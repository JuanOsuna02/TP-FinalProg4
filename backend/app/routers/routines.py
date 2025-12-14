import csv
import io
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from ..database import get_session
from ..models import DayOfWeek, Exercise, Routine
from ..schemas import ExerciseCreate, ExerciseUpdate, RoutineCreate, RoutineListResponse, RoutineRead, RoutineUpdate

router = APIRouter(prefix="/api/rutinas", tags=["Rutinas"])


@router.get("", response_model=RoutineListResponse)
def list_routines(
    nombre: Optional[str] = Query(None),
    dia: Optional[DayOfWeek] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(6, ge=1, le=50),
    session: Session = Depends(get_session),
):
    # Listado con filtros, carga ejercicios y respeta paginación server-side
    base_query = select(Routine)
    if nombre:
        base_query = base_query.where(func.lower(Routine.name).contains(nombre.lower()))
    if dia:
        base_query = base_query.where(
            Routine.id.in_(
                select(Exercise.routine_id).where(Exercise.day == dia)
            )
        )

    # conteo separado para evitar efectos de loaders/offset
    count_query = select(func.count()).select_from(base_query.subquery())
    total = session.exec(count_query).one()

    items_stmt = (
        base_query.options(selectinload(Routine.exercises))
        .offset((page - 1) * size)
        .limit(size)
    )
    items = session.exec(items_stmt).all()
    return RoutineListResponse(items=items, total=total, page=page, size=size)


@router.get("/buscar", response_model=List[RoutineRead])
def search_routines(nombre: str = Query(..., min_length=1), dia: Optional[DayOfWeek] = Query(None), session: Session = Depends(get_session)):
    # Búsqueda por nombre (case-insensitive) y día
    statement = (
        select(Routine)
        .where(func.lower(Routine.name).contains(nombre.lower()))
        .options(selectinload(Routine.exercises))
    )
    if dia:
        statement = statement.where(
            Routine.id.in_(
                select(Exercise.routine_id).where(Exercise.day == dia)
            )
        )
    return session.exec(statement).all()


@router.get("/stats")
def routines_stats(session: Session = Depends(get_session)):
    # Estadísticas simples en memoria (totales, promedios, top, por día)
    routines = session.exec(select(Routine).options(selectinload(Routine.exercises))).all()
    total_routines = len(routines)
    total_exercises = sum(len(r.exercises) for r in routines)
    avg_exercises = total_exercises / total_routines if total_routines else 0

    top_routines = sorted(
        [{"id": r.id, "name": r.name, "exercise_count": len(r.exercises)} for r in routines],
        key=lambda x: x["exercise_count"],
        reverse=True,
    )[:3]

    day_counts = {d.value: 0 for d in DayOfWeek}
    for routine in routines:
        for ex in routine.exercises:
            day_counts[ex.day.value] = day_counts.get(ex.day.value, 0) + 1

    return {
        "total_routines": total_routines,
        "total_exercises": total_exercises,
        "avg_exercises_per_routine": avg_exercises,
        "top_routines_by_exercises": top_routines,
        "exercises_per_day": day_counts,
    }


@router.get("/export")
def export_routines(format: str = Query("csv", regex="^(csv|pdf)$"), session: Session = Depends(get_session)):
    # Exporta rutinas+ejercicios en CSV o PDF
    routines = session.exec(select(Routine).options(selectinload(Routine.exercises))).all()

    if format == "csv":
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(
            [
                "routine_id",
                "routine_name",
                "description",
                "created_at",
                "exercise_id",
                "exercise_name",
                "day",
                "series",
                "repetitions",
                "weight",
                "notes",
                "order",
            ]
        )
        for routine in routines:
            for ex in routine.exercises:
                writer.writerow(
                    [
                        routine.id,
                        routine.name,
                        routine.description or "",
                        routine.created_at.isoformat(),
                        ex.id,
                        ex.name,
                        ex.day.value,
                        ex.series,
                        ex.repetitions,
                        ex.weight or "",
                        ex.notes or "",
                        ex.order,
                    ]
                )
            if not routine.exercises:
                writer.writerow(
                    [
                        routine.id,
                        routine.name,
                        routine.description or "",
                        routine.created_at.isoformat(),
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                    ]
                )
        buffer.seek(0)
        return StreamingResponse(
            iter([buffer.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": 'attachment; filename="rutinas.csv"'},
        )

    # PDF
    pdf_buffer = io.BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=letter)
    width, height = letter
    y = height - 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, "Exportación de rutinas")
    y -= 20
    c.setFont("Helvetica", 10)

    def new_page():
        nonlocal y
        c.showPage()
        c.setFont("Helvetica", 10)
        y = height - 40

    for routine in routines:
        if y < 120:
            new_page()
        c.setFont("Helvetica-Bold", 11)
        c.drawString(40, y, f"Rutina: {routine.name} (ID {routine.id})")
        y -= 16
        c.setFont("Helvetica", 9)
        c.drawString(40, y, f"Descripción: {routine.description or 'Sin descripción'}")
        y -= 14
        c.drawString(40, y, f"Creada: {routine.created_at.isoformat()}")
        y -= 14
        if routine.exercises:
            for ex in routine.exercises:
                if y < 80:
                    new_page()
                c.drawString(
                    60,
                    y,
                    f"- {ex.name} | Día: {ex.day.value} | Series: {ex.series} | Reps: {ex.repetitions} | Peso: {ex.weight or 'N/A'} | Orden: {ex.order}",
                )
                y -= 12
        else:
            if y < 80:
                new_page()
            c.drawString(60, y, "- Sin ejercicios")
            y -= 12
        y -= 12

    c.save()
    pdf_buffer.seek(0)
    return StreamingResponse(
        iter([pdf_buffer.getvalue()]),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=rutinas.pdf"},
    )


@router.get("/{routine_id}", response_model=RoutineRead)
def get_routine(routine_id: int, session: Session = Depends(get_session)):
    # Detalle de rutina con ejercicios
    statement = select(Routine).where(Routine.id == routine_id).options(selectinload(Routine.exercises))
    routine = session.exec(statement).one_or_none()
    if not routine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")
    return routine


@router.post("", response_model=RoutineRead, status_code=status.HTTP_201_CREATED)
def create_routine(payload: RoutineCreate, session: Session = Depends(get_session)):
    # Crea rutina con ejercicios anidados; valida nombre único
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
    # Sincroniza rutina y ejercicios: actualiza, agrega y elimina los omitidos
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
    # Borra rutina (cascada elimina ejercicios)
    routine = session.get(Routine, routine_id)
    if not routine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")

    session.delete(routine)
    session.commit()
    return None


@router.post("/{routine_id}/duplicar", response_model=RoutineRead, status_code=status.HTTP_201_CREATED)
def duplicate_routine(routine_id: int, session: Session = Depends(get_session)):
    # Duplica rutina y sus ejercicios, ajustando nombre para mantener unicidad
    routine = session.exec(
        select(Routine).where(Routine.id == routine_id).options(selectinload(Routine.exercises))
    ).one_or_none()
    if not routine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")

    base_name = routine.name
    suffix = " (copia)"
    new_name = base_name + suffix
    counter = 2
    while session.exec(select(Routine).where(func.lower(Routine.name) == new_name.lower())).first():
        new_name = f"{base_name}{suffix} {counter}"
        counter += 1

    new_routine = Routine(name=new_name, description=routine.description)
    for ex in routine.exercises:
        new_routine.exercises.append(
            Exercise(
                name=ex.name,
                day=ex.day,
                series=ex.series,
                repetitions=ex.repetitions,
                weight=ex.weight,
                notes=ex.notes,
                order=ex.order,
            )
        )

    session.add(new_routine)
    session.commit()
    session.refresh(new_routine)
    return new_routine


