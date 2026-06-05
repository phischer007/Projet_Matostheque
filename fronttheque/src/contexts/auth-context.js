// import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
// import PropTypes from 'prop-types';
// import config from '../utils/config'; 
// import { getCookie } from '../utils/csrf';

// const HANDLERS = {
//   INITIALIZE: 'INITIALIZE',
//   SIGN_IN: 'SIGN_IN',
//   SIGN_OUT: 'SIGN_OUT',
//   UPDATE: 'UPDATE'
// };

// const initialState = {
//   isAuthenticated: false,
//   isLoading: true,
//   user: null
// };

// const handlers = {
//   [HANDLERS.INITIALIZE]: (state, action) => {
//     const { user, isAuthenticated } = action.payload;
//     return {
//       ...state,
//       isAuthenticated,
//       isLoading: false,
//       user
//     };
//   },
//   [HANDLERS.SIGN_IN]: (state, action) => {
//     const { user } = action.payload;
//     return {
//       ...state,
//       isAuthenticated: true,
//       user
//     };
//   },
//   [HANDLERS.SIGN_OUT]: (state) => ({
//     ...state,
//     isAuthenticated: false,
//     user: null
//   }),
//   [HANDLERS.UPDATE]: (state, action) => {
//     const { user } = action.payload;
//     return {
//       ...state,
//       user
//     };
//   }
// };

// const reducer = (state, action) => 
//   handlers[action.type] ? handlers[action.type](state, action) : state;

// export const AuthContext = createContext({ undefined });

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const initialized = useRef(false);

//   // 1. Initialize Session & CSRF Cookie
//   const initialize = async () => {
//     if (initialized.current) return;
//     initialized.current = true;

//     try {
//       // This GET request hits the backend 'session_data' view.
//       // The backend must use @ensure_csrf_cookie to set the cookie here.
//       const response = await fetch(`${config.apiUrl}/session/`, {
//         method: 'GET',
//         credentials: "include",
//         headers: { 'Content-Type': 'application/json' }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         dispatch({
//           type: HANDLERS.INITIALIZE,
//           payload: {
//             isAuthenticated: data.authenticated,
//             user: data.user || null
//           }
//         });
//       } else {
//         throw new Error('Failed to fetch session');
//       }
//     } catch (err) {
//       console.error('Auth initialization failed:', err);
//       dispatch({
//         type: HANDLERS.INITIALIZE,
//         payload: { isAuthenticated: false, user: null }
//       });
//     }
//   };

//   useEffect(() => {
//     initialize();
//   }, []);

//   const signIn = async (email, password) => {
//     const csrftoken = getCookie('csrftoken');

//     try {
//       const response = await fetch(`${config.apiUrl}/login/`, {
//         method: 'POST',
//         credentials: "include",
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': csrftoken, 
//         },
//         body: JSON.stringify({ email, password })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Login failed');
//       }

//       const data = await response.json();
      
//       if (typeof window !== 'undefined') {
//           window.sessionStorage.setItem('authenticated', 'true');
//       }
      
//       dispatch({
//         type: HANDLERS.SIGN_IN,
//         payload: { user: data.user }
//       });

//     } catch (err) {
//       console.error('Sign in error:', err);
//       throw err;
//     }
//   };


//   const signUp = async (email, first_name, last_name, password) => {
//     const csrftoken = getCookie('csrftoken');

//     try {
//       const response = await fetch(`${config.apiUrl}/register/`, {
//         method: 'POST',
//         credentials: "include",
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': csrftoken,
//         },
//         body: JSON.stringify({ email, first_name, last_name, password })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Registration failed');
//       }

//       const data = await response.json();
      
//       if (typeof window !== 'undefined') {
//           window.sessionStorage.setItem('authenticated', 'true');
//       }
      
//       dispatch({
//         type: HANDLERS.SIGN_IN,
//         payload: { user: data.user }
//       });

//     } catch (err) {
//       console.error('Sign up error:', err);
//       throw err;
//     }
//   };

//   // --------------------------------------------------------------------------
//   const signOut = async () => {
//     const csrftoken = getCookie('csrftoken');

//     try {
//       // 1. Attempt to log out from the backend
//       await fetch(`${config.apiUrl}/logout/`, {
//         method: 'POST',
//         credentials: "include",
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': csrftoken,
//         }
//       });
//     } catch (error) {
//       // Ignore network errors during logout (we want to clear local state anyway)
//       console.error('Logout API error:', error);
//     } finally {
//       // 2. Clear all local storage
//       window.sessionStorage.clear();
//       window.localStorage.clear();

//       // 3. Dispatch State Clear
//       dispatch({ type: HANDLERS.SIGN_OUT });

//       // 4. CRITICAL: Force a hard redirect to the login page.
//       // This unmounts the current React tree immediately, preventing 
//       // components from trying to render with "user = null" and crashing.
//       window.location.href = '/matostheque/auth/login';
//     }
//   };
//   // --------------------------------------------------------------------------

//   // // 5. Update User
//   // const updateUser = async (user_pk) => {
//   //  // Implement if needed based on your original file
//   // };
  
//   // Function to update the user's information through the system
//   const updateUser = async (user_pk) => {
//     try {
//       // API call to get the new informations
//       const response = await fetch(`${config.apiUrl}/users/${user_pk}/`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include' // <-- Send the Django session cookie automatically!
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch user data');
//       }

//       const data = await response.json();

//       // Updating the session variables
//       if (typeof window !== 'undefined') {
//         window.sessionStorage.setItem('authenticated', 'true');
//         window.sessionStorage.setItem('user', JSON.stringify(data));
//       }

//       // Dispatch UPDATE action with the new data
//       dispatch({
//         type: HANDLERS.UPDATE,
//         payload: { user: data } // Removed the undefined sessionKey here
//       });
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       throw error;
//     }
//   };


//   return (
//     <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// AuthProvider.propTypes = {
//   children: PropTypes.node
// };

// export const AuthConsumer = AuthContext.Consumer;
// export const useAuthContext = () => useContext(AuthContext);


import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import config from 'src/utils/config';
import PropTypes from 'prop-types';


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
