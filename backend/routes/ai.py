from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from services import ai_service

router = APIRouter(prefix="/api/ai", tags=["AI Guide"])

class AIRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500, description="Question for the AI guide")

@router.post("/guide")
def get_ai_guide(request: AIRequest):
    return ai_service.generate_financial_guide(request.question)
