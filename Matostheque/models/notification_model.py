from django.db import models
from .material_model import Materials
from django.utils import timezone
from datetime import timedelta, datetime
        
class Notifications(models.Model):
    """
    This model represents a notification in the system.
    """
    TYPE_CHOICES = (
        ('General', 'General'), # Non-actionable information
        ('Event', 'Event'),     # User requests, booking requests
        ('Error', 'Error'),     # Errors such as failed bookings
        ('Overdue Alert', 'Overdue Alert'),      # Alerts such as overdue items
        ('Request Alert', 'Request Alert')      # Alerts such as overdue items
    )

    PRIORITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical')
    )

    # A unique identifier for the notification.
    notif_id = models.AutoField(primary_key=True, serialize=False, verbose_name='ID')
    
    # The type of notification.
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='General')
    
    # The priority level of the notification.
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Low')
    
    # The text associated to the notification.
    description = models.TextField()
    
    # The title of the notification.
    title = models.CharField(max_length=100, default='')
    
    #  A flag indicating whether the notification has been resolved or not.
    resolved_flag = models.BooleanField(default=False)
    
    # A flag indicating whether the notification has been read or not.
    read_flag = models.BooleanField(default=False)
    
    # The date and time when the notification was created.
    created_at = models.DateTimeField(default=timezone.now)
    
    # The date and time when the notification was updated.
    updated_at = models.DateTimeField(auto_now=True)
    
    # The loan associated with the notification.
    loan = models.ForeignKey('Loans', on_delete=models.CASCADE, null=True, blank=True, related_name='loan_notifications')
    
    # The user who received the notification.
    user = models.ForeignKey('CustomUsers', on_delete=models.CASCADE, related_name='user_notifications')
    
    
    def mark_as_read(self):
        """
        This function marks the notification as read.
        """
        self.read_flag = True
        self.save()
        
    def mark_as_resolved(self):
        """
        This function marks the notification as resolved.
        """
        self.resolved_flag = True
        self.save()

    class Meta:
        """
        This is the metadata for the Notifications model.
        """
        db_table = 'Notifications'
        verbose_name_plural = "Notifications"
        ordering = ['-created_at']