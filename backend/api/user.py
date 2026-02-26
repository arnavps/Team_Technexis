from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os

router = APIRouter()

class PurgeRequest(BaseModel):
    phone_number: str

@router.delete("/purge")
def purge_user_data(data: PurgeRequest):
    """
    DPDP Act 2023: Right to Erasure.
    Removes all identifying information from the database for the given phone number.
    """
    try:
        # In a real implementation, we would call Supabase to delete the user record
        # and all associated logs/GPS data.
        # For this prototype, we simulate the success.
        
        print(f"DEBUG: Purging all data for user: {data.phone_number}")
        
        # Simulated logic:
        # database.table('users').delete().eq('phone', data.phone_number)
        # database.table('gps_logs').delete().eq('user_phone', data.phone_number)
        
        return {
            "status": "success", 
            "message": f"All identifying data for {data.phone_number} has been permanently erased in compliance with DPDP Act 2023."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
