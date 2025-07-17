import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Spinner, ButtonGroup, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanHeader from './KanbanHeader';
import KanbanSkeleton from './KanbanSkeleton';
import LoadingOverlay from './LoadingOverlay';
import SortableItem from './SortableItem';
import DroppableColumn from './DroppableColumn';
import notificationService from '../services/notificationService';
import {
  getPositionFlow,
  getPositionCandidates,
  updateCandidateStage,
  InterviewStep,
  InterviewFlow,
  Candidate,
  UpdateCandidateStageRequest
} from '../services/positionService';

interface PositionKanbanViewProps {
  // Props if needed
}

const PositionKanbanView: React.FC<PositionKanbanViewProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [positionTitle, setPositionTitle] = useState<string>('');
  const [interviewFlow, setInterviewFlow] = useState<InterviewFlow | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [activeColumnId, setActiveColumnId] = useState<number | null>(null);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  // Configure sensors for mouse, touch, and keyboard interactions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Reduce the activation constraint to make it more responsive
      activationConstraint: {
        distance: 1, // Minimum distance required before activating drag (reduced from 8)
        delay: 0, // No delay for activation
        tolerance: 5, // Tolerance for movement
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Use the trackPromise method to handle loading, success, and error states
        const [positionData, candidatesData] = await Promise.all([
          notificationService.trackPromise(
            getPositionFlow(id),
            'Cargando datos de la posición...',
            'Datos de la posición cargados correctamente',
            (err) => `Error al cargar los datos de la posición: ${err.message || 'Error desconocido'}`
          ),
          notificationService.trackPromise(
            getPositionCandidates(id),
            'Cargando candidatos...',
            'Candidatos cargados correctamente',
            (err) => `Error al cargar los candidatos: ${err.message || 'Error desconocido'}`
          )
        ]);

        console.log('Position data received:', positionData);

        // Ensure positionData has the expected structure
        if (positionData && positionData.positionName) {
          setPositionTitle(positionData.positionName);
        } else {
          console.error('Position name not found in response:', positionData);
          setPositionTitle('Posición desconocida');
        }

        // Ensure interviewFlow exists before setting it
        if (positionData && positionData.interviewFlow) {
          setInterviewFlow(positionData.interviewFlow);

          // Set the first column as active by default if interviewSteps exist
          if (positionData.interviewFlow.interviewSteps && positionData.interviewFlow.interviewSteps.length > 0) {
            setActiveColumnId(positionData.interviewFlow.interviewSteps[0].id);
          } else {
            console.error('No interview steps found in response:', positionData);
          }
        } else {
          console.error('Interview flow not found in response:', positionData);
          setInterviewFlow(null);
        }

        // Ensure candidates data exists before setting it
        if (Array.isArray(candidatesData)) {
          setCandidates(candidatesData);
        } else {
          console.error('Candidates data is not an array:', candidatesData);
          setCandidates([]);
        }

        setLoading(false);
      } catch (err) {
        setError('Error loading position data');
        setLoading(false);

        // Error notifications are already handled by trackPromise
      }
    };

    fetchData();
  }, [id]);

  // Reference to the kanban board container
  const kanbanBoardRef = useRef<HTMLDivElement>(null);

  // Touch swipe handling
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Detect mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    // Initial check
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  // Track swipe direction for animation
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Handle touch events for swiping between columns on mobile
  useEffect(() => {
    if (!isMobileView || !interviewFlow) return;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default to avoid scrolling while swiping horizontally
      if (touchStartX !== null) {
        const touchMoveX = e.touches[0].clientX;
        const diffX = touchMoveX - touchStartX;

        // If it's a significant horizontal swipe, prevent default scrolling
        if (Math.abs(diffX) > 30) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;

      // Minimum swipe distance (px)
      const minSwipeDistance = 50;

      if (Math.abs(diffX) < minSwipeDistance) return;

      if (!activeColumnId || !interviewFlow) return;

      const currentStep = interviewFlow.interviewSteps.find(step => step.id === activeColumnId);
      if (!currentStep) return;

      const sortedSteps = interviewFlow.interviewSteps.sort((a, b) => a.orderIndex - b.orderIndex);

      if (diffX > 0) {
        // Swiped right - go to previous column
        const prevStep = sortedSteps.find(step => step.orderIndex < currentStep.orderIndex);
        if (prevStep) {
          setSwipeDirection('right');
          setActiveColumnId(prevStep.id);

          // Reset swipe direction after animation completes
          setTimeout(() => {
            setSwipeDirection(null);
          }, 300);
        }
      } else {
        // Swiped left - go to next column
        const nextStep = sortedSteps.find(step => step.orderIndex > currentStep.orderIndex);
        if (nextStep) {
          setSwipeDirection('left');
          setActiveColumnId(nextStep.id);

          // Reset swipe direction after animation completes
          setTimeout(() => {
            setSwipeDirection(null);
          }, 300);
        }
      }

      setTouchStartX(null);
    };

    const kanbanBoard = kanbanBoardRef.current;
    if (kanbanBoard) {
      kanbanBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
      kanbanBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
      kanbanBoard.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (kanbanBoard) {
        kanbanBoard.removeEventListener('touchstart', handleTouchStart);
        kanbanBoard.removeEventListener('touchmove', handleTouchMove);
        kanbanBoard.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isMobileView, interviewFlow, activeColumnId, touchStartX]);

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    // Set dragging state to true to apply visual styles
    setIsDragging(true);

    // Find the candidate being dragged
    const candidateId = String(event.active.id).split('-')[1];
    setDraggedCandidateId(candidateId);

    const draggedCandidate = candidates.find(c => c.id === parseInt(candidateId));

    // Add visual feedback for the dragged candidate
    document.body.classList.add('dragging-active');

    console.log(`Started dragging candidate: ${draggedCandidate?.fullName}`);
  };

  // Handle drag over event
  const handleDragOver = (event: DragOverEvent) => {
    // This is where you can implement logic for when a draggable is dragged over a droppable
    // For example, you could highlight the droppable area
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    // Reset dragging state
    setIsDragging(false);
    setDraggedCandidateId(null);

    // Remove dragging class from body
    document.body.classList.remove('dragging-active');

    const { active, over } = event;

    // If dropped outside a droppable area or no movement
    if (!over) {
      console.log('Dropped outside a droppable area');
      return;
    }

    // Extract the candidate ID from the active ID (format: "candidate-{id}")
    const candidateId = String(active.id).split('-')[1];

    // Extract the column ID from the over ID (format: "column-{id}")
    const destinationColumnId = parseInt(String(over.id).split('-')[1]);

    // Find the candidate
    const candidate = candidates.find(c => c.id === parseInt(candidateId));
    if (!candidate) {
      console.error('Candidate not found');
      return;
    }

    // Find the destination step
    const destinationStep = interviewFlow?.interviewSteps.find(
      step => step.id === destinationColumnId
    );

    if (!destinationStep) {
      console.error('Destination step not found');
      return;
    }

    // If dropped in the same column, do nothing
    if (candidate.currentInterviewStep === destinationStep.name) {
      console.log('Dropped in the same column');
      return;
    }

    // Store original candidates state for potential reversion
    const originalCandidates = [...candidates];

    // Find the source step
    const sourceStep = interviewFlow?.interviewSteps.find(
      step => step.name === candidate.currentInterviewStep
    );

    if (!sourceStep) {
      console.error('Source step not found');
      return;
    }

    // Set updating state
    setIsUpdating(true);
    setDraggedCandidateId(candidateId);

    // Create a copy of candidates to update locally first (optimistic update)
    const updatedCandidates = candidates.map(c => {
      if (c.id === parseInt(candidateId)) {
        return {
          ...c,
          currentInterviewStep: destinationStep.name
        };
      }
      return c;
    });

    // Update local state immediately for a responsive UI
    setCandidates(updatedCandidates);

    // Show "updating" notification using the notification service
    notificationService.showWarning(`Actualizando estado del candidato...`);

    // Prepare data for API call
    const updateData: UpdateCandidateStageRequest = {
      applicationId: candidate.applicationId || (id ? parseInt(id) : 0), // Use candidate's applicationId if available
      currentInterviewStep: destinationStep.id // Using step ID instead of name to match API spec
    };

    console.log('Sending update data:', updateData);

    // Add loading overlay to the card being updated
    const cardElement = document.querySelector(`[data-testid="candidate-card-${candidateId}"]`);
    if (cardElement) {
      cardElement.classList.add('is-updating');
    }

    // Call API to update the candidate's stage using trackPromise for better notification handling
    notificationService.trackPromise(
      updateCandidateStage(candidateId.toString(), updateData),
      `Moviendo candidato a "${destinationStep.name}"...`,
      `Candidato movido de "${sourceStep.name}" a "${destinationStep.name}" exitosamente`,
      (error) => `Error al actualizar la fase: ${error.message || 'Error desconocido'}`
    )
      .then((response) => {
        console.log('Candidate stage updated successfully:', response);

        // Remove loading overlay and add animation class to the moved card
        if (cardElement) {
          cardElement.classList.remove('is-updating');
          cardElement.classList.add('card-moving');
          setTimeout(() => {
            cardElement.classList.remove('card-moving');
          }, 500);
        }

        // Reset updating state
        setIsUpdating(false);
        setDraggedCandidateId(null);
      })
      .catch(error => {
        console.error('Error updating candidate stage:', error);

        // Revert to previous state
        setCandidates(originalCandidates);

        // Remove loading overlay and add animation to indicate the reversion
        if (cardElement) {
          cardElement.classList.remove('is-updating');
          cardElement.classList.add('card-moving');
          setTimeout(() => {
            cardElement.classList.remove('card-moving');
          }, 500);
        }

        // Reset updating state
        setIsUpdating(false);
        setDraggedCandidateId(null);
      });
  };

  if (loading) {
    return (
      <Container fluid className="mt-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              <h2 className="mb-0">Cargando posición...</h2>
            </div>
          </Col>
        </Row>
        <KanbanSkeleton columnCount={4} cardsPerColumn={3} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="alert alert-danger">
            <p className="mb-3">{error}</p>
            <Button
              variant="primary"
              onClick={() => {
                setLoading(true);
                setError(null);
                window.location.reload();
              }}
              className="d-flex align-items-center mx-auto"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  <span>Cargando...</span>
                </>
              ) : (
                <span>Reintentar</span>
              )}
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // Helper function to filter candidates by interview step
  const getCandidatesForStep = (stepName: string): Candidate[] => {
    return candidates.filter(candidate => candidate.currentInterviewStep === stepName);
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <KanbanHeader title={positionTitle} />
        </Col>
      </Row>
      {/* Toast notifications are now handled by the global NotificationProvider */}

      {/* Mobile Column Navigation */}
      {isMobileView && interviewFlow && (
        <>
          <Row className="mb-3">
            <Col>
              <div className="mobile-column-nav">
                <ButtonGroup>
                  {interviewFlow.interviewSteps
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((step: InterviewStep) => {
                      const stepCandidates = getCandidatesForStep(step.name);
                      return (
                        <Button
                          key={step.id}
                          variant={activeColumnId === step.id ? "primary" : "outline-secondary"}
                          onClick={() => setActiveColumnId(step.id)}
                          className="d-flex align-items-center"
                          aria-label={`Ver fase ${step.name}`}
                        >
                          {step.name}
                          <Badge
                            bg={activeColumnId === step.id ? "light" : "secondary"}
                            text={activeColumnId === step.id ? "dark" : "light"}
                            pill
                            className="ms-2"
                          >
                            {stepCandidates.length}
                          </Badge>
                        </Button>
                      );
                    })}
                </ButtonGroup>
              </div>
            </Col>
          </Row>

          {/* Mobile Column Indicators */}
          <Row className="mb-2">
            <Col>
              <div className="mobile-column-indicator">
                {interviewFlow.interviewSteps
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((step: InterviewStep) => (
                    <div
                      key={step.id}
                      className={`indicator-dot ${activeColumnId === step.id ? 'active' : ''}`}
                      onClick={() => setActiveColumnId(step.id)}
                      role="button"
                      aria-label={`Seleccionar fase ${step.name}`}
                      tabIndex={0}
                    />
                  ))}
              </div>
            </Col>
          </Row>

          {/* Mobile Swipe Hint - only show on first load */}
          <Row className="mb-3">
            <Col>
              <div className="mobile-swipe-hint">
                Desliza o usa las flechas para navegar entre columnas
              </div>
            </Col>
          </Row>
        </>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="position-relative">
          {/* Global loading overlay */}
          <LoadingOverlay
            show={isUpdating}
            message="Actualizando posición del candidato..."
            transparent={true}
          />
          {/* Mobile Column Navigation Arrows */}
          {isMobileView && interviewFlow && interviewFlow.interviewSteps.length > 1 && (
            <div className="mobile-column-arrows">
              <div
                className={`mobile-column-arrow ${!activeColumnId || !interviewFlow.interviewSteps.find(s => s.orderIndex < (interviewFlow.interviewSteps.find(step => step.id === activeColumnId)?.orderIndex || 0)) ? 'disabled' : ''}`}
                onClick={() => {
                  if (!activeColumnId) return;

                  const currentStep = interviewFlow.interviewSteps.find(step => step.id === activeColumnId);
                  if (!currentStep) return;

                  const prevStep = interviewFlow.interviewSteps
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .find(step => step.orderIndex < currentStep.orderIndex);

                  if (prevStep) {
                    setActiveColumnId(prevStep.id);
                  }
                }}
              >
                <ChevronLeft className="notification-icon" />
              </div>
              <div
                className={`mobile-column-arrow ${!activeColumnId || !interviewFlow.interviewSteps.find(s => s.orderIndex > (interviewFlow.interviewSteps.find(step => step.id === activeColumnId)?.orderIndex || 0)) ? 'disabled' : ''}`}
                onClick={() => {
                  if (!activeColumnId) return;

                  const currentStep = interviewFlow.interviewSteps.find(step => step.id === activeColumnId);
                  if (!currentStep) return;

                  const nextStep = interviewFlow.interviewSteps
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .find(step => step.orderIndex > currentStep.orderIndex);

                  if (nextStep) {
                    setActiveColumnId(nextStep.id);
                  }
                }}
              >
                <ChevronRight className="notification-icon" />
              </div>
            </div>
          )}

          <Row
            className={`kanban-board g-4 ${isDragging ? 'is-dragging' : ''}`}
            ref={kanbanBoardRef}
          >
            {interviewFlow?.interviewSteps
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((step: InterviewStep) => {
                const stepCandidates = getCandidatesForStep(step.name);
                const isActive = !isMobileView || activeColumnId === step.id;

                return (
                  <Col
                    key={step.id}
                    xs={12}
                    md={6}
                    lg={4}
                    xl={3}
                    className={`mb-4 ${isMobileView ? (isActive ? `mobile-active ${swipeDirection ? `swipe-${swipeDirection}` : ''}` : 'mobile-hidden') : ''}`}
                  >
                    <DroppableColumn
                      id={`column-${step.id}`}
                      interviewStep={step}
                      candidateCount={stepCandidates.length}
                      isDragging={isDragging}
                    >
                      {stepCandidates.length > 0 ? (
                        stepCandidates.map((candidate) => (
                          <SortableItem
                            key={candidate.id}
                            id={`candidate-${candidate.id}`}
                            candidate={candidate}
                            isUpdating={isUpdating && draggedCandidateId === candidate.id.toString()}
                          />
                        ))
                      ) : (
                        <div className="text-center text-muted py-3">
                          <p>No hay candidatos en esta fase</p>
                        </div>
                      )}
                    </DroppableColumn>
                  </Col>
                );
              })}
          </Row>
        </div>
      </DndContext>
    </Container>
  );
};

export default PositionKanbanView;