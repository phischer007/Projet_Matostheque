import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';
import PlusCircleIcon from '@heroicons/react/24/solid/PlusCircleIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Grid } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MaterialTable } from 'src/sections/materials/materialtable';
import { applyPagination } from 'src/utils/apply-pagination';
import config from '../utils/config';
import { useAuth } from 'src/hooks/use-auth';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getCookie } from '../utils/csrf';

const Page = () => {
  const [materialList, setMaterialList] = useState(null);
  const [userName, setUserName] = useState(null);
  let user
  const searchParams = useSearchParams();
  const user_id = searchParams.get("id");


  useEffect(() => {
    let ownerApiUrl = `${config.apiUrl}/users/${user_id}/`;
    const csrftoken = getCookie('csrftoken');
    fetch(ownerApiUrl,{
      credentials: "include",
      headers: {
        'X-CSRFToken': csrftoken, // Add this
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        user = data
        getMaterials()
        setUserName(user.first_name+' '+ user.last_name)
      })
  }, []);

  function getMaterials () {
    let materialApiUrl = `${config.apiUrl}/materials/owner/${user.user_id}/`;

    // Fetch Materials -- recent fix for JSON.parse() crashes in MaterialTable
    fetch(materialApiUrl,{
      credentials: 'include'// Add this so the session cookie is sent!
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
        // --- FIX ENDS HERE ---
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  return (
    <>
      <Head>
        <title>Materials of </title>
      </Head>
      <Typography variant="h6" align="center">Materials of {userName}</Typography>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
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
