from datetime import datetime

from sqlalchemy import JSON, Boolean, Date, DateTime, Integer, String, Text, func
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Interaction(Base):
    __tablename__ = "interactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    hcp_name: Mapped[str] = mapped_column(String(160), index=True)
    specialty: Mapped[str] = mapped_column(String(120), index=True)
    organization: Mapped[str] = mapped_column(String(180), index=True)
    interaction_type: Mapped[str] = mapped_column(String(80), index=True)
    interaction_date: Mapped[datetime] = mapped_column(Date, index=True)
    products_discussed: Mapped[list[str]] = mapped_column(MutableList.as_mutable(JSON), default=list)
    notes: Mapped[str] = mapped_column(Text)
    ai_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    sentiment: Mapped[str | None] = mapped_column(String(40), nullable=True, index=True)
    follow_up_required: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    follow_up_date: Mapped[datetime | None] = mapped_column(Date, nullable=True)
    action_items: Mapped[list[str]] = mapped_column(MutableList.as_mutable(JSON), default=list)
    next_best_action: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
