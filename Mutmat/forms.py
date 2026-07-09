from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models.user_model import CustomUsers

# Define a form for creating custom users that inherits from Django's UserCreationForm
class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = CustomUsers
        fields = ("email",)

# Define a form for updating existing users
class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUsers
        fields = ("email",)