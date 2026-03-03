import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { UserIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Grid } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LoansTable } from 'src/sections/loan/loans-table';
import { LoansSearch } from 'src/sections/loan/loans-search';
import { applyPagination } from 'src/utils/apply-pagination';
import config from '../utils/config';
import { useAuth } from 'src/hooks/use-auth';
import NextLink from 'next/link';

const now = new Date();

const useLoans = (page, rowsPerPage, filteredLoans) => {
  return useMemo(() => {
    return applyPagination(filteredLoans, page, rowsPerPage);
  }, [page, rowsPerPage, filteredLoans]);
};

const useLoanIds = (loans) => {
  return useMemo(() => {
    return loans.map((loan) => loan.id);
  }, [loans]);
};

const deepSearch = (obj, searchTerm) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    } else if (typeof obj[key] === 'object' && deepSearch(obj[key], searchTerm)) {
      return true;
    }
  }
  return false;
}


const Page = () => {
  const [loanList, setLoanList] = useState(null);
  const [filteredLoans, setFilteredLoans] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState('loans');
  const user = useAuth().user;
  const btnTitle = user.is_staff ? "All loans" : "Your loans";
  const btnCreateUrl = user.is_staff ? "settings" : "/create/create-loan"; 

  useEffect(() => {
    let apiUrl;

    if (user.is_staff) {
      apiUrl = `${config.apiUrl}/loans/details/`;
    } else {
      if (activeTab === 'loans') {
        apiUrl = `${config.apiUrl}/loans/details/user/${user.user_id}/`;
      } else {
        apiUrl = `${config.apiUrl}/loans/details/owner/${user.owner_id}/`;
      }
    }

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLoanList(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [activeTab, user.user_id, user.owner_id]);


  useEffect(() => {
    // Filter loans when searchTerm changes
    setFilteredLoans(searchTerm
      ? loanList.filter(loan => deepSearch(loan, searchTerm))
      : loanList
    );
  }, [searchTerm, loanList]);

  const loans = useLoans(page, rowsPerPage, filteredLoans);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Loans</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Grid container gap={2} alignItems="left">
              {/* First sub-grid */}
              <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                <Typography variant="h4" align="center">Loans</Typography>
                <Button
                  component={NextLink}
                  href={btnCreateUrl}
                  startIcon={<SvgIcon fontSize="small">{user.is_staff ? <CogIcon /> : <PlusIcon />}</SvgIcon>}
                  variant="contained"
                >
                  {user.is_staff ? 'Loan Settings' : 'Borrow'}
                </Button>
              </Grid>
              {/* Second sub-grid */}
              <Grid item xs={12} container alignItems="left">
                <Stack direction="row" spacing={1} justifyContent="center">
                  {/* Button for "Your loans" */}
                  <Button
                    color="inherit"
                    startIcon={<SvgIcon fontSize="small"><UserIcon /></SvgIcon>}
                    onClick={() => setActiveTab('loans')}
                    variant={activeTab === 'loans' ? 'contained' : 'text'} // Highlight the active tab
                  >
                    {btnTitle}
                  </Button>
                  {/* Button for "Your materials" */}
                  {user.role == "owner" &&
                    <Button
                      color="inherit"
                      startIcon={<SvgIcon fontSize="small"><BookOpenIcon /></SvgIcon>}
                      onClick={() => setActiveTab('materials')}
                      variant={activeTab === 'materials' ? 'contained' : 'text'} // Highlight the active tab
                    >
                      Your materials
                    </Button>}
                </Stack>
              </Grid>
            </Grid>
            <Stack
              direction="column"
              justifyContent="space-between"
              spacing={4}
            >
              <LoansSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
              {filteredLoans ?
                <LoansTable
                  count={filteredLoans.length}
                  items={loans}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  userRole={user.role}
                  activeTab={activeTab}
                /> : <Typography variant="h4">Loading ...</Typography>}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
