import os
import requests

def get_route(points):
    # Fetch URL and API Key from environment variables
    base_url = os.getenv('api_url', 'https://graphhopper.com/api/1/route')
    api_key = os.getenv('api_key')
    
    if not api_key:
        raise ValueError("GraphHopper API key is missing from environment variables.")
    # GraphHopper requires key in the query parameters
    params = {'key': api_key}
    
    payload = {
        "points": points,       # Must be [[lon1, lat1], [lon2, lat2]] format for POST
        "profile": "car",        # Fixed typo: "profile"
        "elevation": False,
        "instructions": False,
        "points_encoded": False
    }

    
    response = requests.post(base_url, params=params, json=payload, timeout=10)
    response.raise_for_status()  # Raises HTTPError for 4xx/5xx codes
    
    data = response.json()
    return data
