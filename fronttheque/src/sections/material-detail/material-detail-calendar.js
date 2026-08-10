import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  momentLocalizer 
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import moment from 'moment';
import 'moment/locale/fr'; 
import { 
  Card, 
  CardContent, 
  Typography, 
  Divider 
} from '@mui/material';
import { getInitials } from 'src/utils/get-initials';

import { useTranslation } from 'react-i18next';


// ----------------------------------------------------------------------------------------------- //


const localizer = momentLocalizer(moment);

const status = ['Borrowed', 'Booked', 'Overdue'];

const formatEvent = (data, mode, t) => {
  const getTitle = (item) => {
    return !mode 
      ? getInitials(`${item.borrower_details.first_name} ${item.borrower_details.last_name}`) 
      : t('materialDetailCalendar.hiddenUser', 'Hidden User');
  }

  const events = data ? data.map((item) => {
    if (mode === 'public'){
      return {
        title: t('materialDetailCalendar.hiddenUser', 'Hidden User'),
        start: new Date(item.loan_date),
        end: new Date(new Date().setDate(new Date(item.loan_date).getDate() + (item.duration)) ), 
      };
    }
    else if (status.includes(item.loan_status)) {
      return {
        title: getTitle(item),
        user_name: `${item.borrower_details.first_name} ${item.borrower_details.last_name}`,
        contact: item.borrower_details.email,
        location: item.location,
        start: new Date(item.loan_date),
        end: new Date(new Date().setDate(new Date(item.loan_date).getDate() + (item.duration - 1)) ), 
        loan_quantity: item.loan_quantity
      };
    }
    return null; 
  }).filter(Boolean) : []; 

  return events;
};

const TableRow = ({ label, value }) => (
  <tr style={{ padding: '0px' }}>
    <td><Typography variant="caption" color="text.primary">{label}</Typography></td>
    <td><Typography variant="caption" color="text.secondary">{value}</Typography></td>
  </tr>
);

export const MaterialDetailCalendar = (props) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  const events = formatEvent(props.data, props.mode, t);
  const [showInformation, setShowInformation] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (events.length > 0 && props.mode !== 'public') {
      setSelectedEvent(events[0]);
      setShowInformation(true);
    }
  }, [props.data, props.mode, events]);

  const dynamicHeight = events.length > 5 ? 500 + ((events.length - 5) * 30) : 500;

  const handleEventClick = (event, item) => {
    if (props.mode !== 'public') {
      setSelectedEvent(event);
      setShowInformation(true);
    }
  };

  const calendarMessages = {
    today: t('materialDetailCalendar.toolbar.today', 'Today'),
    previous: t('materialDetailCalendar.toolbar.previous', 'Back'),
    next: t('materialDetailCalendar.toolbar.next', 'Next'),
    month: t('materialDetailCalendar.toolbar.month', 'Month'),
    week: t('materialDetailCalendar.toolbar.week', 'Week'),
    day: t('materialDetailCalendar.toolbar.day', 'Day'),
    agenda: t('materialDetailCalendar.toolbar.agenda', 'Agenda'),
    showMore: (total) => `+${total} ${t('materialDetailCalendar.toolbar.showMore', 'more')}`
  };

  return (
    <Card>
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
          messages={calendarMessages}
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
                      <TableRow 
                        label={t('materialDetailCalendar.labels.name', 'Name:')} 
                        value={selectedEvent.user_name} 
                      />
                      <TableRow 
                        label={t('materialDetailCalendar.labels.contact', 'Contact:')} 
                        value={selectedEvent.contact} 
                      />
                      <TableRow 
                        label={t('materialDetailCalendar.labels.location', 'Location:')} 
                        value={selectedEvent.location} 
                      />
                      <TableRow 
                        label={t('materialDetailCalendar.labels.quantity', 'Quantity:')} 
                        value={selectedEvent.loan_quantity} 
                      />
                    </tbody>
                  </table>
                </Typography>
          </CardContent>
        </>
      )}
    </Card>
  );
}