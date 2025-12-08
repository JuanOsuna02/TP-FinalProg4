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
          <Route path="/" element={<RoutineList />} />
          <Route path="/rutinas/nueva" element={<RoutineForm />} />
          <Route path="/rutinas/:id" element={<RoutineDetail />} />
          <Route path="/rutinas/:id/editar" element={<RoutineForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
