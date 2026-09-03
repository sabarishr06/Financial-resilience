from fastapi import APIRouter
from services import earnings_service

router = APIRouter(prefix="/api/earnings", tags=["Earnings"])

@router.get("")
def get_earnings():
    return earnings_service.get_true_earnings()
