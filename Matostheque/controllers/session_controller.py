# This file is for managing session-related functionality 
from django.contrib.sessions.models import Session
from django.contrib.auth import get_user_model
from Matostheque.custom_exception import *
from django.utils import timezone

def get_user_from_session_token(session_token):
    """
    Function to get a user instance given a session_token.
    
    Args:
        session_token (str): A unique identifier for a user's session.
    
    Returns:
        user (obj): The user instance associated with the session_token.
    
    Raises:
        SessionNotFoundError: If the session token does not exist.
        UserNotFoundError: If no user is found under the session token.
        SessionExpiredError: If the session key error occurs.
    """
    try: #catches the exceptions if any
        # Retrieve the session object from the database using the session token
        session = Session.objects.get(session_key=session_token)
        
        # Get the session data
        session_data = session.get_decoded()
        
        # Get the user ID stored in the session data
        user_id = session_data['_auth_user_id']
        
        # Retrieve the user object using th0e user ID
        user = get_user_model().objects.get(pk=user_id)
        
        return user
    except Session.DoesNotExist:
        raise SessionNotFoundError("Session not found or invalid")
    except get_user_model().DoesNotExist:
        raise UserNotFoundError("No user found under the session token")
    except KeyError:
        raise SessionExpiredError("Session Key error")


def is_session_expired(session_token):
    """
    Function to check if a session has expired given a session_token.
    
    Args:
        session_token (str): A unique identifier for a user's session.
    
    Returns:
        bool: True if the session has expired, False otherwise.
    
    Raises:
        SessionNotFoundError: If the session token does not exist.
        InvalidExpirationTimeError: If the expiration time format is invalid.
    """
    try:
        # Retrieve the session object from the database using the session token
        session = Session.objects.get(session_key=session_token)
        
        # Get the expiration date of the session
        expire_date = timezone.localtime(session.expire_date) #!important
        
        if expire_date:
            # Get current time
            current_time = timezone.now()
            
            # Check if session has expired
            if current_time > expire_date:
                raise SessionExpiredError("Session expired")
            else:
                return False  # Session not expired yet
        else:
            return False  # Session not expired yet
    except Session.DoesNotExist:
        # Session with the given token does not exist
        raise SessionNotFoundError("Session not found or invalid")
    except ValueError:
        # Invalid expiration time format
        raise InvalidExpirationTimeError("Invalid expiration time format")