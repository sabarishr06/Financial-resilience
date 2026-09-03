from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from services import simulator_service

router = APIRouter(prefix="/api/simulator", tags=["Simulator"])

class SimulatorRequest(BaseModel):
    income_change_percent: float = Field(0.0, ge=-100.0, le=100.0)
    additional_expense: float = Field(0.0, ge=0.0, le=1000000.0)
    days_unable_to_work: int = Field(0, ge=0, le=365)

@router.post("")
def run_simulator(request: SimulatorRequest):
    return simulator_service.run_financial_shock_scenario(
        income_change_percent=request.income_change_percent,
        additional_expense=request.additional_expense,
        days_unable_to_work=request.days_unable_to_work
    )
