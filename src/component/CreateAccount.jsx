import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import { registerApi } from "../service/AuthApiService";
import { useNavigate, Link } from "react-router-dom";
import "../css/tasks.css";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      valid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    } else if (!hasRequiredPasswordStrength(formData.password)) {
      newErrors.password = "Password must contain at least one letter and one number";
      valid = false;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      const response = await registerApi(registrationData);
      
      if (response && response.status === 201) {
        setRegistrationSuccess(true);
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "An error occurred during registration. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRequiredPasswordStrength = (password) => {
    // At least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    return passwordRegex.test(password);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (registrationSuccess) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="mb-4">
            <div className="spinner-border text-success" role="status" style={{ width: '4rem', height: '4rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <h2 className="text-success mb-3">Registration Successful!</h2>
          <p>Your account has been created successfully.</p>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page d-flex align-items-center" style={{ minHeight: '100vh' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Create an Account</h2>
                  <p className="text-muted">Join us today and start managing your tasks</p>
                </div>
                
                {error && (
                  <Alert variant="danger" className="mb-4" onClose={() => setError("")} dismissible>
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      isInvalid={!!errors.username}
                      placeholder="Choose a username"
                      autoComplete="username"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      isInvalid={!!errors.password}
                      placeholder="Create a password"
                      autoComplete="new-password"
                    />
                    <Form.Text className="text-muted">
                      Must be at least 6 characters with at least one letter and one number
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-4" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      isInvalid={!!errors.confirmPassword}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isLoading}
                      className="py-2"
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
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-center mt-4">
                    <p className="mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-decoration-none">
                        Sign in
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

export default CreateAccount;
