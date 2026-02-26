import math

def calculate_quality_loss(crop_type: str, temp: float, humidity: float, hours_passed: float) -> float:
    """
    MittiMitra Optimization Formula: Decay Function.
    Calculates percentage of quality loss using Q10 coefficient.
    
    Q10 Calculation: Rate doubles every 10C.
    Formula: R2 = R1 * Q10^((T2-T1)/10)
    Base condition: T1 = 20C, R1 = 0.5% loss per hour (baseline).
    """
    Q10 = 2.0
    T_BASE = 20.0
    BASE_RATE = 0.005 # 0.5% per hour
    
    # Standard Q10 exponential decay
    relative_rate = math.pow(Q10, (temp - T_BASE) / 10.0)
    
    # High-temperature acceleration logic
    # If temp > 30C, accelerate decay rate by 10% for every degree.
    if temp > 30:
        high_temp_multiplier = 1.0 + ((temp - 30) * 0.10)
        relative_rate *= high_temp_multiplier
        
    quality_loss_pct = BASE_RATE * relative_rate * hours_passed
    
    # Cap loss at 1.0 (100%)
    return min(1.0, quality_loss_pct)
