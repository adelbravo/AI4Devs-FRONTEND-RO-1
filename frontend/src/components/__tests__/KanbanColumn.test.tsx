import React from 'react';
import { render, screen } from '@testing-library/react';
import KanbanColumn from '../KanbanColumn';
import { InterviewStep } from '../../services/positionService';

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => 
    children({
      innerRef: jest.fn(),
      droppableProps: {},
      placeholder: null
    }, { isDraggingOver: false }),
}));

describe('KanbanColumn Component', () => {
  const mockInterviewStep: InterviewStep = {
    id: 1,
    interviewFlowId: 1,
    interviewTypeId: 1,
    name: 'Test Interview Step',
    orderIndex: 1
  };

  it('renders the column with the correct title', () => {
    render(
      <KanbanColumn 
        interviewStep={mockInterviewStep} 
        columnId="test-column" 
      />
    );
    
    // Check if the column title is rendered
    expect(screen.getByText('Test Interview Step')).toBeInTheDocument();
  });

  it('displays the correct candidate count', () => {
    const candidateCount = 5;
    render(
      <KanbanColumn 
        interviewStep={mockInterviewStep} 
        columnId="test-column" 
        candidateCount={candidateCount}
      />
    );
    
    // Check if the candidate count badge is rendered
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders children components', () => {
    render(
      <KanbanColumn 
        interviewStep={mockInterviewStep} 
        columnId="test-column"
      >
        <div data-testid="test-child">Test Child</div>
      </KanbanColumn>
    );
    
    // Check if the child component is rendered
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders the column body with the correct test id', () => {
    render(
      <KanbanColumn 
        interviewStep={mockInterviewStep} 
        columnId="test-column"
      />
    );
    
    // Check if the column body has the correct test id
    expect(screen.getByTestId('column-test-column')).toBeInTheDocument();
  });

  it('displays default candidate count of 0 when not provided', () => {
    render(
      <KanbanColumn 
        interviewStep={mockInterviewStep} 
        columnId="test-column"
      />
    );
    
    // Check if the default candidate count (0) is displayed
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});