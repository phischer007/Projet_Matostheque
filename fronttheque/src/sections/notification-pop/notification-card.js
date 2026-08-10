// import React from 'react';
// import PropTypes from 'prop-types';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import { getTimeDifference } from 'src/utils/get-time-difference';
// import  Link  from 'next/link';

// import { useTranslation } from 'react-i18next';

// // ----------------------------------------------------------------------------------- //

// const statusMap = {
//     'Read': '#F0F0F0', 
//     'Unread': '#F0F0F0'
// };

// export const NotificationCard = ({ notification }) => {
//   let date = getTimeDifference(notification.created_at);
  
//   const { t } = useTranslation();

//   return (
//     <Link href ={"details/loan-detail/"+notification.loan}>
//       <Card
//           sx={{
//               py: 1,
//               mb: 1,
//               bgcolor: `${statusMap[notification.status]}`,
//               borderRadius: '0px', // Add border radius
//               border: '1px solid #f0f0f0', // Add border
//           }}
//       >
//         <CardHeader
//           // subheader={date == 0? 'Today' : `${date}`}
//           subheader={date == 0 ? t('reqNofitications.today', 'Today') : `${date}`}
//           sx={{ py: 0 }}
//         />
//         <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
//           <Typography variant="body1" color="textPrimary">
//             {notification.description}
//           </Typography>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// };

// NotificationCard.propTypes = {
//   notification: PropTypes.shape({
//     description: PropTypes.string.isRequired,
//     created_at: PropTypes.string.isRequired, //change to datetime later
//     type: PropTypes.string.isRequired,
//   }).isRequired,
// };



import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getTimeDifference } from 'src/utils/get-time-difference';
import Link from 'next/link';

import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------------------- //

const statusMap = {
    'Read': '#F0F0F0', 
    'Unread': '#F0F0F0'
};

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

export const NotificationCard = ({ notification }) => {
  
  const { t } = useTranslation();
  
  let date = getTimeDifference(notification.created_at, t);
  
  return (
    <Link href={"details/loan-detail/"+notification.loan}>
      <Card
          sx={{
              py: 1,
              mb: 1,
              bgcolor: `${statusMap[notification.status]}`,
              borderRadius: '0px', 
              border: '1px solid #f0f0f0', 
          }}
      >
        <CardHeader
          subheader={date == 0 ? t('reqNofitications.today', 'Today') : `${date}`}
          sx={{ py: 0 }}
        />
        <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Typography variant="body1" color="textPrimary">
            {/* Wrap the description in our new parser function */}
            {translateDescription(notification.description, t)}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    description: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired, 
    type: PropTypes.string.isRequired,
  }).isRequired,
};