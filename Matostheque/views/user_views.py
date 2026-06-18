import os, json
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.http.response import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from django.views.decorators.csrf import csrf_exempt

from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework import status

from Matostheque.models import CustomUsers
from Matostheque.models.material_model import Materials
from Matostheque.serializers import UserSerializer, ServiceSerializer
from Matostheque.controllers.emails_controller import send_registration_email
from Matostheque.controllers.user_controller import *

# Add by Vikhram
import requests
from django.shortcuts import redirect
from xml.etree import ElementTree



@login_required
@api_view(['GET' ,'DELETE'])
def user_list(request):
    if not request.user.is_staff:
        return JsonResponse(
            {'message': 'You are not authorized to edit this profile.'},
            status=status.HTTP_403_FORBIDDEN
        )
    if request.method == 'GET':
        users = get_user_model().objects.filter(laboratory_id=request.user.laboratory)
        users_serializer = UserSerializer(users, many=True)
        serialized_data = users_serializer.data
        return JsonResponse(serialized_data, safe=False)
    
    elif request.method == 'DELETE':
        count = get_user_model().objects.all().delete()
        return JsonResponse({'message': '{} users were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)


@login_required
@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    # --- SECURITY FIX: Restrict access to own profile only ---
    # We compare the requested ID (pk) with the logged-in user's ID.
    if int(pk) != request.user.pk and not request.user.is_staff:
        return JsonResponse(
            {'message': 'You are not authorized to view or edit this profile.'},
            status=status.HTTP_403_FORBIDDEN
        )
    # ---------------------------------------------------------

    try:
        user = get_user_model().objects.get(pk=pk)
    except Exception:
        return JsonResponse({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        detailed_user = get_formatted_user(user)
        return JsonResponse(detailed_user, safe=False)

    elif request.method == 'PUT':
        user_data = request.data
        role = getattr(user, 'role')
        user_serializer = UserSerializer(user, data=user_data, partial=True)

        if user_serializer.is_valid():
            # Handle Role Changes
            new_role = user_data.get('role')
            if new_role == 'user' and role != 'user':
                materials = Materials.objects.filter(user=user.user_id)
                if materials.exists():
                    return JsonResponse({'message': "You can't become a simple user"},status=status.HTTP_403_FORBIDDEN)

            updated_user = user_serializer.save()
            detailed_user = get_formatted_user(updated_user)
            return JsonResponse(detailed_user, safe=False)

        return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return JsonResponse({'message': 'User was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


@login_required
@api_view(['POST'])
def upload_profile_pic(request, pk):
    # --- SECURITY FIX: Restrict upload to own profile only ---
    if int(pk) != request.user.pk and not request.user.is_staff:
        return JsonResponse(
            {'message': 'You are not authorized to upload pictures for this user.'},
            status=status.HTTP_403_FORBIDDEN
        )
    # ---------------------------------------------------------

    if request.method == 'POST':
        try:
            user = get_user_model().objects.get(pk=pk)
        except Exception:
            return JsonResponse({'message': 'User not found!'}, status=status.HTTP_404_NOT_FOUND)

        response_data = None

        if request.FILES:
            picture = request.FILES
            uploaded_images = []
            folder_path = os.path.join(settings.MEDIA_ROOT, 'images/users/')

            if not os.path.exists(folder_path):
                os.makedirs(folder_path)

            # Iterate over uploaded files
            for key, uploaded_file in picture.items():
                filename = f'user{pk}_{key}.jpg' # Ensure unique name
                file_path = os.path.join(folder_path, filename)

                if os.path.exists(file_path):
                    os.remove(file_path)

                with open(file_path, 'wb') as destination:
                    for chunk in uploaded_file.chunks():
                        destination.write(chunk)

                uploaded_images.append(f'images/users/{filename}')

            response_data = json.dumps(uploaded_images) if len(uploaded_images) > 0 else None

        if response_data is not None:
            try:
                user.profil_pic = response_data
                user.save()
                return JsonResponse({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return JsonResponse({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return JsonResponse({'message': 'Error occured when trying to upload pictures'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@login_required
@api_view(['PUT'])
def changeActivity(request,pk):
    try:
        user = get_user_model().objects.get(pk=pk)
    except Exception:
        return JsonResponse({'message': 'User not found!'}, status=status.HTTP_404_NOT_FOUND)
    if (not request.user.is_staff) | (request.user.user_id == user.user_id):
        return JsonResponse(
            {'message': 'You are not authorized to edit this profile.'},
            status=status.HTTP_403_FORBIDDEN
        )
    try:
        data = json.loads(request.body)
        user.is_active = data.get("is_active")
        user.save()
        return JsonResponse({'message': 'Activity updated successfully'}, status=status.HTTP_200_OK)
    except Exception:
        return JsonResponse({'message': 'Error occured when trying to update the Activity'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@login_required
@api_view(['GET'])
def active_owners_lite(request):
    users = CustomUsers.objects.filter(is_active=True,role='owner', laboratory=request.user.laboratory)
    data = get_lite_Users(users)
    return JsonResponse(data, safe=False)

@login_required
def my_services(request):
    return JsonResponse(ServiceSerializer(request.user.laboratory.services, many=True).data, safe=False)

# --------------------------------------------------------------------------
# AUTHENTICATION & SESSION
# --------------------------------------------------------------------------
# @require_POST
# def api_login(request):
#     try:
#         data = json.loads(request.body)
#         email = data.get('email')
#         password = data.get('password')
#         user = authenticate(request, email=email, password=password)
#         if user is not None:
#             if not user.is_active:
#                 return JsonResponse({'message': 'Account inactive.'}, status=status.HTTP_401_UNAUTHORIZED)

#             if not hasattr(user, 'backend'):
#                 user.backend = 'django.contrib.auth.backends.ModelBackend'

#             login(request, user)

#             formatted_user = get_formatted_user(user)
#             request.session['authenticated'] = True
#             request.session['user'] = formatted_user
#             return JsonResponse({
#                 'message': 'Login successful',
#                 'user': formatted_user,
#                 'session_key': request.session.session_key
#             }, status=status.HTTP_200_OK)
#         else:
#             return JsonResponse({'message': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

#     except Exception as e:
#         return JsonResponse({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# @require_POST
# def api_register(request):
#     try:
#         data = json.loads(request.body)
#         email = data.get('email')
#         password = data.get('password')
#         first_name = data.get('first_name', '')
#         last_name = data.get('last_name', '')

#         if get_user_model().objects.filter(email=email).exists():
#             return JsonResponse({'message': 'User already exists.'}, status=status.HTTP_400_BAD_REQUEST)

#         user = get_user_model().objects.create_user(
#             email=email,
#             password=password,
#             first_name=first_name,
#             last_name=last_name
#         )
        
#         user.backend = 'django.contrib.auth.backends.ModelBackend' 
#         login(request, user)
        
#         formatted_user = get_formatted_user(user)
#         request.session['authenticated'] = True
#         request.session['user'] = formatted_user
        
#         try:
#             user_serializer = UserSerializer(user)
#             send_registration_email(user_serializer.data)
#         except:
#             pass

#         return JsonResponse({
#             'message': 'User registered successfully',
#             'user': formatted_user,
#             'session_key': request.session.session_key
#         }, status=status.HTTP_201_CREATED)

#     except Exception as e:
#         return JsonResponse({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @require_POST
# def api_logout(request):
#     logout(request)
#     return JsonResponse({'message': 'Logged out'}, status=status.HTTP_200_OK)

# @ensure_csrf_cookie
# def session_data(request):
#     try: 
#         if request.method == 'GET':
#             authenticated = request.user.is_authenticated
#             # Always fetch fresh data from DB using request.user to avoid stale session data
#             user_data = get_formatted_user(request.user) if authenticated else {}
            
#             return JsonResponse({
#                 'authenticated': authenticated,
#                 'user' : user_data,
#                 'session_key': request.session.session_key
#             })
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
                    
                # elif local_tag == 'memberOf':
                #     if 'memberOf' not in attributes_dict:
                #         attributes_dict['memberOf'] = []
                #     attributes_dict['memberOf'].append(attribute.text)
            
            # --- ADD THIS LINE TO PRINT TO YOUR CONSOLE ---
            # print("\n=== CAS ATTRIBUTES ===", attributes_dict, "\n")


            normalized_email = email.lower()
            user, created = get_user_model().objects.get_or_create(email=normalized_email, 
                                                                   defaults={'first_name': attributes_dict['givenName'], 'last_name': attributes_dict['sn']})

            # user, created = get_user_model().objects.get_or_create(email=normalized_email, 
            #                                                        defaults={'first_name': attributes_dict['givenName'], 'last_name': attributes_dict['sn'], 'Laboratory': attributes_dict.get('memberOf')})
            
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
            
            return redirect('/matostheque')
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
