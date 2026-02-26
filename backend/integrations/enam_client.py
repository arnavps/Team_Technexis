import os
import httpx
import logging
import asyncio
from typing import Dict, Any, List, Optional
from cachetools import TTLCache, cached

# Configure local logging
logger = logging.getLogger(__name__)

# Cache configurations
# - Long TTL for structural data (States, Districts, APMCs, Commodities) -> 24 hours
# - Short TTL for live prices/bids -> 15 minutes
LONG_CACHE = TTLCache(maxsize=1000, ttl=86400)
SHORT_CACHE = TTLCache(maxsize=5000, ttl=900)

class EnamClient:
    """
    HTTP Client to interface with the 21 UMANG e-NAM (National Agriculture Market) APIs.
    Implements strict in-memory TTLCache to protect against rate-limiting and handle frequent government API downtime.
    """
    BASE_URL = "https://umang.gov.in/apisetu/dept/enamapi/ws1"
    
    # Optional: Load token from environment or fallback to user's provided token pattern
    DEFAULT_TOKEN = os.getenv("ENAM_API_TOKEN", "qkNR1lrrxxxxxxf2tHMU9wh")

    def __init__(self):
        # We use a shared specific async client if needed, or stick to httpx instance usage.
        self.timeout = httpx.Timeout(10.0, connect=5.0)

    async def _fetch(self, endpoint: str, token: str) -> Dict[str, Any]:
        url = f"{self.BASE_URL}/{endpoint}/{token}"
        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
                # Debug logging
                # logger.info(f"e-NAM API Success: {endpoint}")
                return data
        except httpx.HTTPStatusError as e:
            logger.error(f"e-NAM API Error [{e.response.status_code}] on {endpoint}")
            return {"error": str(e), "status_code": e.response.status_code}
        except Exception as e:
            logger.error(f"e-NAM API Connection Exception on {endpoint}: {str(e)}")
            return {"error": str(e)}

    # ------------------------------------------------------------------------
    # 1. STRUCTURAL APIs (Long Cache - 24 Hours)
    # ------------------------------------------------------------------------
    
    @cached(cache=LONG_CACHE)
    async def get_states_new(self) -> Dict[str, Any]:
        # 5. States New Web API
        return await self._fetch("getStatesNew", self.DEFAULT_TOKEN)

    @cached(cache=LONG_CACHE)
    async def get_district_new(self) -> Dict[str, Any]:
        # 6. District New Web API
        # The user provided a slightly different token for district, handling parameter gracefully
        token = os.getenv("ENAM_DISTRICT_TOKEN", "qkNR1lrxxxDf2tHMU9wh")
        return await self._fetch("getDistrictNew", token)

    @cached(cache=LONG_CACHE)
    async def get_apmc_new(self) -> Dict[str, Any]:
        # 7. APMC New Web API 
        token = os.getenv("ENAM_APMC_TOKEN", "qkNR1lrrtAxxxixxf2tHMU9wh")
        return await self._fetch("getApmcNew", token)

    @cached(cache=LONG_CACHE)
    async def get_products_new(self) -> Dict[str, Any]:
        # 8. Products New Web API
        token = os.getenv("ENAM_PRODUCTS_TOKEN", "qkNR1lrrtAxxxxvnDf2tHMU9wh")
        return await self._fetch("getProductsNew", token)

    @cached(cache=LONG_CACHE)
    async def get_commodity_grid_new(self) -> Dict[str, Any]:
        # 11. Commodity Grid New Web API
        token = os.getenv("ENAM_COMMODITY_GRID_TOKEN", "qkNR1lrrtxxxxDf2tHMU9wh")
        return await self._fetch("getCommodityGridNew", token)

    # ------------------------------------------------------------------------
    # 2. LIVE PRICING & MARKET APIs (Short Cache - 15 Mins)
    # ------------------------------------------------------------------------

    @cached(cache=SHORT_CACHE)
    async def get_mandi_info(self) -> Dict[str, Any]:
        # 4. Mandi Information Web API
        token = os.getenv("ENAM_MANDI_INFO_TOKEN", "qkNR1lrrxxxxnDf2tHMU9wh")
        return await self._fetch("getMandiInfoForMI", token)

    @cached(cache=SHORT_CACHE)
    async def get_gps_nearest_apmc(self) -> Dict[str, Any]:
        # 12. GPS Nearest APMC Web API
        token = os.getenv("ENAM_GPS_APMC_TOKEN", "qkNR1lrrxxxnDf2tHMU9wh")
        return await self._fetch("getGpsNearestApmc", token)

    @cached(cache=SHORT_CACHE)
    async def get_agm_gps_min_max_model_price(self) -> Dict[str, Any]:
        # 17. AgmGps Min Max Model Price Web API
        # This is strictly the most important endpoint for our Crop Shock Engine
        token = os.getenv("ENAM_MIN_MAX_PRICE_TOKEN", "qkNR1lrrxxxxvnDf2tHMU9wh")
        return await self._fetch("getAgmGpsMinMaxModelPrice", token)

    # ------------------------------------------------------------------------
    # 3. LIVE BID STREAMING (Short Cache - 15 Mins)
    # ------------------------------------------------------------------------

    @cached(cache=SHORT_CACHE)
    async def get_all_bids(self) -> Dict[str, Any]:
        # 21. All Bids Web API
        token = os.getenv("ENAM_ALL_BIDS_TOKEN", "qkNR1lrrxxxxvnDf2tHMU9wh")
        return await self._fetch("getAllBids", token)

    @cached(cache=SHORT_CACHE)
    async def get_bid_apmc(self) -> Dict[str, Any]:
        # 19. Bid APMC Web API
        token = os.getenv("ENAM_BID_APMC_TOKEN", "qkNR1lrrxxxxnDf2tHMU9wh")
        return await self._fetch("getBidApmc", token)

# Singleton Instance
enam_client = EnamClient()
