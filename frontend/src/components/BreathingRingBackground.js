import React from 'react';
import styled, { keyframes } from 'styled-components';

// Breathing animation
const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.07);
  }
`;

// Wiggle animation for each ring
const wiggle1 = keyframes`
  0%, 100% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(2px) translateY(-1px); }
  50% { transform: translateX(-1px) translateY(2px); }
  75% { transform: translateX(-2px) translateY(-1px); }
`;

const wiggle2 = keyframes`
  0%, 100% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(-2px) translateY(1px); }
  50% { transform: translateX(1px) translateY(-2px); }
  75% { transform: translateX(2px) translateY(1px); }
`;

const wiggle3 = keyframes`
  0%, 100% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(1px) translateY(2px); }
  50% { transform: translateX(-2px) translateY(-1px); }
  75% { transform: translateX(-1px) translateY(2px); }
`;

// Hue shift animation
const hueShift = keyframes`
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(8deg); }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: -1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RingContainer = styled.div`
  position: relative;
  width: 600px;
  height: 600px;
  animation: ${breathe} 12s ease-in-out infinite, ${hueShift} 20s ease-in-out infinite;
`;

const Ring = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid;
`;

const Ring1 = styled(Ring)`
  width: 200px;
  height: 200px;
  border-color: #E31E54;
  animation: ${wiggle1} 8s ease-in-out infinite;
`;

const Ring2 = styled(Ring)`
  width: 300px;
  height: 300px;
  border-color: #3B82F6;
  animation: ${wiggle2} 10s ease-in-out infinite;
`;

const Ring3 = styled(Ring)`
  width: 400px;
  height: 400px;
  border-color: #10B981;
  animation: ${wiggle3} 12s ease-in-out infinite;
`;

const Ring4 = styled(Ring)`
  width: 500px;
  height: 500px;
  border-color: #F59E0B;
  animation: ${wiggle1} 14s ease-in-out infinite;
`;

const Ring5 = styled(Ring)`
  width: 600px;
  height: 600px;
  border-color: #8B5CF6;
  animation: ${wiggle2} 16s ease-in-out infinite;
`;

const BreathingRingBackground = () => {
  return (
    <BackgroundContainer>
      <RingContainer>
        <Ring1 />
        <Ring2 />
        <Ring3 />
        <Ring4 />
        <Ring5 />
      </RingContainer>
    </BackgroundContainer>
  );
};

export default BreathingRingBackground; 