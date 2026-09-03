import pandas as pd
import os
from fastapi import HTTPException

def get_true_earnings():
    try:
        # Load the transaction CSV
        csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "transactions.csv")
        df = pd.read_csv(csv_path)

        # Ensure column names don't have trailing spaces
        df.columns = df.columns.str.strip()

        # Calculate total gross income
        income_df = df[df['type'].str.lower() == 'income']
        gross_income = income_df['amount'].sum()

        # Calculate total work-related expenses
        # In our dataset: fuel, food, maintenance, phone are all expenses.
        expense_df = df[df['type'].str.lower() == 'expense']
        work_expenses = expense_df['amount'].sum()

        # Calculate true earnings
        true_earnings = gross_income - work_expenses

        # Calculate retention rate
        if gross_income > 0:
            retention_rate = (true_earnings / gross_income) * 100
        else:
            retention_rate = 0.0

        return {
            "gross_income": round(float(gross_income), 2),
            "work_expenses": round(float(work_expenses), 2),
            "true_earnings": round(float(true_earnings), 2),
            "retention_rate": round(float(retention_rate), 2)
        }
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Transaction data file not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating earnings: {str(e)}")
