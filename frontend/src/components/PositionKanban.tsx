import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragEndEvent } from '@dnd-kit/core';
import { Alert } from 'react-bootstrap';
import PositionHeader from './PositionHeader';
import KanbanBoard from './KanbanBoard';
import PositionService from '../services/positionService';
import { PositionData, Candidate, InterviewStep } from '../types/kanban';

const PositionKanban: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estados principales
  const [positionData, setPositionData] = useState<PositionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingCandidates, setUpdatingCandidates] = useState<Set<number>>(new Set());

  // Validar que tenemos un ID de posición válido
  const positionId = id ? parseInt(id, 10) : null;

  // Cargar datos iniciales
  const loadPositionData = useCallback(async () => {
    if (!positionId || isNaN(positionId)) {
      setError('ID de posición inválido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Cargar flujo de entrevistas y candidatos en paralelo
      const [interviewFlowResponse, candidatesResponse] = await Promise.all([
        PositionService.getPositionInterviewFlow(positionId),
        PositionService.getPositionCandidates(positionId)
      ]);

      // Estructurar datos para el componente
      const positionData: PositionData = {
        positionName: interviewFlowResponse.positionName,
        interviewSteps: interviewFlowResponse.interviewFlow.interviewSteps,
        candidates: candidatesResponse
      };

      setPositionData(positionData);
    } catch (error) {
      console.error('Error loading position data:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar los datos de la posición');
    } finally {
      setLoading(false);
    }
  }, [positionId]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadPositionData();
  }, [loadPositionData]);

  // Actualizar candidato localmente (optimistic update)
  const updateCandidateLocally = useCallback((candidateId: number, newStepId: number) => {
    setPositionData(prevData => {
      if (!prevData) return prevData;

      // Encontrar el nombre del nuevo step
      const newStepName = prevData.interviewSteps.find(s => s.id === newStepId)?.name;
      if (!newStepName) return prevData;

      const updatedCandidates = prevData.candidates.map(candidate => {
        if (candidate.id === candidateId) {
          return {
            ...candidate,
            currentInterviewStep: newStepName // Usar el nombre del step, no el ID
          };
        }
        return candidate;
      });

      return {
        ...prevData,
        candidates: updatedCandidates
      };
    });
  }, []);

  // Revertir actualización optimista en caso de error
  const revertCandidateUpdate = useCallback((candidateId: number, originalStepName: string) => {
    setPositionData(prevData => {
      if (!prevData) return prevData;

      const revertedCandidates = prevData.candidates.map(candidate => {
        if (candidate.id === candidateId) {
          return {
            ...candidate,
            currentInterviewStep: originalStepName
          };
        }
        return candidate;
      });

      return {
        ...prevData,
        candidates: revertedCandidates
      };
    });
  }, []);

  // Manejar evento de finalización de drag & drop
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active.data.current || !over.data.current) {
      return;
    }

    const candidateId = active.data.current.candidateId as number;
    const applicationId = active.data.current.applicationId as number;
    const newStepId = over.data.current.stepId as number;
    const candidate = positionData?.candidates.find(c => c.id === candidateId);
    const originalStepName = candidate?.currentInterviewStep;
    
    // Encontrar el nombre del nuevo step para comparación
    const newStepName = positionData?.interviewSteps.find(s => s.id === newStepId)?.name;

    // Si es la misma columna, no hacer nada
    if (originalStepName === newStepName) {
      return;
    }

    // Marcar candidato como actualizándose
    setUpdatingCandidates(prev => new Set(prev).add(candidateId));

    try {
      // Actualización optimista
      updateCandidateLocally(candidateId, newStepId);

      // Actualizar en el servidor
      await PositionService.updateCandidateStage(candidateId, applicationId, newStepId);

      // Mostrar feedback exitoso (opcional - se puede añadir toast notification)
      console.log(`Candidato ${active.data.current.fullName} movido exitosamente a ${over.data.current.stepName}`);

    } catch (error) {
      console.error('Error updating candidate stage:', error);
      
      // Revertir actualización optimista
      if (originalStepName) {
        revertCandidateUpdate(candidateId, originalStepName);
      }

      // Mostrar mensaje de error al usuario
      setError('Error al actualizar la etapa del candidato. Por favor, intenta nuevamente.');
      
      // Limpiar error después de unos segundos
      setTimeout(() => setError(null), 5000);
    } finally {
      // Remover candidato de la lista de actualizaciones
      setUpdatingCandidates(prev => {
        const newSet = new Set(prev);
        newSet.delete(candidateId);
        return newSet;
      });
    }
  }, [positionData, updateCandidateLocally, revertCandidateUpdate]);

  // Navegar de vuelta a la lista de posiciones
  const handleBack = useCallback(() => {
    navigate('/positions');
  }, [navigate]);

  // Recargar datos
  const handleRetry = useCallback(() => {
    setError(null);
    loadPositionData();
  }, [loadPositionData]);

  // Renderizar error state
  if (error && !positionData) {
    return (
      <div className="position-kanban-error">
        <PositionHeader title={undefined} onBack={handleBack} />
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <Alert variant="danger" className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="alert-heading mb-2">Error al cargar los datos</h6>
                  <p className="mb-0">{error}</p>
                </div>
                <button 
                  className="btn btn-outline-danger btn-sm ms-3"
                  onClick={handleRetry}
                >
                  Reintentar
                </button>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="position-kanban">
      {/* Header con título y navegación */}
      <PositionHeader 
        title={positionData?.positionName} 
        onBack={handleBack} 
        loading={loading}
      />

      {/* Alert de error (cuando hay error pero ya tenemos datos) */}
      {error && positionData && (
        <div className="container-fluid mb-3">
          <div className="row">
            <div className="col-12">
              <Alert variant="warning" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            </div>
          </div>
        </div>
      )}

      {/* Board Kanban */}
      <KanbanBoard
        steps={positionData?.interviewSteps || []}
        candidates={positionData?.candidates || []}
        onDragEnd={handleDragEnd}
        updatingCandidates={updatingCandidates}
        loading={loading}
      />
    </div>
  );
};

export default PositionKanban; 