import React from 'react';
import { NotificationProvider } from 'src/contexts/notification-context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Wraps the NotificationProvider component with the ToastContainer and children
const ToastProvider = ({ children }) => {
  return (
    <NotificationProvider>
      <ToastContainer 
        position="bottom-right"/>
      {children}
    </NotificationProvider>
  );
};

export default ToastProvider;
