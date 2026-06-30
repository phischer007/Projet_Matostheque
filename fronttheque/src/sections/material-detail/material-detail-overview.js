// import { Avatar, Box, Card, CardContent, Stack, IconButton, Typography, Grid, Divider, CardActions, Button } from '@mui/material';
// import { MaterialQRCodeDoc } from 'src/documents/material-qrcode-document';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import { PresentationChartBarIcon, GlobeAsiaAustraliaIcon } from '@heroicons/react/24/outline';
// import Tooltip from '@mui/material/Tooltip';
// import { useCallback } from 'react';
// import { toast } from 'react-toastify';
// import { quickNotifyOption } from 'src/utils/notification-config';

// export const MaterialDetailOverview = (props) => {
//   const data = props.data
//   const qrcode_Docname = data ? `qr_code_${data.material_id}_ ${data.material_title}.pdf` : '';
//   const material_number = `Mutmat-${data?.material_id.toString().padStart(3, '0')}`;

//   const onManualOpen = useCallback(()=> {
//     if(data.manual_link){
//       try {
//         new URL(data.manual_link);
//         window.open(data.manual_link, '_blank');
//       } catch (_) {
//         toast.info("The provided url is not a valid one.", { ...quickNotifyOption });
//       }
//       return;
//     }
//     toast.info("No manual link provided.", { ...quickNotifyOption });
//   });

//   const onDataSheetOpen = useCallback(()=> {
//     if(data.datasheet_link){
//       try {
//         new URL(data.datasheet_link);
//         window.open(data.datasheet_link, '_blank');
//       } catch (_) {
//         toast.info("The provided url is not a valid one.", { ...quickNotifyOption });
//       }
//       return;
//     }
//     toast.info("No datasheet link provided.", { ...quickNotifyOption });
//   });

//   const printQRCodeAndMaterialNumber = useCallback(() => {
//     const printWindow = window.open('', '_blank');
//     if (printWindow) {
//       printWindow.document.write(`
//         <html>
//           <head>
//             <style>
//               body { font-family: Arial, sans-serif; text-align: center; }
//               img { margin-top: 10px; }
//               h5 { margin-top: -50px; }
//             </style>
//           </head>
//           <body>
//             <img src="data:image/png;base64,${data.qrcode}" alt="QRCode" style="width: 250px; height: 250px; object-fit: cover;"/>
//             <h5> ${material_number} </h5>
//           </body>
//         </html>
//       `);
//       printWindow.document.close(); // Required for IE >= 10
//       printWindow.print();
//     }
//   }, [data, material_number]);

//   return data ? 
//   (
//     <Card>
//       <CardContent>
//         <Box
//           sx={{
//             alignItems: 'center',
//             display: 'flex',
//             flexDirection: 'column',
//             position: 'relative'
//           }}
//         >
//           <Grid
//             container
//             xs={12}
//             sx={{
//               justifyContent: 'flex-end',
//               position: 'absolute'
//             }}
//           >
//             <Stack>
//               <Tooltip title="Manual" placement="left" >
//                 <IconButton onClick={onManualOpen} color='primary' sx={{ height: 40, width: 40 }} disabled={data.manual_link === null}>
//                   <GlobeAsiaAustraliaIcon />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Datasheet" placement="left">
//                 <IconButton onClick={onDataSheetOpen} color='primary' sx={{ height: 40, width: 40 }} disabled={data.datasheet_link === null}>
//                   <PresentationChartBarIcon />
//                 </IconButton>
//               </Tooltip>
//             </Stack>
//           </Grid>
//           <Avatar
//               variant="square"
//               sx={{
//                 height: 250,
//                 width: 250,
//               }}
//             >
//               <img
//                 src={`data:image/png;base64,${data.qrcode}`}
//                 alt="QRCode"
//                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//               />
//             </Avatar>
//           <Typography
//             gutterBottom
//             variant="h6"
//           >
//             {data.material_title}
//           </Typography>
//           <Typography
//             gutterBottom
//             variant="subtitle1"
//           >
//             {data.description}
//           </Typography>
//           <Typography
//             color="text.secondary"
//             variant="body2"
//           >
//             Contact : {data.owner_details.first_name} {data.owner_details.last_name}
//           </Typography>
//           <Typography
//             color="text.secondary"
//             variant="body2"
//           >
//             E-mail : {data.owner_details.email}
//           </Typography>
//           <Typography
//             color="text.secondary"
//             variant="body2"
//           >
//             Material Number : {material_number}
//           </Typography>
//           {data.available_for_transaction && <Grid
//             container
//             justifyContent="center"
//             alignItems="center"
//             spacing={1}
//             fullWidth
//           >
//             <Grid item>
//               <span>{data.availability ? 'Available' : 'Not Available'}</span>
//             </Grid>
//             <Grid item>
//               <Box
//                 sx={{
//                   width: 15,
//                   height: 15,
//                   borderRadius: 1,
//                   bgcolor: data.availability ? '#99FF99' : '#FF9999',
//                 }}
//               />
//             </Grid>
//           </Grid>}
//         </Box>
//       </CardContent>
//       {!props.mode && <>
//         <Divider />
//         <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
//           <PDFDownloadLink
//             document={<MaterialQRCodeDoc
//               documentData={[{
//                 qrCodeData: data.qrcode,
//                 material_id: data.material_id,
//                 material_title: data.material_title
//               }]}
//             />}
//             fileName={qrcode_Docname}
//           >
//             {({ blob, url, loading, error }) => (
//               <Button fullWidth variant="text">
//                 {loading ? 'Loading Document' : 'Print QRCode as PDF'}
//               </Button>
//             )}
//           </PDFDownloadLink>

//           <Button variant="text" onClick={printQRCodeAndMaterialNumber}>
//             Print QRCode & Material Number
//           </Button>

//         </CardActions>
//       </>}
//     </Card>
//     )
//     : 
//     (
//       <Card>
//         <CardContent>
//           <Typography
//             gutterBottom
//             variant="h5"
//           >
//             No material found!!
//           </Typography>
//         </CardContent>
//       </Card>
//     );
// }


import { 
  Avatar, 
  Box, 
  Card, 
  CardContent, 
  Stack, 
  IconButton, 
  Typography, 
  Grid, 
  Divider, 
  CardActions, 
  Button 
} from '@mui/material';
import { MaterialQRCodeDoc } from 'src/documents/material-qrcode-document';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PresentationChartBarIcon, GlobeAsiaAustraliaIcon } from '@heroicons/react/24/outline';
import Tooltip from '@mui/material/Tooltip';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { quickNotifyOption } from 'src/utils/notification-config';

export const MaterialDetailOverview = (props) => {
  const data = props.data;

  // 1. ALL HOOKS MUST BE DEFINED FIRST
  // We use data?.property to prevent crashes when data is initially null
  const onManualOpen = useCallback(()=> {
    if(data?.manual_link){
      try {
        new URL(data.manual_link);
        window.open(data.manual_link, '_blank');
      } catch (_) {
        toast.info("The provided url is not a valid one.", { ...quickNotifyOption });
      }
      return;
    }
    toast.info("No manual link provided.", { ...quickNotifyOption });
  }, [data]); 

  const onDataSheetOpen = useCallback(()=> {
    if(data?.datasheet_link){
      try {
        new URL(data.datasheet_link);
        window.open(data.datasheet_link, '_blank');
      } catch (_) {
        toast.info("The provided url is not a valid one.", { ...quickNotifyOption });
      }
      return;
    }
    toast.info("No datasheet link provided.", { ...quickNotifyOption });
  }, [data]);

  const printQRCodeAndMaterialNumber = useCallback(() => {
    if (!data) return; // Extra safety check before opening the window
    
    const material_number = `Mutmat-${data.material_id.toString().padStart(3, '0')}`;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; }
              img { margin-top: 10px; }
              h5 { margin-top: -50px; }
            </style>
          </head>
          <body>
            <img src="data:image/png;base64,${data.qrcode}" alt="QRCode" style="width: 250px; height: 250px; object-fit: cover;"/>
            <h5> ${material_number} </h5>
          </body>
        </html>
      `);
      printWindow.document.close(); // Required for IE >= 10
      printWindow.print();
    }
  }, [data]);

  // 2. NOW WE DO THE EARLY RETURN
  // If data is null, we stop here and render nothing.
  if (!data) {
    return null; 
  }

  // 3. SAFE TO ACCESS VARIABLES
  // Because of the early return above, 'data' is guaranteed to exist from this line down.
  const qrcode_Docname = `qr_code_${data.material_id}_ ${data.material_title}.pdf`;
  const material_number = `Mutmat-${data.material_id.toString().padStart(3, '0')}`;

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Grid
            container
            xs={12}
            sx={{
              justifyContent: 'flex-end',
              position: 'absolute'
            }}
          >
            <Stack>
              <Tooltip title="Manual" placement="left" >
                <IconButton onClick={onManualOpen} color='primary' sx={{ height: 40, width: 40 }} disabled={data.manual_link === null}>
                  <GlobeAsiaAustraliaIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Datasheet" placement="left">
                <IconButton onClick={onDataSheetOpen} color='primary' sx={{ height: 40, width: 40 }} disabled={data.datasheet_link === null}>
                  <PresentationChartBarIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
          <Avatar
              variant="square"
              sx={{
                height: 250,
                width: 250,
              }}
            >
              <img
                src={`data:image/png;base64,${data.qrcode}`}
                alt="QRCode"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Avatar>
          <Typography
            gutterBottom
            variant="h6"
          >
            {data.material_title}
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle1"
          >
            {data.description}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Contact : {data.owner_details.first_name} {data.owner_details.last_name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            E-mail : {data.owner_details.email}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Material Number : {material_number}
          </Typography>
          {data.available_for_transaction && <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
            fullWidth
          >
            <Grid item>
              <span>{data.availability ? 'Available' : 'Not Available'}</span>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  width: 15,
                  height: 15,
                  borderRadius: 1,
                  bgcolor: data.availability ? '#99FF99' : '#FF9999',
                }}
              />
            </Grid>
          </Grid>}
        </Box>
      </CardContent>
      {!props.mode && <>
        <Divider />
        <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
          <PDFDownloadLink
            document={<MaterialQRCodeDoc
              documentData={[{
                qrCodeData: data.qrcode,
                material_id: data.material_id,
                material_title: data.material_title
              }]}
            />}
            fileName={qrcode_Docname}
          >
            {({ blob, url, loading, error }) => (
              <Button fullWidth variant="text">
                {loading ? 'Loading Document' : 'Print QRCode as PDF'}
              </Button>
            )}
          </PDFDownloadLink>

          <Button variant="text" onClick={printQRCodeAndMaterialNumber}>
            Print QRCode & Material Number
          </Button>
        </CardActions>
      </>}
    </Card>
  );
}