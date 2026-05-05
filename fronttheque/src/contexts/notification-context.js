// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import config from 'src/utils/config';


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
      loan: params.loan
    };

    console.log("Sending notifications");
    try {
      // Make API request to store notification in the database
      const response = await fetch(`${config.apiUrl}/notifications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
