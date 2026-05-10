from __future__ import annotations

import json
from typing import TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import END, StateGraph

from app.agents.tools import CRM_TOOLS, enriched_interaction
from app.core.config import get_settings


class CRMState(TypedDict, total=False):
    message: str
    reply: str
    draft: dict


SYSTEM_PROMPT = """You are an AI-first CRM workflow agent for life science field representatives.
Capture HCP interaction details, identify missing fields politely, and enrich the log with a summary,
sentiment, action items, and next best action. Keep outputs concise and compliant."""


def _fallback_response(message: str) -> CRMState:
    draft = enriched_interaction({"message": message, "notes": message})
    return {
        "message": message,
        "draft": draft,
        "reply": "I created an enriched interaction draft from the conversation. Review the fields, then save it.",
    }


def _build_llm():
    settings = get_settings()
    provider = settings.llm_provider.lower()

    if provider == "ollama":
        from langchain_ollama import ChatOllama

        return ChatOllama(
            base_url=settings.ollama_base_url,
            model=settings.ollama_model,
            temperature=0.2,
        )

    if not settings.groq_api_key or settings.groq_api_key == "your_groq_api_key_here":
        return None

    from langchain_groq import ChatGroq

    return ChatGroq(api_key=settings.groq_api_key, model=settings.groq_model, temperature=0.2)


def _agent_node(state: CRMState) -> CRMState:
    settings = get_settings()
    message = state["message"]

    try:
        llm = _build_llm()
        if llm is None:
            return _fallback_response(message)

        if settings.llm_provider.lower() == "ollama":
            response = llm.invoke([SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=message)])
            return {
                "message": message,
                "draft": enriched_interaction({"message": message, "notes": message}),
                "reply": response.content or "I prepared an enriched interaction draft. Review it before saving.",
            }

        llm_with_tools = llm.bind_tools(CRM_TOOLS)
        response = llm_with_tools.invoke([SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=message)])

        draft = enriched_interaction({"message": message, "notes": message})
        if getattr(response, "tool_calls", None):
            for call in response.tool_calls:
                if call["name"] == "log_interaction_tool":
                    call_args = call.get("args", {})
                    tool_payload = call_args.get("payload", call_args) if isinstance(call_args, dict) else call_args
                    result = CRM_TOOLS[0].invoke(tool_payload if isinstance(tool_payload, str) else json.dumps(tool_payload))
                    draft = json.loads(result)
                    break

        return {
            "message": message,
            "draft": draft,
            "reply": response.content or "I prepared an enriched interaction draft. Review it before saving.",
        }
    except Exception:
        return _fallback_response(message)


graph_builder = StateGraph(CRMState)
graph_builder.add_node("crm_agent", _agent_node)
graph_builder.set_entry_point("crm_agent")
graph_builder.add_edge("crm_agent", END)
crm_graph = graph_builder.compile()


def run_crm_agent(message: str) -> CRMState:
    return crm_graph.invoke({"message": message})
