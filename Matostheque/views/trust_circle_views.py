from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required

from Matostheque.models.laboratory_model import Laboratory
from Matostheque.models.trust_circle_modele import TrustCircle
from Matostheque.serializers import TrustCircleSerializer


@login_required
@api_view(['GET'])
def my_trust_circle(request):
    try:
        user = request.user
        trust_circles = TrustCircle.objects.filter(laboratory=user.laboratory)
        trust_circle_serializer = TrustCircleSerializer(trust_circles, many=True).data
        return JsonResponse(trust_circle_serializer,safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)})
