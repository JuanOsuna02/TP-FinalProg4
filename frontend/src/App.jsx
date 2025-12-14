import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RoutineDetail from './pages/RoutineDetail';
import RoutineForm from './pages/RoutineForm';
import RoutineList from './pages/RoutineList';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Listado principal */}
          <Route path="/" element={<RoutineList />} />
          {/* Crear nueva rutina */}
          <Route path="/rutinas/nueva" element={<RoutineForm />} />
          {/* Detalle */}
          <Route path="/rutinas/:id" element={<RoutineDetail />} />
          {/* Editar reutiliza el mismo form */}
          <Route path="/rutinas/:id/editar" element={<RoutineForm />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
