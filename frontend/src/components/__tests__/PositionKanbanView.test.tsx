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

const mockUpdateResponse = {
  message: 'Candidate stage updated successfully',
  data: {
    id: 1,
    positionId: 1,
    candidateId: 201,
    applicationDate: '2025-07-16T10:00:00Z',
    currentInterviewStep: 2,
    notes: null,
    interviews: []
  }
};

describe('PositionKanbanView Integration Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup the service mocks
    (positionService.getPositionFlow as jest.Mock).mockResolvedValue(mockPositionFlow);
    (positionService.getPositionCandidates as jest.Mock).mockResolvedValue(mockCandidates);
    (positionService.updateCandidateStage as jest.Mock).mockResolvedValue(mockUpdateResponse);
    
    // Mock notification service
    (notificationService.trackPromise as jest.Mock).mockImplementation((promise) => promise);
    (notificationService.showSuccess as jest.Mock).mockImplementation(() => {});
    (notificationService.showWarning as jest.Mock).mockImplementation(() => {});
    (notificationService.showError as jest.Mock).mockImplementation(() => {});
    
    // Mock window.innerWidth for responsive testing
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024 // Default to desktop view
    });
    
    // Mock window resize event
    window.dispatchEvent = jest.fn();
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

  it('fetches and displays position data and candidates correctly', async () => {
    renderWithRouter();

    // Check loading state
    expect(screen.getByText('Cargando posición...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(positionService.getPositionFlow).toHaveBeenCalledWith('1');
      expect(positionService.getPositionCandidates).toHaveBeenCalledWith('1');
    });

    // Check position title is displayed
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Check columns are displayed
    await waitFor(() => {
      expect(screen.getByText('CV Review')).toBeInTheDocument();
      expect(screen.getByText('Technical Interview')).toBeInTheDocument();
      expect(screen.getByText('Final Interview')).toBeInTheDocument();
    });

    // Check candidates are displayed in correct columns
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

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

    // Check if error notification was shown
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

  it('handles responsive layout for mobile view', async () => {
    // Set window width to mobile size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500 // Mobile width
    });

    renderWithRouter();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Trigger resize event to ensure mobile view is activated
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Check for mobile navigation elements
    await waitFor(() => {
      expect(screen.getByText('Desliza o usa las flechas para navegar entre columnas')).toBeInTheDocument();
    });
  });

  it('handles error when fetching position data', async () => {
    // Mock the service to throw an error
    (positionService.getPositionFlow as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch position data')
    );

    renderWithRouter();

    // Check loading state
    expect(screen.getByText('Cargando posición...')).toBeInTheDocument();

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Error loading position data')).toBeInTheDocument();
    });

    // Check for retry button
    expect(screen.getByText('Reintentar')).toBeInTheDocument();
  });
});