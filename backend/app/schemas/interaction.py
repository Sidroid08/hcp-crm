from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class InteractionBase(BaseModel):
    hcp_name: str = Field(..., min_length=2, max_length=160)
    specialty: str = Field(..., min_length=2, max_length=120)
    organization: str = Field(..., min_length=2, max_length=180)
    interaction_type: str = Field(..., min_length=2, max_length=80)
    interaction_date: date
    products_discussed: list[str] = Field(default_factory=list)
    notes: str = Field(..., min_length=5)
    ai_summary: str | None = None
    sentiment: str | None = None
    follow_up_required: bool = False
    follow_up_date: date | None = None
    action_items: list[str] = Field(default_factory=list)
    next_best_action: str | None = None


class InteractionCreate(InteractionBase):
    pass


class InteractionUpdate(BaseModel):
    hcp_name: str | None = Field(default=None, min_length=2, max_length=160)
    specialty: str | None = Field(default=None, min_length=2, max_length=120)
    organization: str | None = Field(default=None, min_length=2, max_length=180)
    interaction_type: str | None = Field(default=None, min_length=2, max_length=80)
    interaction_date: date | None = None
    products_discussed: list[str] | None = None
    notes: str | None = Field(default=None, min_length=5)
    ai_summary: str | None = None
    sentiment: str | None = None
    follow_up_required: bool | None = None
    follow_up_date: date | None = None
    action_items: list[str] | None = None
    next_best_action: str | None = None


class InteractionRead(InteractionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InteractionStats(BaseModel):
    total_interactions: int
    positive_interactions: int
    pending_follow_ups: int
    last_logged_interaction: InteractionRead | None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=5)


class ChatResponse(BaseModel):
    reply: str
    draft: InteractionCreate | None = None


class ToolRequest(BaseModel):
    payload: dict


class ToolResponse(BaseModel):
    tool: str
    result: dict
