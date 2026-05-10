from datetime import date, timedelta

from app.db.session import Base, SessionLocal, engine
from app.schemas.interaction import InteractionCreate
from app.services.interaction_service import create_interaction


DEMO_DATA = [
    {
        "hcp_name": "Dr. Ananya Rao",
        "specialty": "Cardiology",
        "organization": "Apollo Heart Institute",
        "interaction_type": "Clinic Visit",
        "interaction_date": date.today(),
        "products_discussed": ["Cardiostat XR"],
        "notes": "Dr. Rao was receptive and requested outcome data for high-risk patients. Follow up next week.",
        "ai_summary": "Positive cardiology discussion focused on Cardiostat XR outcomes data.",
        "sentiment": "Positive",
        "follow_up_required": True,
        "follow_up_date": date.today() + timedelta(days=7),
        "action_items": ["Share approved outcomes data.", "Schedule follow-up discussion."],
        "next_best_action": "Send clinical data and confirm a 15-minute follow-up slot.",
    },
    {
        "hcp_name": "Dr. Kabir Mehta",
        "specialty": "Endocrinology",
        "organization": "City Diabetes Centre",
        "interaction_type": "Conference Meeting",
        "interaction_date": date.today() - timedelta(days=2),
        "products_discussed": ["GlucoBalance"],
        "notes": "Asked about formulary access and patient affordability barriers.",
        "ai_summary": "Neutral discussion about GlucoBalance access and affordability.",
        "sentiment": "Neutral",
        "follow_up_required": True,
        "follow_up_date": date.today() + timedelta(days=5),
        "action_items": ["Provide access pathway information."],
        "next_best_action": "Share approved access resources and ask about patient segment priorities.",
    },
    {
        "hcp_name": "Dr. Meera Shah",
        "specialty": "Pulmonology",
        "organization": "Metro Respiratory Clinic",
        "interaction_type": "Virtual Call",
        "interaction_date": date.today() - timedelta(days=5),
        "products_discussed": ["Airovent"],
        "notes": "Currently satisfied with existing protocol but open to future safety updates.",
        "ai_summary": "Pulmonology call captured current protocol satisfaction and future update interest.",
        "sentiment": "Neutral",
        "follow_up_required": False,
        "follow_up_date": None,
        "action_items": ["Add to future safety update outreach list."],
        "next_best_action": "Monitor for new approved safety materials before re-engagement.",
    },
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for item in DEMO_DATA:
            create_interaction(db, InteractionCreate(**item))
    finally:
        db.close()


if __name__ == "__main__":
    seed()
    print("Seeded demo HCP interactions.")
