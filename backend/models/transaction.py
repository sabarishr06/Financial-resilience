from pydantic import BaseModel
from datetime import date
from typing import Optional

class Transaction(BaseModel):
    date: str
    type: str  # e.g., 'income', 'expense'
    category: str
    amount: float
    description: Optional[str] = None
