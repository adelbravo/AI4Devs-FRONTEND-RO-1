import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BriefcaseFill, PeopleFill, CalendarEventFill, TrendingUp } from 'react-bootstrap-icons';
import logo from '../assets/lti-logo.png';
import Navigation from './Navigation';

const RecruiterDashboard = () => {
    const navigate = useNavigate();

    const stats = [
        {
            title: 'Posiciones Abiertas',
            value: '5',
            icon: <BriefcaseFill size={40} className="text-primary mb-3" />,
            action: () => navigate('/positions'),
            buttonText: 'Ver Posiciones',
            variant: 'primary'
        },
        {
            title: 'Candidatos en Proceso',
            value: '12',
            icon: <PeopleFill size={40} className="text-success mb-3" />,
            action: () => navigate('/positions'),
            buttonText: 'Ver Candidatos',
            variant: 'success'
        },
        {
            title: 'Entrevistas Programadas',
            value: '3',
            icon: <CalendarEventFill size={40} className="text-warning mb-3" />,
            action: () => alert('Funcionalidad próximamente'),
            buttonText: 'Ver Calendario',
            variant: 'warning'
        }
    ];

    return (
        <>
            <Navigation />
            <Container className="mt-5">
                <div className="text-center mb-5">
                    <img src={logo} alt="LTI Logo" style={{ width: '120px' }} className="mb-3" />
                    <h1 className="display-5 fw-bold text-primary">Panel de Reclutador</h1>
                    <p className="lead text-muted">
                        Gestiona posiciones, candidatos y procesos de contratación de forma eficiente
                    </p>
                </div>

                <Row className="g-4 mb-5">
                    {stats.map((stat, index) => (
                        <Col key={index} md={4}>
                            <Card className="h-100 text-center shadow-sm border-0 hover-card">
                                <Card.Body className="d-flex flex-column">
                                    <div>{stat.icon}</div>
                                    <Card.Title className="h5 mb-2">{stat.title}</Card.Title>
                                    <Card.Text className="display-4 fw-bold text-primary mb-3">
                                        {stat.value}
                                    </Card.Text>
                                    <div className="mt-auto">
                                        <Button 
                                            variant={stat.variant} 
                                            onClick={stat.action}
                                            className="btn-sm"
                                        >
                                            {stat.buttonText}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Acceso rápido original */}
                <Row>
                    <Col md={6}>
                        <Card className="shadow p-4">
                            <h5 className="mb-4 d-flex align-items-center">
                                <PeopleFill className="me-2 text-primary" />
                                Añadir Candidato
                            </h5>
                            <Button 
                                variant="primary" 
                                className="w-100"
                                onClick={() => alert('Funcionalidad próximamente')}
                            >
                                Añadir Nuevo Candidato
                            </Button>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="shadow p-4">
                            <h5 className="mb-4 d-flex align-items-center">
                                <BriefcaseFill className="me-2 text-primary" />
                                Ver Posiciones
                            </h5>
                            <Button 
                                variant="primary" 
                                className="w-100"
                                onClick={() => navigate('/positions')}
                            >
                                Ir a Posiciones
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RecruiterDashboard;