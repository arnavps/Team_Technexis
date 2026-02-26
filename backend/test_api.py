import asyncio
import json
from integrations.mandi_api import fetch_mandi_prices

async def test():
    res = await fetch_mandi_prices("cotton", {"lat": 18, "lng": 73}, "en")
    print(json.dumps(res, indent=2))

if __name__ == "__main__":
    asyncio.run(test())
