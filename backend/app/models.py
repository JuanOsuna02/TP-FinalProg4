import datetime
import enum
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class DayOfWeek(str, enum.Enum):
    lunes = "Lunes"
    martes = "Martes"
    miercoles = "Miercoles"
    jueves = "Jueves"
    viernes = "Viernes"
    sabado = "Sabado"
    domingo = "Domingo"


class ExerciseBase(SQLModel):
    name: str
    day: DayOfWeek
    series: int = Field(gt=0)
    repetitions: int = Field(gt=0)
    weight: Optional[float] = Field(default=None, gt=0)
    notes: Optional[str] = None
    order: int = Field(default=0, ge=0)


class Exercise(ExerciseBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    routine_id: Optional[int] = Field(default=None, foreign_key="routine.id")
    routine: Optional["Routine"] = Relationship(back_populates="exercises")


class RoutineBase(SQLModel):
    name: str = Field(index=True)
    description: Optional[str] = None


class Routine(RoutineBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    exercises: List[Exercise] = Relationship(
        back_populates="routine",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )

