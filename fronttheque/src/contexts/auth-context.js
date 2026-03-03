import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import config from '../utils/config';
import PropTypes from 'prop-types';
import { get } from 'http';
// Define action types
const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  UPDATE: 'UPDATE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

// Define initial state and action handlers
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session_key: null
};

// Define handlers for different actions
const handlers = {

  // Handlers for the INITIALIZE action
  [HANDLERS.INITIALIZE]: (state, action) => {

    // Extract the user and session token from the action payload
    const { user, session_key } = action.payload || {};

    // Return a new state with the updated properites
    return {
      ...state, // Spread the existing state
      isAuthenticated: !!user, // set isAuthenticated to true if a user is present in the payload, else false
      isLoading: false, // set the loading state to false - app ready
      user: user, // update the user in the new state
      session_key: session_key // update the session_key in the new state
    };
  },

  // Handlers for the SIGN_IN action
  [HANDLERS.SIGN_IN]: (state, action) => {
    const { user, session_key } = action.payload || {};
    return {
      ...state, // Spread the existing state
      isAuthenticated: true, // Set the authenticated to true
      user: user, // Pass the authenticated user to the new state
      session_key: session_key // Pass the session token
    };
  },

  // Handlers for the UPDATE action
  [HANDLERS.UPDATE]: (state, action) => {
    const { user } = action.payload || {};
    return {
      ...state, // Spread the existing state
      isAuthenticated: true, // Set the authenticated to true
      user: user, // Update the user in the new state
      session_key: session_key // Pass the session token
    };
  },

  // Handlers for the SIGN_OUT action
  [HANDLERS.SIGN_OUT]: () => {
    return initialState; // Spread a blank (initial) state through the system
  }
};

// Define reducer function
const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// Define context and provider
export const AuthContext = createContext();

// AuthProvider component that wraps the application with authentication logic
export const AuthProvider = (props) => {
  const { children } = props;

  // Use the useReducer hook to create a state and dispatch function
  const [state, dispatch] = useReducer(reducer, initialState);

  // Create a ref to track whether the authentication has been initialized
  const initialized = useRef(false);

  // Asynchronous function to initialize the authentication
  const initialize = async () => {

    // If the authentication has already been initialized, return immediately
    if (initialized.current) {
      return;
    }

    // Set the initialized ref to true to prevent re-initialization
    initialized.current = true;

    // Initialize the isAuthenticated flag to false
    let isAuthenticated = false;

    // Retrieving the authentication status from session storage
    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
    } catch (err) {
      console.error(err);
    }

    // dispatch the INITIALIZE action
    dispatch({
      type: HANDLERS.INITIALIZE,
      payload: { 
        user: isAuthenticated ? getUserFromStorage() : null,
        session_key: isAuthenticated? getSessionFromStorage() : null
      }
    });
  };

  // This effect is used to initialize the user and session token when the component mounts.
  // The exhaustive-deps rule is disabled because we intentionally want this effect to run only once when the component mounts.
  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to log in and authenticate a user
  const signIn = async (email, password) => {
    try {

      const response = await fetch(`${config.apiUrl}/cas/login/`);
      
    } catch (error) {
      console.error('Sign-in error:', error.message);
      throw error;
    }
  };

  // Function to update the user's information through the system
  const updateUser = async (user_pk) => {
    try {

      // Retrieving the session token from the session storage
      const sessionKey = getSessionFromStorage();

      // API call to get the new informations
      const response = await fetch(`${config.apiUrl}/users/${user_pk}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionKey
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const data = await response.json();
  
      // Updating the session variables
      window.sessionStorage.setItem('authenticated', 'true');
      window.sessionStorage.setItem('user', JSON.stringify(data));
  
      // Dispatch UPDATE action with the new data
      dispatch({
        type: HANDLERS.UPDATE,
        payload: { user: data, session_key: sessionKey }
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  // Function to register a user into the system
  const signUp = async (props) => {
    const apiUrl = `${config.apiUrl}/register/`;

    // Retrieving the information from the props argument
    const registerData = props;
    try {

      // API call to save the new user data
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      // Check if the response is not okay
      if (!response.ok || response.status !== 201) {
        const errorMessage = await response.text(); // getting the error message from the response text
        console.error(`Error in signing up! Status: ${response.status}, Message: ${errorMessage}`);
        throw new Error('Error in signing up!');
      }

      const data = await response.json();
    } catch (error) {
      console.error(error);
      throw new Error('Error in signing up!');
    }
  };

  // Function to terminate a user session
  const signOut = async () => {
    try {

      sessionStorage.clear();
      localStorage.clear();

      // dispatch SIGN OUT action with the fetched data
      dispatch({
        type: HANDLERS.SIGN_OUT
      });

      // API call to signout from cas
      window.open(`${config.apiUrl}/cas/logout/`, '_self');

    } catch (error) {
      console.error(error);
      throw new Error('Error in signing out!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

// Function to retrieve a user's data from the session storage
const getUserFromStorage = () => {
  const userDataString = window.sessionStorage.getItem('user');
  try {
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      
      // Parse profil_pic if it exists
      if (userData.profil_pic) {
        userData.profil_pic = JSON.parse(userData.profil_pic);
      }

      return userData ? userData: null;
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Function to retrieve the session token from the session storage
const getSessionFromStorage = () => {
  const sessionKey = window.sessionStorage.getItem('sessionKey');
  try {
    return sessionKey;
  } catch (error) {
    console.error('Error retrieving user session:', error);
    return null;
  }
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
