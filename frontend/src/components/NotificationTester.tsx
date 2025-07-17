import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import notificationService from '../services/notificationService';

/**
 * NotificationTester component
 * A simple component to test different types of notifications
 */
const NotificationTester: React.FC = () => {
  // Function to show a success notification
  const showSuccessNotification = () => {
    notificationService.showSuccess('Operación completada con éxito');
  };

  // Function to show an error notification
  const showErrorNotification = () => {
    notificationService.showError('Ha ocurrido un error al procesar la solicitud');
  };

  // Function to show a warning notification
  const showWarningNotification = () => {
    notificationService.showWarning('Atención: Esta acción no se puede deshacer');
  };

  // Function to show an info notification
  const showInfoNotification = () => {
    notificationService.showInfo('Información importante para el usuario');
  };

  // Function to test the trackPromise functionality with a successful promise
  const testSuccessPromise = () => {
    notificationService.trackPromise(
      new Promise<string>((resolve) => {
        // Simulate an API call that takes 2 seconds
        setTimeout(() => {
          resolve('Datos obtenidos correctamente');
        }, 2000);
      }),
      'Cargando datos...',
      'Datos cargados correctamente',
      'Error al cargar los datos'
    );
  };

  // Function to test the trackPromise functionality with a failed promise
  const testFailedPromise = () => {
    notificationService.trackPromise(
      new Promise<string>((_, reject) => {
        // Simulate an API call that fails after 2 seconds
        setTimeout(() => {
          reject(new Error('Error de conexión con el servidor'));
        }, 2000);
      }),
      'Cargando datos...',
      'Datos cargados correctamente',
      (error) => `Error al cargar los datos: ${error.message}`
    );
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Prueba de Notificaciones</h2>
      
      <Card className="mb-4">
        <Card.Header>Notificaciones Básicas</Card.Header>
        <Card.Body>
          <Row>
            <Col md={3} className="mb-2">
              <Button 
                variant="success" 
                onClick={showSuccessNotification}
                className="w-100"
              >
                Notificación de Éxito
              </Button>
            </Col>
            <Col md={3} className="mb-2">
              <Button 
                variant="danger" 
                onClick={showErrorNotification}
                className="w-100"
              >
                Notificación de Error
              </Button>
            </Col>
            <Col md={3} className="mb-2">
              <Button 
                variant="warning" 
                onClick={showWarningNotification}
                className="w-100"
              >
                Notificación de Advertencia
              </Button>
            </Col>
            <Col md={3} className="mb-2">
              <Button 
                variant="info" 
                onClick={showInfoNotification}
                className="w-100"
              >
                Notificación de Información
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>Notificaciones con Promesas</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-2">
              <Button 
                variant="primary" 
                onClick={testSuccessPromise}
                className="w-100"
              >
                Promesa Exitosa
              </Button>
            </Col>
            <Col md={6} className="mb-2">
              <Button 
                variant="secondary" 
                onClick={testFailedPromise}
                className="w-100"
              >
                Promesa Fallida
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NotificationTester;