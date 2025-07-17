import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Container, Button } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <Alert variant="danger">
                <Alert.Heading>¡Ups! Algo salió mal</Alert.Heading>
                <p>
                  Ha ocurrido un error inesperado en la aplicación. 
                  Esto puede deberse a un problema temporal.
                </p>
                <hr />
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="outline-danger" onClick={this.handleGoHome}>
                    Ir al inicio
                  </Button>
                  <Button variant="danger" onClick={this.handleReload}>
                    Recargar página
                  </Button>
                </div>
              </Alert>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert variant="secondary" className="mt-3">
                  <Alert.Heading>Detalles del error (desarrollo)</Alert.Heading>
                  <pre className="small text-muted">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </Alert>
              )}
            </div>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 