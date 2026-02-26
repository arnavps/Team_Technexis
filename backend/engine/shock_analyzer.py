import statistics
from typing import List, Dict, Any

def detect_market_shock(current_price: float, price_history_7_days: List[float]) -> Dict[str, Any]:
    """
    Detects if the current price represents a high-variance 'Shock' using Z-score volatility.
    Formula: Trigger alert if CurrentPrice < (Mean_7day - 2σ)
    """
    if len(price_history_7_days) < 2:
        return {
            "status": "NORMAL",
            "message": "Insufficient data for shock analysis.",
            "is_shock": False
        }

    mean_price = statistics.mean(price_history_7_days)
    stdev_price = statistics.stdev(price_history_7_days)
    
    # Avoid division by zero if all prices are exactly the same
    if stdev_price == 0:
        return {
            "status": "NORMAL",
            "message": "Market is perfectly stable.",
            "is_shock": False
        }
        
    z_score = (current_price - mean_price) / stdev_price
    
    # A negative Z-score indicates a price drop. If it's less than -2, it's a shock (2 std devs below mean)
    is_shock = z_score < -2.0
    
    if is_shock:
        return {
            "status": "SHOCK_ALERT",
            "message": f"CRITICAL: Price crashed by {abs(z_score):.2f}σ below the 7-day average.",
            "is_shock": True,
            "pivot_advice": "EMERGENCY: Mandi prices just crashed. ABORT transit. Divert to Cold Storage B or Sell to Local Processor C immediately."
        }
    
    return {
        "status": "NORMAL",
        "message": "Prices are within normal volatility ranges.",
        "is_shock": False
    }

def detect_volume_shock(current_volume: float, average_volume: float) -> Dict[str, Any]:
    """
    Predicts a market glut (Black Swan) by analyzing volume spikes at neighboring mandis.
    Logic: If current volume > 2x average, predict price crash.
    """
    if current_volume > (2 * average_volume):
         return {
            "status": "GLUT_WARNING",
            "message": "High volume detected at neighboring mandis. Price crash imminent.",
            "is_shock": True,
            "pivot_advice": "Sell now or Wait 3 days. Market Glut detected."
        }
    
    return {
        "status": "NORMAL",
        "message": "Volume is normal.",
        "is_shock": False
    }
