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
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  @media (min-width: 769px) and (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
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

const FeedbackButton = styled.button`
  background-color: #10B981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.18s, box-shadow 0.18s;
  width: 100%;
  font-size: 1rem;
  margin-top: 0.75rem;
  box-shadow: 0 2px 8px 0 rgba(16, 185, 129, 0.07);
  &:hover {
    background-color: #059669;
    box-shadow: 0 4px 16px 0 rgba(16, 185, 129, 0.13);
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

const RequestCard = styled.div`
  background: #f3f4f6;
  border: 2px dashed #9CA3AF;
  border-radius: 1.25rem;
  padding: 2.25rem 2rem 2rem 2rem;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  min-height: 260px;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  &:hover {
    border-color: #E31E54;
    background-color: #fef2f2;
    transform: translateY(-2px) scale(1.015);
  }
`;

const RequestIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #9CA3AF;
`;

const RequestTitle = styled.h3`
  color: #374151;
  font-size: 1.45rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const RequestDescription = styled.p`
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
`;

const RequestButton = styled.button`
  background-color: #E31E54;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.18s, box-shadow 0.18s;
  font-size: 1.05rem;
  margin-top: auto;
  box-shadow: 0 2px 8px 0 rgba(0,40,85,0.07);
  
  &:hover {
    background-color: #BE185D;
    box-shadow: 0 4px 16px 0 rgba(0,40,85,0.13);
  }
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

  const handleFeedbackClick = (cardTitle, roleType) => {
    const subject = encodeURIComponent(`Conclusion Nexus - Feedback for ${cardTitle}`);
    const body = encodeURIComponent(`Hi Nico,\n\nI'd like to share feedback about the "${cardTitle}" Chat Agent in Conclusion Nexus.\n\nMy feedback:\n\n[Please share your suggestions, feedback, or ideas here]\n\nBest regards,\n[Your name]`);
    window.open(`mailto:nico_Baburek@hotmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleRequestClick = () => {
    const subject = encodeURIComponent('Conclusion Nexus - New Chat Agent Request');
    const body = encodeURIComponent(`Hi Nico,\n\nI'd like to request a new Chat Agent for Conclusion Nexus.\n\nMy request:\n\n[Please describe the type of AI agent you'd like to see added]\n\nBest regards,\n[Your name]`);
    window.open(`mailto:nico_Baburek@hotmail.com?subject=${subject}&body=${body}`, '_blank');
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
        Experiment and explore with specialized AI agents to discover new ways of working
      </Subtitle>
      <CardsGrid>
        {/* First row: 2 regular cards + 1 request card */}
        {Array.from(new Map(roleCards.map(card => [card.role_type, card])).values())
          .filter(card => card.is_active)
          .slice(0, 2)
          .map((card) => (
            <Card 
              key={card.role_type} 
              disabled={!card.is_active}
            >
              {!card.is_active && <DisabledBadge>Disabled</DisabledBadge>}
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
              <CardButton 
                disabled={!card.is_active}
                onClick={() => card.is_active && handleCardClick(card.role_type)}
              >
                {card.is_active ? 'Start Chat' : 'Unavailable'}
              </CardButton>
              <FeedbackButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeedbackClick(card.title, card.role_type);
                }}
              >
                💡 Share Feedback
              </FeedbackButton>
            </Card>
          ))}
        
        {/* Request card in top-right position */}
        <RequestCard onClick={handleRequestClick}>
          <RequestIcon>💭</RequestIcon>
          <RequestTitle>Request New Agent</RequestTitle>
          <RequestDescription>
            Don't see the AI agent you need? Let us know what type of specialized assistant would help you most.
          </RequestDescription>
          <RequestButton>
            📧 Make Request
          </RequestButton>
        </RequestCard>
        
        {/* Remaining cards (3 per row) */}
        {Array.from(new Map(roleCards.map(card => [card.role_type, card])).values())
          .filter(card => card.is_active)
          .slice(2)
          .map((card) => (
            <Card 
              key={card.role_type} 
              disabled={!card.is_active}
            >
              {!card.is_active && <DisabledBadge>Disabled</DisabledBadge>}
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
              <CardButton 
                disabled={!card.is_active}
                onClick={() => card.is_active && handleCardClick(card.role_type)}
              >
                {card.is_active ? 'Start Chat' : 'Unavailable'}
              </CardButton>
              <FeedbackButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeedbackClick(card.title, card.role_type);
                }}
              >
                💡 Share Feedback
              </FeedbackButton>
            </Card>
          ))}
      </CardsGrid>
    </Container>
  );
};

export default Dashboard;