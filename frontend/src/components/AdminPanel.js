import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #E31E54;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  background-color: ${props => props.active ? '#E31E54' : '#374151'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#BE185D' : '#4B5563'};
  }
`;

const PanelContainer = styled.div`
  background-color: #1F2937;
  border-radius: 0.5rem;
  border: 2px solid #E31E54;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #374151;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #374151;
  color: #9CA3AF;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => props.active ? `
    background-color: #10B981;
    color: white;
  ` : `
    background-color: #EF4444;
    color: white;
  `}
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 0.5rem;
  
  ${props => props.block ? `
    background-color: #EF4444;
    color: white;
    
    &:hover {
      background-color: #DC2626;
    }
  ` : `
    background-color: #10B981;
    color: white;
    
    &:hover {
      background-color: #059669;
    }
  `}
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9CA3AF;
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  padding: 1rem;
  background-color: #1F2937;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #10B981;
  padding: 1rem;
  background-color: #1F2937;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roleCards, setRoleCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    role_type: '',
    webhook_url: ''
  });
  const [editingCardId, setEditingCardId] = useState(null);
  const [editCard, setEditCard] = useState({
    title: '',
    description: '',
    role_type: '',
    webhook_url: '',
    is_active: true
  });
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchRoleCards();
    }
    // Get current user from localStorage (token payload or user object)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleCards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/role-cards', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRoleCards(response.data);
    } catch (error) {
      setError('Failed to fetch role cards');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/users/${userId}/block`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, blocked: true } : user
      ));
      setSuccess('User blocked successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to block user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/users/${userId}/unblock`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, blocked: false } : user
      ));
      setSuccess('User unblocked successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to unblock user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/users/${userId}/make-admin`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: 'admin' } : user
      ));
      setSuccess('User promoted to admin successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to promote user to admin');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/users/${userId}/role`, { role: newRole }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setSuccess('User role updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update user role');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddCardChange = (e) => {
    setNewCard({ ...newCard, [e.target.name]: e.target.value });
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/role-cards', newCard, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRoleCards([...roleCards, response.data]);
      setShowAddCard(false);
      setNewCard({ title: '', description: '', role_type: '', webhook_url: '' });
      setSuccess('Role card added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to add role card');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEditCardClick = (card) => {
    setEditingCardId(card.id);
    setEditCard({
      title: card.title,
      description: card.description,
      role_type: card.role_type,
      webhook_url: card.webhook_url,
      is_active: card.is_active
    });
  };

  const handleEditCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditCard({
      ...editCard,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditCardSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/admin/role-cards/${editingCardId}`, editCard, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRoleCards(roleCards.map(card => card.id === editingCardId ? response.data : card));
      setEditingCardId(null);
      setSuccess('Role card updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update role card');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEditCardCancel = () => {
    setEditingCardId(null);
  };

  const handleToggleCard = async (cardId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/admin/role-cards/${cardId}/toggle`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRoleCards(roleCards.map(card => 
        card.id === cardId ? response.data : card
      ));
      setSuccess(`Role card ${response.data.is_active ? 'enabled' : 'disabled'} successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to toggle role card');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this role card? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/role-cards/${cardId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRoleCards(roleCards.filter(card => card.id !== cardId));
      setSuccess('Role card deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to delete role card');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>Admin Panel</Title>
        <LoadingMessage>Loading...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>Admin Panel</Title>
        <button
          style={{
            backgroundColor: '#E31E54',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.375rem',
            fontWeight: 500,
            fontSize: '1rem',
            cursor: 'pointer',
            marginLeft: '1rem',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
            transition: 'background-color 0.2s',
          }}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <TabContainer>
        <Tab 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </Tab>
        <Tab 
          active={activeTab === 'cards'} 
          onClick={() => setActiveTab('cards')}
        >
          Role Cards
        </Tab>
      </TabContainer>
      
      <PanelContainer>
        {activeTab === 'users' && (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    {currentUser && currentUser.role === 'admin' ? (
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                        disabled={user.id === currentUser.id} // Prevent self-demotion
                        style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </Td>
                  <Td>
                    <StatusBadge active={!user.blocked}>
                      {user.blocked ? 'Blocked' : 'Active'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    {user.blocked ? (
                      <ActionButton onClick={() => handleUnblockUser(user.id)}>
                        Unblock
                      </ActionButton>
                    ) : (
                      <ActionButton block onClick={() => handleBlockUser(user.id)}>
                        Block
                      </ActionButton>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        
        {activeTab === 'cards' && (
          <>
            <div style={{ margin: '1rem 0' }}>
              <ActionButton onClick={() => setShowAddCard(!showAddCard)}>
                {showAddCard ? 'Cancel' : 'Add Card'}
              </ActionButton>
            </div>
            {showAddCard && (
              <form onSubmit={handleAddCard} style={{ marginBottom: '2rem', background: '#23272f', padding: '1rem', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <input name="title" value={newCard.title} onChange={handleAddCardChange} placeholder="Title" required style={{ flex: 1, padding: '0.5rem' }} />
                  <input name="role_type" value={newCard.role_type} onChange={handleAddCardChange} placeholder="Role Type" required style={{ flex: 1, padding: '0.5rem' }} />
                  <input name="webhook_url" value={newCard.webhook_url} onChange={handleAddCardChange} placeholder="Webhook URL" required style={{ flex: 2, padding: '0.5rem' }} />
                </div>
                <textarea name="description" value={newCard.description} onChange={handleAddCardChange} placeholder="Description" required style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }} />
                <ActionButton type="submit" style={{ marginTop: '0.5rem' }}>Save Card</ActionButton>
              </form>
            )}
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Title</Th>
                  <Th>Role Type</Th>
                  <Th>Status</Th>
                  <Th>Endpoint</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {roleCards.map((card) => (
                  <tr key={card.id}>
                    <Td>{card.id}</Td>
                    <Td>
                      {editingCardId === card.id ? (
                        <input name="title" value={editCard.title} onChange={handleEditCardChange} style={{ width: '100%' }} />
                      ) : (
                        card.title
                      )}
                    </Td>
                    <Td>
                      {editingCardId === card.id ? (
                        <input name="role_type" value={editCard.role_type} onChange={handleEditCardChange} style={{ width: '100%' }} />
                      ) : (
                        card.role_type
                      )}
                    </Td>
                    <Td>
                      {editingCardId === card.id ? (
                        <input type="checkbox" name="is_active" checked={editCard.is_active} onChange={handleEditCardChange} />
                      ) : (
                        <StatusBadge active={card.is_active}>
                          {card.is_active ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      )}
                    </Td>
                    <Td>
                      {editingCardId === card.id ? (
                        <input name="webhook_url" value={editCard.webhook_url} onChange={handleEditCardChange} style={{ width: '100%' }} />
                      ) : (
                        card.webhook_url
                      )}
                    </Td>
                    <Td>
                      {editingCardId === card.id ? (
                        <>
                          <ActionButton type="button" onClick={handleEditCardSave}>Save</ActionButton>
                          <ActionButton type="button" onClick={handleEditCardCancel}>Cancel</ActionButton>
                        </>
                      ) : (
                        <>
                          <ActionButton onClick={() => handleEditCardClick(card)}>
                            Edit
                          </ActionButton>
                          <ActionButton onClick={() => handleToggleCard(card.id)}>
                            {card.is_active ? 'Disable' : 'Enable'}
                          </ActionButton>
                          <ActionButton block onClick={() => handleDeleteCard(card.id)}>
                            Delete
                          </ActionButton>
                        </>
                      )}
                    </Td>
                  </tr>
                  )
                )}
              </tbody>
            </Table>
          </>
        )}
      </PanelContainer>
    </Container>
  );
};

export default AdminPanel; 