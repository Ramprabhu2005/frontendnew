import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import { loginApi, isUserLoggedIn } from "../service/AuthApiService";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../css/tasks.css";

const styles = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    background: '#f8f9fa',
    padding: '20px 0'
  },
  loginCard: {
    border: 'none',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '400px',
    margin: '0 auto'
  },
  loginHeader: {
    background: '#4e73df',
    color: 'white',
    padding: '1.5rem',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  formControl: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid #d1d3e2',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    height: 'auto'
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '1.5rem'
  },
  inputIcon: {
    position: 'absolute',
    top: '50%',
    left: '15px',
    transform: 'translateY(-50%)',
    color: '#d1d3e2',
    zIndex: 10
  },
  loginBtn: {
    background: '#4e73df',
    border: 'none',
    padding: '12px',
    fontWeight: '600',
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
    borderRadius: '8px',
    width: '100%',
    marginTop: '0.5rem',
    '&:hover': {
      background: '#2e59d9'
    }
  },
  link: {
    color: '#4e73df',
    textDecoration: 'none',
    fontWeight: '500',
    '&:hover': {
      textDecoration: 'underline',
      color: '#2e59d9'
    }
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '1.5rem 0',
    color: '#b7b9cc',
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      width: '45%',
      height: '1px',
      background: '#e3e6f0'
    },
    '&::before': {
      left: 0
    },
    '&::after': {
      right: 0
    }
  }
};

const LoginComponent = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Validate form fields
  const validateField = (name, value) => {
    let error = "";
    
    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === 'username' && value.length < 3) {
      error = "Username must be at least 3 characters";
    } else if (name === 'password' && value.length < 6) {
      error = "Password must be at least 6 characters";
    }
    
    return error;
  };
  
  // Handle input blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
    
    // Clear form error when any field changes
    if (formError) {
      setFormError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const newTouched = {};
    Object.keys(touched).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setFormError("");
    
    try {
      await loginApi(formData.username.trim(), formData.password);
      if (typeof props.onLoginSuccess === 'function') {
        props.onLoginSuccess();
      }
      navigate("/tasks");
    } catch (error) {
      console.error("Login error:", error);
      setFormError(error.response?.data?.message || "Invalid username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Loading state can be added here if needed



  return (
    <div style={styles.loginContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card style={styles.loginCard}>
              <Card.Header style={styles.loginHeader}>
                <h4 className="mb-0">Welcome Back!</h4>
                <small>Please login to your account</small>
              </Card.Header>
              <Card.Body className="p-4">
                {formError && (
                  <Alert variant="danger" onClose={() => setFormError("")} dismissible className="mb-4">
                    {formError}
                  </Alert>
                )}
                <Form onSubmit={handleSubmit} noValidate>
  {/* onLoginSuccess will be called in handleSubmit after login */}
                  <Form.Group controlId="formUsername">
                    <div style={styles.inputGroup}>
                      <FaUser style={styles.inputIcon} />
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter username or email"
                        autoComplete="username"
                        style={{ 
                          ...styles.formControl, 
                          paddingLeft: '45px',
                          borderColor: touched.username && errors.username ? '#dc3545' : '#d1d3e2'
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.username && !!errors.username}
                      />
                    </div>
                  </Form.Group>
                  
                  <Form.Group controlId="formPassword">
                    <div style={styles.inputGroup}>
                      <FaLock style={styles.inputIcon} />
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        autoComplete="current-password"
                        style={{ 
                          ...styles.formControl, 
                          paddingLeft: '45px',
                          borderColor: touched.password && errors.password ? '#dc3545' : '#d1d3e2'
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.password && !!errors.password}
                      />
                    </div>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check 
                      type="checkbox" 
                      id="rememberMe" 
                      label="Remember me"
                      style={{ fontSize: '0.9rem' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username || errors.password}
                    </Form.Control.Feedback>
                    <Link to="/forgot-password" style={styles.link}>
                      Forgot Password?
                    </Link>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isLoading}
                    style={styles.loginBtn}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  
                  <div style={styles.divider}>
                    <span style={{ background: '#f8f9fa', padding: '0 10px' }}>OR</span>
                  </div>
                  
                  <div className="text-center">
                    <p className="mb-0" style={{ color: '#858796' }}>
                      Don't have an account?{' '}
                      <Link to="/register" style={styles.link}>
                        Create an account!
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginComponent;
