import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm'; 
import Positions from './components/Positions'; 
import PositionKanbanView from './components/PositionKanbanView';
import NotificationProvider from './components/NotificationProvider';
import NotificationTester from './components/NotificationTester';

const App = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<RecruiterDashboard />} />
          <Route path="/add-candidate" element={<AddCandidate />} /> {/* Agrega esta línea */}
          <Route path="/positions" element={<Positions />} />
          <Route path="/positions/:id/kanban" element={<PositionKanbanView />} />
          <Route path="/notification-test" element={<NotificationTester />} />
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;