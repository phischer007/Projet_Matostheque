from django.db import models
from django.utils import timezone
from datetime import timedelta

GENERAL_TYPE_CHOICES = [
    ('LAB_SUPPLIES', 'Lab Supplies'),
    ('CONSUMABLES', 'Consumables'),
]

TYPE_CHOICES = [
    ('FILTERS_FILTRATION_SUPPLIES', 'Filters and Filtration Supplies'),
    ('BIOLOGICAL_CONSUMABLES', 'Biological Consumables'),
    ('CHEMICALS', 'Chemicals'),
    ('SAFETY_EQUIPMENT', 'Safety Equipment'),
    ('LAB_FURNITURE_FIXTURES', 'Lab Fixtures'),
    ('CLEANING_MAINTENANCE_SUPPLIES', 'Cleaning and Maintenance Supplies'),
]

#############################################################
# Newly added category
LAB_SUPPLY_TYPE_CHOICES = [
    ('COMPUTING', 'Computing'),
    ('ELECTRONICS', 'Electronics'),
    ('MECHANICAL', 'Mechanical'),
    ('OPTICS_LASER', 'Optics or Laser'),
    ('GAS_FLUIDS', 'Gas or Fluids'),
    ('BIOLOGICAL', 'Biological'),
    ('CHEMISTRY',  'Chemistry'),
    ('BOOKS',  'Books'),
    ('OFFICE_BUILDING',  'Office and Building'),
    ('Others',  'Others'),
]
#############################################################

class Materials(models.Model):
    """
    This model represents a material in the system.
    """
    # A unique identifier for the material.
    material_id = models.AutoField(primary_key=True, serialize=False, verbose_name='ID')
    
    # The title of the material.
    material_title = models.CharField(max_length=100)
    
    # A description of the material.
    description = models.TextField(null=True)
    
    # The team associated with the material.
    team = models.CharField(max_length=100, null=True, blank=True)
    
    # A link to the manual for the material.
    manual_link = models.CharField(max_length=255, null=True, blank=True)
    
    # A link to the datasheet for the material.
    datasheet_link = models.CharField(max_length=255, null=True, blank=True)
    
    # The QR code associated with the material.
    qrcode = models.TextField(null=True, blank=True)
    
    # The images associated with the material.
    images = models.TextField(null=True, blank=True)
    
    # The type of material.
    type = models.CharField(max_length=100, choices=GENERAL_TYPE_CHOICES)

    ##################################################################################################
    # The consumable type of material if the type matches (consumable type)
    consumable_type = models.CharField(max_length=100, choices=TYPE_CHOICES, null=True, blank=True)

    # The quantity of the material available. (consumable type)
    quantity_available =  models.FloatField(default=0.0, null=True)
    
    # The unit of measurement for the material. (consumable type)
    unit = models.CharField(max_length=100, null=True, blank=True)
    
    # The expiration date of the material. (consumable type)
    expiration_date = models.DateTimeField(null=True, blank=True)
    ##################################################################################################

    ##################################################################################################################
    # Add for LAB_SUPPLIES type
    ##################################################################################################################
    lab_supply_type = models.CharField(max_length=100, choices=LAB_SUPPLY_TYPE_CHOICES, null=True, blank=True)
    lab_supply_quantity = models.FloatField(default=0.0, null=True)  # Quantity of lab supplies
    ##################################################################################################################

    # The original location of the material.
    origin = models.CharField(max_length=100, null=True)
    
    # The loan duration allowed for the material.
    loan_duration = models.IntegerField(null=True)
    
    # A flag indicating whether the material is available or not.
    availability = models.BooleanField(default=True)
    
    # A flag indicating whether the loan of the material needs to be validated or not.
    validation = models.BooleanField(default=True)
    
    # A flag indicating whether the material is available for loan or not.
    available_for_loan = models.BooleanField(default=True)
    
    # The NACRE code for the material.
    code_nacre = models.CharField(max_length=10, null=True, blank=True)
    
    # The purchase price of the material.
    purchase_price =  models.FloatField(default=0.0, null=True)
    
    # The owner associated to/ of the material
    owner = models.ForeignKey('Owners', on_delete=models.CASCADE, null=True, related_name='owner_materials')
    
    # The date and time when the material was created.
    created_at = models.DateTimeField(default=timezone.now)
    
    # The date and time when the material was last updated.
    updated_at = models.DateTimeField(default=timezone.now)
    
    USERNAME_FIELD = 'material_title'

    class Meta:
        """
        This is the metadata for the Materials model.
        """
        db_table = 'Materials'
        verbose_name_plural = "Materials"
        
    def save(self, *args, **kwargs):
        """
        This function overrides the default save method to update the availability flag.
        """
        if self.availability is None:
            self.availability = True
        super().save(*args, **kwargs)

    # def update_availability(self, *args, **kwargs):
    #     """
    #     This function updates the availability flag for the material.
        
    #     It checks if there are any loans in progress or overdue for the material.
    #     If there are, it sets the availability flag to False.
    #     """
    #     if self.pk is not None:
    #         related_loans = self.material_loans.all() 
    #         today = timezone.now().date()
            
    #         loans_in_progress_or_overdue = related_loans.filter(
    #             loan_status__in=['Borrowed', 'Overdue']                
    #         )
            
    #         if not loans_in_progress_or_overdue.exists():
    #             self.availability = True
    #         else: 
    #             #just to be sure but the status should already be enough to say whether available or not
    #             for loan in loans_in_progress_or_overdue:
    #                 difference = loan.loan_date.date() - today
    #                 if timedelta(days=0) <= difference <= timedelta(days=(loan.duration - 1)):
    #                     self.availability = False
            
    #         #only saving left
    #         self.save()

    def update_availability(self, *args, **kwargs):
        """
        This function updates the availability flag for the material.
        
        It checks if there are any loans in progress or overdue for the material.
        If there are, it sets the availability flag to False.
        """
        if self.pk is not None:
            related_loans = self.material_loans.all() 
            
            loans_in_progress_or_overdue = related_loans.filter(
                loan_status__in=['Borrowed', 'Overdue']                
            )
            
            # If any loan is active or overdue, the material is NOT available
            if loans_in_progress_or_overdue.exists():
                self.availability = False
            else:
                self.availability = True       
            # only saving left
            self.save()

    def __str__(self):
        return self.material_title


