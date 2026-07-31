// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import config from 'src/utils/config';
import { getCookie } from '../utils/csrf';


const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {

  const addNotification = async (params) => {
    
    let data = { 
      description : params.message, 
      type : params.notificationType,
      user : params.user,
      priority: params.priority,
      title: params.title,
      loan_id: params.loan_id,
    };
//#todo loan loan
    console.log("Sending notifications");
    console.log(data)
    try {
      // Make API request to store notification in the database
      const csrftoken = getCookie('csrftoken');
      const response = await fetch(`${config.apiUrl}/notifications/`, {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
      });

      const json_data = await response.json();
      if (!response.ok) {
        throw new Error(json_data.message || 'Error notification');
      }

    } catch (error) {
      console.error('Error storing notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
