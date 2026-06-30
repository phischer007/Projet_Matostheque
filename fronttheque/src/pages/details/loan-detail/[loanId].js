import Head from 'next/head';
import { Box, Container, Stack, Typography, Button, SvgIcon, Unstable_Grid2 as Grid } from '@mui/material';
import { HandThumbDownIcon, HandThumbUpIcon, CheckIcon, DocumentArrowUpIcon } from '@heroicons/react/24/solid';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LoanDetailOverview } from 'src/sections/loan-detail/loan-detail-overview';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import config from 'src/utils/config';
import NextLink from 'next/link';
import { useTransactionHandlers } from 'src/hooks/loan-handlers';


const Page = () => {
  const router = useRouter();
  const { loanId } = router.query;

  const {
    transactionData,
    user,
    authorization,
    isOwner,
    isBorrower,
    OnApproveClick,
    OnRejectClick,
    OnCancelClick,
    OnReturnClick
  } = useTransactionHandlers(loanId);

  return (
    <>
      <Head>
        <title>
          Transaction Details
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
          {authorization ?

            <Stack spacing={3}>
              <Stack
                sx={{
                  direction: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                spacing={2}
                direction="row"
              >
                <Typography variant="h4">
                  Transaction Details
                </Typography>
                <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  {(transactionData && user) && (
                    <>
                      {(isOwner && (transactionData.transaction_status === 'Borrowed' || transactionData.transaction_status === 'Overdue')) && (
                        <Button startIcon={(<SvgIcon fontSize="small"> <HandThumbUpIcon /> </SvgIcon>)}
                          variant="contained"
                          onClick={OnReturnClick}
                        >
                          Return
                        </Button>
                      )}
                      {(isOwner && transactionData.transaction_status === 'Pending Validation') && (
                        <>
                          <Button startIcon={(<SvgIcon fontSize="small"> <CheckIcon /> </SvgIcon>)}
                            variant="contained"
                            color="success"
                            onClick={OnApproveClick}
                          >
                            Approve
                          </Button>
                          <Button startIcon={(<SvgIcon fontSize="small"> <HandThumbDownIcon /> </SvgIcon>)}
                            variant="contained"
                            color="error"
                            onClick={OnRejectClick}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {(isBorrower && (transactionData.transaction_status === 'Pending Validation' || transactionData.transaction_status === 'Booked')) && (
                        <Button 
                          startIcon={(
                            <SvgIcon fontSize="small">
                              <HandThumbDownIcon /> 
                            </SvgIcon>
                          )}
                          variant="contained"
                          color="error"
                          onClick={OnCancelClick}
                        >
                          Cancel
                        </Button>
                      )}
                    </>
                  )}
                </Stack>
              </Stack>
              <div>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    xs={12}
                    md={10}
                    lg={10}
                  >
                    <LoanDetailOverview
                      data={transactionData}
                    />
                  </Grid>
                </Grid>
              </div>
            </Stack>

            : <Typography variant="subtitle2">
              You don&apos;t have the authorization to access this page.
            </Typography>
          }
        </Container>
      </Box>
    </>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
