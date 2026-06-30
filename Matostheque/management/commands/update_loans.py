import time
from django.core.management.base import BaseCommand
from Matostheque.views.transaction_views import update_transactions
import threading

from Matostheque.views.material_views import update_Consumable_Availability

# Create a lock object
update_transactions_lock = threading.Lock()

class Command(BaseCommand):
    """
    This command is used to update transaction status every 24 hours.
    """
    help = 'Update transaction_status every 24h'

    def handle(self, *args, **options):
        """
        This function is the entry point for the command.
        It prints a message indicating the start of the transaction status update,
        calls the update_transactions function, and then prints a message indicating
        the completion of the transaction status update.
        """
        # Acquire the lock
        with update_transactions_lock:
            print("Running update_transactions")
            update_transactions()
            print("Completed update_transactions")
            print("=========================================")
            update_Consumable_Availability()
            print("Completed update_Consumable_Availability")
            print("=========================================")
