from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

from engine.profit_calc import calculate_net_profit
from engine.shock_analyzer import detect_market_shock, detect_volume_shock
from integrations.mandi_api import fetch_mandi_prices
from integrations.weather_api import fetch_district_weather

app = FastAPI(title="AgriChain API", description="The Temporal Arbitrage Engine")

# Configure CORS
from fastapi.middleware.cors import CORSMiddleware
origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class HarvestRequest(BaseModel):
    crop: str
    location: dict
    yield_est_quintals: float
    base_spoilage_rate: float = 0.05 # 5% base spoilage

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "AgriChain backend is running."}

@app.post("/recommendation")
def get_harvest_recommendation(data: HarvestRequest):
    """
    Core Decision Engine Endpoint.
    1. Fetches weather and mandi info.
    2. Runs profit calc and decay logic.
    3. Runs shock analyzer for Black Swan events.
    """
    try:
        # 1. Fetch Integration Data
        weather_data = fetch_district_weather(data.location)
        mandi_data = fetch_mandi_prices(data.crop, data.location)
        
        # 2. Risk & Shock Analysis
        price_shock = detect_market_shock(mandi_data["current_price"], mandi_data["7_day_history"])
        volume_shock = detect_volume_shock(mandi_data["current_volume_quintals"], mandi_data["average_volume_quintals"])
        
        # Determine if there's any active shock
        active_shock = None
        if price_shock["is_shock"]:
            active_shock = price_shock
        elif volume_shock["is_shock"]:
            active_shock = volume_shock
        elif weather_data["rain_probability_percent"] > 80:
             active_shock = {
                "status": "WEATHER_SHOCK",
                "message": "Heavy rain > 80% probability in next 2 hours!",
                "is_shock": True,
                "pivot_advice": "EMERGENCY: Cover your produce immediately or delay transit!"
            }

        # 3. Profit Calculation
        temp_c = weather_data["temperature_c"]
        high_humidity = weather_data["humidity_percent"] > 70
        
        # Calculate logistics
        logistics_cost = mandi_data["distance_km"] * mandi_data["transport_rate_per_km"]
        
        # Calculate net profit
        net_profit = calculate_net_profit(
            price=mandi_data["current_price"],
            yield_est=data.yield_est_quintals,
            logistics_cost=logistics_cost,
            base_spoilage_rate=data.base_spoilage_rate,
            temp_c=temp_c,
            high_humidity=high_humidity
        )
        
        # 4. Synthesize Final Recommendation
        recommendation = {
            "status": "GREEN" if not active_shock else "RED",
            "net_realization_inr": round(net_profit, 2),
            "best_mandi": f"Local Mandi ({round(mandi_data['distance_km'], 1)} km)",
            "weather": weather_data,
            "mandi_stats": mandi_data,
            "shock_alert": active_shock
        }
        
        return recommendation

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
