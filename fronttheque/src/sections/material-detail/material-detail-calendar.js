import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import styles
import moment from 'moment';
import { Card, CardContent, Typography, Divider } from '@mui/material';
import { getInitials } from 'src/utils/get-initials';

const localizer = momentLocalizer(moment);

const status = ['Borrowed', 'Booked', 'Overdue'];

const formatEvent = (data, mode) => {
  const getTitle = (item) => {
    return !mode ? getInitials(`${item.borrower_details.first_name} ${item.borrower_details.last_name}`) : 'Hidden User';
  }

  const events = data ? data.map((item) => {
    if (status.includes(item.loan_status)) {
      return {
        title: getTitle(item),
        user_name: `${item.borrower_details.first_name} ${item.borrower_details.last_name}`,
        contact: item.borrower_details.email,
        location: item.location,
        start: new Date(item.loan_date),
        end: new Date(new Date(item.loan_date).getTime() + ((item.duration - 1) * 24 * 60 * 60 * 1000)) //converting duration to milliseconds and adding the duration to start date
      };
    }
    return null; // Ensure to return null for events that should not be included
  }).filter(Boolean) : []; // Filter out null events

  return events;
};

const TableRow = ({ label, value }) => (
  <tr style={{ padding: '0px' }}>
    <td><Typography variant="caption" color="text.primary">{label}</Typography></td>
    <td><Typography variant="caption" color="text.secondary">{value}</Typography></td>
  </tr>
);

export const MaterialDetailCalendar = (props) => {
  const events = formatEvent(props.data, props.mode);
  const [showInformation, setShowInformation] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event, item) => {
    setSelectedEvent(event);
    setShowInformation(!showInformation);
  };

  return (
    <Card >
      <CardContent>
        <Calendar
          localizer={localizer}
          events={events}
          tooltipAccessor="description"
          startAccessor="start"
          endAccessor="end"
          style={{ minHeight: 500 }}
          onSelectEvent={handleEventClick}
        />
      </CardContent>

      {showInformation && <><Divider/>
      <CardContent
        sx={{
          paddingY: 0,
        }}
      >
        <Typography variant="body1" component="div">
              <table>
                <tbody>
                  <TableRow label="Name:" value={selectedEvent.user_name} />
                  <TableRow label="Contact:" value={selectedEvent.contact} />
                  <TableRow label="Location:" value={selectedEvent.location} />
                </tbody>
              </table>
            </Typography>
      </CardContent></>
      }
    </Card>
  );
}