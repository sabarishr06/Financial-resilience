import os
import json
import urllib.request
import urllib.error
from fastapi import HTTPException
from services import earnings_service, resilience_service, forecast_service

def get_fallback_response(question, context):
    resilience_score = context["resilience_score"]
    true_earnings = context["true_earnings"]
    warnings = context.get("warnings", [])
    
    if resilience_score < 30:
        base_statement = "Your financial resilience is currently at high risk."
    elif resilience_score < 50:
        base_statement = "Your financial resilience is vulnerable."
    elif resilience_score < 70:
        base_statement = "Your financial resilience is moderate."
    else:
        base_statement = "Your financial position is relatively resilient."
        
    key_points = [
        f"Your true earnings (after work expenses) are ₹{true_earnings}.",
        f"Your earnings retention rate is {context['retention_rate']}%."
    ]
    
    recommended_actions = []
    if warnings and context["warning_count"] > 0:
        highest_warning = warnings[0]
        for w in warnings:
            if w['severity'] == 'high':
                highest_warning = w
                break
                
        base_statement += f" However, there is a critical area needing attention: {highest_warning['title']}."
        key_points.append(f"Warning: {highest_warning['message']}")
        recommended_actions.append(highest_warning['suggestion'])
    else:
        base_statement += " You currently have no severe financial warnings."
        
    if context["forecast_confidence"] < 40:
        key_points.append("Your income forecast has low confidence due to limited or variable historical data.")
        recommended_actions.append("Try to track your income consistently to improve forecast accuracy.")
    else:
        key_points.append(f"Your income forecast shows a {context['forecast_trend']} trend.")
        
    if not recommended_actions:
        if resilience_score < 50:
            recommended_actions.append("Focus on reducing avoidable work expenses.")
            recommended_actions.append("Consider ways to diversify your income sources.")
        else:
            recommended_actions.append("Maintain your current positive financial habits.")
            recommended_actions.append("Prepare for unexpected disruptions by building a buffer.")
            
    q_lower = question.lower()
    if "forecast" in q_lower or "reliable" in q_lower:
        base_statement = f"Regarding your forecast: It shows a {context['forecast_trend']} trend with {context['forecast_confidence']}% confidence. Confidence depends on the stability and amount of your past data."
    elif "score" in q_lower or "why" in q_lower:
        base_statement = f"Your score is {resilience_score}. This is driven by your retention rate ({context['retention_rate']}%) and any active warnings."
    elif "first" in q_lower:
        base_statement = "The most critical action right now is addressing your highest severity warning."
        
    answer = f"{base_statement} Based on your data, your current true earnings are ₹{true_earnings}."

    return {
        "question": question,
        "financial_context": {
            "true_earnings": true_earnings,
            "retention_rate": context["retention_rate"],
            "resilience_score": resilience_score,
            "risk_status": context["risk_status"],
            "warning_count": context["warning_count"],
            "forecast_trend": context["forecast_trend"],
            "forecast_confidence": context["forecast_confidence"]
        },
        "answer": answer,
        "key_points": key_points,
        "recommended_actions": recommended_actions,
        "disclaimer": "This guidance is based on your transaction data and is not professional financial advice."
    }

def call_llm(question, context, api_key):
    system_prompt = f"""You are a financial guidance assistant for gig and informal workers.
Use ONLY the supplied financial context when discussing the user's calculated financial situation.
Do not invent income, expenses, scores, warnings, forecast numbers, savings, debt, or financial products.
Never claim certainty about the future. Explain financial concepts in simple language.
Prioritize the most important current warning first.
Give practical actions that are realistic for a gig/informal worker.
Do not recommend specific financial products, investments, loans, or insurance as if they are guaranteed solutions.
If the user asks something that cannot be answered from the available data, explicitly say that the available transaction data is insufficient.
Do not make medical, legal, or other professional claims.
Do not overwhelm the user with a long answer. Prefer 2-4 concrete actions.

Context:
{json.dumps(context)}

Respond EXACTLY in this JSON format:
{{
  "answer": "A concise, conversational response answering the user's question.",
  "key_points": ["Point 1", "Point 2"],
  "recommended_actions": ["Action 1", "Action 2"]
}}
"""
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question}
        ],
        "response_format": {"type": "json_object"}
    }
    
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(data).encode('utf-8'),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode('utf-8'))
            llm_response = json.loads(result['choices'][0]['message']['content'])
            return {
                "question": question,
                "financial_context": {
                    "true_earnings": context["true_earnings"],
                    "retention_rate": context["retention_rate"],
                    "resilience_score": context["resilience_score"],
                    "risk_status": context["risk_status"],
                    "warning_count": context["warning_count"],
                    "forecast_trend": context["forecast_trend"],
                    "forecast_confidence": context["forecast_confidence"]
                },
                "answer": llm_response.get("answer", "Here is your guidance."),
                "key_points": llm_response.get("key_points", []),
                "recommended_actions": llm_response.get("recommended_actions", []),
                "disclaimer": "This guidance is based on your transaction data and is not professional financial advice."
            }
    except Exception:
        return None

def generate_financial_guide(question: str):
    try:
        earnings_data = earnings_service.get_true_earnings()
        resilience_data = resilience_service.calculate_resilience_score()
        warning_data = resilience_service.generate_early_warnings()
        forecast_data = forecast_service.generate_income_forecast(7)
        
        score = resilience_data['score']
        if score >= 70:
            risk_status = "resilient"
        elif score >= 50:
            risk_status = "moderate"
        elif score >= 30:
            risk_status = "vulnerable"
        else:
            risk_status = "high_risk"
            
        context = {
            "true_earnings": earnings_data['true_earnings'],
            "retention_rate": earnings_data['retention_rate'],
            "resilience_score": resilience_data['score'],
            "risk_status": risk_status,
            "warning_count": warning_data['warning_count'],
            "warnings": warning_data['warnings'],
            "forecast_trend": forecast_data['trend'],
            "forecast_confidence": forecast_data['confidence']
        }
        
        api_key = os.environ.get("AI_API_KEY")
        
        if api_key:
            llm_response = call_llm(question, context, api_key)
            if llm_response:
                return llm_response
                
        return get_fallback_response(question, context)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating AI guide: {str(e)}")
