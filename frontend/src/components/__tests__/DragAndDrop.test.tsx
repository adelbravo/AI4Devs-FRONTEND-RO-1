import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PositionKanbanView from '../PositionKanbanView';
import * as positionService from '../../services/positionService';
import notificationService from '../../services/notificationService';

// Mock the services
jest.mock('../../services/positionService');
jest.mock('../../services/notificationService');

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children, onDragEnd }) => {
    // Store the onDragEnd callback for testing
    window.mockOnDragEnd = onDragEnd;
    return <div data-testid="drag-drop-context">{children}</div>;
  },
  Droppable: ({ children, droppableId }) => 
    children({
      innerRef: jest.fn(),
      droppableProps: { 'data-rbd-droppable-id': droppableId },
      placeholder: null
    }, { isDraggingOver: false }),
  Draggable: ({ children, draggableId, index }) => 
    children({
      innerRef: jest.fn(),
      draggableProps: { 
        'data-rbd-draggable-id': draggableId,
        style: {} 
      },
      dragHandleProps: {},
    }, { isDragging: false }),
}));

// Mock data
const mockPositionFlow = {
  positionName: 'Frontend Developer',
  interviewFlow: {
    id: 1,
    description: 'Standard Interview Process',
    interviewSteps: [
      {
        id: 101,
        interviewFlowId: 1,
        interviewTypeId: 1,
        name: 'CV Review',
        orderIndex: 1
      },
      {
        id: 102,
        interviewFlowId: 1,
        interviewTypeId: 2,
        name: 'Technical Interview',
        orderIndex: 2
      },
      {
        id: 103,
        interviewFlowId: 1,
        interviewTypeId: 3,
        name: 'Final Interview',
        orderIndex: 3
      }
    ]
  }
};

const mockCandidates = [
  {
    id: 201,
    fullName: 'John Doe',
    currentInterviewStep: 'CV Review',
    averageScore: 4.5
  },
  {
    id: 202,
    fullName: 'Jane Smith',
    currentInterviewStep: 'CV Review',
    averageScore: 3.8
  },
  {
    id: 203,
    fullName: 'Bob Johnson',
    currentInterviewStep: 'Technical Interview',
    averageScore: 4.2
  }
];

describe('Drag and Drop Functionality Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup the service mocks
    (positionService.getPositionFlow as jest.Mock).mockResolvedValue(mockPositionFlow);
    (positionService.getPositionCandidates as jest.Mock).mockResolvedValue(mockCandidates);
    (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({
      message: 'Success',
      data: { id: 1, currentInterviewStep: 2 }
    });
    
    // Mock notification service
    (notificationService.trackPromise as jest.Mock).mockImplementation((promise) => promise);
    (notificationService.showWarning as jest.Mock).mockImplementation(() => {});
    
    // Mock DOM methods that we can't directly test
    document.body.classList.add = jest.fn();
    document.body.classList.remove = jest.fn();
    
    // Mock document.querySelector
    document.querySelector = jest.fn().mockReturnValue({
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      }
    });
  });

  const renderWithRouter = (positionId = '1') => {
    return render(
      <MemoryRouter initialEntries={[`/positions/${positionId}/kanban`]}>
        <Routes>
          <Route path="/positions/:id/kanban" element={<PositionKanbanView />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('handles drag and drop to update candidate stage', async () => {
    renderWithRouter();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Simulate drag and drop
    const mockDragResult = {
      draggableId: 'candidate-201', // John Doe
      source: {
        droppableId: 'column-101', // CV Review
        index: 0
      },
      destination: {
        droppableId: 'column-102', // Technical Interview
        index: 0
      },
      type: 'DEFAULT',
      reason: 'DROP',
      mode: 'FLUID'
    };

    // Execute the drag end callback
    act(() => {
      window.mockOnDragEnd(mockDragResult);
    });

    // Check if the service was called with correct parameters
    await waitFor(() => {
      expect(positionService.updateCandidateStage).toHaveBeenCalledWith(
        '201',
        expect.objectContaining({
          applicationId: '1',
          currentInterviewStep: 'Technical Interview'
        })
      );
    });

    // Check if notification service was used
    expect(notificationService.trackPromise).toHaveBeenCalled();
  });

  it('handles error when updating candidate stage', async () => {
    // Mock the service to throw an error
    (positionService.updateCandidateStage as jest.Mock).mockRejectedValue(
      new Error('Failed to update candidate stage')
    );

    renderWithRouter();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Simulate drag and drop
    const mockDragResult = {
      draggableId: 'candidate-201', // John Doe
      source: {
        droppableId: 'column-101', // CV Review
        index: 0
      },
      destination: {
        droppableId: 'column-102', // Technical Interview
        index: 0
      },
      type: 'DEFAULT',
      reason: 'DROP',
      mode: 'FLUID'
    };

    // Execute the drag end callback
    act(() => {
      window.mockOnDragEnd(mockDragResult);
    });

    // Check if the service was called
    await waitFor(() => {
      expect(positionService.updateCandidateStage).toHaveBeenCalled();
    });

    // Check if notification service was used
    expect(notificationService.trackPromise).toHaveBeenCalled();
  });

  it('handles drag to invalid destination (null destination)', async () => {
    renderWithRouter();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Simulate drag with null destination (dropped outside valid area)
    const mockDragResult = {
      draggableId: 'candidate-201', // John Doe
      source: {
        droppableId: 'column-101', // CV Review
        index: 0
      },
      destination: null, // Dropped outside valid area
      type: 'DEFAULT',
      reason: 'DROP',
      mode: 'FLUID'
    };

    // Execute the drag end callback
    act(() => {
      window.mockOnDragEnd(mockDragResult);
    });

    // Check that the service was NOT called
    expect(positionService.updateCandidateStage).not.toHaveBeenCalled();
  });

  it('handles drag to same position (no change)', async () => {
    renderWithRouter();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Simulate drag to same position
    const mockDragResult = {
      draggableId: 'candidate-201', // John Doe
      source: {
        droppableId: 'column-101', // CV Review
        index: 0
      },
      destination: {
        droppableId: 'column-101', // Same column (CV Review)
        index: 0 // Same position
      },
      type: 'DEFAULT',
      reason: 'DROP',
      mode: 'FLUID'
    };

    // Execute the drag end callback
    act(() => {
      window.mockOnDragEnd(mockDragResult);
    });

    // Check that the service was NOT called
    expect(positionService.updateCandidateStage).not.toHaveBeenCalled();
  });
});

// Add the global type for the window object
declare global {
  interface Window {
    mockOnDragEnd: any;
  }
}