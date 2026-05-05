from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta, datetime

class Loans(models.Model):
    """
    This model represents a loan object in the system.
    """
    STATUS_CHOICES = (
        ('Pending Validation', 'Pending Validation'), #waiting for validation
        ('Borrowed', 'Borrowed'), #was pending, have been approved, and not in progress yet
        ('Overdue', 'Overdue'), #in progress and date exceeds the duration set
        ('Canceled', 'Canceled'), #pending loan that was canceled by the user
        ('Rejected', 'Rejected'), #loan request rejected by owner or admin
        ('Closed', 'Closed'), #loan is returned to its original place 
        ('Booked', 'Booked'),  #booked but not lent out yet
    )
    
    PENDING_STATUS = 'Pending Validation'
    
    # A unique identifier for the loan
    loan_id = models.AutoField(primary_key=True, serialize=False, verbose_name='ID')
    
    # The date and time when the loan starts
    # loan_date = models.DateTimeField(default=timezone.now)
    loan_date = models.DateTimeField(null=True, blank=True)
    
    # The duration of loan in days
    duration = models.IntegerField()
    
    # The location where the equipment will be brought to
    location = models.TextField(null=True)
    
    # A message associated with the loan
    message = models.TextField(null=True)
    
    # The current status of the loan
    loan_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING_STATUS)
    
    # A flag indicating if the loan is active or not
    is_active = models.BooleanField(default=False)
    
    # A flag indicating whether the loan is overdue or not
    overdue_flag = models.BooleanField(default=False)
    
    # The date and the time when the loan was approved
    approval_date = models.DateTimeField(null=True, blank=True)
    
    # The date and the time when the loan was canceled
    cancellation_date = models.DateTimeField(null=True, blank=True)
    
    # The date and the time when the equipment was returned
    return_date = models.DateTimeField(null=True, blank=True)
    
    # The date and the time when the loan was rejected
    rejection_date = models.DateTimeField(null=True, blank=True)
    
    # A flag indicating if the reminder email was sent
    email_sent = models.BooleanField(default=False)
    
    # The date and time when the loan was created
    created_at = models.DateTimeField(default=timezone.now)
    
    # The date and time when the loan was last updated
    updated_at = models.DateTimeField(default=timezone.now)
    
    # The material associated with the loan
    material = models.ForeignKey('Materials', on_delete=models.CASCADE, null=True, related_name='material_loans')
    
    # The user who borrowed the material
    borrower = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, related_name='user_loans')

    def calculate_loan_status(self):
        """
        This function computes the current status of the loan based on its attributes.
        """
        if self.is_active and not self.overdue_flag:
            return 'Borrowed'
        elif self.overdue_flag and not self.return_date:
            return 'Overdue'
        elif not self.is_active and self.cancellation_date:
            return 'Canceled'
        elif not self.is_active and self.rejection_date:
            return 'Rejected'
        elif not self.is_active and  self.material.validation and not self.approval_date:
            return 'Pending Validation'
        elif not self.is_active and (self.approval_date or not self.material.validation) and self.loan_date > timezone.now():
            return 'Booked'
        else:
            return 'Closed'
    
    def update_loan_status(self):
        """
        This function updates the loan status based on the calculated status.
        """
        calculated_status = self.calculate_loan_status()
        if self.loan_status != calculated_status:
            self.loan_status = calculated_status
            if self.loan_status == "Borrowed" or self.loan_status == "Closed":
                self.material.update_availability() #TODO: to erase after signal success
    
    #overriding the save method
    def save(self, *args, **kwargs):
        """
        This function overrides the default save method to update the loan status.
        """
        try:
            
            loan_day = self.loan_date.date()
            today_date = timezone.now().date()
            email_sent = False
            
            if self.pk is not None:
                original_loan = self.__class__.objects.get(pk=self.pk)
                # Updating if returned for the first and only time
                if self.return_date != original_loan.return_date:
                    # Update is_active based on return_date
                    self.is_active = False
                    self.material.update_availability() #TODO: to erase after signal success

                # Updating if approved for the first and only time
                if self.approval_date != original_loan.approval_date:
                    # Update is_active based on approval_date
                    approval_day = self.approval_date.date() if self.approval_date is not None else None
                    if loan_day <= today_date and (approval_day is not None and approval_day  == today_date) :
                        self.is_active = True

            
            else:
                # If there was no validation needed, setting the validation_date to today 
                # and activating the loan is the loan date is today
                if not self.material.validation or self.approval_date: 
                    if loan_day == today_date: 
                        self.is_active = True
            self.update_loan_status()
            super().save(*args, **kwargs)
            
            
        except Exception as e:
            print(f"An error occurred while saving the world: {e}")
            raise  # Re-raise the exception to halt further processing

        
    def update_overdue_flag(self, *args, **kwargs):
        """
        This function updates the overdue flag for a loan.
        
        It checks if the loan is active, not overdue, and does not have a return date.
        If these conditions are met, it calculates the due date based on the loan date and duration.
        If the current date is past the due date, it sets the overdue flag to True.
        """
        if self.is_active and not self.overdue_flag  and not self.return_date: 
            # Calculate the due date for the loan
            date_start = self.approval_date if self.approval_date else self.loan_date
            due_date = date_start + timedelta(days=(self.duration - 1)) #maybe start_date instead of approval date
            # Check if the current time is past the due date
            #just comparing the date instead of the whole datetime with milliseconds and all that
            if timezone.now().date() > due_date.date():
                # Update the overdue_flag for the loan
                self.overdue_flag = True
                self.save()
    
    class Meta:
        """
        This is the metadata for the Loans model.
        """
        db_table = 'Loans'
        verbose_name_plural = "Loans"