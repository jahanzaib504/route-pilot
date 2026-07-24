from rest_framework import serializers

class LocationSerializer(serializers.Serializer):
    # Enforce exact field data types inside your coordinates
    name = serializers.CharField(max_length=300)
    lat = serializers.FloatField(min_value=-90.0, max_value=90.0)
    lng = serializers.FloatField(min_value=-180.0, max_value=180.0)
    

class TripSerializer(serializers.Serializer):
    # Replaces JSONField with structured nested validators
    current = LocationSerializer()
    pickup = LocationSerializer()
    dropoff = LocationSerializer()
    cycle_hour = serializers.IntegerField(min_value=0, max_value=69, required=True)
    current_time = serializers.FloatField(min_value=0, max_value=24, required=True)
