import React from 'react';
import styled from 'styled-components';

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const OverlayContent = styled.div`
  background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
  border: 2px solid #E31E54;
  border-radius: 1rem;
  padding: 2.5rem;
  max-width: 600px;
  width: 90%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h1`
  color: #E31E54;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(227, 30, 84, 0.3);
`;

const Subtitle = styled.h2`
  color: #9CA3AF;
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 2rem;
`;

const WelcomeText = styled.p`
  color: #D1D5DB;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: left;
`;

const ContactSection = styled.div`
  background: rgba(227, 30, 84, 0.1);
  border: 1px solid rgba(227, 30, 84, 0.3);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ContactTitle = styled.h3`
  color: #E31E54;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`;

const ContactLink = styled.a`
  color: #60A5FA;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
  
  &:hover {
    color: #93C5FD;
    text-decoration: underline;
  }
`;

const CloseButton = styled.button`
  background: #E31E54;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #BE185D;
  }
`;

const WelcomeOverlay = ({ onClose }) => {
  return (
    <OverlayContainer onClick={onClose}>
      <OverlayContent onClick={(e) => e.stopPropagation()}>
        <Title>Welcome to Conclusion Nexus</Title>
        <Subtitle>Exploring the Future of Work</Subtitle>
        
        <WelcomeText>
          Conclusion Nexus represents the cutting edge of workplace innovation, 
          paving the way for the future of collaborative work. This platform 
          serves as a living laboratory where users can experiment with real data 
          and experience firsthand what's possible in the evolving landscape of 
          digital collaboration and AI-enhanced productivity.
        </WelcomeText>
        
        <ContactSection>
          <ContactTitle>Get in Touch</ContactTitle>
          <ContactInfo>
            <ContactLink href="mailto:nico_Baburek@hotmail.com">
              📧 nico_Baburek@hotmail.com
            </ContactLink>
            <ContactLink 
              href="https://www.linkedin.com/in/nico-baburek-57524215/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              🔗 LinkedIn Profile
            </ContactLink>
          </ContactInfo>
        </ContactSection>
        
        <CloseButton onClick={onClose}>
          Continue to Nexus
        </CloseButton>
      </OverlayContent>
    </OverlayContainer>
  );
};

export default WelcomeOverlay; 