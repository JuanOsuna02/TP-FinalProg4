from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_session
from ..models import Exercise, Routine
from ..schemas import ExerciseCreate, ExerciseRead, ExerciseUpdate

router = APIRouter(prefix="/api", tags=["Ejercicios"])


@router.post("/rutinas/{routine_id}/ejercicios", response_model=ExerciseRead, status_code=status.HTTP_201_CREATED)
def add_exercise(routine_id: int, payload: ExerciseCreate, session: Session = Depends(get_session)):
    # Agrega un ejercicio a una rutina existente
    routine = session.get(Routine, routine_id)
    if not routine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")

    exercise = Exercise(**payload.dict(), routine_id=routine_id)
    session.add(exercise)
    session.commit()
    session.refresh(exercise)
    return exercise


@router.put("/ejercicios/{exercise_id}", response_model=ExerciseRead)
def update_exercise(exercise_id: int, payload: ExerciseUpdate, session: Session = Depends(get_session)):
    # Actualiza campos enviados para un ejercicio puntual
    exercise = session.get(Exercise, exercise_id)
    if not exercise:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ejercicio no encontrado")

    for field in ["name", "day", "series", "repetitions", "weight", "notes", "order"]:
        value = getattr(payload, field)
        if value is not None:
            setattr(exercise, field, value)

    session.add(exercise)
    session.commit()
    session.refresh(exercise)
    return exercise


@router.delete("/ejercicios/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exercise(exercise_id: int, session: Session = Depends(get_session)):
    # Elimina un ejercicio por id
    exercise = session.get(Exercise, exercise_id)
    if not exercise:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ejercicio no encontrado")

    session.delete(exercise)
    session.commit()
    return None




