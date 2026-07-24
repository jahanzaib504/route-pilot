from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import TripSerializer
from .services.map_services import get_route
from .services.generate_eld_logs import generate_eld_logs
@api_view(["POST"])
def post_data(request):
    serializer = TripSerializer(data=request.data)
    print(request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    data = serializer.validated_data
    
    # Extract points in [longitude, latitude] format
    points = [
        [data['current']['lng'], data['current']['lat']],
        [data['pickup']['lng'], data['pickup']['lat']],
        [data['dropoff']['lng'], data['dropoff']['lat']],
    ]
    # Fetch route information from GraphHopper service
    try:
        map_data = get_route(points)
        if not map_data or "paths" not in map_data:
            return Response(
                {"error": "Could not calculate a route for the given locations."},
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response(
            {"error": "Routing service is currently unavailable.", "details": str(e)}, 
            status=status.HTTP_502_BAD_GATEWAY
        )
    
    # Safely extract estimated time (in milliseconds) from GraphHopper paths
    time_ms = map_data["paths"][0]["time"]
    estimated_time_in_hours = time_ms / (1000 * 60 * 60)
    
    # Check if route exceeds driver cycle hours
    if estimated_time_in_hours > 70 - data['cycle_hour']:
        return Response(
            {
                "error": "The journey cannot be completed within the available cycle hours.",
                "estimated_hours": round(estimated_time_in_hours, 2),
                "available_hours": data['cycle_hour']
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )
    routeData = {'mapData':map_data, 'eldLogs':generate_eld_logs(estimated_time_in_hours, data['current_time'])}    
    return Response(routeData, status=status.HTTP_200_OK)