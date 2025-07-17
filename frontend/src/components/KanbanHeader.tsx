import React from 'react';
import { Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

interface KanbanHeaderProps {
  title: string;
}

/**
 * KanbanHeader component displays the title of the position and a back button
 * 
 * @param title - The title of the position to display
 */
const KanbanHeader: React.FC<KanbanHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/positions');
  };

  return (
    <div className="d-flex align-items-center mb-4">
      <Button 
        variant="link" 
        className="p-0 me-2" 
        onClick={handleBackClick}
        aria-label="Volver a posiciones"
      >
        <ArrowLeft size={24} />
      </Button>
      <h2 className="mb-0">{title}</h2>
    </div>
  );
};

export default KanbanHeader;