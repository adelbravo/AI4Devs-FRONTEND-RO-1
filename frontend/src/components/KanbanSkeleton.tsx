import React from 'react';
import { Card, Placeholder, Row, Col } from 'react-bootstrap';
import './Kanban.css';

interface KanbanSkeletonProps {
  columnCount?: number;
  cardsPerColumn?: number;
}

/**
 * KanbanSkeleton component displays a loading skeleton for the kanban board
 * It shows placeholder columns and cards while data is being loaded
 * 
 * @param columnCount - Number of columns to display (default: 4)
 * @param cardsPerColumn - Number of card placeholders per column (default: 3)
 */
const KanbanSkeleton: React.FC<KanbanSkeletonProps> = ({ 
  columnCount = 4, 
  cardsPerColumn = 3 
}) => {
  return (
    <Row className="g-4">
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <Col key={colIndex} xs={12} md={6} lg={4} xl={3} className="mb-4">
          <Card className="kanban-column h-100 skeleton-column">
            <Card.Header className="text-center d-flex justify-content-between align-items-center">
              <Placeholder as="h5" animation="glow" className="mb-0 w-75">
                <Placeholder xs={12} />
              </Placeholder>
              <Placeholder.Button variant="secondary" xs={1} className="rounded-pill" />
            </Card.Header>
            <Card.Body className="kanban-column-body">
              {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
                <Card key={cardIndex} className="candidate-card skeleton-card mb-2">
                  <Card.Body className="p-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <Placeholder as="div" animation="glow" className="candidate-name w-75">
                        <Placeholder xs={12} />
                      </Placeholder>
                      <Placeholder.Button variant="secondary" xs={1} className="rounded-pill" />
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default KanbanSkeleton;