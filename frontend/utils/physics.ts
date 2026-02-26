/**
 * MittiMitra Edge Physics Engine
 * -----------------------------
 * Ported from backend/engine/decay_logic.py
 * 
 * Requirement: "The 'Decay Penalty' math runs locally on the phone's browser 
 * to save battery and work without signal."
 */

export const DECAY_RATES: Record<string, number> = {
    "Tomato": 0.005,      // 0.5% per hour
    "Onion": 0.001,       // 0.1% per hour
    "Cotton": 0.00001,    // Virtually zero loss over days
    "Wheat": 0.00002,     // Virtually zero loss over days
    "Rice": 0.00002,
    "Potato": 0.0005,
};

export const Q10 = 2.0;
export const T_BASE = 20.0;

/**
 * Calculates percentage of quality loss using Q10 coefficient.
 * @param cropType - e.g., "Tomato", "Cotton"
 * @param temp - Current temperature in Celsius
 * @param humidity - Relative humidity (0-100)
 * @param hoursPassed - Time since harvest / last check
 * @returns Quality loss as a fraction (0.0 to 1.0)
 */
export function calculateQualityLoss(
    cropType: string,
    temp: number,
    humidity: number,
    hoursPassed: number
): number {
    const normalizedCrop = cropType.charAt(0).toUpperCase() + cropType.slice(1).toLowerCase();
    const baseRate = DECAY_RATES[normalizedCrop] ?? 0.005;

    // Standard Q10 exponential decay: Rate doubles every 10C.
    let relativeRate = Math.pow(Q10, (temp - T_BASE) / 10.0);

    // High-temperature acceleration logic for perishables
    if (temp > 30 && baseRate > 0.0001) {
        const highTempMultiplier = 1.0 + (temp - 30) * 0.1;
        relativeRate *= highTempMultiplier;
    }

    const qualityLossPct = baseRate * relativeRate * hoursPassed;

    return Math.min(1.0, qualityLossPct);
}

/**
 * Net Realization Formula:
 * Net Profit = (Price * Yield) - (Transport + Spoilage)
 */
export function calculateNetRealizationTotal(
    price: number,
    yieldQtl: number,
    distanceKm: number,
    qualityLossPct: number
): number {
    const grossValue = price * yieldQtl;
    const transportCost = distanceKm * 15; // ₹15 per km standard logic
    const spoilageCost = grossValue * qualityLossPct;

    return grossValue - transportCost - spoilageCost;
}

/**
 * DPDP Act 2023: Data Masking.
 * Adds a random offset to GPS coordinates within a given radius.
 * This ensures the specific farm plot cannot be identified by third parties.
 */
export function fuzzLocation(lat: number, lng: number, radiusMeters: number = 500): { latitude: number, longitude: number } {
    // Convert meters to degrees (approximation)
    // 1 degree lat is approx 111,000 meters
    // 1 degree lng is approx 111,000 * cos(lat) meters

    const latOffset = (Math.random() * 2 - 1) * radiusMeters / 111000;
    const lngOffset = (Math.random() * 2 - 1) * radiusMeters / (111000 * Math.cos(lat * Math.PI / 180));

    return {
        latitude: Number((lat + latOffset).toFixed(5)),
        longitude: Number((lng + lngOffset).toFixed(5))
    };
}
