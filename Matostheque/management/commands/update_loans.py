import time
from django.core.management.base import BaseCommand
from Matostheque.views.loan_views import update_loans
import threading

from Matostheque.views.material_views import update_Consumable_Availability

# Create a lock object
update_loans_lock = threading.Lock()

class Command(BaseCommand):
    """
    This command is used to update loan status every 24 hours.
    """
    help = 'Update loan_status every 24h'

    def handle(self, *args, **options):
        """
        This function is the entry point for the command.
        It prints a message indicating the start of the loan status update,
        calls the update_loans function, and then prints a message indicating
        the completion of the loan status update.
        """
        # Acquire the lock
        with update_loans_lock:
            print("Running update_loans")
            update_loans()
            print("Completed update_loans")
            print("=========================================")
            update_Consumable_Availability()
            print("Completed update_Consumable_Availability")
            print("=========================================")
