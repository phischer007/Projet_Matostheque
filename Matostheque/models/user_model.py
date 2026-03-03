from __future__ import unicode_literals
from django.contrib.auth.hashers import check_password as auth_check_password
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser

from Matostheque.managers import CustomUserManager

class CustomUsers(AbstractBaseUser, PermissionsMixin):
    """
    This model represents a custom user in the system.
    """
    USER_ROLE = 'user'
    OWNER_ROLE = 'owner'

    # The available roles for a system user.
    ROLE_CHOICES = [
        (USER_ROLE, 'User'),
        (OWNER_ROLE, 'Owner'),
    ]
    
    # A unique identifier for the user.
    user_id = models.AutoField(primary_key=True, serialize=False, verbose_name='ID')
    
    # The email address of the user.
    email = models.EmailField(unique=True)
    
    # The role of the user.
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=USER_ROLE)
    
    # The first name of the user.
    first_name = models.CharField(max_length=30, blank=True)
    
    # The last name of the user.
    last_name = models.CharField(max_length=30, blank=True)
    
    # The password of the user.
    password = models.CharField(max_length=100)
    
    # A flag indicating whether the user is active or not.
    is_active = models.BooleanField(default=True)
    
    # A flag indicating whether the user is a staff member or not.
    is_staff = models.BooleanField(default=False)
    
    # The profile picture associated to the user.
    profil_pic = models.TextField(null=True, blank=True)
    
    # The date and time when the user joined/ registered into the system.
    date_joined = models.DateTimeField(auto_now_add=True)
    
    # The date and time when the user was last updated.
    updated_at = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email' # The field used as the username for authentication.
    REQUIRED_FIELDS = [] 
    
    objects = CustomUserManager() # The custom manager for the CustomUsers model.
    

    class Meta:
        """
        This is the metadata for the CustomUsers model.
        """
        db_table = 'Users'
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_full_name(self):
        """
        This function returns the full name of the user.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """
        This function returns the short name of the user.
        """
        return self.first_name
        
    def check_password(self, raw_password):
        """
        This function checks if the provided password matches the user's password.
        """
        return auth_check_password(raw_password, self.password)