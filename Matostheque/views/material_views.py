from django.db.models import F, Count
from django.utils.timezone import now
from django.contrib.auth.decorators import login_required

from rest_framework.decorators import api_view
from Matostheque.controllers.materials_controller import *

@login_required
@api_view(['GET'])
def get_materials(request):
    materials = Materials.objects.filter(available_for_transaction=True,trust_circle__in=request.user.laboratory.trust_circles.all())
    # materials = Materials.objects.all()
    # materials = Materials.objects.all().order_by('material_title') # Sort by 'material_title' in ascending order
    
    selected_materials = materials.values(
        'material_id',
        'material_title',
        'description',
        'images',
        'loan_duration',
        'validation',
        'qrcode',
        'type',
        'sub_type',
        'is_Movable',
        'is_formation_required',
        user_first_name=F('user__first_name'),
        user_last_name=F('user__last_name'),
        user_email=F('user__email'),
        user_profil=F('user__profil_pic')
    )
    return JsonResponse(list(selected_materials), safe=False)


@login_required
@api_view(['GET'])
def get_materials_lite(request):
    materials = Materials.objects.filter(available_for_transaction=True,trust_circle__in=request.user.laboratory.trust_circles.all()).exclude(user_id=request.user.user_id)
    # materials = Materials.objects.filter(available_for_transaction=True)

    # Testing results
    title = request.GET.get('material_title', None)
    if title is not None:
        materials = materials.filter(material_title__icontains=title)

    # Selecting specific attributes
    selected_materials = materials.values(
        'material_id',
        'material_title', 
        'loan_duration',
        'validation', 
        'user_id',
        'type',
        'quantity_available'
    ) 

    return JsonResponse(list(selected_materials), safe=False)

@login_required
@api_view(['POST'])
def create_material(request):
    if request.method == 'POST':
        try:
            return on_create_material(request)
        except Exception as e:
            return JsonResponse({"error": str(e)},status=status.HTTP_400_BAD_REQUEST)
   
@api_view(['GET', 'PUT', 'DELETE'])
def material_detail(request, pk):
    try:
        material = get_material(pk)
        if material.trust_circle not in request.user.laboratory.trust_circles.all() and not request.user.is_staff and request.user.pk != material.user_id:
            return JsonResponse({'message': 'You are not authorized to use this Materials.'},status=status.HTTP_403_FORBIDDEN)
    except Materials.DoesNotExist:
        return JsonResponse({'message': 'The material does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        try:
            details_data = get_detailed_material(pk)
            return JsonResponse(details_data)
        except : 
            return JsonResponse({'message': 'Error fetching material details!'}, status=status.HTTP_404_NOT_FOUND)
 
    elif request.method == 'PUT':
        if not request.user.is_staff and request.user.pk != material.user_id:
            return JsonResponse({'message': 'You are not authorized to modifie this Materials.'},status=status.HTTP_403_FORBIDDEN)
        try:
            material_data = request.data
            #we check that the qrcode is not modified
            if material_data.get('qrcode') is not None:
                return JsonResponse({'message': "You can't add a qrcode yourself"},status=status.HTTP_400_BAD_REQUEST)
            #we check that the id is not modified
            if material_data.get('material_id') and int(material_data.get('material_id')) != int(pk):
                return JsonResponse({'message': "You can't change the id of the materials"},status=status.HTTP_400_BAD_REQUEST)

            material_serializer = MaterialSerializer(material, data=material_data, partial=True)
            if material_serializer.is_valid():
                updated_material = material_serializer.save()
                #Image uploading
                if request.FILES:

                    images_response = upload_images(request.FILES, updated_material.material_id)

                    if images_response is not None:
                        existing_images = json.loads(updated_material.images) if updated_material.images else []
                        loaded_response = json.loads(images_response) if images_response else []

                        for item in loaded_response:
                            existing_images.append(item)

                        updated_material.images = json.dumps(existing_images)

                        updated_material.save()
                return JsonResponse(material_serializer.data)

            return JsonResponse(material_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({'message': str(e)},status=status.HTTP_400_BAD_REQUEST)
 
    elif request.method == 'DELETE':
        if not request.user.is_staff and request.user.pk != material.user_id:
            return JsonResponse({'message': 'You are not authorized to delete this Materials.'},status=status.HTTP_403_FORBIDDEN)
        material.delete()
        return JsonResponse({'message': 'Material was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


@login_required
@api_view(['GET'])
def material_list_per_owner(request, pk):
    materials = Materials.objects.filter(user=pk)
    if request.method == 'GET': 
        materials_serializer = MaterialSerializer(materials, many=True)
        return JsonResponse(materials_serializer.data, safe=False)

@login_required 
@api_view(['GET'])
def latest_material(request):
    materials = []
    if Materials.objects.exists():
        i = 0
        for material in Materials.objects.order_by('-created_at')[:4]:
            materials.append({})
            materials[i]["material_id"] = material.material_id
            materials[i]["available_for_transaction"] = material.available_for_transaction
            materials[i]["material_title"] = material.material_title
            materials[i]["updated_at"] = material.updated_at
            materials[i]["images"] = material.images
            if material.type == 'LAB_SUPPLIES':
                materials[i]["availability"] = is_available(material.material_id)
            else:
                materials[i]["availability"] = material.available_for_transaction


            i = i + 1

    if request.method == 'GET':
        return JsonResponse(materials, safe=False)


@api_view(['GET'])
def material_events_detail(request, pk):
    material = get_material(pk)
    if material.trust_circle not in request.user.laboratory.trust_circles.all():
        return JsonResponse({'message': 'You are not authorized to use this Materials.'},
                            status=status.HTTP_403_FORBIDDEN)
    events =  get_events_detail(pk)
    return JsonResponse(events, safe=False)

@api_view(['GET'])
def material_events_lite(request, pk):
    material = get_material(pk)
    if material.trust_circle not in request.user.laboratory.trust_circles.all():
        return JsonResponse({'message': 'You are not authorized to use this Materials.'},
                            status=status.HTTP_403_FORBIDDEN)
    events =  get_events_detail_lite(pk)
    return JsonResponse(events, safe=False)

@login_required
@api_view(['GET'])
def get_total_count(request):
    # 1. Basic Counts
    materials_count = Materials.objects.count()
    current_month = now().month
    current_year = now().year
    
    materials_added_this_month = Materials.objects.filter(
        created_at__month=current_month,
        created_at__year=current_year
    ).count()
    # --- NEW: Filter materials created in the current year ---
    materials_added_this_year = Materials.objects.filter(
        created_at__year=current_year
    ).count()

    # 2. Materials per Team (For the Bar Chart)
    # Groups by 'team' field and counts material_ids
    #materials_per_team = Materials.objects.values('team').annotate(
    #    count=Count('material_id')
    #).order_by('-count')

    # 2. Materials per Laboratory (For the Bar Chart)
    from django.db.models import Count

    materials_per_laboratory = (
        Materials.objects
        .values('user__laboratory__laboratory_name')
        .annotate(nb_laboratory=Count('user__laboratory')).order_by('-nb_laboratory')
    )
    if request.method == 'GET': 
        return JsonResponse({
            'total_count': materials_count,
            'added_this_month': materials_added_this_month,
            'added_this_year': materials_added_this_year,
            'materials_per_laboratory': list(materials_per_laboratory), # Converted to list for JSON serialization
            # 'users_per_team': list(users_per_team)
        })

def update_Consumable_Availability():
    Materials.objects.filter(
        expiration_date__lte=timezone.now(),
        available_for_transaction=True
    ).update(available_for_transaction=False)

@login_required
@api_view(['PUT'])
def update_material_availability(request,pk):
    try:
        material = Materials.objects.get(pk=pk)
        if material.user_id != request.user.user_id and not request.user.is_staff:
            return JsonResponse({'message': 'You are not authorized to modify this Materials.'},status=status.HTTP_403_FORBIDDEN)
        else:
            material.available_for_transaction = request.data.get('available_for_transaction')
            material.save()
            return JsonResponse("Success", status=status.HTTP_201_CREATED,safe=False)
    except Exception as e:
        return JsonResponse({'message': str(e)},status=status.HTTP_400_BAD_REQUEST)