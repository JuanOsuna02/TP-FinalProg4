from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from ..database import get_session
from ..models import Exercise, Routine
from ..schemas import ExerciseCreate, ExerciseUpdate, RoutineCreate, RoutineRead, RoutineUpdate

router = APIRouter(prefix="/api/rutinas", tags=["Rutinas"])


@router.get("", response_model=List[RoutineRead])
def list_routines(session: Session = Depends(get_session)):
    statement = select(Routine).options(selectinload(Routine.exercises))
    return session.exec(statement).all()


@router.get("/buscar", response_model=List[RoutineRead])
def search_routines(nombre: str = Query(..., min_length=1), session: Session = Depends(get_session)):
    statement = (
        select(Routine)
        .where(func.lower(Routine.name).contains(nombre.lower()))
        .options(selectinload(Routine.exercises))
    )
    return session.exec(statement).all()


@router.get("/{routine_id}", response_model=RoutineRead)
def get_routine(routine_id: int, session: Session = Depends(get_session)):
    statement = select(Routine).where(Routine.id == routine_id).options(selectinload(Routine.exercises))
    routine = session.exec(statement).one_or_none()
    if not routine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")
    return routine


@router.post("", response_model=RoutineRead, status_code=status.HTTP_201_CREATED)
def create_routine(payload: RoutineCreate, session: Session = Depends(get_session)):
    existing = session.exec(
        select(Routine).where(func.lower(Routine.name) == payload.name.lower())
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de rutina ya existe")

    routine = Routine(name=payload.name, description=payload.description)
    for exercise in payload.exercises:
        routine.exercises.append(Exercise(**exercise.dict()))

    session.add(routine)
    session.commit()
    session.refresh(routine)
    return routine


@router.put("/{routine_id}", response_model=RoutineRead)
def update_routine(routine_id: int, payload: RoutineUpdate, session: Session = Depends(get_session)):
    statement = select(Routine).where(Routine.id == routine_id).options(selectinload(Routine.exercises))
    routine = session.exec(statement).one_or_none()
    if not routine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")

    if payload.name:
        name_taken = session.exec(
            select(Routine).where(func.lower(Routine.name) == payload.name.lower(), Routine.id != routine_id)
        ).first()
        if name_taken:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de rutina ya existe")
        routine.name = payload.name

    if payload.description is not None:
        routine.description = payload.description

    if payload.exercises is not None:
        existing_by_id = {exercise.id: exercise for exercise in routine.exercises if exercise.id is not None}
        seen_ids = set()

        for incoming in payload.exercises:
            if incoming.id:
                db_exercise = existing_by_id.get(incoming.id)
                if not db_exercise:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Ejercicio con id {incoming.id} no existe en esta rutina",
                    )
                seen_ids.add(db_exercise.id)
                for field in ["name", "day", "series", "repetitions", "weight", "notes", "order"]:
                    value = getattr(incoming, field)
                    if value is not None:
                        setattr(db_exercise, field, value)
            else:
                data = incoming.dict(exclude_unset=True)
                routine.exercises.append(Exercise(**data))

        for exercise in list(routine.exercises):
            if exercise.id and exercise.id not in seen_ids:
                routine.exercises.remove(exercise)

    session.add(routine)
    session.commit()
    session.refresh(routine)
    return routine


@router.delete("/{routine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_routine(routine_id: int, session: Session = Depends(get_session)):
    routine = session.get(Routine, routine_id)
    if not routine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")

    session.delete(routine)
    session.commit()
    return None



