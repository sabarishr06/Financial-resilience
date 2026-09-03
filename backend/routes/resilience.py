from fastapi import APIRouter
from services import resilience_service

router = APIRouter(prefix="/api", tags=["Resilience"])

@router.get("/resilience")
def get_resilience():
    return resilience_service.calculate_resilience_score()

@router.get("/warnings")
def get_warnings():
    return resilience_service.generate_early_warnings()
