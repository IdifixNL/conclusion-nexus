import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(227, 30, 84, 0.3);
  padding: 1rem 2rem;
  z-index: 100;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BrandLogo = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  
  .conclusion {
    color: #E31E54;
  }
  
  .nexus {
    color: #E31E54;
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes glow {
    0% { text-shadow: 0 0 5px currentColor; }
    100% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
  }
`;

const ContactSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  color: #9CA3AF;
  font-size: 0.875rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  a {
    color: #E31E54;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: #BE185D;
      text-decoration: underline;
    }
  }
`;

const ContactIcon = styled.span`
  font-size: 1rem;
  color: #E31E54;
`;

const DeveloperInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9CA3AF;
  font-size: 0.875rem;
`;

const BrandingFooter = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <BrandSection>
          <BrandLogo>
            <span className="conclusion">Conclusion</span>
            {' '}
            <span className="nexus">Nexus</span>
          </BrandLogo>
        </BrandSection>
        
        <ContactSection>
          <ContactItem>
            <ContactIcon>📧</ContactIcon>
            <a href="mailto:nico_baburek@hotmail.com">nico_baburek@hotmail.com</a>
          </ContactItem>
          
          <ContactItem>
            <ContactIcon>💼</ContactIcon>
            <a href="https://www.linkedin.com/in/nico-baburek-57524215/" target="_blank" rel="noopener noreferrer">
              LinkedIn Profile
            </a>
          </ContactItem>
          
          <DeveloperInfo>
            <ContactIcon>👨‍💻</ContactIcon>
            <span>Developed by Nico Baburek</span>
          </DeveloperInfo>
        </ContactSection>
      </FooterContent>
    </FooterContainer>
  );
};

export default BrandingFooter; 