import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Grid } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { UsersTable } from 'src/sections/user/users-table';
import { UsersSearch } from 'src/sections/user/users-search';
import { MaterialTable } from 'src/sections/materials/materialtable';
import { applyPagination } from 'src/utils/apply-pagination';
import config from '../utils/config';
import { useAuth } from 'src/hooks/use-auth';
import NextLink from 'next/link';

const useUsers = (page, rowsPerPage, filteredUsers) => {
  return useMemo(() => {
    return applyPagination(filteredUsers, page, rowsPerPage);
  }, [page, rowsPerPage, filteredUsers]);
};

const deepSearch = (user, searchTerm) => {
  if (user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) {
    return true;
  }
  else if (user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) {
    return true;
  }
  return false;
}


const Page = () => {
  const [userList, setUserList] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const user = useAuth().user;

  useEffect(() => {
    let loanApiUrl = `${config.apiUrl}/users`;
    //TODO to erase loan data
    // Fetch users data
    fetch(loanApiUrl,{
      credentials: 'include'// Add this so the session cookie is sent!
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUserList(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  useEffect(() => {
    // Filter users when searchTerm changes
    setFilteredUsers(searchTerm
      ? userList.filter(user => deepSearch(user, searchTerm))
      : userList
    );
  }, [searchTerm, userList]);

  const users = useUsers(page, rowsPerPage, filteredUsers);

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
        <title>Liste of Users</title>
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
            <Grid container justifyContent="space-between" alignItems="center">
              {/* First sub-grid */}
              <Grid  gap={1} container alignItems="center">
                <SvgIcon fontSize="medium"><ArchiveBoxIcon /></SvgIcon>
                <Typography variant="h4" align="center">List of Users</Typography>
              </Grid>
            </Grid>
            <Stack
              direction="column"
              justifyContent="space-between"
              spacing={4}
            >
              <UsersSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
              {filteredUsers && (
                <UsersTable
                  count={filteredUsers.length}
                  items={filteredUsers}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  userRole={user.role}
                  activeTab={"materials"}
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
