#file that defines the administration interface: used to register models with the django admin panel
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from Matostheque.models.material_model import Materials
from Matostheque.models.transaction_model import Transactions
from Matostheque.models.notification_model import Notifications
from Matostheque.models.comment_model import Comments
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models.laboratory_model import Laboratory, Service
from .models.trust_circle_modele import TrustCircle
from .models.user_model import CustomUsers

# Override the default UserAdmin to customize the admin interface for user management
class CustomUserAdmin(UserAdmin):
    # Specify custom forms for adding and editing user instances
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    
    # Specify the model to be managed by this admin class
    model = CustomUsers
    
    # Define which fields to display in the list view and provide filtering options
    list_display = ("email","role", "is_staff", "is_active",)
    list_filter = ("email","role", "is_staff", "is_active",)
    
    # Group fields into sections for better organization in the admin interface
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'role', 'laboratory')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'updated_at')}),
    )
    
    # Specify fields and classes for the add user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'laboratory', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}
        ),
    )
    
    # Specify which fields to include in the search functionality
    search_fields = ("email",)
    
    # Determine the default sorting order for user records
    ordering = ("email",)
    
    # Specify fields that should be read-only in the admin interface
    readonly_fields = ('date_joined', 'updated_at')


class MaterialsAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("material_title", "get_user_username", "validation", "available_for_transaction","trust_circle")
    list_filter = ("material_title", "user", "validation", "available_for_transaction","trust_circle")
    
    # Specify fields that should be read-only in the admin interface
    readonly_fields = ('created_at', 'updated_at')
    
    # A custom method to get the owner's username
    def get_user_username(self, obj):
        return obj.user if obj.user else None
    
    # Set a custom description for the owner field in the admin interface
    get_user_username.short_description = 'Owner'

class TransactionsAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("material","type", "borrower", "transaction_status", "transaction_date")
    list_filter = ("material","type", "borrower", "transaction_status",)
    
    # Set a custom description for the owner field in the admin interface
    readonly_fields = ('created_at', 'updated_at')

class NotificationsAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("user","transaction", "type", "priority", "description",)
    list_filter = ("user", "type", "priority", "description",)
    
    # Set a custom description for the owner field in the admin interface
    readonly_fields = ('created_at',)

class CommentsAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("user", "content", "parent_comment",)
    list_filter = ("user", "content", "parent_comment",)
    
    # Set a custom description for the owner field in the admin interface
    readonly_fields = ('created_at',)


class LaboratoryAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("laboratory_id","laboratory_name")
    list_filter = ("laboratory_id","laboratory_name")

    # Set a custom description for the owner field in the admin interface
    readonly_fields = ('created_at',)

class TrustCircleAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("trust_circle_id","trust_circle_name")
    list_filter = ("trust_circle_id","trust_circle_name")

    # Set a custom description for the owner field in the admin interface
    readonly_fields = ('created_at',)

class ServiceAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("service_name","laboratories")
    list_filter = ("service_name","laboratories")

# Registering the models
admin.site.register(CustomUsers, CustomUserAdmin)
admin.site.register(Materials, MaterialsAdmin)
admin.site.register(Transactions, TransactionsAdmin)
admin.site.register(Notifications, NotificationsAdmin)
admin.site.register(Comments, CommentsAdmin)
admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(TrustCircle,TrustCircleAdmin)
admin.site.register(Service, ServiceAdmin)
