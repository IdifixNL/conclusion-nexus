import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import RegistrationSuccess from './components/RegistrationSuccess';

// Minimal Executive Blue theme
const colors = {
  primary: '#002855', // Navy
  accent: '#D72638', // Strong red
  background: '#f8f9fa', // Light gray
  text: '#002855', // Navy for text
  cardBorder: '#dee2e6', // Thin card border
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  color: ${colors.text};
  font-family: 'Roboto', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const AuthContainer = styled.div`
  min-height: 100vh;
  background-color: transparent;
  color: ${colors.text};
  font-family: 'Roboto', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setIsAdmin(userObj.role === 'admin');
      console.log('DEBUG (mount): user', userObj, 'isAdmin', userObj.role === 'admin');
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    setIsAdmin(userData.role === 'admin');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('DEBUG (login): user', userData, 'isAdmin', userData.role === 'admin');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/register" 
          element={
            user ? <Navigate to="/dashboard" /> : (
              <AuthContainer>
                <Register onLogin={handleLogin} />
              </AuthContainer>
            )
          } 
        />
        <Route 
          path="/registration-success" 
          element={
            <AuthContainer>
              <RegistrationSuccess />
            </AuthContainer>
          } 
        />
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/dashboard" /> : (
              <AuthContainer>
                <Login onLogin={handleLogin} />
              </AuthContainer>
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <AppContainer>
              <Header user={user} onLogout={handleLogout} />
              <MainContent>
                {user ? <Dashboard user={user} /> : <Navigate to="/login" />}
              </MainContent>
            </AppContainer>
          } 
        />
        <Route 
          path="/chat/:roleType" 
          element={
            <AppContainer>
              <Header user={user} onLogout={handleLogout} />
              <MainContent>
                {user ? <Chat user={user} /> : <Navigate to="/login" />}
              </MainContent>
            </AppContainer>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AppContainer>
              <Header user={user} onLogout={handleLogout} />
              <MainContent>
                {user && isAdmin ? <AdminPanel /> : <Navigate to="/login" />}
              </MainContent>
            </AppContainer>
          } 
        />
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App; 