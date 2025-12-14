import datetime
from typing import List, Optional

from sqlmodel import Field, SQLModel

from .models import DayOfWeek


class ExerciseBase(SQLModel):
    # Esquema base de ejercicio (entrada/salida)
    name: str
    day: DayOfWeek
    series: int
    repetitions: int
    weight: Optional[float] = None
    notes: Optional[str] = None
    order: int = 0


class ExerciseCreate(ExerciseBase):
    pass


class ExerciseRead(ExerciseBase):
    # Respuesta con ids
    id: int
    routine_id: int

    class Config:
        from_attributes = True


class ExerciseUpdate(SQLModel):
    # Campos opcionales para actualizar ejercicios
    id: Optional[int] = None
    name: Optional[str] = None
    day: Optional[DayOfWeek] = None
    series: Optional[int] = None
    repetitions: Optional[int] = None
    weight: Optional[float] = None
    notes: Optional[str] = None
    order: Optional[int] = None


class RoutineBase(SQLModel):
    # Base de rutina
    name: str
    description: Optional[str] = None


class RoutineCreate(RoutineBase):
    # Alta de rutina con ejercicios anidados
    exercises: List[ExerciseCreate] = Field(default_factory=list)


class RoutineUpdate(SQLModel):
    # Update parcial de rutina y ejercicios
    name: Optional[str] = None
    description: Optional[str] = None
    exercises: Optional[List[ExerciseUpdate]] = None


class RoutineRead(RoutineBase):
    # Respuesta con ids, timestamp y ejercicios
    id: int
    created_at: datetime.datetime
    exercises: List[ExerciseRead] = Field(default_factory=list)

    class Config:
        from_attributes = True


class RoutineListResponse(SQLModel):
    # Respuesta paginada del listado
    items: List[RoutineRead]
    total: int
    page: int
    size: int

