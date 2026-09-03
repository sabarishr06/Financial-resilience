from fastapi import FastAPI
from routes import earnings, resilience, emergency, forecast, simulator, ai

app = FastAPI(title="Financial Resilience API")

# Include routers
app.include_router(earnings.router)
app.include_router(resilience.router)
app.include_router(emergency.router)
app.include_router(forecast.router)
app.include_router(simulator.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "Financial Resilience API is running"}

@app.get("/health")
def read_health():
    return {"status": "healthy"}
