# signals.py
# File where we define tasks to be performed when receiving signals from a specific model
# on a record update
### Can be combined but better separated for clarity
from django.db.models.signals import post_save
from django.dispatch import receiver
from Matostheque.models.loan_model import Loans
from Matostheque.models.notification_model import Notifications
from Matostheque.models.material_model import Materials
from django.utils import timezone

# Function to update material availability on receipt of signal from loans 
@receiver(post_save, sender=Loans)
def update_material_availability(sender, instance, **kwargs):
    material = instance.material
    material.update_availability()

# Function the notification status on loan update
@receiver(post_save, sender=Loans)
def update_notification_on_loan_status_change(sender, instance, **kwargs):
    notifications = Notifications.objects.filter(loan=instance)

    for notification in notifications:
        
        # Resolve notification if Request alert
        if notification.type == 'Request Alert':
            if instance.loan_status in ['Rejected', 'Canceled', 'Borrowed', 'Booked']:
                notification.resolved_flag = True
                notification.updated_at = timezone.now()
                notification.save()
        
        # Resolve notification if overdue alert
        elif notification.type == 'Overdue Alert':
            if instance.loan_status == 'Closed':
                notification.resolved_flag = True
                notification.updated_at = timezone.now()
                notification.save()

# Function to send a notification on loan overdue status update
@receiver(post_save, sender=Loans)
def send_notification_on_overdue(sender, instance, **kwargs):
       if instance.loan_status == "Overdue":
           Notifications.objects.create(
                loan=instance, 
                type="Overdue Alert",
                title="Loan Overdue", 
                priority="Critical",
                description="Your loan of the material {} is overdue. Please kindly attend to it at your earliest convenience.".format(instance.material.material_title),
                user=instance.borrower
            )