from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
from django.contrib.auth.decorators import login_required
 
from Matostheque.models.owner_model import Owners
from Matostheque.serializers import OwnerSerializer
from rest_framework.decorators import api_view
from Matostheque.controllers.owner_controller import *

@login_required
@api_view(['GET', 'POST', 'DELETE'])
def owner_list(request):
    if request.method == 'GET':
        owners = Owners.objects.all()
        
        #testing results                
        name = request.GET.get('owner_name', None)
        if name is not None:
            owners = owners.filter(owner_name__icontains=name)

        owners_serializer = OwnerSerializer(owners, many=True)
        serialized_data = owners_serializer.data
        return JsonResponse(serialized_data, safe=False)
        # 'safe=False' for objects serialization
 
    elif request.method == 'POST':
        owner_data = JSONParser().parse(request)
        owner_serializer = OwnerSerializer(data=owner_data)
        if owner_serializer.is_valid():
            owner_serializer.save()
            return JsonResponse(owner_serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(owner_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
@login_required
@api_view(['GET', 'PUT', 'DELETE'])
def owner_detail(request, pk):
    try: 
        owner = Owners.objects.get(pk=pk) 
    except Owners.DoesNotExist: 
        return JsonResponse({'message': 'The owner does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        owner_serializer = OwnerSerializer(owner) 
        return JsonResponse(owner_serializer.data) 
 
    elif request.method == 'PUT': 
        owner_data = JSONParser().parse(request) 
        owner_serializer = OwnerSerializer(owner, data=owner_data, partial=True) 
        if owner_serializer.is_valid(): 
            owner_serializer.save() 
            return JsonResponse(owner_serializer.data) 
        return JsonResponse(owner_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
 
    elif request.method == 'DELETE': 
        owner.delete() 
        return JsonResponse({'message': 'Owner was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

@login_required 
@api_view(['GET'])
def active_owners_lite(request):
    owners = Owners.objects.filter(is_active=True)
    data = get_lite_owners(owners)
    return JsonResponse(data, safe=False)