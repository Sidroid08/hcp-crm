from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.interaction import InteractionCreate, InteractionRead, InteractionStats, InteractionUpdate
from app.services import interaction_service

router = APIRouter(prefix="/interactions", tags=["Interactions"])


@router.get("", response_model=list[InteractionRead])
def list_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return interaction_service.list_interactions(db, skip=skip, limit=limit)


@router.get("/stats", response_model=InteractionStats)
def stats(db: Session = Depends(get_db)):
    return interaction_service.get_stats(db)


@router.get("/{interaction_id}", response_model=InteractionRead)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = interaction_service.get_interaction(db, interaction_id)
    if not interaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interaction not found")
    return interaction


@router.post("", response_model=InteractionRead, status_code=status.HTTP_201_CREATED)
def create_interaction(payload: InteractionCreate, db: Session = Depends(get_db)):
    return interaction_service.create_interaction(db, payload)


@router.put("/{interaction_id}", response_model=InteractionRead)
def update_interaction(interaction_id: int, payload: InteractionUpdate, db: Session = Depends(get_db)):
    interaction = interaction_service.get_interaction(db, interaction_id)
    if not interaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interaction not found")
    return interaction_service.update_interaction(db, interaction, payload)


@router.delete("/{interaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = interaction_service.get_interaction(db, interaction_id)
    if not interaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interaction not found")
    interaction_service.delete_interaction(db, interaction)
