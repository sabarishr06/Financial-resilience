import pandas as pd
import os
from fastapi import HTTPException
from services import earnings_service

def calculate_resilience_score():
    try:
        # Load transaction CSV
        csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "transactions.csv")
        df = pd.read_csv(csv_path)
        df.columns = df.columns.str.strip()
        
        # Get earnings data
        earnings_data = earnings_service.get_true_earnings()
        gross_income = earnings_data['gross_income']
        
        if gross_income <= 0:
            return {
                "score": 0.0,
                "income_stability": 0.0,
                "earnings_retention": 0.0,
                "expense_health": 0.0,
                "income_diversification": 0.0
            }
            
        income_df = df[df['type'].str.lower() == 'income']
        
        # 1. Income Stability (30 points)
        daily_income = income_df.groupby('date')['amount'].sum()
        if len(daily_income) > 1:
            mean_inc = daily_income.mean()
            std_inc = daily_income.std()
            cv = std_inc / mean_inc if mean_inc > 0 else 1.0
            stability_score = max(0.0, 30.0 - (cv * 30.0))
        else:
            stability_score = 15.0
            
        # 2. Earnings Retention (30 points)
        retention_rate = earnings_data['retention_rate']
        retention_score = max(0.0, min(30.0, (retention_rate / 100.0) * 30.0))
        
        # 3. Expense Health (20 points)
        work_expenses = earnings_data['work_expenses']
        expense_ratio = work_expenses / gross_income
        expense_score = max(0.0, 20.0 - (expense_ratio * 20.0))
        
        # 4. Income Diversification (20 points)
        unique_categories = income_df['category'].nunique()
        if unique_categories == 1:
            diversification_score = 10.0
        elif unique_categories == 2:
            diversification_score = 15.0
        elif unique_categories >= 3:
            diversification_score = 20.0
        else:
            diversification_score = 0.0
            
        # Total Score
        total_score = stability_score + retention_score + expense_score + diversification_score
        total_score = max(0.0, min(100.0, total_score))
        
        return {
            "score": round(float(total_score), 2),
            "income_stability": round(float(stability_score), 2),
            "earnings_retention": round(float(retention_score), 2),
            "expense_health": round(float(expense_score), 2),
            "income_diversification": round(float(diversification_score), 2)
        }
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Transaction data file not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating resilience: {str(e)}")

def generate_early_warnings():
    try:
        csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "transactions.csv")
        df = pd.read_csv(csv_path)
        df.columns = df.columns.str.strip()
        
        earnings_data = earnings_service.get_true_earnings()
        gross_income = earnings_data['gross_income']
        
        if gross_income <= 0:
            return {"status": "healthy", "warning_count": 0, "warnings": []}
            
        warnings = []
        
        # 1. Low Earnings Retention
        retention = earnings_data['retention_rate']
        if retention < 50:
            warnings.append({
                "type": "low_retention",
                "severity": "high",
                "title": "Low earnings retention",
                "message": f"A large portion of your gross income is being consumed by work-related expenses. Your retention rate is {retention:.1f}%.",
                "suggestion": "Review your largest work expenses and identify costs that could be reduced.",
                "metric": float(retention)
            })
        elif retention < 70:
            warnings.append({
                "type": "low_retention",
                "severity": "medium",
                "title": "Low earnings retention",
                "message": f"A notable portion of your gross income goes to expenses. Your retention rate is {retention:.1f}%.",
                "suggestion": "Review your largest work expenses and identify costs that could be reduced.",
                "metric": float(retention)
            })
            
        # 2. High Work Expense Burden
        work_expenses = earnings_data['work_expenses']
        expense_ratio = (work_expenses / gross_income) * 100
        if expense_ratio > 50:
            warnings.append({
                "type": "expense_burden",
                "severity": "high",
                "title": "High work expense burden",
                "message": f"Your work-related expenses are taking up a significant share ({expense_ratio:.1f}%) of your gross income.",
                "suggestion": "Review fuel, maintenance, phone, and other work costs.",
                "metric": float(expense_ratio)
            })
        elif expense_ratio > 30:
            warnings.append({
                "type": "expense_burden",
                "severity": "medium",
                "title": "High work expense burden",
                "message": f"Your work-related expenses are taking up {expense_ratio:.1f}% of your gross income.",
                "suggestion": "Review fuel, maintenance, phone, and other work costs.",
                "metric": float(expense_ratio)
            })
            
        # 3. Income Instability
        income_df = df[df['type'].str.lower() == 'income']
        daily_income = income_df.groupby('date')['amount'].sum()
        if len(daily_income) > 1:
            mean_inc = daily_income.mean()
            std_inc = daily_income.std()
            cv = std_inc / mean_inc if mean_inc > 0 else 0
            if cv > 0.60:
                warnings.append({
                    "type": "income_instability",
                    "severity": "high",
                    "title": "Income instability",
                    "message": f"Your income varies noticeably across working days.",
                    "suggestion": "Consider maintaining a buffer during stronger earning days to handle lower-income days.",
                    "metric": round(float(cv), 4)
                })
            elif cv > 0.30:
                warnings.append({
                    "type": "income_instability",
                    "severity": "medium",
                    "title": "Income instability",
                    "message": f"Your income has some variation across working days.",
                    "suggestion": "Consider maintaining a buffer during stronger earning days to handle lower-income days.",
                    "metric": round(float(cv), 4)
                })
                
        # 4. Limited Income Diversification
        unique_categories = income_df['category'].nunique()
        if unique_categories == 1:
            warnings.append({
                "type": "limited_diversification",
                "severity": "high",
                "title": "Limited income diversification",
                "message": "Most of your income currently comes from a small number of income sources.",
                "suggestion": "Consider developing an additional income source when possible.",
                "metric": int(unique_categories)
            })
        elif unique_categories == 2:
            warnings.append({
                "type": "limited_diversification",
                "severity": "medium",
                "title": "Limited income diversification",
                "message": "Most of your income currently comes from a small number of income sources.",
                "suggestion": "Consider developing an additional income source when possible.",
                "metric": int(unique_categories)
            })
            
        # Overall Status
        if len(warnings) == 0:
            status = "healthy"
        elif any(w['severity'] == 'high' for w in warnings):
            status = "at_risk"
        else:
            status = "attention"
            
        return {
            "status": status,
            "warning_count": len(warnings),
            "warnings": warnings
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating warnings: {str(e)}")
