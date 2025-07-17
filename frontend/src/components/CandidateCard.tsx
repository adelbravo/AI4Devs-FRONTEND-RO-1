import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Star } from 'react-bootstrap-icons';
import { Candidate } from '../types/kanban';

interface CandidateCardProps {
  candidate: Candidate;
  isUpdating?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, isUpdating = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `candidate-${candidate.id}`,
    data: {
      candidateId: candidate.id,
      applicationId: candidate.applicationId,
      fullName: candidate.fullName,
    },
    disabled: isUpdating,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.7 : 1,
    cursor: isUpdating ? 'wait' : isDragging ? 'grabbing' : 'grab',
  };

  // Generar iniciales del nombre
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Formatear puntuación
  const formatScore = (score: number): string => {
    return score.toFixed(1);
  };

  // Color del badge según la puntuación
  const getScoreBadgeClass = (score: number): string => {
    if (score >= 8) return 'bg-success';
    if (score >= 6) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isUpdating ? {} : { ...listeners, ...attributes })}
      className={`card candidate-card mb-3 shadow-sm ${isDragging ? 'shadow' : ''} ${isUpdating ? 'updating' : ''}`}
      role="button"
      tabIndex={isUpdating ? -1 : 0}
      aria-label={`Candidato ${candidate.fullName}, puntuación ${formatScore(candidate.averageScore)}`}
    >
      <div className="card-body p-3">
        <div className="d-flex align-items-start">
          {/* Avatar con iniciales */}
          <div className="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0">
            <small className="fw-bold">{getInitials(candidate.fullName)}</small>
          </div>
          
          <div className="flex-grow-1 min-width-0">
            {/* Nombre del candidato */}
            <h6 className="card-title mb-2 text-truncate" title={candidate.fullName}>
              {candidate.fullName}
            </h6>
            
            {/* Puntuación */}
            <div className="d-flex align-items-center">
              <Star size={14} className="text-warning me-1" />
              <span 
                className={`badge ${getScoreBadgeClass(candidate.averageScore)} d-flex align-items-center`}
              >
                {formatScore(candidate.averageScore)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Indicador de actualización */}
        {isUpdating && (
          <div className="mt-2">
            <div className="progress" style={{ height: '2px' }}>
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                style={{ width: '100%' }}
              ></div>
            </div>
            <small className="text-muted">Actualizando...</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateCard; 