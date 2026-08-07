import { useState } from 'react';
import PropTypes from 'prop-types';
import BellIcon from '@heroicons/react/24/solid/BellIcon';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import { 
  Avatar, 
  Badge, 
  Box, 
  IconButton, 
  Stack, 
  SvgIcon, 
  Tooltip, 
  useMediaQuery,
  Menu,
  MenuItem,
  Button,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { usePopover } from 'src/hooks/use-popover';
import { AccountPopover } from './account-popover';
import { NotificationPopover } from './notification-popover';
import { useAuth } from 'src/hooks/use-auth';
import { useTranslation } from 'react-i18next'; // Imported from i18next

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const accountPopover = usePopover();
  const notifPopover = usePopover();
  const user = useAuth().user;
  
  // 1. Initialize translation and detect layout direction dynamically
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar'; 

  // 2. State and logic for the Language Switcher Menu (Inspired by the Video)
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const openLangMenu = Boolean(langAnchorEl);
  
  const handleLangMenuOpen = (event) => {
    setLangAnchorEl(event.currentTarget);
  };
  
  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);

    // Save the selected language to local storage so it survives page reloads
    localStorage.setItem('appLanguage', lng);

    // Dynamically flip the HTML direction based on the selected language
    document.dir = lng === 'ar' ? 'rtl' : 'ltr'; 
    document.documentElement.lang = lng;
    handleLangMenuClose(); // Close menu after selection
  };

  // Language options with Emojis as used in the tutorial
  const languageOptions = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'French', flag: '🇫🇷' }
  ];

  // Find the currently active language to display on the button
  const currentLang = languageOptions.find((l) => l.code === i18n.language) || languageOptions[0];

  let image_path = '';
  if (user?.profil_pic && user.profil_pic.length !== 0) {
    try {
      const images = JSON.parse(user.profil_pic);
      image_path = images && images.length > 0 ? `${process.env.NEXT_PUBLIC_ASSETS}${images[0]}` : '';
    } catch (e) {
      console.error("Error parsing profile picture:", e);
    }
  }

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          position: 'sticky',
          top: 0,
          // 3. Dynamically adjust Nav spacing depending on RTL/LTR state
          ...(isRtl ? {
            right: { lg: `${SIDE_NAV_WIDTH}px` },
            left: 0
          } : {
            left: { lg: `${SIDE_NAV_WIDTH}px` },
            right: 0
          }),
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
          },
          zIndex: (theme) => theme.zIndex.appBar
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2
          }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
          </Stack>
          
          <Stack alignItems="center" direction="row" spacing={2}>
            
            {/* 4. Language Switcher Button */}
            <Button 
              onClick={handleLangMenuOpen}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              <Typography variant="body1" sx={{ mr: 1 }}>{currentLang.flag}</Typography>
              {!lgUp ? null : <Typography variant="subtitle2">{currentLang.label}</Typography>}
            </Button>
            
            {/* Language Switcher Dropdown */}
            <Menu
              anchorEl={langAnchorEl}
              open={openLangMenu}
              onClose={handleLangMenuClose}
              PaperProps={{ sx: { width: 150 } }}
            >
              {languageOptions.map((option) => (
                <MenuItem 
                  key={option.code} 
                  selected={option.code === i18n.language}
                  onClick={() => changeLanguage(option.code)}
                >
                  <Typography variant="body1" sx={{ mr: 1.5 }}>
                    {option.flag}
                  </Typography>
                  {option.label}
                </MenuItem>
              ))}
            </Menu>

            <Tooltip title={t('navbar.notifications', { defaultValue: 'Notifications' })}>
              <IconButton
                onClick={notifPopover.handleOpen}
                ref={notifPopover.anchorRef}
              >
                <Badge badgeContent={4} color="success" variant="dot">
                  <SvgIcon fontSize="small">
                    <BellIcon />
                  </SvgIcon>
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{ cursor: 'pointer', height: 40, width: 40 }}
              src={image_path}
            />
          </Stack>
        </Stack>
      </Box>
      
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
      <NotificationPopover
        anchorEl={notifPopover.anchorRef.current}
        open={notifPopover.open}
        onClose={notifPopover.handleClose}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};