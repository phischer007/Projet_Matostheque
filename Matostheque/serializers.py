from rest_framework import serializers 
from Matostheque.models.material_model import Materials
from Matostheque.models.owner_model import Owners
from Matostheque.models.loan_model import Loans
from Matostheque.models.user_model import CustomUsers
from Matostheque.models.notification_model import Notifications
from Matostheque.models.comment_model import Comments
 
# Here, we're defining special kind of class called 'serializers'. 
# These classes help us convert complex data from our models into a format that can be easily transferred over the web.

class MaterialSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Materials
        fields = '__all__'

class OwnerSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Owners
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = CustomUsers
        exclude = ('password',) #comma to make it a tuple, not error

class LoanSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Loans
        fields = '__all__'

        
class NotificationSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Notifications
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Comments
        fields = '__all__'