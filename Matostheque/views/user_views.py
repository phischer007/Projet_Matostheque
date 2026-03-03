import os, json
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.http.response import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.shortcuts import redirect
import requests

from rest_framework.parsers import JSONParser 
from rest_framework import status
from rest_framework.decorators import api_view
from xml.etree import ElementTree

from Matostheque.serializers import UserSerializer
from Matostheque.controllers.emails_controller import send_registration_email
from Matostheque.controllers.user_controller import *
from Matostheque.controllers.owner_controller import update_owner, generate_owner_record
from Matostheque.controllers.session_controller import *
from Matostheque.custom_exception import *

@login_required
@api_view(['GET' ,'DELETE'])
def user_list(request):
    if request.method == 'GET':
        users = get_user_model().objects.all()
        users_serializer = UserSerializer(users, many=True)
        serialized_data = users_serializer.data
        return JsonResponse(serialized_data, safe=False)
    
    elif request.method == 'DELETE':
        count = get_user_model().objects.all().delete()
        return JsonResponse({'message': '{} users were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
 

 
@login_required
@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    try: 
        user =  get_user_model().objects.get(pk=pk) 
    except UserNotFoundError as e:
        return JsonResponse({'message': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == 'GET': 
        detailed_user = get_formatted_user(user)
        return JsonResponse(detailed_user, safe=False) 
 
    elif request.method == 'PUT': 
        user_data = JSONParser().parse(request) 
        role = getattr(user, 'role')
        user_serializer = UserSerializer(user, data=user_data, partial=True) 
                
        if user_serializer.is_valid(): 
            updated_user = user_serializer.save() 
            
            if 'role' in user_data and user_data['role'] == 'owner' and role != 'owner':
                generate_owner_record(
                    user=pk,
                    contact=user_data.get('contact') if user_data.get('contact') else None
                )
            elif 'role' in user_data and user_data['role'] == 'user' and role != 'user':
                update_owner(pk, {
                    'is_active': False
                })
            elif 'contact' in user_data and role == 'owner':
                update_owner(pk, {
                    'contact': user_data.get('contact')
                })
            
            detailed_user = get_formatted_user(updated_user)
            
            return JsonResponse(detailed_user, safe=False) 
        return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

    elif request.method == 'DELETE': 
        user.delete() 
        return JsonResponse({'message': 'User was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

@login_required
@api_view(['POST'])
def upload_profile_pic(request, pk):
    if request.method == 'POST': 
        user =  get_user_model().objects.get(pk=pk) 
        if user is None:
            return JsonResponse({'message': 'User not found!'}, status=status.HTTP_400_BAD_REQUEST) 
        
        response_data =  None
        
        if request.FILES: 
            
            picture = request.FILES
            
            uploaded_images = []
            folder_path = os.path.join(settings.MEDIA_ROOT, 'images/users/')
            # Create the folder if it doesn't exist
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)
            # Iterate over the request.POST keys to find keys starting with 'image_image_'
            for key, uploaded_file in picture.items():
                # Generate a unique filename for the image
                filename = f'user{pk}_{key}.jpg'  # You can adjust the extension as needed
                # Construct the full file path
                file_path = os.path.join(folder_path, filename)
                # Check if the file already exists and delete it
                if os.path.exists(file_path):
                    os.remove(file_path)
                # Save the uploaded file as an image to the specified folder
                with open(file_path, 'wb') as destination:
                    # Iterate over the file chunks and write them to the destination
                    for chunk in uploaded_file.chunks():
                        destination.write(chunk)
                        
                uploaded_images.append(f'images/users/{filename}')
            
            response_data = json.dumps(uploaded_images) if len(uploaded_images) > 0 else None
        
        if response_data is not None:
            try:
                user.profil_pic =  response_data
                user.save()
                return JsonResponse({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return JsonResponse({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return JsonResponse({'message': 'Error occured when trying to upload pictures'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
        
def cas_login(request):
    service_url = request.build_absolute_uri('/api/cas/validate/')
    login_url = settings.LOGIN_URL.format(service_url)
    return redirect(login_url)

def cas_validate(request):
    ticket = request.GET.get('ticket')
    service_url = request.build_absolute_uri('/api/cas/validate/')
    validate_url = f'{settings.CAS_SERVER_URL}/p3/serviceValidate'
    params = {'ticket': ticket, 'service': service_url}
    response = requests.get(validate_url, params=params)
    
    if response.status_code == 200:
        tree = ElementTree.fromstring(response.content)
        if tree.find('.//cas:authenticationSuccess', namespaces={'cas': 'http://www.yale.edu/tp/cas'}):
            email = tree.find('.//cas:mail', namespaces={'cas': 'http://www.yale.edu/tp/cas'}).text
            cas_attributes = tree.findall('.//cas:attributes/*', namespaces={'cas': 'http://www.yale.edu/tp/cas'})
        
            attributes_dict = {}
            for attribute in cas_attributes:
                tag_parts = attribute.tag.split('}')
                local_tag = tag_parts[-1]
                if local_tag in ['sn', 'givenName', 'mail']:
                    attributes_dict[local_tag] = attribute.text
            
            normalized_email = email.lower()
            user, created = get_user_model().objects.get_or_create(email=normalized_email, 
                                                                   defaults={'first_name': attributes_dict['givenName'], 'last_name': attributes_dict['sn']})
            user_data = get_formatted_user(user) if user is not None else {}
            user.backend = 'django.contrib.auth.backends.ModelBackend' 
            login(request, user)
            
            #storing session data
            request.session['authenticated'] = True
            request.session['user'] = user_data
            request.session['new'] = created
            
            #sending email
            if created:
                user_serializer = UserSerializer(user)
                send_registration_email(user_serializer.data)
            
            return redirect('/matostheque/')
    #temporary if error authenticating
    service_url = request.build_absolute_uri('/api/cas/validate/')
    login_url = settings.LOGIN_URL.format(service_url)
    return redirect(login_url) #need to change to back to authentication if error

def cas_logout(request):
    logout(request)
    return redirect(settings.LOGOUT_URL)

def session_data(request):
    try: 
        if request.method == 'GET':
            authenticated = request.session.get('authenticated', False)
            user =  request.session.get('user', {})
            new =  request.session.get('new', False)
            sessionKey = request.session.session_key

            return JsonResponse({
                'authenticated': authenticated,
                'user' : user,
                'new' : new,
                'session_key': sessionKey
            })
    except Exception as e:
        return JsonResponse({
            'error': 'Error fetching session data.',
            'message': str(e),
        }, status=status.HTTP_400_BAD_REQUEST)
    