# signals.py
# File where we define tasks to be performed when receiving signals from a specific model
# on a record update
### Can be combined but better separated for clarity
from django.db.models.signals import post_save
from django.dispatch import receiver
from Matostheque.models.transaction_model import Transactions
from Matostheque.models.notification_model import Notifications
from Matostheque.models.material_model import Materials
from django.utils import timezone

'''
# Function the notification status on transaction update
@receiver(post_save, sender=Transactions)
def update_notification_on_transaction_status_change(sender, instance, **kwargs):
    notifications = Notifications.objects.filter(transactions=instance)

    for notification in notifications:
        
        # Resolve notification if Request alert
        if notification.type == 'Request Alert':
            if instance.transaction_status in ['Rejected', 'Canceled', 'Borrowed', 'Booked']:
                notification.resolved_flag = True
                notification.updated_at = timezone.now()
                notification.save()
        
        # Resolve notification if overdue alert
        elif notification.type == 'Overdue Alert':
            if instance.transaction_status == 'Closed':
                notification.resolved_flag = True
                notification.updated_at = timezone.now()
                notification.save()

# Function to send a notification on transaction overdue status update
@receiver(post_save, sender=Transactions)
def send_notification_on_overdue(sender, instance, **kwargs):
       if instance.transaction_status == "Overdue":
           Notifications.objects.create(
                transactions=instance,
                type="Overdue Alert",
                title="Loan Overdue", 
                priority="Critical",
                description="Your transaction of the material {} is overdue. Please kindly attend to it at your earliest convenience.".format(instance.material.material_title),
                user=instance.borrower
            )'''