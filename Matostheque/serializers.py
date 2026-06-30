from rest_framework import serializers 
from Matostheque.models.material_model import Materials
from Matostheque.models.transaction_model import Transactions
from Matostheque.models.trust_circle_modele import TrustCircle
from Matostheque.models.user_model import CustomUsers
from Matostheque.models.notification_model import Notifications
from Matostheque.models.comment_model import Comments
from Matostheque.models.laboratory_model import Laboratory,Service

 
# Here, we're defining special kind of class called 'serializers'. 
# These classes help us convert complex data from our models into a format that can be easily transferred over the web.

class MaterialSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Materials
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = CustomUsers
        exclude = ('password',) #comma to make it a tuple, not error

class TransactionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Transactions
        fields = '__all__'

        
class NotificationSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Notifications
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Comments
        fields = '__all__'

class LaboratorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Laboratory
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class TrustCircleSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrustCircle
        fields = '__all__'