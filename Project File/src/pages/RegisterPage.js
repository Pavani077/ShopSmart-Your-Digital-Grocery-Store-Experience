import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      setError('You must agree to the Terms and Conditions');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        // Registration successful, redirect to login
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in with your new account.' 
          } 
        });
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
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
              <AuthTitle>Create Account</AuthTitle>
              <AuthSubtitle>Join us to get access to exclusive offers and features</AuthSubtitle>
            </AuthHeader>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <AuthForm onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>First Name</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <FormInput 
                    type="text" 
                    name="firstName"
                    placeholder="Enter your first name" 
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Last Name</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <FormInput 
                    type="text" 
                    name="lastName"
                    placeholder="Enter your last name" 
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Email Address</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaEnvelope />
                  </InputIcon>
                  <FormInput 
                    type="email" 
                    name="email"
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Password</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <FormInput 
                    type="password" 
                    name="password"
                    placeholder="Create a password" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
                <PasswordRequirements>
                  Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                </PasswordRequirements>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Confirm Password</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <FormInput 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Confirm your password" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>
              
              <TermsWrapper>
                <TermsLabel>
                  <TermsCheckbox 
                    type="checkbox" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>I agree to the <TermsLink to="/terms">Terms and Conditions</TermsLink> and <TermsLink to="/privacy">Privacy Policy</TermsLink></span>
                </TermsLabel>
              </TermsWrapper>
              
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </SubmitButton>
            </AuthForm>
            
            <OrDivider>
              <OrLine />
              <OrText>or</OrText>
              <OrLine />
            </OrDivider>
            
            <SocialButtons>
              <SocialButton type="button">
                <FaGoogle /> Sign up with Google
              </SocialButton>
              <SocialButton type="button">
                <FaFacebook /> Sign up with Facebook
              </SocialButton>
            </SocialButtons>
            
            <LoginPrompt>
              Already have an account? <LoginLink to="/login">Sign in</LoginLink>
            </LoginPrompt>
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

const PasswordRequirements = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.lightText};
  margin-top: 8px;
`;

const TermsWrapper = styled.div`
  margin-bottom: 20px;
`;

const TermsLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  
  span {
    flex: 1;
    line-height: 1.4;
  }
`;

const TermsCheckbox = styled.input`
  width: 16px;
  height: 16px;
  margin-top: 2px;
  cursor: pointer;
`;

const TermsLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
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

const LoginPrompt = styled.div`
  text-align: center;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.lightText};
`;

const LoginLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default RegisterPage;