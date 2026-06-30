import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';
import Head from 'next/head';

const Page = () => (
  <>
    <Head>
      <title>
        Validated Email
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%'
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              mb: 3,
              textAlign: 'center'
            }}
          >
            <img
              alt="Smiley Face"
              src="/assets/logos/lab-logo.png"
              style={{
                display: 'inline-block',
                maxWidth: '100%',
                width: 300
              }}
            />
          </Box>
          <Typography
            align="center"
            sx={{ mb: 3 }}
            variant="h3"
          >
             Your email is validated.
          </Typography>
          <Typography
            align="center"
            color="text.secondary"
            variant="body1"
          >
            <i>Thank you for using Matostheque! </i><br/>You will be  redirected to the home page in a few seconds. 
            If nothing happens after a minute, please click
          </Typography>
          <Button
            component={NextLink}
            href="/"
            startIcon={(
              <SvgIcon fontSize="small">
                <ArrowLeftIcon />
              </SvgIcon>
            )}
            sx={{ mt: 3 }}
            variant="contained"
          >
            Here
          </Button>
        </Box>
      </Container>
    </Box>
  </>
);

export default Page;
