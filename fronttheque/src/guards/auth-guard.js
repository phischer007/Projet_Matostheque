import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuthContext } from 'src/contexts/auth-context';
import config from 'src/utils/config';


export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.

  const redirectToCAS = () => {
    window.open(`${config.apiUrl}/cas/login/`, '_self');
  };

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/session/`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.authenticated) {
          window.sessionStorage.setItem('user', JSON.stringify(data.user));
          window.sessionStorage.setItem('sessionKey', data.session_key);
          window.sessionStorage.setItem('isNew', data.new);
          return true;
        }
      } else {
        console.error('Failed to fetch session data:', response.statusText);
      }
      return false;
    } catch (error) {
      console.error('Error fetching session data:', error);
      return false;
    }
  };

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      // Prevent from calling twice in development mode with React.StrictMode enabled
      if (ignore.current) {
        return;
      }

      ignore.current = true;

      if (!isAuthenticated) {
        fetchSessionData().then((authenticated) => {
          if (authenticated) {
            window.sessionStorage.setItem('authenticated', true);
            window.location.reload();
          } else {
            redirectToCAS();
          }
        });
      } else {
        setChecked(true);
      }
    },
    [router.isReady]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};
