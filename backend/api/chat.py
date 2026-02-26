import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Initialize Groq Client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY and GROQ_API_KEY != "gsk_placeholder_key_you_need_to_change_this" else None


class ChatRequest(BaseModel):
    farmer_query: str
    dashboard_context: Dict[str, Any]
    language: str = "Regional"

def build_system_prompt(context: Dict[str, Any], language: str) -> str:
    """
    Injects the real-time dashboard data (prices, weather, shocks) into the AI prompt.
    """
    status = context.get("status", "UNKNOWN")
    best_mandi = context.get("best_mandi", "Unknown")
    profit = context.get("net_realization_inr", 0)
    weather = context.get("weather", {})
    mandi = context.get("mandi_stats", {})
    shock = context.get("shock_alert", {})
    
    prompt = f"""You are the MittiMitra Agri-Vakeel, an expert, empathetic agricultural advisor for Indian farmers.
You MUST respond in the following language: {language}.
If the language is Hindi, use conversational, respectful Hindi (like 'Ji Kisan bhai').

Here is the CURRENT REAL-TIME DATA for the farmer:
- Overall Recommendation Status: {status} (GREEN=Sell, YELLOW=Hold, RED=Wait/Danger)
- Estimated Net Profit: ₹{profit}
- Best Market to sell: {best_mandi} (Current Price: ₹{mandi.get('current_price', 0)}/Qtl)
- Weather: {weather.get('temperature_c', 0)}°C, Rain Probability: {weather.get('rain_probability_percent', 0)}%

"""
    if shock and shock.get("is_shock"):
        prompt += f"\nCRITICAL SHOCK ALERT ACTIVE: {shock.get('message')}. Pivot Advice: {shock.get('pivot_advice')}\n"

    prompt += """
YOUR TASK:
Explain the 'Sell vs Wait' recommendation to the farmer based ONLY on the data above.
Do not just repeat the numbers. Explain the TRADE-OFFS.
Example: 'Ji, although the local Mandi price is ₹20, waiting 2 days for the Latur market (₹25) is worth it because the rain risk is low and your transport cost is only ₹1.'
Keep the response UNDER 3 sentences and highly actionable. Be empathetic and build trust.
"""
    return prompt


@router.post("/explain")
def chat_explain(req: ChatRequest):
    """
    Sub-second inference endpoint utilizing Groq + Llama 3 70B for Explainable AI.
    """
    if not client:
        # Mock response if API key isn't provided (for local testing without keys)
        return {
            "response": f"[MOCK - {req.language}] Ji Kisan bhai. We see the price at {req.dashboard_context.get('best_mandi', 'market')} is good right now and weather is stable. You should harvest today to secure ₹{req.dashboard_context.get('net_realization_inr', 0)} profit."
        }

    try:
        system_prompt = build_system_prompt(req.dashboard_context, req.language)
        
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.farmer_query or "Please explain my dashboard recommendation."}
            ],
            temperature=0.3, # Low temperature for factual consistency
            max_tokens=150,
        )
        
        reply = completion.choices[0].message.content
        return {"response": reply}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
