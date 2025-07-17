import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card, Badge } from 'react-bootstrap';
import { InterviewStep } from '../services/positionService';

interface DroppableColumnProps {
  id: string;
  interviewStep: InterviewStep;
  candidateCount: number;
  children: React.ReactNode;
  isDragging: boolean;
}

/**
 * DroppableColumn component represents a column in the kanban board
 * It uses @dnd-kit/core for drop functionality
 */
const DroppableColumn: React.FC<DroppableColumnProps> = ({ 
  id, 
  interviewStep, 
  candidateCount, 
  children,
  isDragging
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id
  });

  return (
    <Card className="kanban-column h-100">
      <Card.Header className="text-center d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{interviewStep.name}</h5>
        <Badge bg="secondary" pill>
          {candidateCount}
        </Badge>
      </Card.Header>
      <div
        ref={setNodeRef}
        className={`kanban-column-body ${isOver ? 'dragging-over' : ''} ${isDragging ? 'is-dragging' : ''}`}
        data-testid={`column-${id}`}
      >
        {children}
      </div>
    </Card>
  );
};

export default DroppableColumn;