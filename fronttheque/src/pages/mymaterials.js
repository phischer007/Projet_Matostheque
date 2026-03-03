import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Grid } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LoansTable } from 'src/sections/loan/loans-table';
import { LoansSearch } from 'src/sections/loan/loans-search';
import { MaterialTable } from 'src/sections/materials/materialtable';
import { applyPagination } from 'src/utils/apply-pagination';
import config from '../utils/config';
import { useAuth } from 'src/hooks/use-auth';
import NextLink from 'next/link';

const useLoans = (page, rowsPerPage, filteredLoans) => {
  return useMemo(() => {
    return applyPagination(filteredLoans, page, rowsPerPage);
  }, [page, rowsPerPage, filteredLoans]);
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
  const [materialList, setMaterialList] = useState(null);
  const [filteredLoans, setFilteredLoans] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const user = useAuth().user;
  const btnCreateUrl = user.is_staff ? "settings" : "/create/create-material"; //coming soon super user

  useEffect(() => {
    let loanApiUrl = `${config.apiUrl}/loans/details/owner/${user.owner_id}/`;
    let materialApiUrl = `${config.apiUrl}/materials/owner/${user.owner_id}/`;

    //TODO to erase loan data
    // Fetch loans data
    fetch(loanApiUrl)
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
    
    // Fetch materials data
    // fetch(materialApiUrl)
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     setMaterialList(data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching data:', error);
    //   });

    // Fetch Materials -- recent fix for JSON.parse() crashes in MaterialTable
    fetch(materialApiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // --- FIX STARTS HERE ---
        // We sanitize the data to prevent JSON.parse() crashes in MaterialTable
        const safeData = data.map(item => {
          // If images is null, undefined, or an empty string, set it to "[]"
          if (!item.images || (typeof item.images === 'string' && item.images.trim() === "")) {
            return { ...item, images: "[]" };
          }
          return item;
        });
        setMaterialList(safeData);
        // --- FIX ENDS HERE ---
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  }, [user.user_id, user.owner_id]);


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
        <title>Personal Materials</title>
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
            <Grid container xs={12} justifyContent="space-between" alignItems="center">
              {/* First sub-grid */}
              <Grid xs={6} gap={1} container alignItems="center">
                <SvgIcon fontSize="medium"><ArchiveBoxIcon /></SvgIcon>
                <Typography variant="h4" align="center">Personal Materials</Typography>
              </Grid>
              <Grid xs={6} container justifyContent="flex-end">
                  <Button
                    component={NextLink}
                    href={btnCreateUrl}
                    startIcon={<SvgIcon fontSize="small">{user.is_staff ? <CogIcon /> : <PlusIcon />}</SvgIcon>}
                    variant="contained"
                  >
                    {user.is_staff ? 'Loan Settings' : 'Add'}
                  </Button>
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
              {filteredLoans && (
                <LoansTable
                  count={filteredLoans.length}
                  items={loans}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  userRole={user.role}
                  activeTab={"materials"}
                />)}
            </Stack>
            <Stack
              direction="column"
              justifyContent="space-between"
              spacing={4}
            >
              {materialList && (
                <MaterialTable
                  data={materialList}
                />)}
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
