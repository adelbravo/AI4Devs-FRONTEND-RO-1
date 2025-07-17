import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, Badge, Spinner } from 'react-bootstrap';
import { Candidate } from '../services/positionService';

interface SortableItemProps {
  id: string;
  candidate: Candidate;
  isUpdating?: boolean;
}

/**
 * SortableItem component represents a draggable candidate card
 * It uses @dnd-kit/sortable for drag and drop functionality
 */
const SortableItem: React.FC<SortableItemProps> = ({ id, candidate, isUpdating = false }) => {
  // Use the useDraggable hook to make this component draggable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  // Apply styles for dragging
  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 0.2s ease',
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 9999 : 'auto',
    pointerEvents: isDragging ? 'none' as const : 'auto' as const,
    width: isDragging ? '100%' : 'auto',
    position: isDragging ? 'relative' as const : 'static' as const,
  } : {};

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="mb-2"
      data-testid={`candidate-card-${candidate.id}`}
      {...attributes}
      {...listeners}
    >
      <Card 
        className={`candidate-card ${isDragging ? 'is-dragging' : ''} ${isUpdating ? 'is-updating' : ''}`}
      >
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="candidate-name">{candidate.fullName}</div>
            <Badge 
              bg={getScoreBadgeColor(candidate.averageScore)} 
              className="score-badge"
            >
              {formatScore(candidate.averageScore)}
            </Badge>
          </div>
          {isUpdating && (
            <div className="updating-overlay d-flex align-items-center justify-content-center">
              <div className="bg-white p-2 rounded shadow-sm d-flex align-items-center">
                <Spinner animation="border" size="sm" role="status" variant="primary">
                  <span className="visually-hidden">Actualizando...</span>
                </Spinner>
                <span className="ms-2 small text-primary">Actualizando...</span>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

/**
 * Returns the appropriate badge color based on the score
 * @param score - The candidate's average score
 * @returns The Bootstrap color for the badge
 */
const getScoreBadgeColor = (score: number): string => {
  if (score === 0 || isNaN(score)) return 'secondary';
  if (score < 3) return 'danger';
  if (score < 4) return 'warning';
  return 'success';
};

/**
 * Formats the score for display
 * @param score - The candidate's average score
 * @returns Formatted score string
 */
const formatScore = (score: number): string => {
  if (score === 0 || isNaN(score)) return 'N/A';
  return score.toFixed(1);
};

export default SortableItem;