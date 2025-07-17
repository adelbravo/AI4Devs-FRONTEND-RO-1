import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import CandidateCard from './CandidateCard';
import { InterviewStep, Candidate } from '../types/kanban';

interface KanbanColumnProps {
  step: InterviewStep;
  candidates: Candidate[];
  updatingCandidates?: Set<number>;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  step, 
  candidates, 
  updatingCandidates = new Set() 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${step.id}`,
    data: {
      stepId: step.id,
      stepName: step.name,
    },
  });

  const candidatesCount = candidates.length;

  return (
    <div className="kanban-column col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
      <div className="h-100">
        {/* Header de la columna */}
        <div className="card border-0 shadow-sm h-100">
          <div className={`card-header bg-light border-bottom-2 ${isOver ? 'border-primary bg-primary bg-opacity-10' : ''}`}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold text-dark" title={step.name}>
                {step.name}
              </h6>
              <span className="badge bg-secondary rounded-pill">
                {candidatesCount}
              </span>
            </div>
          </div>
          
          {/* Área de drop para candidatos */}
          <div 
            ref={setNodeRef}
            className={`card-body p-3 kanban-drop-zone ${isOver ? 'drop-zone-active' : ''}`}
            style={{ 
              minHeight: '400px',
              backgroundColor: isOver ? 'rgba(13, 110, 253, 0.05)' : 'transparent',
              transition: 'background-color 0.2s ease'
            }}
          >
            {/* Lista de candidatos */}
            {candidates.length > 0 ? (
              <div className="candidates-list">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    isUpdating={updatingCandidates.has(candidate.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-column d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                <div className="empty-icon mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p className="small mb-0 text-center">
                  No hay candidatos en esta etapa
                </p>
                <p className="small text-center opacity-75">
                  Arrastra candidatos aquí
                </p>
              </div>
            )}
            
            {/* Indicador visual de drop zone activa */}
            {isOver && (
              <div className="drop-indicator position-absolute">
                <div className="border border-primary border-2 rounded p-3 text-center">
                  <div className="text-primary fw-bold">
                    Soltar candidato aquí
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn; 