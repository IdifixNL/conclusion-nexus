import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  padding: 2rem;
`;

const ChatHeader = styled.div`
  background-color: #1F2937;
  padding: 1rem 2rem;
  border-radius: 0.5rem 0.5rem 0 0;
  border: 2px solid #E31E54;
  border-bottom: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h2`
  color: #E31E54;
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
`;

const BackButton = styled.button`
  background-color: transparent;
  color: #9CA3AF;
  border: 1px solid #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: #374151;
    color: white;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  background-color: #1F2937;
  border: 2px solid #E31E54;
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  max-width: 70%;
  word-wrap: break-word;
  
  ${props => props.isUser ? `
    background-color: #E31E54;
    color: white;
    align-self: flex-end;
    margin-left: auto;
  ` : `
    background-color: #374151;
    color: white;
    align-self: flex-start;
  `}
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: #9CA3AF;
  margin-top: 0.25rem;
`;

const InputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #374151;
  display: flex;
  gap: 1rem;
`;

const MessageInput = styled.input`
  flex: 1;
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

const SendButton = styled.button`
  background-color: #E31E54;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
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

const ConnectionStatus = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${props => props.connected ? '#10B981' : '#EF4444'};
  background-color: #1F2937;
  border-bottom: 1px solid #374151;
`;

const Chat = ({ user }) => {
  const { roleType } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  const [sessionId] = useState(() => {
    // Try to get from localStorage or generate a new one per roleType
    const key = `chat-sessionId-${roleType}`;
    let id = localStorage.getItem(key);
    if (!id) {
      id = `${roleType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(key, id);
    }
    return id;
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Set role title based on roleType
    const roleTitles = {
      'customer_engineer': 'Customer Engineer',
      'azure_engineer': 'Azure Engineer',
      'project_manager': 'Project Manager',
      'service_manager': 'Service Manager'
    };
    setRoleTitle(roleTitles[roleType] || 'Chat');

    const websocket = new WebSocket('ws://localhost:3001');
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data); // Debug log
        if (data.type === 'response') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: data.data.message || data.data.output || 'Response received',
            isUser: false,
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [roleType]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !ws || !connected) return;

    const message = {
      type: 'message',
      text: inputMessage,
      user: user.email,
      roleType: roleType,
      sessionId: sessionId // Ensure sessionId is always sent
    };

    ws.send(JSON.stringify(message));
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }]);
    
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Container>
      <ChatHeader>
        <ChatTitle>{roleTitle} Chat</ChatTitle>
        <BackButton onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </BackButton>
      </ChatHeader>
      
      <ChatContainer>
        <ConnectionStatus connected={connected}>
          {connected ? 'Connected' : 'Disconnected'}
        </ConnectionStatus>
        
        <MessagesContainer>
          {messages.map((message) => (
            <Message key={message.id} isUser={message.isUser}>
              <div>{message.text}</div>
              <MessageTime>
                {message.timestamp.toLocaleTimeString()}
              </MessageTime>
            </Message>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <InputContainer>
          <MessageInput
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={!connected}
          />
          <SendButton onClick={sendMessage} disabled={!connected || !inputMessage.trim()}>
            Send
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default Chat; 