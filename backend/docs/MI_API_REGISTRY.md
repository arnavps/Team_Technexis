# MI & AGMARKNET API Integration Registry

This file tracks the API keys and endpoints provided for the Multi-Index (MI) Web API integration. These will be used to power the real-time Mandi Discovery and Global Price Discovery features of MittiMitra.

## API Integration Map

| ID | API Name | Endpoint/Functionality | Key |
|---|---|---|---|
| 1 | State For MI | Fetch list of active states | `qkNR1lrrxxxxxxf2tHMU9wh` |
| 2 | District for MI | Fetch districts for a selected state | `qkNR1lrrxxxxxxHMU9wh` |
| 3 | APMC For MI | Fetch APMC/Mandi list for a district | `qkNR1lxxxxlvnDf2tHMU9wh` |
| 4 | Mandi Information | Detailed historical info for a Mandi | `qkNR1lrrxxxxnDf2tHMU9wh` |
| 11 | GPS Nearest APMC | Find closest Mandi to farmer's coordinates | `qkNR1lrrxxxnDf2tHMU9wh` |
| 12 | GPS MIN MAX Model | Fetch price volatility models for crops | `qkNR1lrxxxxxxvnDf2tHMU9wh` |
| 13 | GPS Price Model | Detailed GPS-based price forecasting | `qkNR1lrrtxxxxxxHMU9wh` |
| 17 | Bid States | Fetch states with active bidding | `qkNR1lrrxxxxvnDf2tHMU9wh` |
| 20 | All Bids | Fetch active farmer/trader bids | `qkNR1lrrxxxxvnDf2tHMU9wh` |

> [!IMPORTANT]
> Some keys appear to be truncated (`xxxxx`). Ensure these are verified before production implementation.

## Implementation Strategy

1. **Backend Integration**: Create a new wrapper `backend/core/mi_api.py` to handle requests to these endpoints.
2. **Real-time Discovery**: Port the `GPS Nearest APMC` logic to replace the current static Mandi selection in `dashboard/page.tsx`.
3. **Price Arbitrage**: Use the `MIN MAX Model` to improve the "Sell vs Wait" logic in the Agri-Vakeel AI.
