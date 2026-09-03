import pandas as pd
import os
from services import earnings_service, resilience_service

def calculate_emergency_scenario(emergency_cost: float, days_unable_to_work: int):
    # Get current values
    earnings_data = earnings_service.get_true_earnings()
    current_true_earnings = earnings_data['true_earnings']
    gross_income = earnings_data['gross_income']
    work_expenses = earnings_data['work_expenses']
    
    resilience_data = resilience_service.calculate_resilience_score()
    current_resilience_score = resilience_data['score']
    
    # Load transactions for averages
    csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "transactions.csv")
    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip()
    
    income_df = df[df['type'].str.lower() == 'income']
    
    # Use the days represented in the income transaction history
    num_working_days = income_df['date'].nunique()
    num_working_days = max(1, num_working_days)
    
    average_daily_income = gross_income / num_working_days
    average_daily_work_expense = work_expenses / num_working_days
    
    estimated_lost_income = average_daily_income * days_unable_to_work
    estimated_avoided_work_expenses = average_daily_work_expense * days_unable_to_work
    
    net_work_income_impact = estimated_lost_income - estimated_avoided_work_expenses
    total_emergency_impact = emergency_cost + net_work_income_impact
    
    remaining_after_emergency = current_true_earnings - total_emergency_impact
    estimated_shortfall = max(0.0, -remaining_after_emergency)
    
    impact_ratio = total_emergency_impact / max(current_true_earnings, 1.0)
    scenario_score_reduction = min(current_resilience_score, impact_ratio * 40.0)
    simulated_resilience_score = max(0.0, current_resilience_score - scenario_score_reduction)
    
    if simulated_resilience_score >= 70:
        resilience_status = "resilient"
    elif simulated_resilience_score >= 50:
        resilience_status = "moderate"
    elif simulated_resilience_score >= 30:
        resilience_status = "vulnerable"
    else:
        resilience_status = "high_risk"
        
    if estimated_shortfall > 0:
        message = f"Under this scenario, the emergency could create an estimated shortfall of ₹{estimated_shortfall:.2f}."
    else:
        message = "This scenario does not create an estimated earnings shortfall, but it would still reduce your financial resilience."
        
    message += " This is an estimate based on your historical transaction data."
    
    return {
        "inputs": {
            "emergency_cost": round(float(emergency_cost), 2),
            "days_unable_to_work": int(days_unable_to_work)
        },
        "current_true_earnings": round(float(current_true_earnings), 2),
        "average_daily_income": round(float(average_daily_income), 2),
        "average_daily_work_expense": round(float(average_daily_work_expense), 2),
        "estimated_lost_income": round(float(estimated_lost_income), 2),
        "estimated_avoided_work_expenses": round(float(estimated_avoided_work_expenses), 2),
        "net_work_income_impact": round(float(net_work_income_impact), 2),
        "total_emergency_impact": round(float(total_emergency_impact), 2),
        "remaining_after_emergency": round(float(remaining_after_emergency), 2),
        "estimated_shortfall": round(float(estimated_shortfall), 2),
        "current_resilience_score": round(float(current_resilience_score), 2),
        "simulated_resilience_score": round(float(simulated_resilience_score), 2),
        "resilience_status": resilience_status,
        "message": message
    }
