import random
from typing import Dict, Any, List

def fetch_mandi_prices(crop: str, location: dict, language: str = "en") -> Dict[str, Any]:
    """
    Simulates fetching real-time Mandi price and volume data from Agmarknet/e-NAM APIs.
    Returns current price, rolling 7-day average, historical prices, and current volume.
    """
    # Regional Staple Fallbacks based on language context if crop is not specified
    if not crop or crop.lower() in ["tomato", "default", ""]:
        lang_defaults = {
            "te": "Cotton",
            "ta": "Rice",
            "gu": "Groundnut",
            "pa": "Wheat",
            "mr": "Sugarcane",
            "hi": "Mustard",
            "en": "Tomato"
        }
        crop = lang_defaults.get(language, "Tomato")

    # Mocking standard price ranges based on crop
    base_prices = {
        "tomato": 25.0,
        "onion": 30.0,
        "potato": 20.0,
        "cotton": 70.0,
        "rice": 40.0,
        "groundnut": 60.0,
        "wheat": 35.0,
        "sugarcane": 30.0,
        "mustard": 50.0
    }
    
    base_price = base_prices.get(crop.lower(), 25.0)
    
    # Simulate a price history (7 days) with normal volatility (e.g. +/- 2 rupees)
    price_history = [base_price + random.uniform(-2, 2) for _ in range(7)]
    
    # Introduce random variation to current price
    current_price = base_price + random.uniform(-1, 1)
    
    # Primary Mandi details
    primary_mandi = {
        "name": "Local APMC",
        "crop": crop,
        "current_price": round(current_price, 2),
        "7_day_history": [round(p, 2) for p in price_history],
        "current_volume_quintals": random.randint(100, 500), # Typical volume
        "average_volume_quintals": 250,
        "distance_km": random.uniform(5.0, 30.0), # Distance from farmer to mandi
        "transport_rate_per_km": 15.0 # Base fuel/transport rate
    }
    
    # Generate 3 alternative regional options for Spatial Profit Analysis
    regional_options = [
        primary_mandi,
        {
            "name": "District Main Market",
            "crop": crop,
            "current_price": round(current_price + random.uniform(2, 6), 2), # Often higher price
            "distance_km": random.uniform(35.0, 80.0), # But further away
            "transport_rate_per_km": 15.0
        },
        {
            "name": "State Wholesale Hub",
            "crop": crop,
            "current_price": round(current_price + random.uniform(5, 12), 2),
            "distance_km": random.uniform(90.0, 180.0), # Much further
            "transport_rate_per_km": 12.0 # Slightly cheaper bulk transport
        },
        {
            "name": "Nearest Cold Storage",
            "crop": crop,
            "current_price": round(current_price * 0.9, 2), # Lower immediate realization
            "distance_km": random.uniform(10.0, 40.0),
            "transport_rate_per_km": 15.0,
            "is_cold_storage": True
        }
    ]
    
    return {
        "primary": primary_mandi,
        "regional_options": regional_options
    }
