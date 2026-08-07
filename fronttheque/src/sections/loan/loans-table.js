// import { 
//   Box, 
//   Card, 
//   Select, 
//   Stack, 
//   Table, 
//   MenuItem, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TablePagination, 
//   TableRow, 
//   Typography
// } from '@mui/material';
// import PropTypes from 'prop-types';
// import React, { useState } from 'react';
// import { Scrollbar } from 'src/components/scrollbar';
// import { SeverityPill } from 'src/components/severity-pill';
// import { formatDate } from 'src/utils/get-formatted-date';
// import { useAuth } from 'src/hooks/use-auth';
// import { statusMap, loanStatus, loanTypes } from 'src/data/static_data';
// import Link from 'next/link';

// import { useTranslation } from 'react-i18next';

// // -------------------------------------------------------------------------------- //

// export const LoansTable = (props) => {
//   const user = useAuth().user;
//   const {
//     items = [],
//     onPageChange = () => { },
//     onRowsPerPageChange,
//     page = 0,
//     rowsPerPage = 25,
//     userRole = null,
//     activeTab = null,
//     title,       // New optional prop
//     subtitle     // New optional prop
//   } = props;

//   const { t } = useTranslation();

//   const [filter, setFilter] = useState('');
//   const [filterType, setFilterType] = useState('');

//   // Determine dynamic headers based on explicit props OR the activeTab state
//   const displayTitle = title || (
//     activeTab === 'loans' 
//       ? t('persLoansTable.persLoanRequest', 'Personal Loan Requests') 
//       : t('persLoansTable.persLendingManagement', 'Lending Management')
//   );
  
//   const displaySubtitle = subtitle || (
//     activeTab === 'loans'
//       ? t('persLoansTable.persLoanRequestSubtitle', 'Track your active loans and requests')
//       : t('persLoansTable.persLendingManagementSubtitle', 'Manage active loans and review incoming requests')
//   );

//   // 1. Filter the items based on status
//   const filteredItems = items.filter((loan) => {
//     if (!filter && !filterType) return true;
//     else if(!filter && filterType){
//       return loan.type === filterType
//     }
//     else if (!filterType && filter){
//       return loan.loan_status === filter;
//     }
//     else {
//       return loan.loan_status === filter && loan.type === filterType
//     }
//   });

//   // 2. Pagination Logic
//   const paginatedLoans = filteredItems.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const headerStyle = {
//     backgroundColor: '#162A42',
//     color: 'white',
//   };

//   return (
//     <Card
//       sx={{
//         border: 1.5,
//         borderColor: 'divider',
//         boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
//         borderRadius: '0px',
//       }}
//     >
//       {/* Dynamic Title and Subtitle */}
//       <Box sx={{ px: 2, pt: 3 }}>
//         <Typography variant="h6" component="h2">
//           {displayTitle}
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//           {displaySubtitle}
//         </Typography>
//       </Box>

//       <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 2 }}>
//         <Stack direction="row" spacing={2} alignItems="center">
//           <Typography 
//             variant="subtitle2"
//           >
//             {t('persLoansTable.filterByType', 'Filter by type')}
//           </Typography>
//           <Select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             variant="outlined"
//             size="small"
//             sx={{ minWidth: '100px' }}
//           >
//             {loanTypes && loanTypes.map((item) => (
//               <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
//             ))}
//           </Select>
//         </Stack>
//         <Stack direction="row" spacing={2} alignItems="center">
//           <Typography 
//             variant="subtitle2"
//           >
//             {t('persLoansTable.filterByStatus', 'Filter by status')}
//           </Typography>
//           <Select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             variant="outlined"
//             size="small"
//             sx={{ minWidth: '100px' }}
//           >
//             {loanStatus && loanStatus.map((item) => (
//               <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
//             ))}
//           </Select>
//         </Stack>
//       </Stack>

//       <Scrollbar>
//         <Box sx={{ minWidth: 800 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell style={headerStyle}> Title </TableCell>
//                 <TableCell style={headerStyle}> Type </TableCell>
//                 {activeTab === 'loans' &&
//                   <TableCell style={headerStyle}> Owner's Name </TableCell>
//                 }
//                 {activeTab !== 'loans' &&
//                   <TableCell style={headerStyle}> Borrower </TableCell>
//                 }
//                 <TableCell style={headerStyle}> Duration</TableCell>
//                 <TableCell style={headerStyle}> Loan Date </TableCell>
//                 <TableCell style={headerStyle}> Quantity </TableCell>
//                 <TableCell style={headerStyle}> Status </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedLoans.map((loan) => {
//                 return (
//                   <Link
//                     key={loan.loan_id}
//                     underline="none"
//                     color="inherit"
//                     href={`/details/loan-detail/${loan.loan_id}`}
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
//                             {loan.material_details.title}
//                           </Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         {loan.type}
//                       </TableCell>
//                       {activeTab === 'loans' &&
//                         <TableCell>
//                           {`${loan.owner_details.first_name} ${loan.owner_details.last_name}`}
//                         </TableCell>
//                       }
//                       {activeTab !== 'loans' &&
//                         <TableCell> { `${loan.borrower_details.first_name} ${loan.borrower_details.last_name}` }</TableCell>
//                       }
//                       <TableCell> {loan.duration}</TableCell>
//                       <TableCell> {formatDate(loan.loan_date)} </TableCell>
//                       <TableCell> {loan.loan_quantity}</TableCell>
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
//         count={filteredItems.length} 
//         onPageChange={onPageChange}
//         onRowsPerPageChange={onRowsPerPageChange}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         rowsPerPageOptions={[25, 50, 100, 200]}
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
//   activeTab: PropTypes.string,
//   title: PropTypes.string,
//   subtitle: PropTypes.string
// };



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
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { formatDate } from 'src/utils/get-formatted-date';
import { useAuth } from 'src/hooks/use-auth';
import { statusMap, loanStatus, loanTypes } from 'src/data/static_data';
import Link from 'next/link';

import { useTranslation } from 'react-i18next';

// -------------------------------------------------------------------------------- //

export const LoansTable = (props) => {
  const user = useAuth().user;
  const {
    items = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 25,
    userRole = null,
    activeTab = null,
    title,       
    subtitle     
  } = props;

  const { t } = useTranslation();

  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('');

  // Determine dynamic headers based on explicit props OR the activeTab state
  const displayTitle = title || (
    activeTab === 'loans' 
      ? t('persLoansTable.persLoanRequest', 'Personal Loan Requests') 
      : t('persLoansTable.persLendingManagement', 'Lending Management')
  );
  
  const displaySubtitle = subtitle || (
    activeTab === 'loans'
      ? t('persLoansTable.persLoanRequestSubtitle', 'Track your active loans and requests')
      : t('persLoansTable.persLendingManagementSubtitle', 'Manage active loans and review incoming requests')
  );

  // 1. Filter the items based on status
  const filteredItems = items.filter((loan) => {
    if (!filter && !filterType) return true;
    else if(!filter && filterType){
      return loan.type === filterType
    }
    else if (!filterType && filter){
      return loan.loan_status === filter;
    }
    else {
      return loan.loan_status === filter && loan.type === filterType
    }
  });

  // 2. Pagination Logic
  const paginatedLoans = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const headerStyle = {
    backgroundColor: '#162A42',
    color: 'white',
  };

  return (
    <Card
      sx={{
        border: 1.5,
        borderColor: 'divider',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '0px',
      }}
    >
      {/* Dynamic Title and Subtitle */}
      <Box sx={{ px: 2, pt: 3 }}>
        <Typography variant="h6" component="h2">
          {displayTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {displaySubtitle}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle2">
            {t('persLoansTable.filterByType', 'Filter by type')}
          </Typography>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: '100px' }}
          >
            {loanTypes && loanTypes.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {/* Dynamically translate the type option. Fallback to 'None' if value is empty */}
                {t(`staticData.loanTypes.${item.value || 'None'}`, item.label)}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle2">
            {t('persLoansTable.filterByStatus', 'Filter by status')}
          </Typography>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: '100px' }}
          >
            {loanStatus && loanStatus.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {/* Dynamically translate the status option. Fallback to 'None' if value is empty */}
                {t(`staticData.loanStatus.${item.value || 'None'}`, item.label)}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>

      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* Translated Table Headers */}
                <TableCell style={headerStyle}> {t('persLoansTable.headers.title', 'Title')} </TableCell>
                <TableCell style={headerStyle}> {t('persLoansTable.headers.type', 'Type')} </TableCell>
                {activeTab === 'loans' &&
                  <TableCell style={headerStyle}> {t('persLoansTable.headers.ownerName', "Owner's Name")} </TableCell>
                }
                {activeTab !== 'loans' &&
                  <TableCell style={headerStyle}> {t('persLoansTable.headers.borrower', 'Borrower')} </TableCell>
                }
                <TableCell style={headerStyle}> {t('persLoansTable.headers.duration', 'Duration')} </TableCell>
                <TableCell style={headerStyle}> {t('persLoansTable.headers.loanDate', 'Loan Date')} </TableCell>
                <TableCell style={headerStyle}> {t('persLoansTable.headers.quantity', 'Quantity')} </TableCell>
                <TableCell style={headerStyle}> {t('persLoansTable.headers.status', 'Status')} </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLoans.map((loan) => {
                return (
                  <Link
                    key={loan.loan_id}
                    underline="none"
                    color="inherit"
                    href={`/details/loan-detail/${loan.loan_id}`}
                    style={{ display: 'contents' }}
                  >
                    <TableRow hover key={loan.loan_id}>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">
                            {loan.material_details.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        {/* Translate the mapped type inside the table cell */}
                        {t(`staticData.loanTypes.${loan.type}`, loan.type)}
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
                      <TableCell> {formatDate(loan.loan_date)} </TableCell>
                      <TableCell> {loan.loan_quantity}</TableCell>
                      
                      <TableCell>
                        <SeverityPill color={statusMap[loan.loan_status]}>
                          {/* Translate the mapped status inside the severity pill */}
                          {t(`staticData.loanStatus.${loan.loan_status}`, loan.loan_status)}
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
        labelRowsPerPage={t('persLoansTable.rowsPerPage', 'Rows per page:')}
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
  activeTab: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string
};