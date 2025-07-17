import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanHeader from '../KanbanHeader';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('KanbanHeader Component', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    mockNavigate.mockClear();
  });

  it('renders the title correctly', () => {
    const testTitle = 'Test Position Title';
    render(<KanbanHeader title={testTitle} />);
    
    // Check if the title is rendered
    expect(screen.getByText(testTitle)).toBeInTheDocument();
  });

  it('renders a back button with arrow icon', () => {
    render(<KanbanHeader title="Test Title" />);
    
    // Check if the back button exists with the correct aria-label
    const backButton = screen.getByLabelText('Volver a posiciones');
    expect(backButton).toBeInTheDocument();
  });

  it('navigates to positions page when back button is clicked', () => {
    render(<KanbanHeader title="Test Title" />);
    
    // Find and click the back button
    const backButton = screen.getByLabelText('Volver a posiciones');
    fireEvent.click(backButton);
    
    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/positions');
  });
});