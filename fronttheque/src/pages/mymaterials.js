import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import PlusCircleIcon from '@heroicons/react/24/solid/PlusCircleIcon';
import { Box, Button, Container, Divider, Stack, SvgIcon, Typography, Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LoansTable } from 'src/sections/loan/loans-table';
import { LoansSearch } from 'src/sections/loan/loans-search';
import { MaterialTable } from 'src/sections/materials/materialtable';
import { applyPagination } from 'src/utils/apply-pagination';
import config from '../utils/config';
import { useAuth } from 'src/hooks/use-auth';
import NextLink from 'next/link';

import { MaterialTableView } from 'src/sections/materials/materialtableview';

import { useTranslation } from 'react-i18next';

// ---------------------------------------------------------------------------------------------------- //


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
  const btnCreateUrl = "/create/create-material";

  const { t } = useTranslation();

  useEffect(() => {
    let loanApiUrl = `${config.apiUrl}/loans/details/owner/${user.user_id}/`;
    let materialApiUrl = `${config.apiUrl}/materials/owner/${user.user_id}`;

    // Fetch loans data
    fetch(loanApiUrl,{
      credentials: 'include' // Add this so the session cookie is sent!
    })
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

    // Fetch Materials -- recent fix for JSON.parse() crashes in MaterialTable
    fetch(materialApiUrl,{
      credentials: 'include' // Add this so the session cookie is sent!
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // We sanitize the data to prevent JSON.parse() crashes in MaterialTable
        const safeData = data.map(item => {
          // If images is null, undefined, or an empty string, set it to "[]"
          if (!item.images || (typeof item.images === 'string' && item.images.trim() === "")) {
            return { ...item, images: "[]" };
          }
          return item;
        });
        setMaterialList(safeData);
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
        <title>
          {t('navbar.personalMaterials', 'Personal Materials')}
        </title>
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
                <Typography 
                  variant="h4" 
                  align="center"
                >
                  {t('persMaterials.title', 'Personal Materials')}
                </Typography>
              </Grid>
              <Grid xs={6} container justifyContent="flex-end">
                  <Button
                    component={NextLink}
                    href={btnCreateUrl}
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusCircleIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    {t('persMaterials.btnAdd', 'Add')}
                  </Button>
              </Grid>
            </Grid>
            
            <Stack
              direction="column"
              justifyContent="space-between"
              spacing={5} 
            >
              {/* 1. Search at the top */}
              <LoansSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
              
              {/* 2. List of materials */}
              {materialList && (
                <MaterialTable data={materialList} />
              )}
              
              {/* 3. Loan table */}
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
                />
              )}
              
              {/* 4. Material table view */}
              {materialList && (
                <Stack spacing={4}>
                  <Divider />
                  <MaterialTableView data={materialList} />
                </Stack>
              )}
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