import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';

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
      <AppContainer>
        <Header user={user} onLogout={handleLogout} />
        <MainContent>
          <Routes>
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/chat/:roleType" 
              element={user ? <Chat user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={user && isAdmin ? <AdminPanel /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App; 