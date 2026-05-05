import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getTimeDifference } from 'src/utils/get-time-difference';

const statusMap = {
    'Read': '#F0F0F0', 
    'Unread': '#F0F0F0'
};

export const NotificationCard = ({ notification }) => {
  let date = getTimeDifference(notification.created_at);
  return (
    <Card  
        sx={{ 
            py: 1,
            mb: 1,  
            bgcolor: `${statusMap[notification.status]}`,
            borderRadius: '0px', // Add border radius
            border: '1px solid #f0f0f0', // Add border
        }}
    >
      <CardHeader
        subheader={date == 0? 'Today' : `${date}`}
        sx={{ py: 0 }}
      />
      <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Typography variant="body1" color="textPrimary">
          {notification.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    description: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired, //change to datetime later
    type: PropTypes.string.isRequired,
  }).isRequired,
};
