import asyncio
import json
from integrations.enam_client import enam_client

async def test():
    res = await enam_client.get_agm_gps_min_max_model_price()
    print(json.dumps(res, indent=2))

if __name__ == "__main__":
    asyncio.run(test())
