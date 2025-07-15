import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { apiCall } from '../config';
import NeuralNetworkBackground from './NeuralNetworkBackground';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
`;

const FormContainer = styled.div`
  background-color: #1F2937;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 2px solid #E31E54;
  width: 100%;
  max-width: 400px;
`;

const ProjectName = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  
  .conclusion {
    color: #E31E54;
  }
  
  .nexus {
    color: #E31E54;
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  .conclusion .letter {
    display: inline-block;
  }
  
  .conclusion .letter:nth-child(1) { color: #FF6B6B; }
  .conclusion .letter:nth-child(2) { color: #4ECDC4; }
  .conclusion .letter:nth-child(3) { color: #45B7D1; }
  .conclusion .letter:nth-child(4) { color: #96CEB4; }
  .conclusion .letter:nth-child(5) { color: #FFEAA7; }
  .conclusion .letter:nth-child(6) { color: #DDA0DD; }
  .conclusion .letter:nth-child(7) { color: #98D8C8; }
  .conclusion .letter:nth-child(8) { color: #F7DC6F; }
  .conclusion .letter:nth-child(9) { color: #BB8FCE; }
  .conclusion .letter:nth-child(10) { color: #85C1E9; }
  
  @keyframes glow {
    0% { text-shadow: 0 0 5px currentColor; }
    100% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #E31E54;
  margin-bottom: 2rem;
  font-size: 1.875rem;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #9CA3AF;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  background-color: #111827;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #E31E54;
    box-shadow: 0 0 0 3px rgba(227, 30, 84, 0.1);
  }
`;

const Button = styled.button`
  background-color: #E31E54;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #BE185D;
  }
  
  &:disabled {
    background-color: #6B7280;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #9CA3AF;
  
  a {
    color: #E31E54;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(apiCall('/api/login'), {
        email: formData.email,
        password: formData.password
      });

      onLogin(response.data.user, response.data.token);
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NeuralNetworkBackground />
      <Container>
        <FormContainer>
          <ProjectName>
            <span className="conclusion">
              {'Conclusion'.split('').map((letter, index) => (
                <span key={index} className="letter">{letter}</span>
              ))}
            </span>
            {' '}
            <span className="nexus">Nexus</span>
          </ProjectName>
          <Title>Welcome Back</Title>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form>
          
          <LinkText>
            Don't have an account? <Link to="/register">Register</Link>
          </LinkText>
        </FormContainer>
      </Container>
    </>
  );
};

export default Login; 