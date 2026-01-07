import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, register, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (showForgotPassword) {
        await forgotPassword(email);
        setError('Password reset link sent! Check your email.');
        setTimeout(() => {
          setShowForgotPassword(false);
          setError('');
        }, 3000);
      } else if (isRegister) {
        await register(username, email, password);
        navigate('/dashboard');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showForgotPassword) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={4}>
              <Card className="shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ color: '#6f42c1', fontSize: '1.5rem' }}>
                      D digitalflake
                    </h2>
                  </div>
                  
                  <h4 className="text-center mb-4" style={{ color: '#333', fontSize: '1.1rem' }}>
                    Did you forget password?
                  </h4>
                  
                  <p className="text-center text-muted mb-4">
                    Enter your email address and we'll send you a link to restore password
                  </p>

                  {error && <Alert variant="danger">{error}</Alert>}
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label className="fw-semibold">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ borderRadius: '8px', padding: '12px' }}
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mb-3"
                      disabled={loading}
                      style={{ 
                        backgroundColor: '#6f42c1', 
                        border: 'none', 
                        borderRadius: '8px', 
                        padding: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {loading ? 'Loading...' : 'Request reset link'}
                    </Button>
                  </Form>

                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError('');
                      }}
                      style={{ color: '#6f42c1', textDecoration: 'none' }}
                    >
                      Back to log in
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col md={6} lg={5}>
            <Card className="shadow-sm border-0" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-3" style={{ color: '#6f42c1', fontSize: '1.8rem' }}>
                    D digitalflake
                  </h2>
                  <p className="text-muted mb-0">Welcome to Digitalflake admin</p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  {isRegister && (
                    <Form.Group className="mb-3" controlId="formUsername">
                      <Form.Label className="fw-semibold">Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ borderRadius: '8px', padding: '12px' }}
                      />
                    </Form.Group>
                  )}
                  
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="fw-semibold">Email-id</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ borderRadius: '8px', padding: '12px' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4 position-relative" controlId="formPassword">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ borderRadius: '8px', padding: '12px', paddingRight: '45px' }}
                      />
                      <Button
                        variant="link"
                        className="position-absolute end-0 top-50 translate-middle-y me-2"
                        style={{ 
                          color: '#6c757d', 
                          padding: '0 5px',
                          textDecoration: 'none'
                        }}
                        onClick={togglePasswordVisibility}
                      >
                        <span style={{ cursor: 'pointer' }}>
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                      </Button>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                    style={{ 
                      backgroundColor: '#6f42c1', 
                      border: 'none', 
                      borderRadius: '8px', 
                      padding: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {loading ? 'Loading...' : 'Log In'}
                  </Button>
                </Form>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsRegister(!isRegister);
                      setError('');
                    }}
                    >
                    {isRegister
                      ? 'Already have an account? Login'
                      : "Don't have an account? Register"}
                  </Button>
                </div>
                
                {!isRegister && (
                  <div className="text-center mt-2">
                    <Button
                      variant="link"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-muted"
                      style={{ textDecoration: 'none' }}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={7} className="d-none d-lg-flex align-items-center justify-content-center">
            <div className="text-center">
              <div 
                className="img-fluid"
                style={{ 
                  maxWidth: '400px',
                  height: '300px',
                  backgroundColor: '#6f42c1',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              >
                📱
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
