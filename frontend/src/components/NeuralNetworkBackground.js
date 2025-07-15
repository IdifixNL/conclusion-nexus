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
  
  &.firing {
    animation: ${neuronFire} 0.8s ease-out;
    z-index: 10;
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
  
  &.active {
    animation: ${signalTravel} 1s ease-out;
    box-shadow: 0 0 10px ${props => props.color};
  }
`;

const NeuralNetworkBackground = () => {
  const [firingNeurons, setFiringNeurons] = useState(new Set());
  const [activeConnections, setActiveConnections] = useState(new Set());
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

  // Neuron positions (distributed across screen)
  const neurons = [
    { id: 1, x: 10, y: 20, depth: 0, color: colors[0] },
    { id: 2, x: 25, y: 15, depth: 10, color: colors[1] },
    { id: 3, x: 40, y: 30, depth: 20, color: colors[2] },
    { id: 4, x: 15, y: 50, depth: 5, color: colors[3] },
    { id: 5, x: 35, y: 45, depth: 15, color: colors[4] },
    { id: 6, x: 60, y: 25, depth: 25, color: colors[5] },
    { id: 7, x: 70, y: 60, depth: 30, color: colors[6] },
    { id: 8, x: 80, y: 40, depth: 35, color: colors[7] },
    { id: 9, x: 50, y: 70, depth: 10, color: colors[0] },
    { id: 10, x: 20, y: 80, depth: 20, color: colors[1] },
    { id: 11, x: 85, y: 15, depth: 15, color: colors[2] },
    { id: 12, x: 90, y: 80, depth: 25, color: colors[3] },
    { id: 13, x: 5, y: 60, depth: 30, color: colors[4] },
    { id: 14, x: 75, y: 85, depth: 5, color: colors[5] },
    { id: 15, x: 45, y: 10, depth: 35, color: colors[6] },
  ];

  // Connections between neurons
  const connections = [
    { from: 1, to: 2, color: colors[0] },
    { from: 2, to: 3, color: colors[1] },
    { from: 3, to: 4, color: colors[2] },
    { from: 4, to: 5, color: colors[3] },
    { from: 5, to: 6, color: colors[4] },
    { from: 6, to: 7, color: colors[5] },
    { from: 7, to: 8, color: colors[6] },
    { from: 8, to: 9, color: colors[7] },
    { from: 9, to: 10, color: colors[0] },
    { from: 10, to: 11, color: colors[1] },
    { from: 11, to: 12, color: colors[2] },
    { from: 12, to: 13, color: colors[3] },
    { from: 13, to: 14, color: colors[4] },
    { from: 14, to: 15, color: colors[5] },
    { from: 15, to: 1, color: colors[6] },
    { from: 1, to: 5, color: colors[7] },
    { from: 2, to: 8, color: colors[0] },
    { from: 3, to: 11, color: colors[1] },
    { from: 4, to: 14, color: colors[2] },
  ];

  // Fire random neurons
  const fireRandomNeurons = (count = 3) => {
    const newFiring = new Set();
    const newConnections = new Set();
    
    for (let i = 0; i < count; i++) {
      const randomNeuron = neurons[Math.floor(Math.random() * neurons.length)];
      newFiring.add(randomNeuron.id);
      
      // Find connections from this neuron
      connections.forEach(conn => {
        if (conn.from === randomNeuron.id) {
          newConnections.add(`${conn.from}-${conn.to}`);
        }
      });
    }
    
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
      fireRandomNeurons(5); // Fire more neurons when typing
    };

    // Add event listeners to input fields
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', handleTyping);
      input.addEventListener('focus', handleTyping);
    });

    // Auto-fire neurons periodically
    const interval = setInterval(() => {
      fireRandomNeurons(2);
    }, 3000);

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('input', handleTyping);
        input.removeEventListener('focus', handleTyping);
      });
      clearInterval(interval);
    };
  }, []);

  return (
    <BackgroundContainer ref={containerRef}>
      <NeuralLayer>
        {/* Render connections */}
        {connections.map((conn, index) => {
          const fromNeuron = neurons.find(n => n.id === conn.from);
          const toNeuron = neurons.find(n => n.id === conn.to);
          
          if (!fromNeuron || !toNeuron) return null;
          
          const dx = toNeuron.x - fromNeuron.x;
          const dy = toNeuron.y - fromNeuron.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          
          return (
            <Connection
              key={`conn-${index}`}
              style={{
                left: `${fromNeuron.x}%`,
                top: `${fromNeuron.y}%`,
                width: `${distance}%`,
                transform: `rotate(${angle}deg)`,
              }}
              color={conn.color}
              depth={Math.min(fromNeuron.depth, toNeuron.depth)}
              className={activeConnections.has(`${conn.from}-${conn.to}`) ? 'active' : ''}
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
            className={firingNeurons.has(neuron.id) ? 'firing' : ''}
          />
        ))}
      </NeuralLayer>
    </BackgroundContainer>
  );
};

export default NeuralNetworkBackground; 