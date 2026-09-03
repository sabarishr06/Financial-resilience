import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta
from fastapi import HTTPException
from services import earnings_service

def generate_income_forecast(days: int):
    """
    Generates a simple income forecast based on historical daily gross income.
    - Aggregates transactions by date.
    - Uses NumPy for simple linear regression if enough data points exist.
    - Applies a conservative trend to avoid wild predictions on small datasets.
    - Leverages existing earnings_service for true earnings ratio.
    """
    try:
        csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "transactions.csv")
        df = pd.read_csv(csv_path)
        df.columns = df.columns.str.strip()
        
        income_df = df[df['type'].str.lower() == 'income'].copy()
        
        if income_df.empty:
            raise HTTPException(status_code=400, detail="No income transactions found for forecasting.")
            
        income_df['date'] = pd.to_datetime(income_df['date'])
        daily_income = income_df.groupby('date')['amount'].sum().sort_index()
        
        historical_days = len(daily_income)
        historical_average_daily_income = daily_income.mean()
        
        dates = daily_income.index
        y = daily_income.values
        
        if historical_days >= 2:
            x = (dates - dates[0]).days.values
            if np.max(x) == 0:
                slope, intercept = 0, y[0]
            else:
                slope, intercept = np.polyfit(x, y, 1)
                
            dampened_slope = slope * 0.5
            
            if dampened_slope > 1.0:
                trend = "increasing"
            elif dampened_slope < -1.0:
                trend = "decreasing"
            else:
                trend = "stable"
                
            base_income = historical_average_daily_income
            std_dev = daily_income.std()
            cv = std_dev / historical_average_daily_income if historical_average_daily_income > 0 else 1.0
            confidence = min(80.0, max(20.0, 30 + (historical_days * 2) - (cv * 10)))
        else:
            base_income = y[0]
            dampened_slope = 0
            trend = "stable"
            std_dev = base_income * 0.2
            confidence = 20.0
        
        earnings_data = earnings_service.get_true_earnings()
        current_retention_rate = earnings_data.get('retention_rate', 0) / 100.0
        
        daily_forecast = []
        total_predicted_gross = 0.0
        last_date = dates[-1]
        
        for i in range(1, days + 1):
            future_date = last_date + timedelta(days=i)
            predicted_day_income = base_income + (dampened_slope * i)
            predicted_day_income = max(0.0, predicted_day_income)
            
            total_predicted_gross += predicted_day_income
            daily_forecast.append({
                "date": future_date.strftime("%Y-%m-%d"),
                "predicted_income": round(float(predicted_day_income), 2)
            })
            
        predicted_true_earnings = total_predicted_gross * current_retention_rate
        
        total_std_dev = std_dev * np.sqrt(days)
        predicted_min_income = max(0.0, total_predicted_gross - total_std_dev)
        predicted_max_income = total_predicted_gross + total_std_dev
        
        if trend == "increasing":
            message = "Your income shows a positive trend. This estimate projects modest continued growth."
        elif trend == "decreasing":
            message = "Your income shows a recent downward trend. This estimate reflects a conservative outlook."
        else:
            message = "Your income appears stable. This estimate projects average historical earnings."
            
        message += " (Note: This is an estimate based on historical transaction data, not a guarantee)."
        
        return {
            "forecast_days": days,
            "historical_days": historical_days,
            "historical_average_daily_income": round(float(historical_average_daily_income), 2),
            "predicted_gross_income": round(float(total_predicted_gross), 2),
            "predicted_true_earnings": round(float(predicted_true_earnings), 2),
            "predicted_min_income": round(float(predicted_min_income), 2),
            "predicted_max_income": round(float(predicted_max_income), 2),
            "confidence": round(float(confidence), 1),
            "trend": trend,
            "daily_forecast": daily_forecast,
            "message": message
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")
