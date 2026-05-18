from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

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
    description = models.TextField()
    
    # The team associated with the material.
    #team = models.CharField(max_length=100, null=True, blank=True)
    
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

    # The subType of material.
    sub_type = models.CharField(max_length=100, choices= TYPE_CHOICES + LAB_SUPPLY_TYPE_CHOICES)
    ##################################################################################################
    # The consumable type of material if the type matches (consumable type)
    #consumable_type = models.CharField(max_length=100, choices=TYPE_CHOICES, null=True, blank=True)
    
    # The unit of measurement for the material. (consumable type)
    #unit = models.CharField(max_length=100, null=True, blank=True)
    
    # The expiration date of the material. (consumable type)
    expiration_date = models.DateField(null=True, blank=True)
    ##################################################################################################

    ##################################################################################################################
    # Add for LAB_SUPPLIES type
    ##################################################################################################################
    #lab_supply_type = models.CharField(max_length=100, choices=LAB_SUPPLY_TYPE_CHOICES, null=True, blank=True)
    #lab_supply_quantity = models.FloatField(default=0.0, null=True)  # Quantity of lab supplies

    # The loan duration allowed for the material.
    loan_duration = models.IntegerField(null=True, blank=True)
    ##################################################################################################################

    # The quantity of the material available. (consumable type)
    quantity_available =  models.FloatField(default=1)

    # The original location of the material.
    origin = models.CharField(max_length=100, null=True)
    
    # The loan duration allowed for the material.
    #loan_duration = models.IntegerField(null=True)
    
    # A flag indicating whether the material is available or not.
    #availability = models.BooleanField(default=True)
    
    # A flag indicating whether the loan of the material needs to be validated or not.
    validation = models.BooleanField(default=True)
    
    # A flag indicating whether the material is available for loan or not.
    available_for_loan = models.BooleanField(default=True)

    is_Movable = models.BooleanField(default=True)

    is_formation_required = models.BooleanField(default=False)

    # The NACRE code for the material.
    code_nacre = models.CharField(max_length=10, null=True, blank=True)
    
    # The purchase price of the material.
    purchase_price =  models.FloatField(default=0.0, null=True, blank=True)
    
    # The user associated to/ of the material
    user = models.ForeignKey('CustomUsers', on_delete=models.CASCADE, related_name='User_materials')
    
    # The date and time when the material was created.
    created_at = models.DateTimeField(auto_now_add=True)
    
    # The date and time when the material was last updated.
    updated_at = models.DateTimeField(auto_now=True)
    
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
        # A Materials has a positive quantity
        if self.quantity_available is not None and self.quantity_available<=0.0:
            raise Exception("The quantity must be positive")

        if self.type == "LAB_SUPPLIES":
            # A LAB_SUPPLIES don't have an expiration_date
            self.expiration_date = None

            # A LAB_SUPPLIES has a positive integer quantity
            if self.quantity_available is not None and isinstance(self.quantity_available, float):
                if not self.quantity_available.is_integer():
                    raise Exception("The quantity must be a positive integer.")

        else:
            # A CONSUMABLES can't be loan
            self.loan_duration = None

            if self.expiration_date is not None and self.expiration_date < timezone.now():
                raise Exception("You can't loan an expired material")
        if get_user_model().objects.get(pk=self.user_id).role == "user":
            raise Exception("Le propriétaire doit être un owner")
        super().save(*args, **kwargs)


    def __str__(self):
        return self.material_title


