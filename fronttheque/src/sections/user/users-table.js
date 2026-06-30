import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { toast } from 'react-toastify';
import config from '../../utils/config';
import { formatDate } from 'src/utils/get-formatted-date';
import { userStatus } from 'src/data/static_data';
import { useAuth } from '../../hooks/use-auth';
import { getCookie } from '../../utils/csrf';

// -------------------------------------------------------------------- //
// 1. UserRow Component (Handles individual user logic & Dialog)
// -------------------------------------------------------------------- //

const UserRow = ({ user }) => {
  const [isChecked, setIsChecked] = useState(user.is_active);
  const [dialogOpen, setDialogOpen] = useState(false);
  const csrftoken = getCookie('csrftoken');
  const actual_user = useAuth().user;
  
  // Determine if this row belongs to the currently logged-in user
  const isActualUser = actual_user.email === user.email;

  // Intercept the toggle to show a warning if deactivating
  const handleToggleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isChecked) {
      // If currently active, we are deactivating -> Open the warning dialog
      setDialogOpen(true);
    } else {
      // If currently inactive, we are activating -> Do it immediately without a warning
      executeStatusChange(true);
    }
  };

  // The actual API call to your Django backend
  const executeStatusChange = async (newStatus) => {
    // Optimistic UI update for a snappy feel
    setIsChecked(newStatus); 
    setDialogOpen(false); // Close dialog if it was open

    try {
      const response = await fetch(`${config.apiUrl}/users/changeActivity/${user.user_id}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json', // Ensure JSON content type is set
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
          is_active: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // If we successfully deactivated the user, notify the admin about the transfer
      if (!newStatus) {
        toast.success(`${user.first_name}'s materials were successfully transferred.`, { autoClose: 4000 });
      } else {
        toast.success(`${user.first_name} is now active.`);
      }

    } catch (error) {
      // If the backend fails, revert the toggle switch to its original state
      setIsChecked(!newStatus); 
      toast.error('Could not update user status. Please try again.');
    }
  };

  // The base row UI
  const tableRowContent = (
    <TableRow 
      hover={!isActualUser}
      style={{ cursor: isActualUser ? 'default' : 'pointer' }}
      sx={{
        '& .MuiTableCell-root': {
          paddingTop: '4px',
          paddingBottom: '4px',
        }
      }}
    >
      <TableCell>{user.first_name} {user.last_name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell sx={{ textTransform: 'capitalize' }}>
        {user.role}
      </TableCell>
      <TableCell>{formatDate(user.last_login)}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}> 
        <span style={{ color: isChecked ? 'inherit' : 'red', marginRight: '8px' }}>
          {isChecked ? 'Active' : 'Not Active'}
        </span>

        <Switch
          checked={isChecked}
          onChange={handleToggleClick} // We use our interceptor function here
          disabled={isActualUser}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#3f7242ff',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#3f7242ff',
            },
          }}
        />
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {/* Render the TableRow (Wrapped in a link if it's not the current user) */}
      {isActualUser ? (
        <React.Fragment key={user.user_id}>{tableRowContent}</React.Fragment>
      ) : (
        <Link
          key={user.user_id}
          underline="none"
          color="inherit"
          href={`/mutmat/materialsof?id=${user.user_id}`}
          style={{ display: 'contents' }}
        >
          {tableRowContent}
        </Link>
      )}

      {/* The Confirmation Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        onClick={(e) => e.stopPropagation()} // Prevent row click from firing
      >
        <DialogTitle>Deactivate User & Transfer Materials?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate <strong>{user.first_name} {user.last_name}</strong>? 
            <br/><br/>
            Because if this user is deactivated, all materials currently owned by them will be automatically transferred to your Admin account to prevent them from being lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => executeStatusChange(false)} color="error" variant="contained">
            Deactivate & Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
};

// -------------------------------------------------------------------- //
// 2. Main UsersTable Component (Filtering, Sorting, Pagination)
// -------------------------------------------------------------------- //

export const UsersTable = (props) => {
  const { items = [] } = props;

  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25); 

  const filteredItems = items.filter((user) => {
    if (!filter || filter === 'All' || filter === 'Null' || filter === 'all') {
      return true; 
    }
    const filterBool = filter === 'True';
    return user.is_active === filterBool;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const nameA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase().trim();
    const nameB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase().trim();

    if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
    if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedUsers = sortedItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSortClick = () => {
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const headerStyle = {
    backgroundColor: '#162A42',
    color: 'white',
    width: 280
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          border: 1.5,
          borderColor: 'divider',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle2">
              Filter by status:
            </Typography>
            <Select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(0); 
              }}
              variant="outlined"
              size="small"
              displayEmpty
              sx={{ minWidth: '150px' }}
            >
              {userStatus &&
                userStatus.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
            </Select>
          </Stack>
        </Box>

        <Table size="small" aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell style={headerStyle}>
                <TableSortLabel
                  active={true}
                  direction={sortDirection}
                  onClick={handleSortClick}
                  sx={{
                    color: 'white !important',
                    '& .MuiTableSortLabel-icon': { color: 'white !important' },
                  }}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ ...headerStyle, width: '35%'}}>Email</TableCell>
              <TableCell style={headerStyle}>Role</TableCell>
              <TableCell style={headerStyle}>Date of last connection</TableCell>
              <TableCell style={headerStyle}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <UserRow key={user.user_id} user={user} />
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredItems.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[25, 50, 100, 150, 200, 250]}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </TableContainer>
    </>
  );
};

UsersTable.propTypes = {
  items: PropTypes.array,
};