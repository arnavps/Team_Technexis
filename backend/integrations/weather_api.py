import logging
import httpx
from typing import Dict, Any

logger = logging.getLogger(__name__)

async def fetch_district_weather(location: dict) -> Dict[str, Any]:
    """
    Fetches real-time weather and soil data from Open-Meteo based on GPS coordinates.
    Includes Temperature, Humidity, Precipitation probability, and Soil Moisture.
    """
    lat = location.get("lat", 18.5204)
    lng = location.get("lng", 73.8567)
    
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,precipitation&hourly=precipitation_probability,soil_moisture_0_to_1cm&forecast_days=1"
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            current = data.get("current", {})
            hourly = data.get("hourly", {})
            
            # Map Open-Meteo fields to our schema
            return {
                "temperature_c": current.get("temperature_2m", 30.0),
                "humidity_percent": current.get("relative_humidity_2m", 60),
                "rain_probability_percent": hourly.get("precipitation_probability", [0])[0], # Take first hour probe
                "soil_moisture_percent": round(hourly.get("soil_moisture_0_to_1cm", [0.25])[0] * 100, 1), # Data is usually m3/m3, convert to %
                "is_verified_env": True
            }
            
    except Exception as e:
        logger.error(f"Environmental API Error: {e}. Falling back to seasonal heuristics.")
        # Graceful Fallback
        return {
            "temperature_c": 32.5,
            "humidity_percent": 65,
            "rain_probability_percent": 10,
            "soil_moisture_percent": 22.1,
            "is_verified_env": False
        }
