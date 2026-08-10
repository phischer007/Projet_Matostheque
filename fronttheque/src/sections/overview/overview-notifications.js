import { useState } from 'react';
import PropTypes from 'prop-types';
import { ClockIcon } from '@heroicons/react/24/solid';
import { Grid, Card, CardContent, Stack, SvgIcon, Typography, IconButton } from '@mui/material';
import { formatDate } from 'src/utils/get-formatted-date';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';

import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

// -------------------------------------------------------------------------------------------------------- //

// --- UPDATED PARSER FUNCTION ---
const translateDescription = (desc, t) => {
  if (!desc) return desc;

  // 1. Pending Request (English & French)
  if (desc.startsWith("You have a new pending request: ")) {
    const title = desc.replace("You have a new pending request: ", "");
    return t('newLoan.notifications.ownerPending', { title: title });
  }
  if (desc.startsWith("Vous avez une nouvelle demande en attente : ")) {
    const title = desc.replace("Vous avez une nouvelle demande en attente : ", "");
    return t('newLoan.notifications.ownerPending', { title: title });
  }

  // 2. Owner Booked (English & French)
  if (desc.includes(" has booked your material: ")) {
    const parts = desc.split(" has booked your material: ");
    const name = parts[0];
    const title = parts[1].replace(".", ""); 
    return t('newLoan.notifications.ownerBooked', { name: name, title: title });
  }
  if (desc.includes(" a réservé votre matériel : ")) {
    const parts = desc.split(" a réservé votre matériel : ");
    const name = parts[0];
    const title = parts[1].replace(".", ""); 
    return t('newLoan.notifications.ownerBooked', { name: name, title: title });
  }

  // 3. Borrower Success (English & French)
  if (desc.startsWith("You successfully booked the material: ")) {
    const title = desc.replace("You successfully booked the material: ", "").replace(".", "");
    return t('newLoan.notifications.borrowerSuccess', { title: title });
  }
  if (desc.startsWith("Vous avez réservé avec succès le matériel : ")) {
    const title = desc.replace("Vous avez réservé avec succès le matériel : ", "").replace(".", "");
    return t('newLoan.notifications.borrowerSuccess', { title: title });
  }

  // Fallback to raw string if it doesn't match our patterns
  return desc; 
};


export const OverviewNotification = (props) => {
  const { data } = props;
  const [isVisible, setIsVisible] = useState(true);
  const handleButtonClick = () => {
    setIsVisible(false);
  };

  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language === 'fr' ? fr : enUS;
  const date = data.created_at ? format(new Date(data.created_at), 'PPp', { locale: currentLocale }) : '';

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
                {t('overviewNotification.title', 'Notification')}
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
                {/* Wrap the database string in the parser! */}
                {translateDescription(data.description, t)}
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
                      {t('overviewNotification.date', 'Date:')}
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