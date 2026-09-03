# simulator_service.py
# Business logic for shock simulator will go here.

import pandas as pd
import os
from services import earnings_service, resilience_service

def run_financial_shock_scenario(income_change_percent: float, additional_expense: float, days_unable_to_work: int):
    # 1. CURRENT STATE
    earnings_data = earnings_service.get_true_earnings()
    current_gross = earnings_data['gross_income']
    current_expenses = earnings_data['work_expenses']
    current_true = earnings_data['true_earnings']
    
    resilience_data = resilience_service.calculate_resilience_score()
    current_resilience = resilience_data['score']
    
    # 2. INCOME SHOCK
    scenario_gross_income = current_gross * (1.0 + (income_change_percent / 100.0))
    scenario_gross_income = max(0.0, scenario_gross_income)
    
    # Load transactions for averages
    csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "transactions.csv")
    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip()
    
    income_df = df[df['type'].str.lower() == 'income']
    num_working_days = max(1, income_df['date'].nunique())
    
    # 3. DAYS UNABLE TO WORK
    average_daily_income = current_gross / num_working_days
    average_daily_work_expense = current_expenses / num_working_days
    
    lost_income_from_days = average_daily_income * days_unable_to_work
    avoided_work_expenses = average_daily_work_expense * days_unable_to_work
    
    scenario_gross_income -= lost_income_from_days
    scenario_gross_income = max(0.0, scenario_gross_income)
    
    # 4. EXPENSE SHOCK
    scenario_work_expenses = current_expenses - avoided_work_expenses
    scenario_work_expenses = max(0.0, scenario_work_expenses)
    
    total_scenario_expenses = scenario_work_expenses + additional_expense
    
    # 5. SCENARIO TRUE EARNINGS
    scenario_true_earnings = scenario_gross_income - total_scenario_expenses
    
    # 6. SCENARIO RESILIENCE SCORE
    if scenario_gross_income > 0:
        scenario_retention_rate = (scenario_true_earnings / scenario_gross_income) * 100.0
    else:
        scenario_retention_rate = 0.0
    scenario_retention_score = max(0.0, min(30.0, (scenario_retention_rate / 100.0) * 30.0))
    
    if scenario_gross_income > 0:
        scenario_expense_ratio = total_scenario_expenses / scenario_gross_income
    else:
        scenario_expense_ratio = 1.0
    scenario_expense_score = max(0.0, 20.0 - (scenario_expense_ratio * 20.0))
    
    diversification_score = resilience_data.get('income_diversification', 0.0)
    original_stability = resilience_data.get('income_stability', 0.0)
    
    income_loss_ratio = 0.0
    if current_gross > 0:
        income_loss_ratio = (current_gross - scenario_gross_income) / current_gross
    income_loss_ratio = max(0.0, min(1.0, income_loss_ratio))
    
    scenario_stability_score = original_stability * (1.0 - income_loss_ratio)
    scenario_stability_score = max(0.0, scenario_stability_score)
    
    total_scenario_score = scenario_stability_score + scenario_retention_score + scenario_expense_score + diversification_score
    total_scenario_score = max(0.0, min(100.0, total_scenario_score))
    
    # 7. DETERMINE STATUS
    if total_scenario_score >= 70:
        status = "resilient"
    elif total_scenario_score >= 50:
        status = "moderate"
    elif total_scenario_score >= 30:
        status = "vulnerable"
    else:
        status = "high_risk"
        
    income_difference = scenario_gross_income - current_gross
    true_earnings_difference = scenario_true_earnings - current_true
    score_difference = total_scenario_score - current_resilience
    
    message = "Simulated scenario executed successfully."
    if score_difference < -10:
        message = "This scenario creates a severe negative impact on your financial resilience."
    elif score_difference < 0:
        message = "This scenario mildly reduces your financial resilience."
    elif score_difference > 0:
        message = "This scenario improves your overall financial resilience."
    
    return {
        "scenario": {
            "income_change_percent": float(income_change_percent),
            "additional_expense": float(additional_expense),
            "days_unable_to_work": int(days_unable_to_work)
        },
        "current": {
            "gross_income": round(float(current_gross), 2),
            "work_expenses": round(float(current_expenses), 2),
            "true_earnings": round(float(current_true), 2),
            "resilience_score": round(float(current_resilience), 2)
        },
        "simulated": {
            "gross_income": round(float(scenario_gross_income), 2),
            "work_expenses": round(float(total_scenario_expenses), 2),
            "true_earnings": round(float(scenario_true_earnings), 2),
            "resilience_score": round(float(total_scenario_score), 2),
            "status": status
        },
        "impact": {
            "income_difference": round(float(income_difference), 2),
            "true_earnings_difference": round(float(true_earnings_difference), 2),
            "resilience_score_difference": round(float(score_difference), 2),
            "lost_income_from_days_unable_to_work": round(float(lost_income_from_days), 2),
            "additional_expense": round(float(additional_expense), 2)
        },
        "message": message
    }

