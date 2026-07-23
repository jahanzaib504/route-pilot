from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import TripSerializer

@api_view(["POST"])
def index(request):

    serializer = TripSerializer(data=request.data)
    print(request.data)
    if serializer.is_valid():
        
        return Response(serializer.validated_data)

    return Response(serializer.errors, status=400)