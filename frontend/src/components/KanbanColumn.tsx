import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { InterviewStep } from '../services/positionService';
import './Kanban.css';

interface KanbanColumnProps {
  interviewStep: InterviewStep;
  columnId: string;
  candidateCount?: number;
  children?: React.ReactNode;
}

/**
 * KanbanColumn component represents a column in the kanban board
 * Each column corresponds to an interview step and can contain candidate cards
 * 
 * @param interviewStep - The interview step data for this column
 * @param columnId - Unique identifier for the column (used by react-beautiful-dnd)
 * @param candidateCount - Optional count of candidates in this column
 * @param children - Child components (candidate cards)
 */
// Using JavaScript default parameters instead of defaultProps
const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  interviewStep, 
  columnId, 
  candidateCount = 0, // Default parameter
  children 
}) => {
  return (
    <Card className="kanban-column h-100">
      <Card.Header className="text-center d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{interviewStep.name}</h5>
        <Badge bg="secondary" pill>
          {candidateCount}
        </Badge>
      </Card.Header>
      <Droppable droppableId={columnId}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <Card.Body
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`kanban-column-body ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            data-testid={`column-${columnId}`}
          >
            {children}
            {provided.placeholder}
          </Card.Body>
        )}
      </Droppable>
    </Card>
  );
};

export default KanbanColumn;