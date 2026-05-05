import time
from django.core.management.base import BaseCommand
from Matostheque.views.loan_views import update_loans
import threading

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
            
            # Initialize email count
            email_count = {'count': 0}  
            update_loans(email_count)
            
            print("Completed update_loans")
            print("Completed with emails:", email_count)
            print("=========================================")
            print("")
   