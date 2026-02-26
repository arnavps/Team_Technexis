import random
import math

def fuzz_gps(lat: float, lng: float, radius_meters: float = 500) -> tuple:
    """
    DPDP Act 2023: Data Masking.
    Adds a random offset to GPS coordinates within a given radius.
    This ensures the specific farm plot cannot be identified by third parties.
    """
    # Convert meters to degrees (approximation)
    # 1 degree lat is approx 111,000 meters
    # 1 degree lng is approx 111,000 * cos(lat) meters
    
    lat_offset = (random.uniform(-radius_meters, radius_meters)) / 111000
    lng_offset = (random.uniform(-radius_meters, radius_meters)) / (111000 * math.cos(math.radians(lat)))
    
    return (round(lat + lat_offset, 5), round(lng + lng_offset, 5))
