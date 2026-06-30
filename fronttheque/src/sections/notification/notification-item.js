import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import { getTimeDifference } from 'src/utils/get-time-difference';

const statusMap = {
  'Read': '#FFFFFF',
  'Unread': '#FFFFFF'
};

export const NotificationItem = ({ notification }) => {
  let date = getTimeDifference(notification.created_at);

  return (
    <Card
      sx={{
        py: 1,
        mt:1,
        mb: 1, // Add margin bottom
        bgcolor: `${statusMap[notification.status]}`,
        display: 'flex', // Use flexbox layout
        flexDirection: 'row', // Arrange items horizontally
        alignItems: 'center', // Align items vertically
        justifyContent: 'space-between', // Add space between header and content
        borderRadius: '0px', // Add border radius
        border: '1px solid #f0f0f0', // Add border
        minHeight: '100px'
      }}
      style={{ boxShadow: 'none'}}
    >
      <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Typography gutterBottom variant="h6" component="div">
          {notification.title}
        </Typography>
        <Typography gutterBottom variant="caption" component="div">
          {notification.type} {notification.loan? "- Loan of the material:" : ""}  {notification.loan? notification.material_title : ""}

        </Typography>
        <Typography variant="body2" color="text.secondary">
          {notification.description}
        </Typography>
      </CardContent>
      <CardHeader
        subheader={date == 0 ? 'Today' : `${date}`}
        sx={{ py: 0 }}
      />
    </Card>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};
