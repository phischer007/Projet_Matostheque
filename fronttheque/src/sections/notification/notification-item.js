// import React from 'react';
// import PropTypes from 'prop-types';
// import { Card, CardHeader, CardContent, Typography } from '@mui/material';
// import { getTimeDifference } from 'src/utils/get-time-difference';

// import { useTranslation } from 'react-i18next';

// const statusMap = {
//   'Read': '#FFFFFF',
//   'Unread': '#FFFFFF'
// };

// export const NotificationItem = ({ notification }) => {

//   const { t } = useTranslation();

//   let date = getTimeDifference(notification.created_at);

//   return (
//     <Card
//       sx={{
//         py: 1,
//         mt:1,
//         mb: 1, // Add margin bottom
//         bgcolor: `${statusMap[notification.status]}`,
//         display: 'flex', // Use flexbox layout
//         flexDirection: 'row', // Arrange items horizontally
//         alignItems: 'center', // Align items vertically
//         justifyContent: 'space-between', // Add space between header and content
//         borderRadius: '0px', // Add border radius
//         border: '1px solid #f0f0f0', // Add border
//         minHeight: '100px'
//       }}
//       style={{ boxShadow: 'none'}}
//     >
//       <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
//         <Typography gutterBottom variant="h6" component="div">
//           {notification.title}
//         </Typography>
//         <Typography gutterBottom variant="caption" component="div">
//           {/* {notification.type} {notification.loan? "- Loan of the material:" : ""}  {notification.loan? notification.material_title : ""} */}
//           {t(`staticData.notificationTypes.${notification.type}`, notification.type)} {notification.loan ? t('reqNofitications.loanOfMaterial', '- Loan of the material:') : ""}  {notification.loan ? notification.material_title : ""}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {notification.description}
//         </Typography>
//       </CardContent>
//       <CardHeader
//         subheader={date == 0 ? 'Today' : `${date}`}
//         sx={{ py: 0 }}
//       />
//     </Card>
//   );
// };

// NotificationItem.propTypes = {
//   notification: PropTypes.object.isRequired
// };



import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import { getTimeDifference } from 'src/utils/get-time-difference';

import { useTranslation } from 'react-i18next';

const statusMap = {
  'Read': '#FFFFFF',
  'Unread': '#FFFFFF'
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

export const NotificationItem = ({ notification }) => {

  const { t } = useTranslation();

  let date = getTimeDifference(notification.created_at, t);

  return (
    <Card
      sx={{
        py: 1,
        mt:1,
        mb: 1, 
        bgcolor: `${statusMap[notification.status]}`,
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderRadius: '0px', 
        border: '1px solid #f0f0f0', 
        minHeight: '100px'
      }}
      style={{ boxShadow: 'none'}}
    >
      <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Typography gutterBottom variant="h6" component="div">
          {notification.title}
        </Typography>
        <Typography gutterBottom variant="caption" component="div">
          {t(`staticData.notificationTypes.${notification.type}`, notification.type)} {notification.loan ? t('reqNofitications.loanOfMaterial', '- Loan of the material:') : ""}  {notification.loan ? notification.material_title : ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {/* Wrap the description in our new parser function */}
          {translateDescription(notification.description, t)}
        </Typography>
      </CardContent>
      <CardHeader
        subheader={date == 0 ? t('reqNofitications.today', 'Today') : `${date}`}
        sx={{ py: 0 }}
      />
    </Card>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};
