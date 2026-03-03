// import { Box, Card, Select, Stack, Table, MenuItem, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography, Link } from '@mui/material';
// import PropTypes from 'prop-types';
// import React, { useState } from 'react';
// import { Scrollbar } from 'src/components/scrollbar';
// import { SeverityPill } from 'src/components/severity-pill';
// import { formatDate } from 'src/utils/get-formatted-date';
// import { useAuth } from 'src/hooks/use-auth';
// import { statusMap, loanStatus } from 'src/data/static_data'

// export const LoansTable = (props) => {
//   const user = useAuth().user;
//   const {
//     count = 0,
//     items = [],
//     onPageChange = () => { },
//     onRowsPerPageChange,
//     page = 0,
//     // rowsPerPage = 0,
//     rowsPerPage = 50,
//     userRole = null,
//     activeTab = null
//   } = props;

//   const [filter, setFilter] = useState(''); // State for filter option

//   const filteredItems = items.filter((loan) => {
//     if (!filter) return true; // If no filter selected, show all items
//     return loan.loan_status === filter;
//   });

//   return (
//     <Card
//       sx={{
//         borderRadius: '0px',
//       }}
//     >

//       <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ px: 2, py: 1 }}>
//         <Typography variant="subtitle2">Filter by status:</Typography>
//         <Select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           variant="outlined"
//           size="small"
//           sx={{ minWidth: '100px' }}
//         >
//           {loanStatus && loanStatus.map((item) => (
//             <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
//           ))}
//         </Select>
//       </Stack>

//       <Scrollbar>
//         <Box sx={{ minWidth: 800 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell> Title </TableCell>
//                 <TableCell> {activeTab == 'loans' ? 'Owner' : 'Borrower'} </TableCell>
//                 <TableCell> {user.is_staff ? 'Borrower' : 'Duration'} </TableCell>
//                 <TableCell> Loan Date </TableCell>
//                 <TableCell> Status </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {/* {items.map((loan) => { */}
//               {filteredItems.map((loan) => {
//                 return (
//                   <Link
//                     key={loan.loan_id}
//                     underline="none"
//                     color="inherit"
//                     href={`/matostheque/details/loan-detail/${loan.loan_id}`}
//                     style={{ display: 'contents' }}
//                   >

//                     <TableRow
//                       hover
//                       key={loan.loan_id}
//                     >
//                       <TableCell>
//                         <Stack
//                           alignItems="center"
//                           direction="row"
//                           spacing={2}
//                         >
//                           <Typography variant="subtitle2">
//                             {user.is_staff ? loan.material_title : loan.material_details.title}
//                           </Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         {user.is_staff ?
//                           `${loan.owner_first_name} ${loan.owner_last_name}` :
//                           activeTab == 'loans' ?
//                             `${loan.owner_details.first_name} ${loan.owner_details.last_name}` :
//                             `${loan.borrower_details.first_name} ${loan.borrower_details.last_name}`
//                         }
//                       </TableCell>
//                       <TableCell> {user.is_staff ? `${loan.borrower_first_name} ${loan.borrower_last_name}` : loan.duration}</TableCell>
//                       <TableCell> {formatDate(loan.loan_date)} </TableCell>
//                       <TableCell>
//                         <SeverityPill color={statusMap[loan.loan_status]}>
//                           {loan.loan_status}
//                         </SeverityPill>
//                       </TableCell>
//                     </TableRow>
//                   </Link>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </Box>
//       </Scrollbar>
//       <TablePagination
//         component="div"
//         count={count}
//         onPageChange={onPageChange}
//         onRowsPerPageChange={onRowsPerPageChange}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         rowsPerPageOptions={[20, 50, 100, 200]}
//       />
//     </Card>
//   );
// };

// LoansTable.propTypes = {
//   count: PropTypes.number,
//   items: PropTypes.array,
//   onPageChange: PropTypes.func,
//   onRowsPerPageChange: PropTypes.func,
//   page: PropTypes.number,
//   rowsPerPage: PropTypes.number,
// };


import { Box, Card, Select, Stack, Table, MenuItem, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography, Link } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { formatDate } from 'src/utils/get-formatted-date';
import { useAuth } from 'src/hooks/use-auth';
import { statusMap, loanStatus } from 'src/data/static_data'

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

  // 1. Filter the items based on status
  const filteredItems = items.filter((loan) => {
    if (!filter) return true; // If no filter selected, show all items
    return loan.loan_status === filter;
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

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2">Filter by status:</Typography>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: '100px' }}
        >
          {loanStatus && loanStatus.map((item) => (
            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
          ))}
        </Select>
      </Stack>

      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> Title </TableCell>
                <TableCell> {activeTab == 'loans' ? 'Owner' : 'Borrower'} </TableCell>
                <TableCell> {user.is_staff ? 'Borrower' : 'Duration'} </TableCell>
                <TableCell> Loan Date </TableCell>
                <TableCell> Status </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* 3. Map over paginatedLoans instead of the full filteredItems list */}
              {paginatedLoans.map((loan) => {
                return (
                  <Link
                    key={loan.loan_id}
                    underline="none"
                    color="inherit"
                    href={`/matostheque/details/loan-detail/${loan.loan_id}`}
                    style={{ display: 'contents' }}
                  >

                    <TableRow
                      hover
                      key={loan.loan_id}
                    >
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Typography variant="subtitle2">
                            {user.is_staff ? loan.material_title : loan.material_details.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {user.is_staff ?
                          `${loan.owner_first_name} ${loan.owner_last_name}` :
                          activeTab == 'loans' ?
                            `${loan.owner_details.first_name} ${loan.owner_details.last_name}` :
                            `${loan.borrower_details.first_name} ${loan.borrower_details.last_name}`
                        }
                      </TableCell>
                      <TableCell> {user.is_staff ? `${loan.borrower_first_name} ${loan.borrower_last_name}` : loan.duration}</TableCell>
                      <TableCell> {formatDate(loan.loan_date)} </TableCell>
                      <TableCell>
                        <SeverityPill color={statusMap[loan.loan_status]}>
                          {loan.loan_status}
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