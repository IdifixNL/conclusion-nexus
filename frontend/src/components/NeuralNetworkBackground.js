import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// 3D firing animation
const neuronFire = keyframes`
  0% {
    transform: scale(1) translateZ(0px);
    box-shadow: 0 0 10px rgba(227, 30, 84, 0.3);
  }
  50% {
    transform: scale(1.5) translateZ(20px);
    box-shadow: 0 0 30px rgba(227, 30, 84, 0.8), 0 0 50px rgba(227, 30, 84, 0.4);
  }
  100% {
    transform: scale(1) translateZ(0px);
    box-shadow: 0 0 10px rgba(227, 30, 84, 0.3);
  }
`;

// Signal propagation animation
const signalTravel = keyframes`
  0% {
    opacity: 0;
    transform: scale(0) translateZ(0px);
  }
  50% {
    opacity: 1;
    transform: scale(1) translateZ(10px);
  }
  100% {
    opacity: 0;
    transform: scale(1.5) translateZ(20px);
  }
`;

// 3D floating animation
const float3D = keyframes`
  0%, 100% {
    transform: translateZ(0px) rotateX(0deg) rotateY(0deg);
  }
  25% {
    transform: translateZ(10px) rotateX(5deg) rotateY(5deg);
  }
  50% {
    transform: translateZ(20px) rotateX(0deg) rotateY(10deg);
  }
  75% {
    transform: translateZ(10px) rotateX(-5deg) rotateY(5deg);
  }
`;

// New connection formation animation
const formConnection = keyframes`
  0% {
    width: 0%;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 1;
  }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%);
  z-index: -1;
  overflow: hidden;
  perspective: 1000px;
  transform-style: preserve-3d;
`;

const NeuralLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: ${float3D} 20s ease-in-out infinite;
`;

const Neuron = styled.div`
  position: absolute;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  background: radial-gradient(circle, ${props => props.color} 0%, rgba(0,0,0,0.8) 70%);
  border-radius: 50%;
  box-shadow: 
    0 0 10px ${props => props.color}40,
    0 0 20px ${props => props.color}20,
    0 0 30px ${props => props.color}10;
  transform: translateZ(${props => props.depth || '0px'});
  transition: all 0.3s ease;
  cursor: pointer;
  
  &.firing {
    animation: ${neuronFire} 0.8s ease-out;
    z-index: 10;
  }
  
  &.forming {
    animation: ${neuronFire} 1.2s ease-out infinite;
    z-index: 15;
  }
  
  &:hover {
    transform: translateZ(${props => props.depth || '0px'}) scale(1.2);
    box-shadow: 
      0 0 20px ${props => props.color}80,
      0 0 40px ${props => props.color}40,
      0 0 60px ${props => props.color}20;
  }
`;

const Connection = styled.div`
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, ${props => props.color}40, ${props => props.color}80, ${props => props.color}40);
  transform-origin: left center;
  transform: translateZ(${props => props.depth || '0px'});
  transition: all 0.5s ease;
  
  &.active {
    animation: ${signalTravel} 1s ease-out;
    box-shadow: 0 0 10px ${props => props.color};
  }
  
  &.forming {
    animation: ${formConnection} 1.5s ease-out;
    box-shadow: 0 0 15px ${props => props.color};
  }
  
  &.new {
    animation: ${formConnection} 2s ease-out;
    box-shadow: 0 0 20px ${props => props.color};
  }
`;

const NeuralNetworkBackground = () => {
  const [firingNeurons, setFiringNeurons] = useState(new Set());
  const [activeConnections, setActiveConnections] = useState(new Set());
  const [formingConnections, setFormingConnections] = useState(new Set());
  const [newConnections, setNewConnections] = useState(new Set());
  const [connections, setConnections] = useState([]);
  const [neurons, setNeurons] = useState([]);
  const containerRef = useRef(null);

  // Conclusion brand colors
  const colors = [
    '#E31E54', // Red
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Orange
    '#8B5CF6', // Purple
    '#FCD34D', // Yellow
    '#EC4899', // Pink
    '#14B8A6', // Teal
  ];

  // Initialize neurons
  useEffect(() => {
    const initialNeurons = [
      { id: 1, x: 10, y: 20, depth: 0, color: colors[0], connections: [] },
      { id: 2, x: 25, y: 15, depth: 10, color: colors[1], connections: [] },
      { id: 3, x: 40, y: 30, depth: 20, color: colors[2], connections: [] },
      { id: 4, x: 15, y: 50, depth: 5, color: colors[3], connections: [] },
      { id: 5, x: 35, y: 45, depth: 15, color: colors[4], connections: [] },
      { id: 6, x: 60, y: 25, depth: 25, color: colors[5], connections: [] },
      { id: 7, x: 70, y: 60, depth: 30, color: colors[6], connections: [] },
      { id: 8, x: 80, y: 40, depth: 35, color: colors[7], connections: [] },
      { id: 9, x: 50, y: 70, depth: 10, color: colors[0], connections: [] },
      { id: 10, x: 20, y: 80, depth: 20, color: colors[1], connections: [] },
      { id: 11, x: 85, y: 15, depth: 15, color: colors[2], connections: [] },
      { id: 12, x: 90, y: 80, depth: 25, color: colors[3], connections: [] },
      { id: 13, x: 5, y: 60, depth: 30, color: colors[4], connections: [] },
      { id: 14, x: 75, y: 85, depth: 5, color: colors[5], connections: [] },
      { id: 15, x: 45, y: 10, depth: 35, color: colors[6], connections: [] },
    ];

    const initialConnections = [
      { id: '1-2', from: 1, to: 2, color: colors[0] },
      { id: '2-3', from: 2, to: 3, color: colors[1] },
      { id: '3-4', from: 3, to: 4, color: colors[2] },
      { id: '4-5', from: 4, to: 5, color: colors[3] },
      { id: '5-6', from: 5, to: 6, color: colors[4] },
      { id: '6-7', from: 6, to: 7, color: colors[5] },
      { id: '7-8', from: 7, to: 8, color: colors[6] },
      { id: '8-9', from: 8, to: 9, color: colors[7] },
      { id: '9-10', from: 9, to: 10, color: colors[0] },
      { id: '10-11', from: 10, to: 11, color: colors[1] },
      { id: '11-12', from: 11, to: 12, color: colors[2] },
      { id: '12-13', from: 12, to: 13, color: colors[3] },
      { id: '13-14', from: 13, to: 14, color: colors[4] },
      { id: '14-15', from: 14, to: 15, color: colors[5] },
      { id: '15-1', from: 15, to: 1, color: colors[6] },
    ];

    setNeurons(initialNeurons);
    setConnections(initialConnections);
  }, []);

  // Form new connections dynamically
  const formNewConnection = () => {
    const availableNeurons = neurons.filter(n => n.connections.length < 4);
    if (availableNeurons.length < 2) return;

    const fromNeuron = availableNeurons[Math.floor(Math.random() * availableNeurons.length)];
    const toNeuron = availableNeurons.filter(n => n.id !== fromNeuron.id)[Math.floor(Math.random() * availableNeurons.length)];

    if (!toNeuron) return;

    const newConnectionId = `${fromNeuron.id}-${toNeuron.id}`;
    const reverseConnectionId = `${toNeuron.id}-${fromNeuron.id}`;
    
    // Check if connection already exists
    const exists = connections.some(c => c.id === newConnectionId || c.id === reverseConnectionId);
    if (exists) return;

    const newConnection = {
      id: newConnectionId,
      from: fromNeuron.id,
      to: toNeuron.id,
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    setConnections(prev => [...prev, newConnection]);
    setFormingConnections(prev => new Set([...prev, newConnectionId]));

    // Mark neurons as forming
    setNeurons(prev => prev.map(n => 
      n.id === fromNeuron.id || n.id === toNeuron.id 
        ? { ...n, forming: true }
        : n
    ));

    // Clear forming state after animation
    setTimeout(() => {
      setFormingConnections(prev => {
        const newSet = new Set(prev);
        newSet.delete(newConnectionId);
        return newSet;
      });
      setNeurons(prev => prev.map(n => ({ ...n, forming: false })));
    }, 2000);
  };

  // Fire random neurons with pattern formation
  const fireRandomNeurons = (count = 3) => {
    const newFiring = new Set();
    const newConnections = new Set();
    
    // Select neurons that are close to each other to form patterns
    const selectedNeurons = [];
    const firstNeuron = neurons[Math.floor(Math.random() * neurons.length)];
    selectedNeurons.push(firstNeuron);
    
    // Find nearby neurons to create clusters
    for (let i = 1; i < count; i++) {
      const nearbyNeurons = neurons.filter(n => {
        const distance = Math.sqrt(
          Math.pow(n.x - firstNeuron.x, 2) + Math.pow(n.y - firstNeuron.y, 2)
        );
        return distance < 30 && !selectedNeurons.includes(n);
      });
      
      if (nearbyNeurons.length > 0) {
        const randomNearby = nearbyNeurons[Math.floor(Math.random() * nearbyNeurons.length)];
        selectedNeurons.push(randomNearby);
      } else {
        const randomNeuron = neurons[Math.floor(Math.random() * neurons.length)];
        selectedNeurons.push(randomNeuron);
      }
    }
    
    selectedNeurons.forEach(neuron => {
      newFiring.add(neuron.id);
      
      // Find connections from this neuron
      connections.forEach(conn => {
        if (conn.from === neuron.id) {
          newConnections.add(conn.id);
        }
      });
    });
    
    setFiringNeurons(newFiring);
    setActiveConnections(newConnections);
    
    // Clear after animation
    setTimeout(() => {
      setFiringNeurons(new Set());
      setActiveConnections(new Set());
    }, 1000);
  };

  // Listen for typing events
  useEffect(() => {
    const handleTyping = () => {
      fireRandomNeurons(5);
      // Form new connections when typing
      setTimeout(() => formNewConnection(), 500);
    };

    // Add event listeners to input fields
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', handleTyping);
      input.addEventListener('focus', handleTyping);
    });

    // Auto-fire neurons and form patterns periodically
    const interval = setInterval(() => {
      fireRandomNeurons(3);
      // Form new connections every few seconds
      if (Math.random() > 0.7) {
        formNewConnection();
      }
    }, 4000);

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('input', handleTyping);
        input.removeEventListener('focus', handleTyping);
      });
      clearInterval(interval);
    };
  }, [neurons, connections]);

  return (
    <BackgroundContainer ref={containerRef}>
      <NeuralLayer>
        {/* Render connections */}
        {connections.map((conn) => {
          const fromNeuron = neurons.find(n => n.id === conn.from);
          const toNeuron = neurons.find(n => n.id === conn.to);
          
          if (!fromNeuron || !toNeuron) return null;
          
          const dx = toNeuron.x - fromNeuron.x;
          const dy = toNeuron.y - fromNeuron.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          
          return (
            <Connection
              key={conn.id}
              style={{
                left: `${fromNeuron.x}%`,
                top: `${fromNeuron.y}%`,
                width: `${distance}%`,
                transform: `rotate(${angle}deg)`,
              }}
              color={conn.color}
              depth={Math.min(fromNeuron.depth, toNeuron.depth)}
              className={
                activeConnections.has(conn.id) ? 'active' :
                formingConnections.has(conn.id) ? 'forming' :
                newConnections.has(conn.id) ? 'new' : ''
              }
            />
          );
        })}
        
        {/* Render neurons */}
        {neurons.map(neuron => (
          <Neuron
            key={neuron.id}
            style={{
              left: `${neuron.x}%`,
              top: `${neuron.y}%`,
            }}
            color={neuron.color}
            depth={neuron.depth}
            size={firingNeurons.has(neuron.id) ? '30px' : '20px'}
            className={
              firingNeurons.has(neuron.id) ? 'firing' :
              neuron.forming ? 'forming' : ''
            }
          />
        ))}
      </NeuralLayer>
    </BackgroundContainer>
  );
};

export default NeuralNetworkBackground; 