import json

from fastapi import APIRouter

from app.agents.crm_agent import run_crm_agent
from app.agents.tools import (
    extract_action_items_tool,
    log_interaction_tool,
    edit_interaction_tool,
    recommend_next_best_action_tool,
    summarize_interaction_tool,
)
from app.schemas.interaction import ChatRequest, ChatResponse, InteractionCreate, ToolRequest, ToolResponse

router = APIRouter(prefix="/ai", tags=["AI Workflow"])


def _invoke(tool_name: str, tool_fn, payload: dict) -> ToolResponse:
    result = json.loads(tool_fn.invoke(json.dumps(payload)))
    return ToolResponse(tool=tool_name, result=result)


@router.post("/chat", response_model=ChatResponse)
def chat_logger(payload: ChatRequest):
    result = run_crm_agent(payload.message)
    draft = InteractionCreate(**result["draft"]) if result.get("draft") else None
    return ChatResponse(reply=result["reply"], draft=draft)


@router.post("/tools/log-interaction", response_model=ToolResponse)
def test_log_interaction(payload: ToolRequest):
    return _invoke("log_interaction_tool", log_interaction_tool, payload.payload)


@router.post("/tools/edit-interaction", response_model=ToolResponse)
def test_edit_interaction(payload: ToolRequest):
    return _invoke("edit_interaction_tool", edit_interaction_tool, payload.payload)


@router.post("/tools/summarize-interaction", response_model=ToolResponse)
def test_summarize_interaction(payload: ToolRequest):
    return _invoke("summarize_interaction_tool", summarize_interaction_tool, payload.payload)


@router.post("/tools/extract-action-items", response_model=ToolResponse)
def test_extract_action_items(payload: ToolRequest):
    return _invoke("extract_action_items_tool", extract_action_items_tool, payload.payload)


@router.post("/tools/recommend-next-best-action", response_model=ToolResponse)
def test_recommend_next_best_action(payload: ToolRequest):
    return _invoke("recommend_next_best_action_tool", recommend_next_best_action_tool, payload.payload)
