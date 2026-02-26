import os
import io
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Dict, Any, List
from groq import Groq
from dotenv import load_dotenv
from gtts import gTTS

load_dotenv()

router = APIRouter()

# Initialize Groq Client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY and GROQ_API_KEY != "gsk_placeholder_key_you_need_to_change_this" else None


class ChatRequest(BaseModel):
    farmer_query: str
    dashboard_context: Dict[str, Any]
    language: str = "Regional"

class TTSRequest(BaseModel):
    text: str
    language: str = "English"

def build_system_prompt(context: Dict[str, Any], language: str) -> str:
    """
    Injects the real-time dashboard data (prices, weather, shocks) into the AI prompt.
    """
    status = context.get("status", "UNKNOWN")
    best_mandi = context.get("best_mandi", "Unknown")
    total_profit = context.get("total_net_profit", 0)
    per_quintal = context.get("net_realization_inr_per_quintal", 0)
    yield_qtl = context.get("yield_quintals", 1) # Default to 1 to avoid div zero
    weather = context.get("weather", {})
    mandi = context.get("mandi_stats", {})
    shock = context.get("shock_alert", {})
    
    # Calculate totals for the prompt to match dashboard
    total_today = total_profit
    total_48h = context.get('profit_forecast_48h', 0) * yield_qtl
    total_diff = total_48h - total_today
    prompt = f"""You are the MittiMitra Agri-Vakeel, an expert, empathetic agricultural advisor for Indian farmers.
You MUST respond ONLY in the following language: {language}.
If the language is Hindi or Marathi or Telugu or Tamil or Gujarati or Punjabi:
1. You MUST use the native script of {language} (e.g. Devanagari, Telugu script, Tamil script, etc.).
2. DO NOT use Roman script (English letters) for words in the response.
3. You MUST write out all numbers in words in {language} (e.g., instead of '15000' write the words for fifteen thousand in {language}). This is critical for voice clarity.

If the language is Hindi, use simple, respectful, and grounding Hindi. 
Address the farmer as 'Ji Kisan Bhai' (जी किसान भाई).
Language specific Rule for Hindi:
- Use terms like 'Bech den' (बेच दें) or 'Vikri karein' (बिक्री करें) for Sell.
- Use 'Intezar karein' (इंतजार करें) or 'Thoda rukein' (थोड़ा रुकें) for Wait/Hold.

If the language is Marathi, use very simple, slow-paced Marathi that a farmer can easily understand.
Address the farmer as 'Namaskar Shetkari Mitra' (नमस्कार शेतकरी मित्र).

If the language is Telugu, address the farmer as 'Namaskaram Raithu Sodhara' in Telugu script.
If the language is Tamil, address the farmer as 'Vanakkam Vivasayi Nanbare' in Tamil script.
If the language is Gujarati, address the farmer as 'Namaskar Khedut Mitra' in Gujarati script.
If the language is Punjabi, address the farmer as 'Sat Sri Akal Kisan Veer' in Punjabi script.

Translate technical terms into locally understood farming analogies. For example, "Biological Clock" should be explained as "Crop Expiry / Fasal ka samay" or equivalent in {language}. Keep the analogy native and intuitive.

If the language is English:
- Use clear, professional, yet empathetic Indian English.
- Address the farmer as 'Farmer Friend' or 'Sir'.
- Keep sentences concise and focus on the profit impact.

Here is the CURRENT REAL-TIME DATA for the farmer:
- Overall Recommendation Status: {status} (GREEN=Sell, YELLOW=Hold, RED=Wait/Danger)
- Total Estimated Take-Home Profit (Today): ₹{total_today}
- Net Realization value: ₹{per_quintal} per quintal
- Best Market to sell: {best_mandi} (Current Price: ₹{mandi.get('current_price', 0)}/Qtl)
- Weather: {weather.get('temperature_c', 0)}°C, Rain Probability: {weather.get('rain_probability_percent', 0)}%
- Temporal Arbitrage Analysis (Risk vs Reward):
  * Total Profit Today: ₹{total_today}
  * Predicted Total Profit in 48h (after spoilage/rot): ₹{total_48h}
  * Net Change if you wait: ₹{total_diff}
{f"CRITICAL: The farmer has MANUALLY CALIBRATED the environmental data ({context.get('manual_override_count')} overrides). Trust the farmer's ground truth over the sensors. Acknowledge this in your opening." if context.get('is_manual_override') else ""}

"""
    if shock and shock.get("is_shock"):
        prompt += f"\nCRITICAL SHOCK ALERT ACTIVE: {shock.get('message')}. Pivot Advice: {shock.get('pivot_advice')}\n"

    prompt += """
YOUR TASK:
Explain the 'Sell vs Wait' recommendation to the farmer based ONLY on the data above.
Do not just repeat the numbers. Explain the TRADE-OFFS—specifically the balance between harvesting now to avoid spoilage versus waiting for a potential price peak.
Compare the Total Profit Today vs the Predicted Profit in 48 hours clearly.
The response should be concise enough for voice playback (around 4-5 sentences) but comprehensive enough to build institutional trust.
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
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.farmer_query or "Please explain my dashboard recommendation."}
            ],
            temperature=0.3, # Low temperature for factual consistency
            max_tokens=250, # Increased for complex multilingual sentences
        )
        
        reply = completion.choices[0].message.content
        return {"response": reply}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tts")
def text_to_speech(req: TTSRequest):
    """
    Sub-second endpoint to generate robust audio for all 7 Indic languages via gTTS.
    """
    try:
        lang_map = {
            "English": "en",
            "Hindi": "hi",
            "Marathi": "mr",
            "Telugu": "te",
            "Tamil": "ta",
            "Gujarati": "gu",
            "Punjabi": "pa"
        }
        
        target_lang = lang_map.get(req.language, "en")
        
        # Removed artificial slowdown for Marathi per farmer feedback
        tts = gTTS(text=req.text, lang=target_lang, slow=False)
        
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        
        return StreamingResponse(mp3_fp, media_type="audio/mpeg")
    
    except Exception as e:
        import traceback
        error_msg = f"TTS Error: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/tts")
def text_to_speech_stream(text: str = Query(...), language: str = Query("English")):
    """
    Sub-second GET endpoint for native HTML5 Audio streaming. 
    Bypasses the need for Blob downloading on the frontend.
    """
    try:
        lang_map = {
            "English": "en",
            "Hindi": "hi",
            "Marathi": "mr",
            "Telugu": "te",
            "Tamil": "ta",
            "Gujarati": "gu",
            "Punjabi": "pa"
        }
        
        target_lang = lang_map.get(language, "en")
        
        print(f"DEBUG: TTS Request - Lang: {language} ({target_lang}), Text Length: {len(text)}")
        if len(text) > 100:
            print(f"DEBUG: Text Snippet: {text[:100]}...")
        else:
            print(f"DEBUG: Text Content: {text}")

        tts = gTTS(text=text, lang=target_lang, slow=False)
        
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        audio_content = mp3_fp.getvalue()
        content_length = len(audio_content)
        
        # Stream the audio buffer directly to the browser
        return StreamingResponse(io.BytesIO(audio_content), media_type="audio/mpeg", headers={
            "Cache-Control": "public, max-age=31536000",
            "Content-Length": str(content_length),
            "Accept-Ranges": "bytes"
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
