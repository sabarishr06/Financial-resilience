from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from services import emergency_service

router = APIRouter(prefix="/api/emergency", tags=["Emergency"])

class EmergencyRequest(BaseModel):
    emergency_cost: float = Field(..., ge=0, description="Cost of the emergency")
    days_unable_to_work: int = Field(..., ge=0, le=365, description="Days unable to work")

@router.post("")
def calculate_emergency(request: EmergencyRequest):
    return emergency_service.calculate_emergency_scenario(
        emergency_cost=request.emergency_cost,
        days_unable_to_work=request.days_unable_to_work
    )
