import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import config from '../utils/config'; 
import { getCookie } from '../utils/csrf';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  UPDATE: 'UPDATE'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const { user, isAuthenticated } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isLoading: false,
      user
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  [HANDLERS.UPDATE]: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      user
    };
  }
};

const reducer = (state, action) => 
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({ undefined });

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  // 1. Initialize Session & CSRF Cookie
  const initialize = async () => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      // This GET request hits the backend 'session_data' view.
      // The backend must use @ensure_csrf_cookie to set the cookie here.
      const response = await fetch(`${config.apiUrl}/session/`, {
        method: 'GET',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: {
            isAuthenticated: data.authenticated,
            user: data.user || null
          }
        });
      } else {
        throw new Error('Failed to fetch session');
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: { isAuthenticated: false, user: null }
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const signIn = async (email, password) => {
    const csrftoken = getCookie('csrftoken');

    try {
      const response = await fetch(`${config.apiUrl}/login/`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken, 
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('authenticated', 'true');
      }
      
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: { user: data.user }
      });

    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    }
  };


  const signUp = async (email, first_name, last_name, password) => {
    const csrftoken = getCookie('csrftoken');

    try {
      const response = await fetch(`${config.apiUrl}/register/`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ email, first_name, last_name, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('authenticated', 'true');
      }
      
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: { user: data.user }
      });

    } catch (err) {
      console.error('Sign up error:', err);
      throw err;
    }
  };

  // --------------------------------------------------------------------------
  const signOut = async () => {
    const csrftoken = getCookie('csrftoken');

    try {
      // 1. Attempt to log out from the backend
      await fetch(`${config.apiUrl}/logout/`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      });
    } catch (error) {
      // Ignore network errors during logout (we want to clear local state anyway)
      console.error('Logout API error:', error);
    } finally {
      // 2. Clear all local storage
      window.sessionStorage.clear();
      window.localStorage.clear();

      // 3. Dispatch State Clear
      dispatch({ type: HANDLERS.SIGN_OUT });

      // 4. CRITICAL: Force a hard redirect to the login page.
      // This unmounts the current React tree immediately, preventing 
      // components from trying to render with "user = null" and crashing.
      window.location.href = '/matostheque/auth/login';
    }
  };
  // --------------------------------------------------------------------------

  // // 5. Update User
  // const updateUser = async (user_pk) => {
  //  // Implement if needed based on your original file
  // };
  
  // Function to update the user's information through the system
  const updateUser = async (user_pk) => {
    try {
      // API call to get the new informations
      const response = await fetch(`${config.apiUrl}/users/${user_pk}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' 
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();

      // Updating the session variables
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('authenticated', 'true');
        window.sessionStorage.setItem('user', JSON.stringify(data));
      }

      // Dispatch UPDATE action with the new data
      dispatch({
        type: HANDLERS.UPDATE,
        payload: { user: data } 
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };


  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;
export const useAuthContext = () => useContext(AuthContext);