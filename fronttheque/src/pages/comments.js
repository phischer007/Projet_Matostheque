// import React, { useCallback, useMemo, useState, useEffect } from 'react';
// import Head from 'next/head';
// import { Box, Container, Stack, SvgIcon, Typography, Grid } from '@mui/material';
// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
// import { CreateComment } from 'src/sections/comments/create-comment';
// import { CommentThread } from 'src/sections/comments/comments-thread';
// import config from 'src/utils/config';
// import { useAuth } from 'src/hooks/use-auth';

// const Page = () => {
//     const [commentsList, setCommentsList] = useState([]);
//     const user = useAuth().user;

//     useEffect(() => {
//         fetch(`${config.apiUrl}/comments/detailed/`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 setCommentsList(data);
//                 console.log(data);
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     }, []);

//     return (
//         <>
//             <Head>
//                 <title>Threads</title>
//             </Head>
//             <Box
//                 component="main"
//                 sx={{
//                     flexGrow: 1,
//                     py: 4
//                 }}
//             >
//                 <Container maxWidth="xl" sx={{ position: 'relative', minHeight: '100%' }}>
//                     <Stack
//                         container
//                         spacing={3}
//                         sx={{
//                             flexDirection: 'column'
//                         }}
//                     >
//                         <Stack
//                             direction="row"
//                             justifyContent="space-between"
//                             spacing={4}
//                             item
//                         >
//                             <Stack spacing={1}>
//                                 <Typography variant="h4">@Threads</Typography>
//                             </Stack>
//                         </Stack>
//                         <Box sx={{
//                             maxHeight: '615px',
//                             overflowY: 'auto',
//                             scrollbarWidth: 'thin',
//                             '&::-ms-scrollbar': {
//                                 width: '8px',
//                                 backgroundColor: 'rgba(0, 0, 0, 0.1)'
//                             },
//                             '&::-ms-scrollbar-thumb': {
//                                 backgroundColor: 'rgba(0, 0, 0, 0.2)',
//                                 borderRadius: '4px'
//                             }
//                         }}
//                         >
//                             <Stack
//                                 direction="column"
//                                 justifyContent="space-between"
//                                 spacing={2}
//                                 sx={{
//                                     boxShadow: 'none',
//                                 }}
//                                 item
//                             >
//                                 {commentsList && commentsList.map((item, index) => (
//                                     <CommentThread key={index} comment={item} />
//                                 ))}
//                             </Stack>
//                         </Box>
//                         <Stack
//                             direction="row"
//                             justifyContent="space-between"
//                             item
//                             sx={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 width: '95%'
//                             }}
//                         >
//                             <CreateComment />
//                         </Stack>
//                     </Stack>
//                 </Container>
//             </Box>
//         </>
//     );
// };

// Page.getLayout = (page) => (
//     <DashboardLayout>
//         {page}
//     </DashboardLayout>
// );

// export default Page;


import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Stack, SvgIcon, Typography, Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CreateComment } from 'src/sections/comments/create-comment';
import { CommentThread } from 'src/sections/comments/comments-thread';
import config from 'src/utils/config';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {
  const [commentsList, setCommentsList] = useState([]);
  const user = useAuth().user;

  useEffect(() => {
    fetch(`${config.apiUrl}/comments/detailed/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setCommentsList(data);
            console.log(data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
  }, []);

  return (
    <>
      <Head>
        <title>Threads</title>
      </Head>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', minHeight: '100%' }}>
          <Stack
            container
            spacing={3}
            sx={{
              flexDirection: 'column',
              minHeight: '85vh',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ flexGrow: 1, pb: 15 }}> {/* Added padding-bottom to prevent content from hiding behind sticky footer */}
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
                sx={{ mb: 3 }}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">@Threads</Typography>
                </Stack>
              </Stack>
                            
              <Box sx={{ width: '100%' }}>
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  spacing={2}
                  sx={{
                    boxShadow: 'none',
                  }}
                >
                  {commentsList && commentsList.map((item, index) => (
                    <CommentThread key={index} comment={item} />
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Sticky Footer Configuration */}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                position: 'sticky', 
                bottom: 0,
                width: '100%',
                py: 3, 
                px: 1,
                zIndex: 1100, // High z-index to stay on top
                backgroundColor: 'background.paper', // Opaque background to hide scrolling content
                borderTop: 1,
                borderColor: 'divider',
                boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.05)' // Optional subtle shadow for depth
              }}
            >
              <CreateComment />
            </Stack>
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