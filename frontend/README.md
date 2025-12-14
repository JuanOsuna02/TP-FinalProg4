# Frontend - Gestor de Rutinas de Gimnasio

SPA en React 18 + Vite con Chakra UI. Incluye listado con filtros/paginación (6), stats, duplicar, export CSV/PDF, modo claro/oscuro, drag & drop de ejercicios y toasts.

## Requisitos
- Node.js 18+
- npm

## Instalación
```bash
cd frontend
npm install
```

## Configuración (.env)
En `frontend/.env` (o `.env.local`):
```
VITE_API_URL=http://127.0.0.1:8000
```
La app usa `VITE_API_URL` para llamar a la API (Axios).

## Ejecución
```bash
cd frontend
npm run dev -- --host --port 5173
```
- Dev: puerto 5173 (expuesto en LAN con `--host`).
- Build: `npm run build`
- Preview: `npm run preview`

## Funcionalidades clave
- Listado de rutinas en cards, búsqueda por nombre, filtro por día, paginación (6 por página).
- Stats (totales, promedio, top por ejercicios, ejercicios por día).
- Export CSV/PDF.
- Duplicar rutina.
- Calendario semanal clicable en el detalle.
- Form de alta/edición con drag & drop de ejercicios (@hello-pangea/dnd).
- Modo claro/oscuro, logo dinámico, botones con íconos, toasts centrados.

## Tecnologías
- React 18, Vite
- Chakra UI (tema custom, color mode)
- React Router DOM (rutas CRUD)
- Axios (API)
- React Hot Toast (feedback)
- @hello-pangea/dnd (drag & drop de ejercicios)
- Framer Motion (animaciones sutiles)

## Estructura
```
frontend/
├─ src/
│  ├─ api/
│  │  ├─ client.js        # Axios base (usa VITE_API_URL)
│  │  └─ routines.js      # llamadas CRUD, stats, export, duplicate
│  ├─ components/
│  │  └─ Layout.jsx       # navbar, toggle tema, logo dinámico
│  ├─ pages/
│  │  ├─ RoutineList.jsx  # listado, filtros, stats, export, paginación
│  │  ├─ RoutineDetail.jsx# detalle + calendario semanal
│  │  └─ RoutineForm.jsx  # alta/edición + drag & drop ejercicios
│  ├─ theme.js            # tema Chakra (paleta teal/blue)
│  ├─ App.jsx             # rutas
│  ├─ main.jsx            # providers (Chakra, Toaster)
│  ├─ index.css / App.css # estilos globales (full width)
├─ public/
│  ├─ logo.png
│  └─ logo-light.png
├─ package.json
└─ README.md
```
