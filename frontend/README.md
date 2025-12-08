# Frontend - Gestor de Rutinas de Gimnasio

Aplicación React + Vite para gestionar rutinas y ejercicios consumiendo la API de FastAPI.

## Requisitos previos
- Node.js 18+ (recomendado)
- npm (incluido con Node)

## Instalación
```bash
cd frontend
npm install
```

## Configuración
- Define la URL del backend en un archivo `.env` (o `.env.local`) dentro de `frontend/`:
```
VITE_API_URL=http://localhost:8000
```
- Usa `VITE_API_URL` al hacer las peticiones (por ejemplo con `fetch` o `axios`).

## Ejecución
```bash
cd frontend
npm run dev
```
- Puerto por defecto: 5173 (Vite).
- Build producción: `npm run build` y vista previa con `npm run preview`.

## Tecnologías utilizadas
- React 18
- Vite
- React Router (a incorporar para navegación)
- Axios o Fetch API (para llamadas a la API)
- Librería de UI a elección (MUI/Chakra/Ant u otra)

## Estructura del proyecto
```
frontend/
├─ src/
│  ├─ main.jsx      # punto de entrada
│  ├─ App.jsx       # componente raíz
│  ├─ index.css     # estilos globales
│  └─ assets/       # íconos/recursos estáticos
├─ public/          # assets públicos
├─ package.json
└─ README.md
```

## Próximos pasos (sugeridos)
- Añadir layout y navegación (listado, detalle, crear/editar rutina).
- Implementar formulario con validaciones cliente.
- Conectar endpoints CRUD y búsqueda en vivo al backend.
- Mostrar estados de carga/errores y confirmaciones de borrado.
