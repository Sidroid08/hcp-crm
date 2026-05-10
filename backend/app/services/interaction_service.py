from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.models.interaction import Interaction
from app.schemas.interaction import InteractionCreate, InteractionStats, InteractionUpdate


def list_interactions(db: Session, skip: int = 0, limit: int = 100) -> list[Interaction]:
    stmt = select(Interaction).order_by(desc(Interaction.interaction_date), desc(Interaction.created_at)).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


def get_interaction(db: Session, interaction_id: int) -> Interaction | None:
    return db.get(Interaction, interaction_id)


def create_interaction(db: Session, payload: InteractionCreate) -> Interaction:
    interaction = Interaction(**payload.model_dump())
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction


def update_interaction(db: Session, interaction: Interaction, payload: InteractionUpdate) -> Interaction:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(interaction, field, value)
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction


def delete_interaction(db: Session, interaction: Interaction) -> None:
    db.delete(interaction)
    db.commit()


def get_stats(db: Session) -> InteractionStats:
    total = db.scalar(select(func.count()).select_from(Interaction)) or 0
    positive = (
        db.scalar(select(func.count()).select_from(Interaction).where(func.lower(Interaction.sentiment) == "positive")) or 0
    )
    pending = (
        db.scalar(select(func.count()).select_from(Interaction).where(Interaction.follow_up_required.is_(True))) or 0
    )
    last = db.scalars(select(Interaction).order_by(desc(Interaction.created_at)).limit(1)).first()
    return InteractionStats(
        total_interactions=total,
        positive_interactions=positive,
        pending_follow_ups=pending,
        last_logged_interaction=last,
    )
