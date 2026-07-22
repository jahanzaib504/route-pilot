const BASE_URL = "https://nominatim.openstreetmap.org";

const headers = {
  Accept: "application/json",
};

const getLocationLatLng = async (locationName, signal = null) => {
  if (!locationName || locationName.trim().length < 3) {
    return [];
  }

  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(
      locationName
    )}&format=json&addressdetails=0&limit=6`,
    {
      signal,
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search locations.");
  }

  return await response.json();
};

const getLocationName = async (lat, lng, signal = null) => {
  if (lat == null || lng == null) {
    return null;
  }

  const response = await fetch(
    `${BASE_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
    {
      signal,
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch location name.");
  }

  return await response.json();
};

export { getLocationLatLng, getLocationName };