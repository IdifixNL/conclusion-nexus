import React from 'react';
import styled from 'styled-components';

const StrengthContainer = styled.div`
  margin-top: 0.5rem;
  padding: 1rem;
  background-color: #1a1a1a;
  border-radius: 0.375rem;
  border: 1px solid #374151;
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
`;

const RequirementItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: ${props => props.met ? '#10B981' : '#9CA3AF'};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RequirementIcon = styled.span`
  margin-right: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
`;

const RequirementText = styled.span`
  font-size: 0.875rem;
`;

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    {
      id: 'length',
      text: 'At least 10 characters',
      test: (pwd) => pwd.length >= 10
    },
    {
      id: 'uppercase',
      text: 'At least 2 capital letters',
      test: (pwd) => (pwd.match(/[A-Z]/g) || []).length >= 2
    },
    {
      id: 'numbers',
      text: 'At least 2 numbers',
      test: (pwd) => (pwd.match(/[0-9]/g) || []).length >= 2
    },
    {
      id: 'special',
      text: 'At least 2 special characters',
      test: (pwd) => (pwd.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >= 2
    }
  ];

  const isAllMet = requirements.every(req => req.test(password));

  return (
    <StrengthContainer>
      <RequirementsList>
        {requirements.map((requirement) => {
          const isMet = requirement.test(password);
          return (
            <RequirementItem key={requirement.id} met={isMet}>
              <RequirementIcon>
                {isMet ? '✓' : '○'}
              </RequirementIcon>
              <RequirementText>
                {requirement.text}
              </RequirementText>
            </RequirementItem>
          );
        })}
      </RequirementsList>
    </StrengthContainer>
  );
};

export default PasswordStrengthIndicator; 