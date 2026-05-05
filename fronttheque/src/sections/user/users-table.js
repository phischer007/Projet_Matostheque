import {
  Box,
  Card,
  Select,
  Stack,
  Table,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Link, Grid, Switch
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState,useEffect } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { useAuth } from 'src/hooks/use-auth';
import { statusMap, loanStatus, userStatus } from 'src/data/static_data';
import { getCookie } from '../../utils/csrf';
import { UsersList } from './users-list';

// -------------------------------------------------------------------------------- //
export const UsersTable = (props) => {


  const {
    // count = 0, // content is handled via filteredItems.length for client-side pagination
    items = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 25,
    userRole = null,
    activeTab = null
  } = props;

  const [filter, setFilter] = useState('Null'); // State for filter option


  // 1. Filter the items based on status
  const filteredItems = items.filter((user) => {
    if (!filter | filter == "Null") return true; // If no filter selected, show all items
    const filterBool = filter === "True";
    return user.is_active === filterBool
  });

  const SortItems = filteredItems.sort((a, b) => {
    const nameA = a.first_name.toUpperCase(); // ignorer les majuscules/minuscules
    const nameB = b.first_name.toUpperCase(); // ignorer les majuscules/minuscules
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // les noms sont égaux
    return 0;
  });
  // 2. Pagination Logic (Adapted from material-table.js)
  // Slice the filtered list based on the current page and rowsPerPage
  const paginatedUsers = SortItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card
      sx={{
        borderRadius: '0px',
      }}
    >

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2">Filter by status:</Typography>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: '100px' }}
        >
          {userStatus && userStatus.map((item) => (
            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
          ))}
        </Select>
      </Stack>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> First Name </TableCell>
              <TableCell> Last Name </TableCell>
              <TableCell> Email </TableCell>
              <TableCell> Role </TableCell>
              <TableCell> Date last Connexion </TableCell>
              <TableCell> Activity </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 3. Map over paginatedUsers instead of the full filteredItems list */}
            {paginatedUsers.map((user) => (
              <UsersList
                key={user.user_id}
                user={user}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={filteredItems.length}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[25, 50, 100, 200]}
      />
    </Card>
  );
};

UsersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};