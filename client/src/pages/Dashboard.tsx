import React, { useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Modal, Button } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <Container fluid className="p-0" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Top Navigation Bar */}
      <Navbar expand="lg" style={{ backgroundColor: '#6f42c1' }} className="mb-4">
        <Navbar.Brand as={Link} to="/dashboard" className="text-white ms-3">
          <img
            src="/digitalflake-logo.svg"
            height="30"
            className="d-inline-block align-top"
            alt="Digitalflake"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={handleLogoutClick} className="text-white">
              👤
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Row className="g-0" style={{ height: 'calc(100vh - 76px)' }}>
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-white shadow-sm">
          <div className="p-3">
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/dashboard" className="text-dark d-flex align-items-center py-2">
                🏠 Home
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/categories" className="text-dark d-flex align-items-center py-2">
                📁 Category
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/subcategories" className="text-dark d-flex align-items-center py-2">
                📋 Sub Category
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/products" className="text-dark d-flex align-items-center py-2">
                📦 Product
              </Nav.Link>
            </Nav>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="p-4">
          <div className="text-center">
            <img
              src="/digitalflake-logo.png"
              height="60"
              className="mb-4"
              alt="Digitalflake"
            />
            <h1 className="mb-3" style={{ color: '#6f42c1', fontWeight: 'bold' }}>
              Welcome to Digitalflake admin
            </h1>
            <p className="text-muted">
              Select a section from the sidebar to manage your e-commerce data
            </p>
          </div>
          
          <Outlet />
        </Col>
      </Row>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={handleCancelLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelLogout}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const DashboardHome: React.FC = () => {
  return (
    <div className="text-center py-5">
      <h3>Welcome to the Dashboard</h3>
      <p className="text-muted">Select a section from the sidebar to manage your e-commerce data</p>
    </div>
  );
};

export { DashboardHome };
export default Dashboard;
