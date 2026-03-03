import Head from 'next/head';
import { 
  Box, 
  Container, 
  Unstable_Grid2 as Grid, 
  Typography, 
  Button, 
  Avatar, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  Card,
  CardContent,
  LinearProgress,
  Divider
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewNotification } from 'src/sections/overview/overview-notifications';
import { OverviewLatestLoans } from 'src/sections/overview/overview-latest-loans';
import { OverviewLatestMaterials } from 'src/sections/overview/overview-list-last-materials';
import { useEffect, useState, useCallback } from 'react';
import config from 'src/utils/config';
import { useAuth } from 'src/hooks/use-auth';
import { UserIcon, ComputerDesktopIcon, ClipboardDocumentCheckIcon, PresentationChartBarIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

import { toast } from 'react-toastify';


const Page = () => {
  const auth = useAuth();
  const user = auth.user;
  

  const [lastMaterialList, setLastMaterialList] = useState(null);
  const [lastLoanList, setLastLoanList] = useState(null);
  const [lastNotificationList, setLastNotificationList] = useState(null);
  const [open, setOpen] = useState(false);
  const [accountChoice, setAccountChoice] = useState("user");

  // New State for Materials Statistics
  const [dashboardStats, setDashboardStats] = useState({
    total_count: 0,
    added_this_month: 0,
    added_this_year: 0,
    materials_per_team: []
  });

  // New State for Loan Statistics
  const [loanStats, setLoanStats] = useState({
    total_borrowed: 0,
    borrowed_this_month: 0,
    borrowed_this_year: 0,
    last_3_months: []
  });

  const onConfirmAccountType = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiUrl}/users/${user.user_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({role: accountChoice}),
      });

      if (!response.ok) {
        toast.error("An error occurred. Please try again later.", { autoClose: false });
      } else {
        const updatedUserData = await response.json();
        await auth.updateUser(updatedUserData.user_id);
        toast.success("Your account was successfully updated!");
        window.location.reload();
      }
      window.sessionStorage.setItem('isNew', false);
      setOpen(false);

    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred. Please try again later.", { autoClose: false });
    }

  }, [accountChoice]);

  const selectedStyle = {
    bgcolor: 'primary.main',
    cursor: 'pointer'
  };

  useEffect(() => {
    // 1. Fetch Dashboard Stats (Total, Teams)
    fetch(`${config.apiUrl}/materials/count/`)
      .then(response => response.json())
      .then(data => {
        setDashboardStats(data);
      })
      .catch(error => console.error('Error fetching stats:', error));

    // 2. Fetch Latest Materials
    fetch(`${config.apiUrl}/materials/latest/`)
      .then(response => response.json())
      .then(data => { setLastMaterialList(data);})
      .catch(error => console.error('Error fetching data:', error));

    // 3. Fetch Latest Loans
    let loanUrl = !user.is_staff ? `${config.apiUrl}/loans/latest/${user.user_id}/` : `${config.apiUrl}/loans/`
    fetch(loanUrl)
      .then(response => response.json())
      .then(data => {
        let to_loan = !user.is_staff ? data : data.slice(0, 5);
        setLastLoanList(to_loan);
      })
      .catch(error => console.error('Error fetching data:', error));

    // 4. Fetch Notifications
    fetch(`${config.apiUrl}/notifications/important/${user.user_id}/`)
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          const firstThreeRecords = data.slice(0, 2);
          setLastNotificationList(firstThreeRecords);
        }
      })
      .catch(error => console.error('Error fetching data:', error));

      // 5. Fetch Loan Statistics
      fetch(`${config.apiUrl}/loans/stats/`) 
      .then(response => response.json())
      .then(data => {
        setLoanStats(data);
      })
      .catch(error => console.error('Error fetching loan stats:', error));


    
    let isNew = window.sessionStorage.getItem('isNew');
    if (isNew === 'true') { setOpen(isNew) };
  }, [user]);

  // Helper to calculate max value for bar chart scaling
  const maxMaterialCount = dashboardStats.materials_per_team?.length > 0 
    ? Math.max(...dashboardStats.materials_per_team.map(item => item.count)) 
    : 0;
  
  return (
    <>
      <Head>
        <title>
          Dashboard
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
          <Grid
            container
            spacing={3}
            direction="row" 
          >
            
            {/* Total Materials Card */}
            <Grid xs={12} sm={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
                    <Stack spacing={1}>
                      <Typography color="text.secondary" variant="overline">
                        Total Materials
                      </Typography>
                      <Typography variant="h3">
                        {dashboardStats.total_count}
                      </Typography>
                    </Stack>
                    <Avatar sx={{ backgroundColor: 'primary.main', height: 56, width: 56 }}>
                      {/* <ComputerDesktopIcon style={{ width: 24, height: 24 }} />  */}
                      <PresentationChartBarIcon style={{ width: 24, height: 24 }} /> 
                    </Avatar>
                  </Stack>

                  {/* Stats Container */}
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    
                    {/* Monthly Stat */}
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <Typography color="success.main" variant="body">
                        +{dashboardStats.added_this_month}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        added this month
                      </Typography>
                    </Stack>

                    {/* Yearly Stat */}
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <Typography color="success.main" variant="body">
                        +{dashboardStats.added_this_year}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        added this year
                      </Typography>
                    </Stack>

                  </Stack>

                </CardContent>
              </Card>
            </Grid>

            {/* Total Loans Approved Card */}
            <Grid xs={12} sm={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
                    <Stack spacing={1}>
                      <Typography color="text.secondary" variant="overline">
                        Total Loans Approved
                      </Typography>
                      <Typography variant="h3">
                        {loanStats.total_borrowed}
                      </Typography>
                    </Stack>
                    <Avatar sx={{ backgroundColor: 'warning.main', height: 56, width: 56 }}>
                      <ClipboardDocumentCheckIcon style={{ width: 24, height: 24 }} /> 
                    </Avatar>
                  </Stack>
                  
                  <Stack spacing={1} sx={{ mt: 2 }}>
                      
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <Typography color="success.main" variant="body">
                        +{loanStats.borrowed_this_month}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        approved this month
                      </Typography>
                    </Stack>
                    
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <Typography color="success.main" variant="body">
                        +{loanStats.borrowed_this_year}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        approved this year
                      </Typography>
                    </Stack>

                    <Divider sx={{ my: 1, width: '100%' }} />
                    
                    <Typography variant="subtitle2" color="text.secondary">
                        Recent Activity
                    </Typography>
                    {loanStats.last_3_months && loanStats.last_3_months.map((item) => (
                        <Stack key={item.month} direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                            <Typography variant="body2" color="text.secondary">{item.month}</Typography>
                            <Typography variant="body2" fontWeight="bold">{item.count}</Typography>
                        </Stack>
                    ))}
                  </Stack>

                </CardContent>
              </Card>
            </Grid>

            <Grid
              xs={12}
              // sm={12}
              lg={6}
            >
              <OverviewLatestMaterials
                materials={lastMaterialList}
                sx={{ height: '100%' }}
              />
            </Grid>

            {/* Materials Per Team Bar Chart */}
            <Grid xs={12} lg={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Materials Inventory by Team
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={4}>
                    {dashboardStats.materials_per_team && dashboardStats.materials_per_team.map((team) => (
                      <Grid xs={12} sm={6} md={4} key={team.team}>
                        <Box sx={{ mb: 1 }}>
                          <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" fontWeight="bold">
                              {team.team}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {team.count} items
                            </Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={maxMaterialCount > 0 ? (team.count / maxMaterialCount) * 100 : 0} 
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              backgroundColor: 'neutral.200',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                backgroundColor: 'blue.main'
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            {/* --- NEW STATS SECTION END --- */}


            <Grid
              container
              spacing={3}
              lg={12}
              direction="column"
              xs={12} // Ensure full width on mobile
            >
              {lastNotificationList && lastNotificationList.map((notification) => (
                <Grid key={notification.notif_id} item xs={12} lg={6}>
                  <OverviewNotification data={notification} />
                </Grid>
              ))}
            </Grid>

            <Grid
              xs={12}
              sm={12}
              lg={12}
            >
              <OverviewLatestLoans
                loans={lastLoanList}
                sx={{ height: '100%' }}
              />
            </Grid>
          </Grid>

          {/* Account Type Selection Dialog */}
          {open &&
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              disableBackdropClick
              disableEscapeKeyDown
            >
              <DialogTitle>Welcome to Matostheque!</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  We are happy you joined the community. Please choose the type of account you want.
                </DialogContentText>
                <Grid container spacing={2} xs={12} sx={{ my: 2 }} justifyContent="center" alignItems="flex-start">
                  <Grid item xs={5}>
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      spacing={1}
                      sx={{ height: '100%' }}
                    >
                      <Avatar
                        variant="rounded"
                        onClick={() => {
                          setAccountChoice('user');
                          console.log('USER');
                        }}
                        sx={accountChoice === 'user' ? { ...selectedStyle } : { cursor: 'pointer' }}
                      >
                        <UserIcon style={{ fontSize: 100 }} />
                      </Avatar>
                      <Typography align="center">User</Typography>
                      <Typography align="center" variant="caption">A simple user can view the inventory and borrow equipments.</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={5}>
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      spacing={1}
                      sx={{ height: '100%' }}
                    >
                      <Avatar
                        variant="rounded"
                        onClick={() => {
                          setAccountChoice('owner');
                          console.log('OWNER');
                        }}
                        sx={accountChoice === 'owner' ? { ...selectedStyle } : { cursor: 'pointer' }}
                      >
                        <UserIcon style={{ fontSize: 100 }} />
                      </Avatar>
                      <Typography align="center">Owner</Typography>
                      <Typography align="center" variant="caption">An owner provides equipments he/she is willing to lend and can also borrow other equipments.</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={onConfirmAccountType} color="error">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>}
        </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;