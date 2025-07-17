import React from 'react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import { InterviewStep, Candidate } from '../types/kanban';

interface KanbanBoardProps {
  steps: InterviewStep[];
  candidates: Candidate[];
  onDragEnd: (event: DragEndEvent) => Promise<void>;
  updatingCandidates: Set<number>;
  loading?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  steps, 
  candidates, 
  onDragEnd, 
  updatingCandidates, 
  loading = false 
}) => {
  // Configurar sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requiere 8px de movimiento antes de activar el drag
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Agrupar candidatos por etapa
  const groupCandidatesByStep = (): Record<number, Candidate[]> => {
    const grouped: Record<number, Candidate[]> = {};
    
    // Inicializar grupos vacíos para todas las etapas
    steps.forEach(step => {
      grouped[step.id] = [];
    });
    
    // Crear mapeo de nombres de step a IDs
    const stepNameToId: Record<string, number> = {};
    steps.forEach(step => {
      stepNameToId[step.name] = step.id;
    });
    
    // Agrupar candidatos por su currentInterviewStep (que viene como nombre)
    candidates.forEach(candidate => {
      const stepId = stepNameToId[candidate.currentInterviewStep];
      if (stepId && grouped[stepId]) {
        grouped[stepId].push(candidate);
      }
    });
    
    return grouped;
  };

  const groupedCandidates = groupCandidatesByStep();

  // Ordenar etapas por orderIndex
  const sortedSteps = [...steps].sort((a, b) => a.orderIndex - b.orderIndex);

  if (loading) {
    return (
      <div className="kanban-board-loading">
        <div className="container-fluid">
          <div className="row">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </div>
                      <div className="placeholder-glow">
                        <span className="placeholder col-3 bg-secondary"></span>
                      </div>
                    </div>
                  </div>
                  <div className="card-body" style={{ minHeight: '400px' }}>
                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p className="text-muted mt-3 small">Cargando candidatos...</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="kanban-board-empty">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="mb-4">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-muted opacity-50">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                  </div>
                  <h5 className="text-muted">No hay flujo de entrevistas configurado</h5>
                  <p className="text-muted">
                    Esta posición no tiene un flujo de entrevistas definido. 
                    Contacta al administrador para configurar las etapas del proceso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-board">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <div className="container-fluid">
          <div className="row">
            {sortedSteps.map((step) => (
              <KanbanColumn
                key={step.id}
                step={step}
                candidates={groupedCandidates[step.id] || []}
                updatingCandidates={updatingCandidates}
              />
            ))}
          </div>
        </div>
      </DndContext>
      
      {/* Resumen estadísticas */}
      <div className="kanban-stats mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card border-0 bg-light">
                <div className="card-body py-2">
                  <div className="d-flex justify-content-between align-items-center text-muted small">
                    <span>
                      Total candidatos: <strong className="text-dark">{candidates.length}</strong>
                    </span>
                    <span>
                      Etapas del proceso: <strong className="text-dark">{steps.length}</strong>
                    </span>
                    <span>
                      Puntuación promedio: <strong className="text-dark">
                        {candidates.length > 0 
                          ? (candidates.reduce((sum, c) => sum + c.averageScore, 0) / candidates.length).toFixed(1)
                          : '0.0'
                        }
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard; 