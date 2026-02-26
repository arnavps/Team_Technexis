from .decay_logic import calculate_spoilage_penalty

def calculate_net_profit(price: float, yield_est: float, logistics_cost: float, base_spoilage_rate: float, temp_c: float, high_humidity: bool) -> float:
    """
    Calculates the Net Realization (Profit) for a harvest.
    Formula: Net Profit = (Price * Yield) - (Logistics + SpoilagePenalty)
    """
    gross_revenue = price * yield_est
    
    # Calculate Spoilage Penalty applied to the gross revenue
    spoilage_multiplier = calculate_spoilage_penalty(base_spoilage_rate, temp_c, high_humidity)
    spoilage_penalty_value = gross_revenue * spoilage_multiplier
    
    net_profit = gross_revenue - (logistics_cost + spoilage_penalty_value)
    
    return net_profit
