"""initial schema

Revision ID: 20260510_0001
Revises:
Create Date: 2026-05-10
"""
from alembic import op
import sqlalchemy as sa

revision = "20260510_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "interactions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("hcp_name", sa.String(length=160), nullable=False),
        sa.Column("specialty", sa.String(length=120), nullable=False),
        sa.Column("organization", sa.String(length=180), nullable=False),
        sa.Column("interaction_type", sa.String(length=80), nullable=False),
        sa.Column("interaction_date", sa.Date(), nullable=False),
        sa.Column("products_discussed", sa.JSON(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=False),
        sa.Column("ai_summary", sa.Text(), nullable=True),
        sa.Column("sentiment", sa.String(length=40), nullable=True),
        sa.Column("follow_up_required", sa.Boolean(), nullable=False),
        sa.Column("follow_up_date", sa.Date(), nullable=True),
        sa.Column("action_items", sa.JSON(), nullable=False),
        sa.Column("next_best_action", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_interactions_hcp_name"), "interactions", ["hcp_name"], unique=False)
    op.create_index(op.f("ix_interactions_id"), "interactions", ["id"], unique=False)
    op.create_index(op.f("ix_interactions_interaction_date"), "interactions", ["interaction_date"], unique=False)
    op.create_index(op.f("ix_interactions_interaction_type"), "interactions", ["interaction_type"], unique=False)
    op.create_index(op.f("ix_interactions_organization"), "interactions", ["organization"], unique=False)
    op.create_index(op.f("ix_interactions_sentiment"), "interactions", ["sentiment"], unique=False)
    op.create_index(op.f("ix_interactions_specialty"), "interactions", ["specialty"], unique=False)
    op.create_index(op.f("ix_interactions_follow_up_required"), "interactions", ["follow_up_required"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_interactions_follow_up_required"), table_name="interactions")
    op.drop_index(op.f("ix_interactions_specialty"), table_name="interactions")
    op.drop_index(op.f("ix_interactions_sentiment"), table_name="interactions")
    op.drop_index(op.f("ix_interactions_organization"), table_name="interactions")
    op.drop_index(op.f("ix_interactions_interaction_type"), table_name="interactions")
    op.drop_index(op.f("ix_interactions_interaction_date"), table_name="interactions")
    op.drop_index(op.f("ix_interactions_id"), table_name="interactions")
    op.drop_index(op.f("ix_interactions_hcp_name"), table_name="interactions")
    op.drop_table("interactions")
