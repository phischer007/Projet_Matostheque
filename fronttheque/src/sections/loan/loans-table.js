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
  Link 
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { formatDate } from 'src/utils/get-formatted-date';
import { useAuth } from 'src/hooks/use-auth';
import { statusMap, transactionStatus, transactionTypes } from 'src/data/static_data';


// -------------------------------------------------------------------------------- //


export const LoansTable = (props) => {
  const user = useAuth().user;
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

  const [filter, setFilter] = useState(''); // State for filter option
  const [filterType, setFilterType] = useState(''); // State for filter option

  // 1. Filter the items based on status
  const filteredItems = items.filter((loan) => {
    if (!filter && !filterType) return true; // If no filter selected, show all items
    else if(!filter && filterType){
      return loan.type === filterType
    }
    else if (!filterType && filter){
      return loan.transaction_status === filter;
    }
    else {
      return loan.transaction_status === filter && loan.type === filterType
    }

  });

  // 2. Pagination Logic (Adapted from material-table.js)
  // Slice the filtered list based on the current page and rowsPerPage
  const paginatedLoans = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card
      sx={{
        borderRadius: '0px',
      }}
    >

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle2">Filter by type:</Typography>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: '100px' }}
          >
            {transactionTypes && transactionTypes.map((item) => (
              <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle2">Filter by status:</Typography>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: '100px' }}
          >
            {transactionStatus && transactionStatus.map((item) => (
              <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>

      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> Title </TableCell>
                <TableCell> Type </TableCell>
                {activeTab === 'loans' &&
                  <TableCell> Owner </TableCell>
                }
                {activeTab !== 'loans' &&
                  <TableCell> Borrower </TableCell>
                }
                <TableCell> Duration</TableCell>
                <TableCell> Loan Date </TableCell>
                <TableCell> Quantity </TableCell>
                <TableCell> Status </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* 3. Map over paginatedLoans instead of the full filteredItems list */}
              {paginatedLoans.map((loan) => {
                return (
                  <Link
                    key={loan.transaction_id}
                    underline="none"
                    color="inherit"
                    href={`/matostheque/details/loan-detail/${loan.transaction_id}`}
                    style={{ display: 'contents' }}
                  >

                    <TableRow
                      hover
                      key={loan.transaction_id}
                    >
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Typography variant="subtitle2">
                            {loan.material_details.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {loan.type}
                      </TableCell>
                      {activeTab === 'loans' &&
                        <TableCell>
                          {`${loan.owner_details.first_name} ${loan.owner_details.last_name}`}
                        </TableCell>
                      }
                      {activeTab !== 'loans' &&
                        <TableCell> { `${loan.borrower_details.first_name} ${loan.borrower_details.last_name}` }</TableCell>
                      }
                      <TableCell> {loan.duration}</TableCell>
                      <TableCell> {formatDate(loan.transaction_date)} </TableCell>
                      <TableCell> {loan.transaction_quantity}</TableCell>
                      <TableCell>
                        <SeverityPill color={statusMap[loan.transaction_status]}>
                          {loan.transaction_status}
                        </SeverityPill>
                      </TableCell>
                    </TableRow>
                  </Link>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
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

LoansTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};