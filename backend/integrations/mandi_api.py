import random
from typing import Dict, Any, List

def fetch_mandi_prices(crop: str, location: dict) -> Dict[str, Any]:
    """
    Simulates fetching real-time Mandi price and volume data from Agmarknet/e-NAM APIs.
    Returns current price, rolling 7-day average, historical prices, and current volume.
    """
    # Mocking standard price ranges based on crop
    base_prices = {
        "tomato": 25.0,
        "onion": 30.0,
        "potato": 20.0
    }
    
    base_price = base_prices.get(crop.lower(), 25.0)
    
    # Simulate a price history (7 days) with normal volatility (e.g. +/- 2 rupees)
    price_history = [base_price + random.uniform(-2, 2) for _ in range(7)]
    
    # Introduce random variation to current price
    current_price = base_price + random.uniform(-1, 1)
    
    return {
        "crop": crop,
        "current_price": round(current_price, 2),
        "7_day_history": [round(p, 2) for p in price_history],
        "current_volume_quintals": random.randint(100, 500), # Typical volume
        "average_volume_quintals": 250,
        "distance_km": random.uniform(5.0, 50.0), # Distance from farmer to mandi
        "transport_rate_per_km": 15.0 # Base fuel/transport rate
    }
