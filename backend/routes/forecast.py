from fastapi import APIRouter, Query
from services import forecast_service

router = APIRouter(prefix="/api/forecast", tags=["Forecast"])

@router.get("")
def get_forecast(days: int = Query(7, ge=1, le=90)):
    return forecast_service.generate_income_forecast(days)
