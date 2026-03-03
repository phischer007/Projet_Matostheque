from django.shortcuts import render
from django.db.models import Q, F

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
 
from Matostheque.models.notification_model import Notifications
from Matostheque.serializers import NotificationSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required

@login_required
@api_view(['GET', 'POST', 'DELETE'])
def notification_operations(request):
    if request.method == 'GET':
        notifications = Notifications.objects.all().order_by('-created_at')
        notification_serializer = NotificationSerializer(notifications, many=True)
        serialized_data = notification_serializer.data
        return JsonResponse(serialized_data, safe=False)
 
    elif request.method == 'POST':
        notification_data = request.data
        notification_serializer = NotificationSerializer(data=notification_data)
        if notification_serializer.is_valid():
            notification_serializer.save()
            return JsonResponse(notification_serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(notification_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        count = Notifications.objects.all().delete()
        return JsonResponse({'message': '{} Notifications were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
 
@login_required
@api_view(['GET'])
def user_notification_list(request, pk):
    notifications = Notifications.objects.filter(user=pk)
    if notifications is not None:
        try: 
            detailed_notifications = notifications.values(
                'notif_id',
                'type',
                'priority',
                'description',
                'title',
                'resolved_flag', 
                'read_flag', 
                'created_at', 
                'updated_at', 
                'loan', 
                'user',
                material_title=F('loan__material__material_title'),
                borrower_first_name=F('loan__borrower__first_name'),
                borrower_last_name=F('loan__borrower__last_name'),
            )
            detailed_notifications = detailed_notifications.order_by('-created_at')
            if request.method == 'GET': 
                return JsonResponse(list(detailed_notifications), safe=False)
        except Exception as e:
            print(e)

@login_required
@api_view(['GET'])
def user_important_notification_list(request, pk):
    user_notifications = Notifications.objects.filter(user=pk)
    unresolved_notifications = user_notifications.filter(resolved_flag=False)
    critical_or_high_priority_notifications = unresolved_notifications.filter(
        Q(priority='Critical') | Q(priority='High')
    )
    
    if critical_or_high_priority_notifications is not None:
        notifications = critical_or_high_priority_notifications.order_by('-created_at')
        
    if request.method == 'GET': 
        notifications_serializer = NotificationSerializer(notifications, many=True)
        return JsonResponse(notifications_serializer.data, safe=False)
