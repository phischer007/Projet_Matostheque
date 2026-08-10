import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import NewMaterialDetails from 'src/sections/create-material/new-material-details';
import config from '../../utils/config';

import { useTranslation } from 'react-i18next';


const gridStyles = {
  '--Grid-columns': 1, // Change the number of columns
};

const Page = () => {
  const [ownersList, setOwnersList] = useState(null);

  useEffect(() => {
    fetch(`${config.apiUrl}/active_owners/lite/`,{
      credentials: 'include', // Add this
    })
      .then(response => response.json())
      .then(data => {
        const filteredOwners = data.filter(person => 
          person.role?.trim().toLowerCase() === 'owner'
        );
        setOwnersList(filteredOwners);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  
  // 1. Initialize translation
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>
          {/* New Material */}
          {t('newMaterial.title', 'New Material')}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">
                {/* Add a new material */}
                {t('newMaterial.heading', 'Add a new material')}
              </Typography>
            </div>
            <div>
              <Grid
                container
                width={'100%'}
                style={gridStyles}
              >
                <Grid
                  xs={12}
                  md={6}
                  lg={10}
                >
                  <NewMaterialDetails ownersList={ownersList}/>
                </Grid>
              </Grid>
            </div>
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
