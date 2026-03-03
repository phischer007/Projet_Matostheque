import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import NewMaterialDetails from 'src/sections/create-material/new-material-details';
import config from '../../utils/config';

const gridStyles = {
  '--Grid-columns': 1, // Change the number of columns
};

const Page = () => {
  const [ownersList, setOwnersList] = useState(null);

  useEffect(() => {
    fetch(`${config.apiUrl}/active_owners/lite/`)
      .then(response => response.json())
      .then(data => {
        setOwnersList(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <Head>
        <title>
          New Material
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
                Add a new material
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
