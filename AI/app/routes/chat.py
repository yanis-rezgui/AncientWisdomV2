from typing import Literal

from fastapi import APIRouter, HTTPException, Depends
from openai import APIError, RateLimitError
from pydantic import BaseModel, Field

from app.core.security import verify_internal_key

from app.services.llm import generate_response

router = APIRouter(
    prefix="/chat",
    tags=["Hermes Chat"],
    dependencies=[Depends(verify_internal_key)],
)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatMessage] = Field(
        default_factory=list,
        max_length=20,
    )


class ChatResponse(BaseModel):
    reply: str


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        history = [item.model_dump() for item in request.history]

        reply = await generate_response(
            message=request.message,
            history=history,
        )

        if not reply or not reply.strip():
            raise HTTPException(
                status_code=502,
                detail="The AI model returned an empty response.",
            )

        return ChatResponse(reply=reply.strip())

    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="The provider's rate limit has been reached.",
        )

    except APIError:
        raise HTTPException(
            status_code=502,
            detail="The AI provider is temporarily unavailable.",
        )
