# This file is for managing owner-related functionality 
from datetime import datetime
from Matostheque.models.owner_model import Owners 
from Matostheque.serializers import OwnerSerializer
from rest_framework.serializers import ValidationError

from django.http.response import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status

def get_owner(pk):
    """
    Function to return an owner instance given a primary key.
    """
    return Owners.objects.get(pk=pk)

def get_owner_by_user(pk):
    """
    Function to return an owner instance given a user primary key.
    """
    try:
        owner = Owners.objects.get(user=pk)
    except ObjectDoesNotExist:
        owner = None
    return owner
    

def generate_owner_record(**args):
    """
    Function to create an owner record.

    Args:
        args (obj) : A list of necessary arguments (the user primary key, and contact(opt))
    Returns:
        json: returns respective message if record reactivated, created or error.
    """
    owner = get_owner_by_user(args['user'])
    
    # Check if an owner instance is already related to the user primary key
    # Reactivate the owner instance if found
    if owner : 
        owner.is_active = True
        owner.contact = args['contact'] if args['contact'] else owner.contact
        owner.save()
        return JsonResponse({'message': 'Owner record reactivated!'}, status=status.HTTP_204_NO_CONTENT)
    
    #create a new instance if owner not found
    data = {
        'user' : args['user'],
        'contact' : args['contact'] if args['contact'] else None
    }
    owner_serializer = OwnerSerializer(data=data)
    
    try:
        if owner_serializer.is_valid(raise_exception=True) : 
            owner_serializer.save()
        # Return message after successful generation
        return JsonResponse({'message': 'Record created!'}, status=status.HTTP_204_NO_CONTENT)
    except ValidationError as e:
        errors = e.detail
        print(errors)
        # Catch error on record generation
        return JsonResponse({'message': errors}, status=status.HTTP_204_NO_CONTENT)
    
def get_lite_owners(owners):
    """
    Function to get a list of lite information related to a list of owner.

    Args:
        owners (list of obj) : A list of owner instance
    Returns:
        array: returns a list of related information to each owner instance.
    """
    owner_detail = []
    for owner in owners:
        owner_data = {
            'owner_id': owner.owner_id,
            'owner_name': f"{owner.user.first_name} {owner.user.last_name}",
            'is_staff': owner.user.is_staff
        }
        owner_detail.append(owner_data)
    return owner_detail

def update_owner(user_pk, data):
    """
    Function that updates the attributes of an owner instance.

    Args:
        user_pk (int) : the primary key of the related user
        data (obj) :  a list of attribute to update
    Returns:
        array: returns a respective message of success or error.
    """
    try:
        owner = Owners.objects.get(user=user_pk)
        if owner:
            for key, value in data.items():
                setattr(owner, key, value)
            owner.save()
            return JsonResponse({'message': 'Owner record updated'}, status=status.HTTP_200_OK)
    except Owners.DoesNotExist:
        return JsonResponse({'message': 'Owner record not found'}, status=status.HTTP_404_NOT_FOUND)
    