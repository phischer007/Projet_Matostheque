import React, { useState, useEffect } from 'react';
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
    if (mode === 'public'){
      return {
        title: "Hidden User",
        start: new Date(item.transaction_date),
        end: new Date(new Date().setDate(new Date(item.transaction_date).getDate() + (item.duration)) ), //converting duration to milliseconds and adding the duration to start date
      };
    }
    else if (status.includes(item.transaction_status)) {
      return {
        title: getTitle(item),
        user_name: `${item.borrower_details.first_name} ${item.borrower_details.last_name}`,
        contact: item.borrower_details.email,
        location: item.location,
        start: new Date(item.transaction_date),
        end: new Date(new Date().setDate(new Date(item.transaction_date).getDate() + (item.duration - 1)) ), //converting duration to milliseconds and adding the duration to start date
        transaction_quantity: item.transaction_quantity
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

  useEffect(() => {
    if (events.length > 0 && props.mode !== 'public') {
      setSelectedEvent(events[0]);
      setShowInformation(true);
    }
  }, [props.data, props.mode]);

  // DYNAMIC HEIGHT CALCULATION:
  // Starts at a minimum of 500px so it looks good when empty.
  // If there are more than 5 events, it adds 30px of height for each additional event.
  const dynamicHeight = events.length > 5 ? 500 + ((events.length - 5) * 30) : 500;

  const handleEventClick = (event, item) => {
    if (props.mode !== 'public') {
      setSelectedEvent(event);
      // setShowInformation(!showInformation);
      setShowInformation(true);
    }
  };

  return (
    <Card >
      <CardContent>
        <Calendar
          localizer={localizer}
          events={events}
          views={['month']}
          showAllEvents
          className="my-calendar"
          style={{ height: dynamicHeight }}
          popup
          onSelectEvent={handleEventClick}
        />
      </CardContent>

      {showInformation && selectedEvent && ( 
        <>
          <Divider/>
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
                      <TableRow label="Quantity:" value={selectedEvent.transaction_quantity} />
                    </tbody>
                  </table>
                </Typography>
          </CardContent>
        </>
      )}
    </Card>
  );
}