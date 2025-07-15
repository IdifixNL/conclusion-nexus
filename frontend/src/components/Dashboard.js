import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 2.5rem 2rem 3rem 2rem;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  background: #f8f9fa;
  border-radius: 0;
  box-shadow: none;
  font-family: 'Roboto', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Title = styled.h1`
  color: #002855;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: #374151;
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1.125rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background: ${props => props.disabled ? '#f8f9fa' : '#f3f4f6'};
  border: 1px solid ${props => props.disabled ? '#e5e7eb' : '#dee2e6'};
  border-radius: 1.25rem;
  padding: 2.25rem 2rem 2rem 2rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: box-shadow 0.25s, border-color 0.2s, transform 0.2s;
  position: relative;
  box-shadow: 0 2px 8px 0 rgba(0,40,85,0.04);
  display: flex;
  flex-direction: column;
  min-height: 260px;
  opacity: ${props => props.disabled ? 0.6 : 1};
  &:hover {
    border-color: ${props => props.disabled ? '#e5e7eb' : '#002855'};
    box-shadow: ${props => props.disabled ? '0 2px 8px 0 rgba(0,40,85,0.04)' : '0 8px 24px 0 rgba(0,40,85,0.10)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px) scale(1.015)'};
  }
`;

const DisabledBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #6b7280;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const CardTitle = styled.h3`
  color: #002855;
  font-size: 1.45rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
`;

const CardButton = styled.button`
  background-color: #D72638;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.18s, box-shadow 0.18s;
  width: 100%;
  font-size: 1.05rem;
  margin-top: auto;
  box-shadow: 0 2px 8px 0 rgba(0,40,85,0.07);
  &:hover {
    background-color: #a81c28;
    box-shadow: 0 4px 16px 0 rgba(0,40,85,0.13);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: #9CA3AF;
  font-size: 1.125rem;
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  text-align: center;
  padding: 2rem;
  background-color: #fff;
  border-radius: 0.5rem;
  border: 1px solid #EF4444;
  margin: 2rem 0;
`;

const Dashboard = ({ user }) => {
  const [roleCards, setRoleCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoleCards();
  }, []);

  const fetchRoleCards = async () => {
    try {
      const response = await axios.get('/api/role-cards');
      setRoleCards(response.data);
    } catch (error) {
      setError('Failed to load role cards');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (roleType) => {
    navigate(`/chat/${roleType}`);
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading role cards...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Welcome to Conclusion Nexus</Title>
      <Subtitle>
        Select a specialized AI agent to assist you with your work
      </Subtitle>
      <CardsGrid>
        {Array.from(new Map(roleCards.map(card => [card.role_type, card])).values()).map((card) => (
          <Card 
            key={card.role_type} 
            disabled={!card.is_active}
            onClick={() => card.is_active && handleCardClick(card.role_type)}
          >
            {!card.is_active && <DisabledBadge>Disabled</DisabledBadge>}
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
            <CardButton disabled={!card.is_active}>
              {card.is_active ? 'Start Chat' : 'Unavailable'}
            </CardButton>
          </Card>
        ))}
      </CardsGrid>
    </Container>
  );
};

export default Dashboard;