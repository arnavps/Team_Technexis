def calculate_spoilage_penalty(base_penalty_rate: float, temperature_c: float, high_humidity: bool) -> float:
    """
    Calculates the spoilage penalty multiplier based on environmental factors.
    Formula: Increase decay penalty by 10% for every degree above 30°C in high humidity.
    """
    if temperature_c <= 30 or not high_humidity:
        return base_penalty_rate
    
    degrees_above_30 = temperature_c - 30
    additional_penalty = degrees_above_30 * 0.10
    
    return base_penalty_rate * (1 + additional_penalty)
