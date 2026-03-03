// import React, {useEffect, useState} from 'react';
// import Head from 'next/head';
// import {
//   Box,
//   Button,
//   Container,
//   Stack,
//   SvgIcon,
//   Typography,
//   Unstable_Grid2 as Grid
// } from '@mui/material';
// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
// import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
// import NewLoanCard from 'src/sections/create-loan/new-loan-card';
// import config from '../../utils/config';
// import { useRouter } from 'next/router';

// const Page = () => {
//   const router =  useRouter();
//   const { materialId } = router.query;
//   const [materialsList, setMaterialsList] = useState(null);

//   useEffect(() => {
//     fetch(`${config.apiUrl}/materials/lite/`)
//       .then(response => response.json())
//       .then(data => {
//         setMaterialsList(data);
//       })
//       .catch(error => console.error('Error fetching data:', error));
//   }, []);


//   return (
//     <>
//       <Head>
//         <title>
//           New loan 
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
//             <div>
//               <Typography variant="h4">
//                 Borrow a material
//               </Typography>
//             </div>
//             <div>
//               <Grid
//                 container
//                 spacing={3}
//               >
//                 <Grid
//                   xs={12}
//                   md={10}
//                   lg={10}
//                 >
//                   {materialsList && (
//                   <NewLoanCard
//                     materialsList={materialsList} 
//                     selectedMaterial = {materialId? parseInt(materialId) : null}/>
//                   )}
//                 </Grid>
//               </Grid>
//             </div>
//           </Stack>
//         </Container>
//       </Box>
//     </>
//   );
// };

// Page.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

// export default Page;


import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import NewLoanCard from 'src/sections/create-loan/new-loan-card';
import config from '../../utils/config';
import { useRouter } from 'next/router';

const Page = () => {
  const router =  useRouter();
  const { materialId } = router.query;
  const [materialsList, setMaterialsList] = useState(null);

  useEffect(() => {
    fetch(`${config.apiUrl}/materials/lite/`)
      .then(response => response.json())
      .then(data => {
        // Sort the data alphabetically by material_title
        if (data) {
            const list = Array.isArray(data) ? data : Object.values(data);
            list.sort((a, b) => (a.material_title || "").localeCompare(b.material_title || ""));
            setMaterialsList(list);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  return (
    <>
      <Head>
        <title>
          New loan 
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
                Borrow a material
              </Typography>
            </div>
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
                  {materialsList && (
                  <NewLoanCard
                    materialsList={materialsList} 
                    selectedMaterial = {materialId? parseInt(materialId) : null}/>
                  )}
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