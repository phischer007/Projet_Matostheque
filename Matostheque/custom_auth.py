# custom_auth_backends.py

from django.contrib.auth.backends import BaseBackend
from Matostheque.models.user_model import CustomUsers

# A custom definition of the authentication logic using the custom user table
class CustomAuth(BaseBackend):
    def authenticate(self, request, email=None, password=None):
        try:
            user = CustomUsers.objects.get(email=email)
            if user.check_password(password):
                return user
        except CustomUsers.DoesNotExist:
            return None

    # A function that returns the user from the custom made table
    def get_user(self, user_id):
        try:
            return CustomUsers.objects.get(pk=user_id)
        except CustomUsers.DoesNotExist:
            return None
