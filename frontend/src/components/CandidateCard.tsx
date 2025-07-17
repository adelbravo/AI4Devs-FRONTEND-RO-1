import React from 'react';
import { Card, Badge, Spinner } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';
import { Candidate } from '../services/positionService';

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
  isUpdating?: boolean;
}

/**
 * CandidateCard component represents a card for a candidate in the kanban board
 * It displays the candidate's name and average score
 * It is configured as a draggable element
 * 
 * @param candidate - The candidate data
 * @param index - The index of the card in the list (used by react-beautiful-dnd)
 * @param isUpdating - Whether the card is currently being updated
 */
const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index, isUpdating = false }) => {
  return (
    <Draggable draggableId={`candidate-${candidate.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2"
          data-testid={`candidate-card-${candidate.id}`}
        >
          <Card 
            className={`candidate-card ${snapshot.isDragging ? 'is-dragging' : ''} ${isUpdating ? 'is-updating' : ''}`}
            style={{ 
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.8 : 1
            }}
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
      )}
    </Draggable>
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

export default CandidateCard;