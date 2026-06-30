# file that defines a few custom exceptions used through the app
class SessionDataError(Exception):
    """Exception raised when the session token is expired."""
    pass

class SessionExpiredError(Exception):
    """Exception raised when the session token is expired."""
    pass

class UserNotFoundError(Exception):
    """Exception raised when no user is found under the session token."""
    pass

class UserDoesNotExistError(Exception):
    """Exception raised when a user does not exist in the database."""
    pass

class SessionTokenNotFoundError(Exception):
    """Exception raised when the session token is not found."""
    pass

class SessionNotFoundError(Exception):
    """Exception raised when the session token is not found or is invalid."""
    pass

class InvalidExpirationTimeError(Exception):
    """Exception raised when the session's expiration time is in an invalid format."""
    pass