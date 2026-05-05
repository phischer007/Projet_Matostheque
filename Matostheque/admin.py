#file that defines the administration interface: used to register models with the django admin panel
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from Matostheque.models.owner_model import Owners
from Matostheque.models.material_model import Materials
from Matostheque.models.loan_model import Loans
from Matostheque.models.notification_model import Notifications
from Matostheque.models.comment_model import Comments
from .forms import CustomUserCreationForm, CustomUserChangeForm
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
        ('Personal info', {'fields': ('first_name', 'last_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'updated_at')}),
    )
    
    # Specify fields and classes for the add user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}
        ),
    )
    
    # Specify which fields to include in the search functionality
    search_fields = ("email",)
    
    # Determine the default sorting order for user records
    ordering = ("email",)
    
    # Specify fields that should be read-only in the admin interface
    readonly_fields = ('date_joined', 'updated_at')

#
class OwnersAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("user", "is_active",)
    list_filter = ("user", "is_active",)
    
    # Specify fields that should be read-only in the admin interface
    readonly_fields = ('created_at', 'updated_at')

class MaterialsAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("material_title", "get_owner_username", "availability", "validation")
    list_filter = ("material_title", "owner", "availability", "validation")
    
    # Specify fields that should be read-only in the admin interface
    readonly_fields = ('created_at', 'updated_at')
    
    # A custom method to get the owner's username
    def get_owner_username(self, obj):
        return obj.owner.user if obj.owner else None
    
    # Set a custom description for the owner field in the admin interface
    get_owner_username.short_description = 'Owner'

class LoansAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("material", "borrower", "loan_status", "loan_date")
    list_filter = ("material", "borrower", "loan_status",)
    
    # Set a custom description for the owner field in the admin interface
    readonly_fields = ('created_at', 'updated_at')

class NotificationsAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("user", "type", "priority", "description",)
    list_filter = ("user", "type", "priority", "description",)
    
    # Set a custom description for the owner field in the admin interface
    readonly_fields = ('created_at',)

class CommentsAdmin(admin.ModelAdmin):
    # Define which fields to display in the list view and provide filtering options
    list_display = ("user", "content", "parent_comment",)
    list_filter = ("user", "content", "parent_comment",)
    
    # Set a custom description for the owner field in the admin interface
    readonly_fields = ('created_at',)

# Registering the models
admin.site.register(CustomUsers, CustomUserAdmin)
admin.site.register(Owners, OwnersAdmin)
admin.site.register(Materials, MaterialsAdmin)
admin.site.register(Loans, LoansAdmin)
admin.site.register(Notifications, NotificationsAdmin)
admin.site.register(Comments, CommentsAdmin)
