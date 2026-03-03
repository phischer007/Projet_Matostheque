from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

class Owners(models.Model):
    """
    This model represents an owner in the system.
    """
    # A unique identifier for the owner.
    owner_id = models.AutoField(primary_key=True, serialize=False, verbose_name='ID')
    
    # The user associated with the owner.
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE, related_name='owner_profile')
    
    # A flag indicating whether the owner is active or not.
    is_active = models.BooleanField(default=True)
    
    # The contact information of the owner.
    contact = models.CharField(max_length=100, null=True)
    
    # The date and time when the owner was created.
    created_at = models.DateTimeField(default=timezone.now)
    
    # The date and time when the owner was updated.
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        """
        This is the metadata for the Owners model.
        """
        db_table = 'Owners'
        verbose_name_plural = "Owners"
    
    def __str__(self):
        return self.user.email
        