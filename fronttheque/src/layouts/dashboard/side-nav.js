import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import {
  Box,
  Divider,
  Drawer,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import { useAuth } from 'src/hooks/use-auth';

import { useTranslation } from 'react-i18next';

export const SideNav = (props) => {
  const user = useAuth().user;
  const { open, onClose } = props;
  const router = useRouter();
  const pathname = router.pathname;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const { t, i18n } = useTranslation();

  const anchorDir = i18n.language === 'ar' ? 'right' : 'left';

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {/* Combine Logo and Typography inside this single centering Box */}
        <Box 
          sx={{ 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center' 
          }}
        >
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'flex',
              minHeight: 50,
              maxHeight: 75,
              minWidth: 50,
              maxWidth: 75,
              justifyContent: 'center' // Ensures the logo itself is centered in its link box
            }}
          >
            <Logo />
          </Box>
          <Typography
            color="inherit"
            variant="h5"
            sx={{ 
              mt: 4, // Adjusted from 8 to 4 to give a balanced space, change back to 8 if you want a huge gap
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Matosthèque
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'neutral.700' }} />

        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {items.map((item) => {
              const active = item.path ? (pathname === item.path) : false;
              if ((item.path === "/mymaterials" && user.role !== "owner") ||(item.path === "/userslist" && !user.is_staff)) return;
              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  // title={item.title}
                  title={t(item.title)}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          sx={{
            px: 2,
            py: 3
          }}
        >
          <Typography
            color="neutral.100"
            variant="subtitle2"
          >
            Version 2.0.0
          </Typography>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        // anchor="left"
        anchor={anchorDir}
        open
        PaperProps={{
          sx: {
            backgroundColor: '#162A42',
            color: 'common.white',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      // anchor="left"
      anchor={anchorDir}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: '#0B1120',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};

// import { useTranslation } from 'react-i18next';
// import NextLink from 'next/link';
// import { useRouter } from 'next/router';
// import PropTypes from 'prop-types';

// import {
//   Box,
//   Divider,
//   Drawer,
//   Stack,
//   Typography,
//   useMediaQuery,
//   Select,
//   MenuItem,
//   FormControl
// } from '@mui/material';
// import { Logo } from 'src/components/logo';
// import { Scrollbar } from 'src/components/scrollbar';
// import { items } from './config';
// import { SideNavItem } from './side-nav-item';
// import { useAuth } from 'src/hooks/use-auth';

// export const SideNav = (props) => {
//   const user = useAuth().user;
//   const { open, onClose } = props;
//   const router = useRouter();
//   const pathname = router.pathname;
//   const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

//   const { t, i18n } = useTranslation();

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//     document.dir = lng === 'ar' ? 'rtl' : 'ltr'; // Adjust the direction based on the language
//     document.documentElement.lang = lng; // Set the lang attribute for accessibility
//   };

//   const languageOptions = [
//     { code: 'en', label: 'English' },
//     { code: 'fr', label: 'French' },
//     { code: 'ar', label: 'العربية' } // Added Arabic to test your RTL logic
//   ];

//   const content = (
//     <Scrollbar
//       sx={{
//         height: '100%',
//         '& .simplebar-content': {
//           height: '100%'
//         },
//         '& .simplebar-scrollbar:before': {
//           background: 'neutral.400'
//         }
//       }}
//     >
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           height: '100%'
//         }}
//       >
//         <Box 
//           sx={{ 
//             p: 3,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center' 
//           }}
//         >
//           <Box
//             component={NextLink}
//             href="/"
//             sx={{
//               display: 'flex',
//               minHeight: 50,
//               maxHeight: 75,
//               minWidth: 50,
//               maxWidth: 75,
//               justifyContent: 'center'
//             }}
//           >
//             <Logo />
//           </Box>
//           <Typography
//             color="inherit"
//             variant="h5"
//             sx={{ 
//               mt: 4, 
//               fontWeight: 'bold',
//               textAlign: 'center'
//             }}
//           >
//             Matosthèque
//           </Typography>
//         </Box>

//         <Divider sx={{ borderColor: 'neutral.700' }} />

//         <Box
//           component="nav"
//           sx={{
//             flexGrow: 1,
//             px: 2,
//             py: 3
//           }}
//         >
//           <Stack
//             component="ul"
//             spacing={0.5}
//             sx={{
//               listStyle: 'none',
//               p: 0,
//               m: 0
//             }}
//           >
//             {items.map((item) => {
//               const active = item.path ? (pathname === item.path) : false;
//               if ((item.path === "/mymaterials" && user?.role !== "owner") || (item.path === "/userslist" && !user?.is_staff)) return null;
              
//               return (
//                 <SideNavItem
//                   active={active}
//                   disabled={item.disabled}
//                   external={item.external}
//                   icon={item.icon}
//                   key={item.title}
//                   path={item.path}
//                   title={t(item.title)} // Translate the item title dynamically
//                 />
//               );
//             })}
//           </Stack>
//         </Box>
        
//         <Divider sx={{ borderColor: 'neutral.700' }} />
        
//         {/* Language Selector */}
//         <Box sx={{ px: 2, py: 2 }}>
//           <FormControl fullWidth size="small">
//             <Select
//               value={i18n.language || 'en'}
//               onChange={(e) => changeLanguage(e.target.value)}
//               sx={{
//                 color: 'neutral.100',
//                 '.MuiOutlinedInput-notchedOutline': { borderColor: 'neutral.700' },
//                 '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'neutral.400' },
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
//                 '& .MuiSvgIcon-root': { color: 'neutral.400' }
//               }}
//             >
//               {languageOptions.map((option) => (
//                 <MenuItem key={option.code} value={option.code}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>

//         <Box
//           sx={{
//             px: 2,
//             py: 3,
//             pt: 1 // Reduced top padding to accommodate the select box
//           }}
//         >
//           <Typography
//             color="neutral.400"
//             variant="subtitle2"
//           >
//             Version 2.0.0
//           </Typography>
//         </Box>
//       </Box>
//     </Scrollbar>
//   );

//   // Dynamic anchor to support RTL layout (Arabic)
//   const anchorDir = i18n.language === 'ar' ? 'right' : 'left';

//   if (lgUp) {
//     return (
//       <Drawer
//         anchor={anchorDir}
//         open
//         PaperProps={{
//           sx: {
//             backgroundColor: '#162A42',
//             color: 'common.white',
//             width: 280
//           }
//         }}
//         variant="permanent"
//       >
//         {content}
//       </Drawer>
//     );
//   }

//   return (
//     <Drawer
//       anchor={anchorDir}
//       onClose={onClose}
//       open={open}
//       PaperProps={{
//         sx: {
//           backgroundColor: '#0B1120',
//           color: 'common.white',
//           width: 280
//         }
//       }}
//       sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
//       variant="temporary"
//     >
//       {content}
//     </Drawer>
//   );
// };

// SideNav.propTypes = {
//   onClose: PropTypes.func,
//   open: PropTypes.bool
// };