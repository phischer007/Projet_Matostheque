import Head from 'next/head';
import { Box, Container, Stack, Typography, Button, SvgIcon} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { 
  HandThumbDownIcon, 
  HandThumbUpIcon, 
  CheckIcon, 
  DocumentArrowUpIcon 
} from '@heroicons/react/24/solid';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LoanDetailOverview } from 'src/sections/loan-detail/loan-detail-overview';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import { useLoanHandlers } from 'src/hooks/loan-handlers';

import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------------------- //


const Page = () => {
  const router = useRouter();
  const { loanId } = router.query;

  const {
    loanData,
    user,
    authorization,
    isOwner,
    isBorrower,
    OnApproveClick,
    OnRejectClick,
    OnCancelClick,
    OnReturnClick
  } = useLoanHandlers(loanId);

  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>
          {/* Loan Details */}
          {t('reqLoanDetails.title', 'Loan Details')}
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
                  {/* Loan Details */}
                  {t('reqLoanDetails.title', 'Loan Details')}
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
                  {(loanData && user) && (
                    <>
                      {(isOwner && (loanData.loan_status === 'Borrowed' || loanData.loan_status === 'Overdue')) && (
                        <Button startIcon={(<SvgIcon fontSize="small"> <HandThumbUpIcon /> </SvgIcon>)}
                          variant="contained"
                          onClick={OnReturnClick}
                        >
                          {/* Return */}
                          {t('reqLoanDetails.btnReturn', 'Return')}
                        </Button>
                      )}
                      {(isOwner && loanData.loan_status === 'Pending Validation') && (
                        <>
                          <Button startIcon={(<SvgIcon fontSize="small"> <CheckIcon /> </SvgIcon>)}
                            variant="contained"
                            color="success"
                            onClick={OnApproveClick}
                          >
                            {/* Approve */}
                            {t('reqLoanDetails.btnApprove', 'Approve')}
                          </Button>
                          <Button startIcon={(<SvgIcon fontSize="small"> <HandThumbDownIcon /> </SvgIcon>)}
                            variant="contained"
                            color="error"
                            onClick={OnRejectClick}
                          >
                            {/* Reject */}
                            {t('reqLoanDetails.btnReject', 'Reject')}
                          </Button>
                        </>
                      )}
                      {(isBorrower && (loanData.loan_status === 'Pending Validation' || loanData.loan_status === 'Booked')) && (
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
                          {/* Cancel */}
                          {t('reqLoanDetails.btnCancel', 'Cancel')}
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
                      data={loanData}
                    />
                  </Grid>
                </Grid>
              </div>
            </Stack>

            : <Typography variant="subtitle2">
              {/* You don&apos;t have the authorization to access this page. */}
              {t('reqLoanDetails.unauthorizedText', "You don't have the authorization to access this page.")}
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
