import random
from typing import Dict, Any

def fetch_district_weather(location: dict) -> Dict[str, Any]:
    """
    Simulates fetching district-level 3-hourly Nowcast from IMD (India Meteorological Department).
    Returns temperature, humidity, and rain probability.
    """
    return {
        "temperature_c": round(random.uniform(25.0, 42.0), 1), # Indian summer range
        "humidity_percent": random.randint(40, 95),
        "rain_probability_percent": random.randint(0, 100)
    }
