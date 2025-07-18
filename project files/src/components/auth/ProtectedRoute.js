import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { FaLock, FaSignInAlt } from 'react-icons/fa';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!isAuthenticated()) {
    return (
      <AuthRequiredContainer>
        <AuthRequiredContent>
          <LockIcon>
            <FaLock />
          </LockIcon>
          <AuthRequiredTitle>Authentication Required</AuthRequiredTitle>
          <AuthRequiredText>
            You need to be logged in to access this page. Please sign in to continue.
          </AuthRequiredText>
          <LoginButton to="/login" state={{ from: location }}>
            <FaSignInAlt /> Sign In
          </LoginButton>
        </AuthRequiredContent>
      </AuthRequiredContainer>
    );
  }

  return children;
};

// Styled Components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
`;

const AuthRequiredContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
`;

const AuthRequiredContent = styled.div`
  text-align: center;
  max-width: 500px;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const LockIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 20px;
`;

const AuthRequiredTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const AuthRequiredText = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 30px;
  line-height: 1.6;
`;

const LoginButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 30px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  text-decoration: none;

  &:hover {
    background-color: #e55a2b;
    transform: translateY(-2px);
  }
`;

export default ProtectedRoute; 