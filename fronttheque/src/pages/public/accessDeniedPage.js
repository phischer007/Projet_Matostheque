// import Head from 'next/head';
// import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';

// const Page = () => (
//   <>
//     <Head>
//       <title>
//         Connexion impossible
//       </title>
//     </Head>
//     <Box
//       component="main"
//       sx={{
//         alignItems: 'center',
//         display: 'flex',
//         flexGrow: 1,
//         minHeight: '100%'
//       }}
//     >
//       <Container maxWidth="md">
//         <Box
//           sx={{
//             alignItems: 'center',
//             display: 'flex',
//             flexDirection: 'column'
//           }}
//         >
//           <Box
//             sx={{
//               mb: 3,
//               textAlign: 'center'
//             }}
//           >
//             <img
//               alt="Under development"
//               src="/mutmat/assets/errors/error-404.png"
//               style={{
//                 display: 'inline-block',
//                 maxWidth: '100%',
//                 width: 400
//               }}
//             />
//           </Box>
//           <Typography
//             align="center"
//             sx={{ mb: 3 }}
//             variant="h3"
//           >
//             Votre laboratoire ne fait pas partie des établissements actuellement inscrits à l'application.
//           </Typography>
//           <Typography
//             align="center"
//             color="text.secondary"
//             variant="body1"
//           >
//           Veuillez contacter votre direction afin qu'elle effectue une demande
//           d'adhésion au projet.
//           </Typography>
//                     <Typography
//             align="center"
//             color="text.secondary"
//             variant="body1"
//           >
//           L'accès à l'application sera possible une fois votre laboratoire
//           enregistré et validé.
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   </>
// );

// export default Page;


import { Box, Button, Container, Typography } from '@mui/material';

const Page = () => (
  <Box
    component="main"
    sx={{
      alignItems: 'center',
        backgroundColor: '#f4f7f6',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100vh',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
            borderTop: '5px solid #0056b3',
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 3, md: 5 },
            textAlign: 'center'
          }}
        >
          <Typography sx={{ fontSize: 48, mb: 2 }}>
            🔒
          </Typography>
          
          <Typography
            align="center"
            sx={{ mb: 2, color: '#0056b3', fontWeight: 'bold' }}
            variant="h5"
            component="h1"
          >
            Accès restreint - Inscription à MUTMAT requise
          </Typography>
          
          <Typography
            align="center"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.6 }}
            variant="body1"
          >
            Pour accéder à cette application, votre{' '}
            <Box 
              component="span" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#333333', 
                backgroundColor: '#eef2f5', 
                px: 1, 
                py: 0.5, 
                borderRadius: '4px' 
              }}
            >
              laboratoire
            </Box>{' '}
            doit d'abord être inscrit et faire partie des établissements actuellement agréés par l'équipe du <strong> MUTMAT ou DGDSI</strong>.
          </Typography>
          
          <Typography
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
            variant="body2"
          >
            Veuillez contacter la direction de votre établissement afin qu'elle puisse soumettre une demande d'adhésion au projet. L'accès à l'application vous sera accordé dès que votre laboratoire aura été enregistré et approuvé.
          </Typography>
          
          <Button
            component="a"
            href="mailto:support.dgdsi@votre-institution.fr?subject=Demande%20d'inscription%20laboratoire"
            variant="contained"
            sx={{
              backgroundColor: '#0056b3',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#004494'
              }
            }}
          >
            Contacter le support MUTMAT ou DGDSI
          </Button>
    </Box>
  </Container>
</Box>
);

export default Page;