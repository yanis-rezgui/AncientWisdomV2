from fastapi import FastAPI

from app.routes.chat import router as chat_router

app = FastAPI(
    title="Hermes AI",
    description="The AI assistant of Ancient Wisdom",
    version="0.1.0",
)


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "ok",
        "service": "Hermes AI",
    }


app.include_router(
    chat_router,
    prefix="/api/v1",
)
