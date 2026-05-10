from __future__ import annotations

import json
import re
from datetime import date, timedelta
from typing import Any

from langchain_core.tools import tool


def _as_dict(payload: str | dict[str, Any]) -> dict[str, Any]:
    if isinstance(payload, dict):
        return payload
    try:
        return json.loads(payload)
    except json.JSONDecodeError:
        return {"notes": payload}


def _notes(payload: dict[str, Any]) -> str:
    return str(payload.get("notes") or payload.get("message") or "")


def _extract_hcp_name(notes: str) -> str | None:
    match = re.search(r"\bDr\.?\s+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){0,3})", notes)
    return f"Dr. {match.group(1).strip()}" if match else None


def _extract_specialty(notes: str) -> str | None:
    specialties = {
        "cardiologist": "Cardiology",
        "cardiology": "Cardiology",
        "endocrinologist": "Endocrinology",
        "endocrinology": "Endocrinology",
        "pulmonologist": "Pulmonology",
        "pulmonology": "Pulmonology",
        "oncologist": "Oncology",
        "oncology": "Oncology",
        "neurologist": "Neurology",
        "neurology": "Neurology",
        "dermatologist": "Dermatology",
        "dermatology": "Dermatology",
        "general physician": "General Medicine",
    }
    lowered = notes.lower()
    for keyword, specialty in specialties.items():
        if keyword in lowered:
            return specialty
    return None


def _extract_organization(notes: str) -> str | None:
    patterns = [
        r"\bat\s+([A-Z][A-Za-z&.\s]+?(?:Hospital|Hospitals|Clinic|Institute|Centre|Center|Medical Center)(?:,\s*[A-Z][A-Za-z\s]+)?)\b",
        r"\bfrom\s+([A-Z][A-Za-z&.\s]+?(?:Hospital|Hospitals|Clinic|Institute|Centre|Center|Medical Center)(?:,\s*[A-Z][A-Za-z\s]+)?)\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, notes)
        if match:
            return match.group(1).strip().rstrip(".,")
    return None


def _extract_interaction_type(notes: str) -> str | None:
    lowered = notes.lower()
    if "in-person" in lowered or "in person" in lowered or "clinic" in lowered:
        return "Clinic Visit"
    if "virtual" in lowered or "video" in lowered:
        return "Virtual Call"
    if "phone" in lowered:
        return "Phone Call"
    if "email" in lowered:
        return "Email"
    if "conference" in lowered:
        return "Conference Meeting"
    return None


def _extract_products(notes: str) -> list[str]:
    candidates = re.findall(r"\b[A-Z][A-Za-z0-9]*(?:\s+(?:Plus|XR|ER|SR|LA)|(?:Plus|XR|ER|SR|LA))(?:\s+[A-Z]{2,3})?\b", notes)
    seen: set[str] = set()
    products: list[str] = []
    for candidate in candidates:
        if candidate not in seen:
            seen.add(candidate)
            products.append(candidate)
    return products


def summarize_payload(payload: dict[str, Any]) -> dict[str, Any]:
    notes = _notes(payload)
    hcp = payload.get("hcp_name", "the HCP")
    products = payload.get("products_discussed") or []
    products_text = ", ".join(products) if isinstance(products, list) else str(products)
    summary = f"Discussion with {hcp}"
    if products_text:
        summary += f" covering {products_text}"
    if notes:
        summary += f". Key context: {notes[:220]}"
    return {"ai_summary": summary.strip()}


def sentiment_for_text(text: str) -> str:
    positive_terms = ["interested", "positive", "adopt", "agreed", "supportive", "requested", "receptive"]
    negative_terms = ["concern", "barrier", "negative", "not interested", "declined", "skeptical"]
    lowered = text.lower()
    if any(term in lowered for term in positive_terms):
        return "Positive"
    if any(term in lowered for term in negative_terms):
        return "Negative"
    return "Neutral"


def extract_actions(payload: dict[str, Any]) -> dict[str, Any]:
    notes = _notes(payload)
    action_items: list[str] = []
    lowered = notes.lower()
    if "sample" in lowered:
        action_items.append("Confirm sample request status and eligibility.")
    if "data" in lowered or "study" in lowered:
        action_items.append("Share relevant clinical data or study materials.")
    if "side effect" in lowered or "safety" in lowered or "elderly" in lowered:
        action_items.append("Share elderly-patient safety and side-effect data.")
    if "pricing" in lowered or "price" in lowered:
        action_items.append("Provide approved pricing details.")
    if "comparison" in lowered or "alternative" in lowered or "current preferred brand" in lowered:
        action_items.append("Prepare a short comparison sheet against leading alternatives.")
    if "follow" in lowered or "next" in lowered:
        action_items.append("Schedule the requested follow-up conversation.")
    action_items = list(dict.fromkeys(action_items))
    if not action_items:
        action_items.append("Review call notes and prepare a tailored follow-up.")
    return {"action_items": action_items}


def recommend_action(payload: dict[str, Any]) -> dict[str, Any]:
    sentiment = str(payload.get("sentiment") or sentiment_for_text(_notes(payload))).lower()
    action_items = payload.get("action_items") or extract_actions(payload)["action_items"]
    if sentiment == "positive":
        recommendation = "Prioritize a timely follow-up with approved resources and a clear next meeting objective."
    elif sentiment == "negative":
        recommendation = "Address stated concerns with evidence-based materials before proposing another product discussion."
    else:
        recommendation = "Send a concise recap and ask which topic would be most useful for the next touchpoint."
    return {"next_best_action": recommendation, "recommended_focus": action_items[0] if action_items else None}


def enriched_interaction(payload: dict[str, Any]) -> dict[str, Any]:
    today = date.today()
    notes = _notes(payload)
    data = {
        "hcp_name": payload.get("hcp_name") or _extract_hcp_name(notes) or "Unspecified HCP",
        "specialty": payload.get("specialty") or _extract_specialty(notes) or "General Medicine",
        "organization": payload.get("organization") or _extract_organization(notes) or "Unspecified Organization",
        "interaction_type": payload.get("interaction_type") or _extract_interaction_type(notes) or "Field Visit",
        "interaction_date": payload.get("interaction_date") or today.isoformat(),
        "products_discussed": payload.get("products_discussed") or _extract_products(notes),
        "notes": notes or "Interaction captured through AI chat logger.",
        "follow_up_required": bool(payload.get("follow_up_required", True)),
        "follow_up_date": payload.get("follow_up_date") or (today + timedelta(days=7)).isoformat(),
    }
    data.update(summarize_payload({**payload, **data}))
    data["sentiment"] = payload.get("sentiment") or sentiment_for_text(data["notes"])
    data.update(extract_actions({**payload, **data}))
    data.update(recommend_action({**payload, **data}))
    return data


@tool("log_interaction_tool")
def log_interaction_tool(payload: str) -> str:
    """Create a fully enriched HCP interaction draft from structured or conversational input."""
    return json.dumps(enriched_interaction(_as_dict(payload)))


@tool("edit_interaction_tool")
def edit_interaction_tool(payload: str) -> str:
    """Return validated edit fields for an existing HCP interaction."""
    data = _as_dict(payload)
    allowed = {
        "hcp_name",
        "specialty",
        "organization",
        "interaction_type",
        "interaction_date",
        "products_discussed",
        "notes",
        "ai_summary",
        "sentiment",
        "follow_up_required",
        "follow_up_date",
        "action_items",
        "next_best_action",
    }
    return json.dumps({key: value for key, value in data.items() if key in allowed})


@tool("summarize_interaction_tool")
def summarize_interaction_tool(payload: str) -> str:
    """Generate an AI-style summary for an HCP interaction."""
    return json.dumps(summarize_payload(_as_dict(payload)))


@tool("extract_action_items_tool")
def extract_action_items_tool(payload: str) -> str:
    """Extract compliant follow-up action items from interaction notes."""
    return json.dumps(extract_actions(_as_dict(payload)))


@tool("recommend_next_best_action_tool")
def recommend_next_best_action_tool(payload: str) -> str:
    """Recommend the next best action for the representative."""
    return json.dumps(recommend_action(_as_dict(payload)))


CRM_TOOLS = [
    log_interaction_tool,
    edit_interaction_tool,
    summarize_interaction_tool,
    extract_action_items_tool,
    recommend_next_best_action_tool,
]
