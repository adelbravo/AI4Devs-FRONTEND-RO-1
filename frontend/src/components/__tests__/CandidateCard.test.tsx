import React from 'react';
import { render, screen } from '@testing-library/react';
import CandidateCard from '../CandidateCard';
import { Candidate } from '../../services/positionService';

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  Draggable: ({ children }) => 
    children({
      innerRef: jest.fn(),
      draggableProps: { style: {} },
      dragHandleProps: {},
    }, { isDragging: false }),
}));

describe('CandidateCard Component', () => {
  const mockCandidate: Candidate = {
    id: 1,
    fullName: 'John Doe',
    currentInterviewStep: 'Interview',
    averageScore: 4.5
  };

  it('renders the candidate name correctly', () => {
    render(<CandidateCard candidate={mockCandidate} index={0} />);
    
    // Check if the candidate name is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders the average score correctly for a high score', () => {
    render(<CandidateCard candidate={mockCandidate} index={0} />);
    
    // Check if the score is rendered correctly
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('renders N/A for a zero score', () => {
    const candidateWithZeroScore = { ...mockCandidate, averageScore: 0 };
    render(<CandidateCard candidate={candidateWithZeroScore} index={0} />);
    
    // Check if N/A is rendered for zero score
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders N/A for NaN score', () => {
    const candidateWithNaNScore = { ...mockCandidate, averageScore: NaN };
    render(<CandidateCard candidate={candidateWithNaNScore} index={0} />);
    
    // Check if N/A is rendered for NaN score
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('displays updating spinner when isUpdating is true', () => {
    render(<CandidateCard candidate={mockCandidate} index={0} isUpdating={true} />);
    
    // Check if the updating spinner is rendered
    const spinnerText = screen.getAllByText('Actualizando...')[0];
    expect(spinnerText).toBeInTheDocument();
  });

  it('does not display updating spinner when isUpdating is false', () => {
    render(<CandidateCard candidate={mockCandidate} index={0} isUpdating={false} />);
    
    // Check that the updating overlay is not rendered
    expect(screen.queryByText('Actualizando...')).toBeNull();
  });

  it('renders with the correct test id', () => {
    render(<CandidateCard candidate={mockCandidate} index={0} />);
    
    // Check if the card has the correct test id
    expect(screen.getByTestId(`candidate-card-${mockCandidate.id}`)).toBeInTheDocument();
  });

  it('renders a low score with the correct formatting', () => {
    const candidateWithLowScore = { ...mockCandidate, averageScore: 2.5 };
    render(<CandidateCard candidate={candidateWithLowScore} index={0} />);
    
    // Check if the score is rendered correctly
    expect(screen.getByText('2.5')).toBeInTheDocument();
  });

  it('renders a medium score with the correct formatting', () => {
    const candidateWithMediumScore = { ...mockCandidate, averageScore: 3.5 };
    render(<CandidateCard candidate={candidateWithMediumScore} index={0} />);
    
    // Check if the score is rendered correctly
    expect(screen.getByText('3.5')).toBeInTheDocument();
  });
});