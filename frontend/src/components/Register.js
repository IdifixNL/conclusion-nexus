import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

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

const SuccessMessage = styled.div`
  color: #10B981;
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

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #111827;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const DropdownItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  color: white;
  border-bottom: 1px solid #374151;
  
  &:hover {
    background-color: #374151;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    company_role: 'Conclusion Enablement',
    your_role: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const dropdownRef = useRef(null);

  // Conclusion companies data
  const conclusionCompanies = [
    'Conclusion Enablement',
    'Conclusion Data',
    'Conclusion Learning',
    'Conclusion AFAS',
    'Conclusion AI',
    'Conclusion Development',
    'Conclusion Strategy',
    'Conclusion Security',
    'Conclusion Cloud',
    'Conclusion Design',
    'Conclusion Mobility',
    'Conclusion Integration',
    'Conclusion Innovation',
    'Conclusion Mendix',
    'Conclusion Dynamics',
    'Conclusion Critical IT',
    'Conclusion Sourcing',
    'Conclusion Healthcare',
    'Conclusion Java',
    'Conclusion Healthcare IT',
    'Conclusion BI',
    'Conclusion Project Management',
    'Conclusion Public',
    'Conclusion SAP',
    'Conclusion Financial'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Handle company role autocomplete
    if (name === 'company_role') {
      if (value.trim() === '') {
        setFilteredCompanies([]);
        setShowDropdown(false);
      } else {
        const filtered = conclusionCompanies.filter(company =>
          company.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCompanies(filtered);
        setShowDropdown(filtered.length > 0);
      }
    }
  };

  const handleCompanySelect = (company) => {
    setFormData({
      ...formData,
      company_role: company
    });
    setShowDropdown(false);
    setFilteredCompanies([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validatePassword = (password) => {
    const requirements = [
      password.length >= 10,
      (password.match(/[A-Z]/g) || []).length >= 2,
      (password.match(/[0-9]/g) || []).length >= 2,
      (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >= 2
    ];
    return requirements.every(req => req);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password does not meet all requirements');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/register', {
        email: formData.email,
        password: formData.password,
        company_role: formData.company_role,
        your_role: formData.your_role
      });

      // Redirect to success page instead of auto-login
      navigate('/registration-success');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
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
          <Title>Create Account</Title>
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
                onFocus={() => setShowPasswordStrength(true)}
                onBlur={() => setShowPasswordStrength(false)}
                required
              />
              {showPasswordStrength && formData.password && (
                <PasswordStrengthIndicator password={formData.password} />
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword ? '#EF4444' : 
                               formData.confirmPassword && formData.password === formData.confirmPassword ? '#10B981' : '#374151'
                }}
              />
              {formData.confirmPassword && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  color: formData.password === formData.confirmPassword ? '#10B981' : '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontWeight: 'bold' }}>
                    {formData.password === formData.confirmPassword ? '✓' : '✗'}
                  </span>
                  {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </div>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="company_role">Conclusion Label</Label>
              <DropdownContainer ref={dropdownRef}>
                <Input
                  type="text"
                  id="company_role"
                  name="company_role"
                  value={formData.company_role}
                  onChange={handleChange}
                  placeholder="Select or type a Conclusion company"
                  required
                  autoComplete="off"
                />
                {showDropdown && (
                  <DropdownList>
                    {filteredCompanies.map((company, index) => (
                      <DropdownItem
                        key={index}
                        onClick={() => handleCompanySelect(company)}
                      >
                        {company}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                )}
              </DropdownContainer>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="your_role">Your Role</Label>
              <Input
                type="text"
                id="your_role"
                name="your_role"
                value={formData.your_role}
                onChange={handleChange}
                placeholder="e.g., Service Manager, Azure Platform Engineer, Developer"
                required
              />
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Form>
          
          <LinkText>
            Already have an account? <Link to="/login">Log in</Link>
          </LinkText>
        </FormContainer>
      </Container>
    </>
  );
};

export default Register; 