import React from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';

interface PositionHeaderProps {
  title: string | undefined;
  onBack: () => void;
  loading?: boolean;
}

const PositionHeader: React.FC<PositionHeaderProps> = ({ title, onBack, loading = false }) => {
  return (
    <div className="position-header py-3 mb-4 border-bottom">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-outline-secondary me-3 d-flex align-items-center"
            onClick={onBack}
            disabled={loading}
            aria-label="Volver al listado de posiciones"
          >
            <ArrowLeft size={20} />
            <span className="ms-2 d-none d-sm-inline">Volver</span>
          </button>
          
          <div className="flex-grow-1">
            <h1 className="h3 mb-0 text-primary">
              {loading ? (
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  Cargando posición...
                </div>
              ) : (
                title || 'Gestión de Candidatos'
              )}
            </h1>
            <p className="text-muted mb-0 small">
              Arrastra los candidatos entre las columnas para cambiar su estado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionHeader; 