import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { House, BriefcaseFill, Kanban } from 'react-bootstrap-icons';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      key: 'dashboard',
      path: '/dashboard',
      label: 'Dashboard',
      icon: <House size={16} className="me-2" />
    },
    {
      key: 'positions',
      path: '/positions',
      label: 'Posiciones',
      icon: <BriefcaseFill size={16} className="me-2" />
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer' }}
          className="d-flex align-items-center"
        >
          <Kanban size={24} className="me-2" />
          <strong>LTI</strong>
          <small className="ms-2 opacity-75">Talent Tracking</small>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navItems.map((item) => (
              <Nav.Link
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`d-flex align-items-center ${isActive(item.path) ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                {item.icon}
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
          
          <Nav>
            <Nav.Link href="#" className="text-light">
              <small>👤 Usuario</small>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 