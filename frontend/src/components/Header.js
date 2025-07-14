import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: #000; /* Black */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
`;

const LogoImg = styled.img`
  height: 128px;
  width: 128px;
  margin-right: 0.75rem;
  vertical-align: middle;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  
  .nexus {
    color: #D72638;
    margin-left: 0.25rem;
    font-weight: bold;
  }
  .slogan {
    font-size: 1rem;
    font-weight: 400;
    font-style: italic;
    color: #fff;
    margin-left: 1.5rem;
    letter-spacing: 0.02em;
    opacity: 0.92;
    white-space: nowrap;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  color: #fff;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #fff;
`;

const LogoutButton = styled.button`
  background-color: #D72638;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #a81c28;
  }
`;

const Header = ({ user, onLogout }) => {
  return (
    <HeaderContainer>
      <Logo>
        <LogoImg src="/img/topmenu/768x768.webp" alt="Conclusion Logo" />
        <span className="nexus">Nexus</span>
        <span className="slogan">Empowering Your Business Processes with AI and Human Insight</span>
      </Logo>
      
      <Nav>
        {user && user.role === 'admin' && (
          <Link to="/admin" style={{ color: '#D72638', fontWeight: 'bold', textDecoration: 'none' }}>
            Admin Panel
          </Link>
        )}
        {user && (
          <>
            <UserInfo>
              <span>Welcome, {user.email}</span>
            </UserInfo>
            <LogoutButton onClick={onLogout}>
              Logout
            </LogoutButton>
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 