// import Head from 'next/head';
// import { Box, Container, Stack, Typography, Button, Divider, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
// import { MaterialDetailOverview } from 'src/sections/material-detail/material-detail-overview';
// import { MaterialDetailEdit } from 'src/sections/material-detail/material-detail-edit';
// import { MaterialDetailViewer } from 'src/sections/material-detail/material-detail-viewer';
// import { MaterialDetailCalendar } from 'src/sections/material-detail/material-detail-calendar';
// import { useRouter } from 'next/router';
// import React, {useState, useEffect, useCallback, use } from 'react';
// import config from 'src/utils/config';
// import { useAuth } from 'src/hooks/use-auth';
// import { toast } from 'react-toastify';
// import { quickNotifyOption } from 'src/utils/notification-config';
// import { getCookie } from '../../../utils/csrf';

// const Page = () => {
//   const router = useRouter();
//   const user = useAuth().user;
//   const { materialId } = router.query;
//   const [materialData, setMaterialData] = useState(null);
//   const [eventsData, setEventsData] = useState(null); 
//   const [canDeleteOrRemove, setCanDeleteOrRemove] =  useState(false);
//   const [open, setOpen] = useState(false);
//   const [dialogSubject, setDialogSubject] = useState("");
//   const [canBeLoaned, setCanBeLoaned] = useState(false);

//   const getDialogDetails = useCallback(() => {
//     let title = '';
//     let content = '';
//     let buttonText = '';
//     let action = null;

//     switch (dialogSubject) {
//       case 'delete':
//         title = 'Delete Material';
//         content = 'Are you sure you want to delete this material?';
//         buttonText = 'Delete';
//         action = handleDelete
//         break;
//       case 'loan':
//         if (materialData.type ==="LAB_SUPPLIES") {
//           title = canBeLoaned ? 'Remove from Loan' : 'Put on Loan';
//           content =
//             canBeLoaned
//               ? 'Are you sure you want to remove this material from Loan?'
//               : 'Are you sure you want to make this material available for Loan?';
//           buttonText = canBeLoaned ? 'Remove From Loan' : 'Put On Loan';
//           action = handleCanBeLoaned;
//         }else {
//           title = canBeLoaned ? 'Remove from Donation' : 'Put on Donation';
//           content =
//             canBeLoaned
//               ? 'Are you sure you want to remove this material from Donation?'
//               : 'Are you sure you want to make this material available for Donation?';
//           buttonText = canBeLoaned ? 'Remove From Donation' : 'Put On Donation';
//           action = handleCanBeLoaned;
//         }
//         break;
//       default:
//         break;
//     }

//     return { title, content, buttonText, action };
//   }, [dialogSubject, canBeLoaned]);


//   const handleDelete =  useCallback( async () => {
//     try {
//         const response = await fetch(`${config.apiUrl}/materials/${materialId}/`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         if (!response.ok) {
//             toast.error('Could not delete material, try again later', { ...quickNotifyOption });
//         } else {
//             toast.success('The material was successfully deleted', { ...quickNotifyOption });

//             setTimeout(() => {
//               router.push('/materials');
//             }, 1000); //maybe there's a better way?
//         }

//     } catch (error) {
//       toast.error('Could not delete material, try again later', { ...quickNotifyOption });
//     }
//     setOpen(false);
//   });

//   const handleCanBeLoaned =  useCallback( async () => {
//     try {
//       const csrftoken = getCookie('csrftoken');
//       const response = await fetch(`${config.apiUrl}/materials/${materialId}/availability/`, {
//         method: 'PUT',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': csrftoken,
//         },
//         body: JSON.stringify({available_for_loan: !materialData.available_for_loan})
//       });

//         if (!response.ok) {
//             toast.error('Could not update the material status.', { ...quickNotifyOption });
//         } else {
//             toast.success(`The material was successfully ${canBeLoaned ? "removed from" : "put on"} ${materialData.type === "LAB_SUPPLIES" ? "loan" : "donation"}`, { ...quickNotifyOption });

//             setTimeout(() => {
//               window.location.reload();
//             }, 2000); //maybe there's a better way?
//         }

//     } catch (error) {
//       toast.error('Could not update the material, try again later', { ...quickNotifyOption });
//     }
//     setOpen(false);
//   });


//   useEffect(() => {
//     if (materialId) {
//       //fetching material data
//       fetch(`${config.apiUrl}/materials/${materialId}`,{
//         credentials:'include'
//       })
//         .then(response => response.json())
//         .then(data => {
//           setMaterialData(data);

//           if (data.owner_details.user_id === user.user_id) {
//             setCanDeleteOrRemove(true);
//             setCanBeLoaned(data.available_for_loan)
//           } else {
//             setCanDeleteOrRemove(false);
//             setCanBeLoaned(data.available_for_loan)
//           }
//           if (user.is_staff) {
//             setCanDeleteOrRemove(true);
//             setCanBeLoaned(data.available_for_loan)
//           }

//           //fetching events related to given material
//           if (data.type === "LAB_SUPPLIES")
//             fetch(`${config.apiUrl}/material/${materialId}/events/`,{credentials:"include"})
//               .then(response => response.json())
//               .then(data => {
//                 setEventsData(data);
//               })
//               .catch(error => console.error('Error fetching data:', error));
//         })
//         .catch(error => console.error('Error fetching data:', error));
//     }
//   }, [ materialId,user]);

//   const handleBorrow = useCallback(() =>{
//     const url = '/create/create-loan' + (materialId ? `?materialId=${materialId}` : '');
//     router.push(url);
//   }, [materialId, router]);

//   return (
//     <>
//       <Head>
//         <title>
//           Material Details 
//         </title>
//       </Head>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           py: 8
//         }}
//       >
//         <Container maxWidth="lg">
//           <Stack spacing={3}>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               spacing={4}
//             >
//               <Typography variant="h4">
//                 Material Details
//               </Typography>
//               <Box
//                 sx={{
//                   position: 'fixed',
//                   top: 100, 
//                   right: 48,  
//                   zIndex: 1000, 
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   onClick={handleBorrow}
//                   disabled={!materialData?.available_for_loan || materialData.owner_details.user_id === user.user_id}
//                 >
//                 {materialData?.available_for_loan ? "Book Material" : "Not Available For loan"}
//                 </Button>
//               </Box>

//             </Stack>
//             <div>
//               <Grid
//                 container
//                 spacing={3}
//               >
//                 <Grid
//                   xs={12}
//                 >
//                   <MaterialDetailOverview 
//                     data = {materialData}
//                   />
//                 </Grid>
//                 <Grid
//                   xs={12}
//                 >
//                   <MaterialDetailEdit 
//                     data = {materialData}
//                   />
//                 </Grid>
//                 <Grid
//                   xs={12}
//                 >
//                   <MaterialDetailViewer
//                     data = {materialData?.images}
//                     owner = {materialData?.owner_details.user_id}
//                     id = {materialData?.material_id}
//                   />
//                 </Grid>
//                 { materialData && materialData.type === "LAB_SUPPLIES" &&
//                   <Grid
//                     xs={12}
//                   >
//                     <MaterialDetailCalendar
//                       data = {eventsData}
//                     />
//                   </Grid>
//                 }
//                 <Divider />
//                 {canDeleteOrRemove && <Grid
//                   xs={12}
//                 >
//                   <CardActions sx={{ justifyContent: 'flex-end' }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick= {() => {
//                         setOpen(true);
//                         setDialogSubject("loan");
//                       }}
//                     >
//                       {materialData.type ==="LAB_SUPPLIES"? (canBeLoaned? "Remove From Loan" : "Put On Loan") : (canBeLoaned? "Remove From Donation" : "Put On Donation")}
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       onClick= {() => {
//                         setOpen(true);
//                         setDialogSubject("delete");
//                       }}
//                     >
//                       Delete Material
//                     </Button>
//                   </CardActions>
//                   <Dialog open={open} onClose={() => setOpen(false)}>
//                     <DialogTitle>{getDialogDetails().title}</DialogTitle>
//                     <DialogContent>
//                       <DialogContentText>
//                         {getDialogDetails().content}
//                       </DialogContentText>
//                     </DialogContent>
//                     <DialogActions>
//                       <Button onClick={() => setOpen(false)}>Cancel</Button>
//                       <Button onClick={getDialogDetails().action} color="error">
//                         {getDialogDetails().buttonText}
//                       </Button>
//                     </DialogActions>
//                   </Dialog>
//                 </Grid>}
//               </Grid>
//             </div>
//           </Stack>
//         </Container>
//       </Box>
//     </>
//   );
// }

// Page.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

// export default Page;



import Head from 'next/head';
import { Box, Container, Stack, Typography, Button, Divider, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
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
import { getCookie } from '../../../utils/csrf';

// 1. Import translation hook
import { useTranslation } from 'react-i18next';

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

  // 2. Initialize translation hook
  const { t } = useTranslation();

  const getDialogDetails = useCallback(() => {
    let title = '';
    let content = '';
    let buttonText = '';
    let action = null;

    switch (dialogSubject) {
      case 'delete':
        title = t('materialDetailsPage.dialog.deleteTitle', 'Delete Material');
        content = t('materialDetailsPage.dialog.deleteContent', 'Are you sure you want to delete this material?');
        buttonText = t('materialDetailsPage.dialog.deleteBtn', 'Delete');
        action = handleDelete
        break;
      case 'loan':
        if (materialData.type ==="LAB_SUPPLIES") {
          title = canBeLoaned 
            ? t('materialDetailsPage.dialog.removeLoanTitle', 'Remove from Loan') 
            : t('materialDetailsPage.dialog.putLoanTitle', 'Put on Loan');
          content = canBeLoaned
              ? t('materialDetailsPage.dialog.removeLoanContent', 'Are you sure you want to remove this material from Loan?')
              : t('materialDetailsPage.dialog.putLoanContent', 'Are you sure you want to make this material available for Loan?');
          buttonText = canBeLoaned 
            ? t('materialDetailsPage.dialog.removeLoanBtn', 'Remove From Loan') 
            : t('materialDetailsPage.dialog.putLoanBtn', 'Put On Loan');
          action = handleCanBeLoaned;
        } else {
          title = canBeLoaned 
            ? t('materialDetailsPage.dialog.removeDonationTitle', 'Remove from Donation') 
            : t('materialDetailsPage.dialog.putDonationTitle', 'Put on Donation');
          content = canBeLoaned
              ? t('materialDetailsPage.dialog.removeDonationContent', 'Are you sure you want to remove this material from Donation?')
              : t('materialDetailsPage.dialog.putDonationContent', 'Are you sure you want to make this material available for Donation?');
          buttonText = canBeLoaned 
            ? t('materialDetailsPage.dialog.removeDonationBtn', 'Remove From Donation') 
            : t('materialDetailsPage.dialog.putDonationBtn', 'Put On Donation');
          action = handleCanBeLoaned;
        }
        break;
      default:
        break;
    }

    return { title, content, buttonText, action };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogSubject, canBeLoaned, materialData, t]);


  const handleDelete =  useCallback( async () => {
    try {
        const response = await fetch(`${config.apiUrl}/materials/${materialId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            toast.error(t('materialDetailsPage.toasts.deleteError', 'Could not delete material, try again later'), { ...quickNotifyOption });
        } else {
            toast.success(t('materialDetailsPage.toasts.deleteSuccess', 'The material was successfully deleted'), { ...quickNotifyOption });

            setTimeout(() => {
              router.push('/materials');
            }, 1000); 
        }

    } catch (error) {
      toast.error(t('materialDetailsPage.toasts.deleteError', 'Could not delete material, try again later'), { ...quickNotifyOption });
    }
    setOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId, router, t]);

  const handleCanBeLoaned =  useCallback( async () => {
    try {
      const csrftoken = getCookie('csrftoken');
      const response = await fetch(`${config.apiUrl}/materials/${materialId}/availability/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({available_for_loan: !materialData.available_for_loan})
      });

        if (!response.ok) {
            toast.error(t('materialDetailsPage.toasts.updateStatusError', 'Could not update the material status.'), { ...quickNotifyOption });
        } else {
            // Use dynamically constructed translation keys for full multi-language sentence support
            const actionStr = canBeLoaned ? 'removed' : 'added';
            const typeStr = materialData.type === "LAB_SUPPLIES" ? 'loan' : 'donation';
            const translationKey = `materialDetailsPage.toasts.success_${actionStr}_${typeStr}`;
            
            toast.success(t(translationKey, `The material was successfully ${canBeLoaned ? "removed from" : "put on"} ${materialData.type === "LAB_SUPPLIES" ? "loan" : "donation"}`), { ...quickNotifyOption });

            setTimeout(() => {
              window.location.reload();
            }, 2000); 
        }

    } catch (error) {
      toast.error(t('materialDetailsPage.toasts.updateError', 'Could not update the material, try again later'), { ...quickNotifyOption });
    }
    setOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId, materialData, canBeLoaned, t]);


  useEffect(() => {
    if (materialId) {
      fetch(`${config.apiUrl}/materials/${materialId}`,{
        credentials:'include'
      })
        .then(response => response.json())
        .then(data => {
          setMaterialData(data);

          if (data.owner_details.user_id === user.user_id) {
            setCanDeleteOrRemove(true);
            setCanBeLoaned(data.available_for_loan)
          } else {
            setCanDeleteOrRemove(false);
            setCanBeLoaned(data.available_for_loan)
          }
          if (user.is_staff) {
            setCanDeleteOrRemove(true);
            setCanBeLoaned(data.available_for_loan)
          }

          if (data.type === "LAB_SUPPLIES")
            fetch(`${config.apiUrl}/material/${materialId}/events/`,{credentials:"include"})
              .then(response => response.json())
              .then(data => {
                setEventsData(data);
              })
              .catch(error => console.error('Error fetching data:', error));
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [ materialId,user]);

  const handleBorrow = useCallback(() =>{
    const url = '/create/create-loan' + (materialId ? `?materialId=${materialId}` : '');
    router.push(url);
  }, [materialId, router]);

  return (
    <>
      <Head>
        <title>
          {t('materialDetailsPage.pageTitle', 'Material Details')}
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
                {t('materialDetailsPage.pageTitle', 'Material Details')}
              </Typography>
              <Box
                sx={{
                  position: 'fixed',
                  top: 100, 
                  right: 48,  
                  zIndex: 1000, 
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleBorrow}
                  disabled={!materialData?.available_for_loan || materialData.owner_details.user_id === user.user_id}
                >
                {materialData?.available_for_loan 
                  ? t('materialDetailsPage.buttons.bookMaterial', "Book Material") 
                  : t('materialDetailsPage.buttons.notAvailableForLoan', "Not Available For loan")}
                </Button>
              </Box>

            </Stack>
            <div>
              <Grid
                container
                spacing={3}
              >
                <Grid xs={12}>
                  <MaterialDetailOverview data={materialData} />
                </Grid>
                <Grid xs={12}>
                  <MaterialDetailEdit data={materialData} />
                </Grid>
                <Grid xs={12}>
                  <MaterialDetailViewer
                    data={materialData?.images}
                    owner={materialData?.owner_details.user_id}
                    id={materialData?.material_id}
                  />
                </Grid>
                { materialData && materialData.type === "LAB_SUPPLIES" &&
                  <Grid xs={12}>
                    <MaterialDetailCalendar data={eventsData} />
                  </Grid>
                }
                <Divider />
                {canDeleteOrRemove && <Grid xs={12}>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick= {() => {
                        setOpen(true);
                        setDialogSubject("loan");
                      }}
                    >
                      {materialData.type ==="LAB_SUPPLIES"
                        ? (canBeLoaned 
                            ? t('materialDetailsPage.dialog.removeLoanBtn', "Remove From Loan") 
                            : t('materialDetailsPage.dialog.putLoanBtn', "Put On Loan")) 
                        : (canBeLoaned 
                            ? t('materialDetailsPage.dialog.removeDonationBtn', "Remove From Donation") 
                            : t('materialDetailsPage.dialog.putDonationBtn', "Put On Donation"))}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick= {() => {
                        setOpen(true);
                        setDialogSubject("delete");
                      }}
                    >
                      {t('materialDetailsPage.buttons.deleteMaterial', 'Delete Material')}
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
                      <Button onClick={() => setOpen(false)}>
                        {t('materialDetailsPage.buttons.cancel', 'Cancel')}
                      </Button>
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