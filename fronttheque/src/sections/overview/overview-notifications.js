import { useState } from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon, ClockIcon, BellIcon } from '@heroicons/react/24/solid';
import { Grid, Card, CardContent, Stack, SvgIcon, Typography, IconButton } from '@mui/material';
import { formatDate } from 'src/utils/get-formatted-date';
import { alpha } from '@mui/material/styles';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';

export const OverviewNotification = (props) => {
  const { data } = props;
  const date = formatDate(data.created_at);
  const [isVisible, setIsVisible] = useState(true);
  const handleButtonClick = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && <Card>
        <CardContent sx={{ p: 0, pb: '0 !important' }}>
          <Stack
            alignItems="flex-start"
            direction="row"
            justifyContent="space-between"
            spacing={3}
          >
            <Stack spacing={1} sx={{ px: 2, pt:1, pb:0 }}>
              <Typography
                color="text.secondary"
                variant="overline"
                sx={{ fontSize: '0.9rem' }}
              >
                Notification
              </Typography>
            </Stack>
            <Stack>
            <IconButton
              onClick={handleButtonClick}
              color="error"
              sx={{
                eight: 47,
                width: 47,

              }}
            >
              <XCircleIcon />
            </IconButton>
            </Stack>
          </Stack>
          <Grid container sx={{ p: 2 }} justifyContent="space-between">
            <Grid item xs={12} sm={8}>
              <Typography
                color="text.primary"
                variant="subtitle1"
              >
                {data.description}
              </Typography>
            </Grid>
              {date && (
                <Grid item 
                  xs={12} 
                  sm={4} 
                  container 
                  alignItems="center" 
                  justifyContent="flex-end"
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={0.5}
                    sx={{px:1}}
                  >
                    <SvgIcon
                      color='disabled'
                      fontSize="smaller"
                    >
                      <ClockIcon />
                    </SvgIcon>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Date:
                    </Typography>
                  </Stack>
                  <Grid item>
                  <Typography
                    color="text.secondary"
                    variant="caption"
                  >
                    {date}
                  </Typography>
                  </Grid>
                </Grid>
              )}
          </Grid>
        </CardContent>
      </Card>}
    </>
  );
};

OverviewNotification.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
