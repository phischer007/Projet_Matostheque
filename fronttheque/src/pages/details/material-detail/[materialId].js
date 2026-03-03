import Head from 'next/head';
import { Box, Container, Stack, Typography, Button, Divider, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MaterialDetailOverview } from 'src/sections/material-detail/material-detail-overview';
import { MaterialDetailEdit } from 'src/sections/material-detail/material-detail-edit';
import { MaterialDetailViewer } from 'src/sections/material-detail/material-detail-viewer';
import { MaterialDetailCalendar } from 'src/sections/material-detail/material-detail-calendar';
import { useRouter } from 'next/router';
import React, {useState, useEffect, useCallback, use } from 'react';
import config from 'src/utils/config';
import { useAuth } from 'src/hooks/use-auth';
import { toast } from 'react-toastify';
import { quickNotifyOption } from 'src/utils/notification-config';

const Page = () => {
  const router = useRouter();
  const user = useAuth().user;
  const { materialId } = router.query;
  const [materialData, setMaterialData] = useState(null);
  const [eventsData, setEventsData] = useState(null); 
  const [canDeleteOrRemove, setCanDeleteOrRemove] =  useState(false);
  const [open, setOpen] = useState(false);
  const [dialogSubject, setDialogSubject] = useState("");
  const [canBeLoaned, setCanBeLoaned] = useState(false);

  const getDialogDetails = useCallback(() => {
    let title = '';
    let content = '';
    let buttonText = '';
    let action = null;

    switch (dialogSubject) {
      case 'delete':
        title = 'Delete Material';
        content = 'Are you sure you want to delete this material?';
        buttonText = 'Delete';
        action = handleDelete
        break;
      case 'loan':
        title = canBeLoaned ? 'Remove from Loan' : 'Put on Loan';
        content = canBeLoaned ? 'Are you sure you want to remove this material from loan?' : 'Are you sure you want to make this material available for loan?';
        buttonText = canBeLoaned ? 'Remove From Loan' : 'Put On Loan';
        action = handleCanBeLoaned
        break;
      default:
        break;
    }

    return { title, content, buttonText, action };
  }, [dialogSubject, canBeLoaned]);

  const handleDelete =  useCallback( async () => {
    try {
        const response = await fetch(`${config.apiUrl}/materials/${materialId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            toast.error('Could not delete material, try again later', { ...quickNotifyOption });
        } else {
            toast.success('The material was successfully deleted', { ...quickNotifyOption });

            setTimeout(() => {
              router.push('/materials');
            }, 1000); //maybe there's a better way?
        }

    } catch (error) {
      toast.error('Could not delete material, try again later', { ...quickNotifyOption });
    }
    setOpen(false); 
  });

  const handleCanBeLoaned =  useCallback( async () => {
    try {
      const response = await fetch(`${config.apiUrl}/materials/${materialId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({available_for_loan: !materialData.available_for_loan})
      });

        if (!response.ok) {
            toast.error('Could not update the material status.', { ...quickNotifyOption });
        } else {
            toast.success(`The material was successfully ${canBeLoaned ? "removed from" : "put on"} loan`, { ...quickNotifyOption });
            
            setTimeout(() => {
              window.location.reload();
            }, 2000); //maybe there's a better way?
        }

    } catch (error) {
      toast.error('Could not update the material, try again later', { ...quickNotifyOption });
    }
    setOpen(false); 
  });


  useEffect(() => {
    if (materialId) {
      //fetching material data
      fetch(`${config.apiUrl}/materials/${materialId}`)
        .then(response => response.json())
        .then(data => {
          setMaterialData(data);

          if(data.owner_details.user_id == user.user_id || user.is_staff) {
            setCanDeleteOrRemove(true);
            setCanBeLoaned(data.available_for_loan)
          }
        })
        .catch(error => console.error('Error fetching data:', error));
  
      //fetching events related to given material
      fetch(`${config.apiUrl}/material/${materialId}/events/`)
        .then(response => response.json())
        .then(data => {
          setEventsData(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [materialId]);

  const handleBorrow = useCallback(() =>{
    const url = '/create/create-loan' + (materialId ? `?materialId=${materialId}` : '');
    router.push(url);
  }, [materialId]);

  return (
    <>
      <Head>
        <title>
          Material Details 
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
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Typography variant="h4">
                Material Details
              </Typography>
             <div>
                <Button
                  variant="contained"
                  onClick={handleBorrow}
                  disabled={!materialData?.available_for_loan}
                >
                 {materialData?.available_for_loan? "Book Material" : "Not Available For Loan"}


                </Button>
              </div>
            </Stack>
            <div>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                >
                  <MaterialDetailOverview 
                    data = {materialData}
                  />
                </Grid>
                <Grid
                  xs={12}
                >
                  <MaterialDetailEdit 
                    data = {materialData}
                  />
                </Grid>
                <Grid
                  xs={12}
                >
                  <MaterialDetailViewer
                    data = {materialData?.images}
                    owner = {materialData?.owner_details.user_id}
                    id = {materialData?.material_id}
                  />
                </Grid>
                <Grid
                  xs={12}
                >
                  <MaterialDetailCalendar
                    data = {eventsData}
                  />
                </Grid>
                <Divider />
                {canDeleteOrRemove && <Grid
                  xs={12}
                >
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick= {() => {
                        setOpen(true);
                        setDialogSubject("loan");
                      }}
                    >
                      {canBeLoaned? "Remove From Loan" : "Put On Loan"}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick= {() => {
                        setOpen(true);
                        setDialogSubject("delete");
                      }}
                    >
                      Delete Material
                    </Button>
                  </CardActions>
                  <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{getDialogDetails().title}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {getDialogDetails().content}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpen(false)}>Cancel</Button>
                      <Button onClick={getDialogDetails().action} color="error">
                        {getDialogDetails().buttonText}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>}
              </Grid>
            </div>
          </Stack>
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
