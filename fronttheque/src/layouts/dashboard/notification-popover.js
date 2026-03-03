import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import config from 'src/utils/config';
import { NotificationCard } from 'src/sections/notification-pop/notification-card';


export const NotificationPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const [lastNotifList, setlastNotifList] = useState(null);
  const router = useRouter();
  const auth = useAuth();
  const user = auth.user;

  const handleView = useCallback(
    () => {
      onClose?.();
      router.push(`/notifications`);
    },
    [onClose, auth, router]
  );

  useEffect(() => {
    fetch(`${config.apiUrl}/notifications/${user.user_id}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const slicedData = data?.slice(0, 3);
        setlastNotifList(slicedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [])

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 500 } }}
    >
      {user ?
        <Box
          sx={{
            py: 2,
            px: 2
          }}
        >
          {lastNotifList && lastNotifList.length >0 ? lastNotifList.map(item =>
            < NotificationCard key={item.notif_id} notification={item} />
          ) : <Typography variant="subtitle2">
            No notification to show.
          </Typography>}

        </Box> : null}

      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={handleView}>
          View all
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

NotificationPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
