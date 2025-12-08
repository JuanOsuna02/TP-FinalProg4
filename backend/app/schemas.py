import datetime
from typing import List, Optional

from sqlmodel import Field, SQLModel

from .models import DayOfWeek


class ExerciseBase(SQLModel):
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
    id: int
    routine_id: int

    class Config:
        from_attributes = True


class ExerciseUpdate(SQLModel):
    id: Optional[int] = None
    name: Optional[str] = None
    day: Optional[DayOfWeek] = None
    series: Optional[int] = None
    repetitions: Optional[int] = None
    weight: Optional[float] = None
    notes: Optional[str] = None
    order: Optional[int] = None


class RoutineBase(SQLModel):
    name: str
    description: Optional[str] = None


class RoutineCreate(RoutineBase):
    exercises: List[ExerciseCreate] = Field(default_factory=list)


class RoutineUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    exercises: Optional[List[ExerciseUpdate]] = None


class RoutineRead(RoutineBase):
    id: int
    created_at: datetime.datetime
    exercises: List[ExerciseRead] = Field(default_factory=list)

    class Config:
        from_attributes = True

