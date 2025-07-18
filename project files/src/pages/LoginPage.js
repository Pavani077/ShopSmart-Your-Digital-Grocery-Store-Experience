import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Login successful, redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <div className="container">
        <AuthContainer>
          <AuthCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AuthHeader>
              <AuthTitle>Sign In</AuthTitle>
              <AuthSubtitle>Welcome back! Please enter your details</AuthSubtitle>
            </AuthHeader>
            
            {message && <SuccessMessage>{message}</SuccessMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <AuthForm onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>Email Address</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaEnvelope />
                  </InputIcon>
                  <FormInput 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <FormLabelFlex>
                  <FormLabel>Password</FormLabel>
                  <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>
                </FormLabelFlex>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <FormInput 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputWrapper>
              </FormGroup>
              
              <RememberMeWrapper>
                <RememberMeLabel>
                  <RememberMeCheckbox 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </RememberMeLabel>
              </RememberMeWrapper>
              
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </SubmitButton>
            </AuthForm>
            
            <OrDivider>
              <OrLine />
              <OrText>or</OrText>
              <OrLine />
            </OrDivider>
            
            <SocialButtons>
              <SocialButton type="button">
                <FaGoogle /> Sign in with Google
              </SocialButton>
              <SocialButton type="button">
                <FaFacebook /> Sign in with Facebook
              </SocialButton>
            </SocialButtons>
            
            <SignupPrompt>
              Don't have an account? <SignupLink to="/register">Sign up</SignupLink>
            </SignupPrompt>
          </AuthCard>
        </AuthContainer>
      </div>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  padding: 120px 0 80px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 100px 0 60px;
  }
`;

const AuthContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const AuthCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 40px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 30px 20px;
  }
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const AuthTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const AuthSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.lightText};
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #388e3c;
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const AuthForm = styled.form`
  margin-bottom: 25px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
`;

const FormLabelFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ForgotPassword = styled(Link)`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.lightText};
  font-size: 1rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const RememberMeWrapper = styled.div`
  margin-bottom: 20px;
`;

const RememberMeLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const RememberMeCheckbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  &:disabled {
    background-color: #a0c3e8;
    cursor: not-allowed;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 25px 0;
`;

const OrLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: #ddd;
`;

const OrText = styled.span`
  padding: 0 15px;
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
`;

const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.lightText};
`;

const SignupLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginPage;