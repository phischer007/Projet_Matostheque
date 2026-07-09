from importlib.metadata import requires

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone, duration
from datetime import timedelta, datetime

from Mutmat.models.material_model import Materials


class Transactions(models.Model):
    """
    This model represents a transaction object in the system.
    """
    STATUS_CHOICES = (
        ('Pending Validation', 'Pending Validation'), #waiting for validation
        ('Borrowed', 'Borrowed'), #is in progress
        ('Overdue', 'Overdue'), #in progress and date exceeds the duration set
        ('Canceled', 'Canceled'), #pending transaction that was canceled by the user
        ('Rejected', 'Rejected'), #transaction request rejected by owner or admin
        ('Closed', 'Closed'), #transaction is returned to its original place
        ('Booked', 'Booked'),  #booked but not lent out yet
    )

    TYPE_CHOICES = (
    ('Loan','Loan'),
    ('Donation','Donation'),
    )
    
    PENDING_STATUS = 'Pending Validation'
    
    # A unique identifier for the transaction
    transaction_id = models.AutoField(primary_key=True, serialize=False, verbose_name='ID')

    # The type of transaction
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    # The date and time when the transaction starts
    transaction_date = models.DateField()
    
    # The duration of transaction in days
    duration = models.IntegerField(null=True,blank=True)
    
    # The location where the equipment will be brought to
    location = models.TextField()
    
    # A message associated with the transaction
    message = models.TextField(null=True,blank=True)
    
    # The current status of the transaction
    transaction_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING_STATUS)

    # The quantity involved in the transaction
    transaction_quantity = models.FloatField(default=1)

    # The date and the time when the transaction was approved
    approval_date = models.DateTimeField(null=True, blank=True)

    # The Date and Time when the transaction entered its 'final status' so canceled, returned,rejected,Closed
    latest_change_status_date = models.DateTimeField(null=True, blank=True)
    
    # The date and time when the transaction was created
    created_at = models.DateTimeField(default=timezone.now)
    
    # The date and time when the transaction was last updated
    updated_at = models.DateTimeField(default=timezone.now)
    
    # The material associated with the transaction
    material = models.ForeignKey('Materials', on_delete=models.CASCADE, null=True, related_name='material_loans')
    
    # The user who borrowed the material
    borrower = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, related_name='user_loans')
    
    #overriding the save method
    def save(self, *args, **kwargs):
        """
        This function overrides the default save method to update the transaction status.
        """
        self.full_clean()
        super().save(*args, **kwargs)

    def clean(self):
        if self.type == "Loan":
            if self.duration <= 0:
                raise Exception('A transaction duration cannot be negative')
            if self.material.loan_duration and self.duration > self.material.loan_duration:
                raise Exception('A transaction can not be longer than the max transaction duration')
            if self.transaction_quantity is not None and isinstance(self.transaction_quantity, float):
                if not self.transaction_quantity.is_integer():
                    raise Exception("The quantity must be a positive integer.")
            if self.transaction_status in ['Pending Validation','Booked','Borrowed']:
                # Get the start and end date of the transaction
                new_start = self.transaction_date
                new_end = self.transaction_date + timedelta(days=self.duration-1)
                # the quantity of material used is set to 0
                usedcount = 0
                # Get all the transaction of this material
                material_rentals = Transactions.objects.filter(material__material_id=self.material.material_id,transaction_status__in=['Booked','Borrowed'])
                # remove the actual transaction
                if self.pk:
                    material_rentals = material_rentals.exclude(pk=self.pk)
                for loan in material_rentals:
                    # Get the start and end date of the other transaction
                    existing_start = loan.transaction_date
                    existing_end = loan.transaction_date + timedelta(days=loan.duration-1)
                    # Check if it is overlapping
                    if existing_start <= new_end and existing_end >= new_start:
                        # if it is we had the quantity to the used quantity
                        usedcount += loan.transaction_quantity
                # and we check if we don't use too much material
                if (usedcount + self.transaction_quantity) > self.material.quantity_available:
                    if self.material.quantity_available - usedcount > 0:
                        raise Exception("There is only "+str( self.material.quantity_available - usedcount)+" available during this period." )
                    else:
                        raise Exception("There is no material available during this period." )
        else:
            if self.duration is not None:
                raise Exception('A donation of a Consumable can not have a duration')
        if self.borrower_id == self.material.user_id:
            raise Exception('A borrower cannot be the material contact')

    class Meta:
        """
        This is the metadata for the Transactions model.
        """
        db_table = 'Transactions'
        verbose_name_plural = "Transactions"