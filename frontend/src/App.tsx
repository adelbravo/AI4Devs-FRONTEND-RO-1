import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './components/kanban.css';

// Componentes
import Positions from './components/Positions';
import PositionKanban from './components/PositionKanban';
import RecruiterDashboard from './components/RecruiterDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta por defecto - redirige al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard principal */}
          <Route path="/dashboard" element={<RecruiterDashboard />} />
          
          {/* Lista de posiciones */}
          <Route path="/positions" element={<Positions />} />
          
          {/* Kanban de candidatos por posición */}
          <Route path="/position/:id/kanban" element={<PositionKanban />} />
          
          {/* Ruta catch-all para páginas no encontradas */}
          <Route path="*" element={
            <div className="container mt-5">
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <h2 className="text-muted">Página no encontrada</h2>
                  <p className="text-muted">La página que buscas no existe.</p>
                  <a href="/" className="btn btn-primary">Volver al inicio</a>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
