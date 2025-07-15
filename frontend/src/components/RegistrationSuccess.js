import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import NeuralNetworkBackground from './NeuralNetworkBackground';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
`;

const SuccessCard = styled.div`
  background-color: #1F2937;
  padding: 3rem 2rem;
  border-radius: 0.5rem;
  border: 2px solid #10B981;
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2);
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: #10B981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-size: 2.5rem;
  color: white;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const Title = styled.h1`
  color: #10B981;
  margin-bottom: 1.5rem;
  font-size: 1.875rem;
  font-weight: bold;
`;

const Message = styled.div`
  color: #9CA3AF;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const InfoBox = styled.div`
  background-color: #111827;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const InfoTitle = styled.h3`
  color: #E31E54;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
`;

const InfoList = styled.ul`
  color: #9CA3AF;
  line-height: 1.6;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const Button = styled.button`
  background-color: #E31E54;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 0 0.5rem;
  
  &:hover {
    background-color: #BE185D;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const RegistrationSuccess = () => {
  return (
    <>
      <NeuralNetworkBackground />
      <Container>
        <SuccessCard>
          <SuccessIcon>✓</SuccessIcon>
          <Title>Account Created Successfully!</Title>
          
          <Message>
            Your account has been created and is pending admin approval. 
            You will receive an email notification once your account is approved.
          </Message>
          
          <InfoBox>
            <InfoTitle>What happens next?</InfoTitle>
            <InfoList>
              <li>An administrator will review your account</li>
              <li>You'll receive an email notification when approved</li>
              <li>You can then log in and access all features</li>
              <li>This process usually takes 24-48 hours</li>
            </InfoList>
          </InfoBox>
          
          <ButtonContainer>
            <Link to="/login">
              <Button>Try Logging In</Button>
            </Link>
            <Button onClick={() => window.location.reload()}>
              Create Another Account
            </Button>
          </ButtonContainer>
        </SuccessCard>
      </Container>
    </>
  );
};

export default RegistrationSuccess; 