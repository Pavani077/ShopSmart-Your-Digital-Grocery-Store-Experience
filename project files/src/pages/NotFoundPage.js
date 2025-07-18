import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <PageContainer>
      <div className="container">
        <NotFoundContent
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <NotFoundImage>
            <NotFoundNumber>404</NotFoundNumber>
            <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
          </NotFoundImage>
          <NotFoundTitle>Page Not Found</NotFoundTitle>
          <NotFoundText>
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </NotFoundText>
          <NotFoundActions>
            <HomeButton to="/">
              <FaHome /> Go to Homepage
            </HomeButton>
            <SearchButton to="/products">
              <FaSearch /> Browse Products
            </SearchButton>
          </NotFoundActions>
        </NotFoundContent>
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

const NotFoundContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const NotFoundImage = styled.div`
  max-width: 100%;
  height: auto;
  margin-bottom: 30px;
`;

const NotFoundNumber = styled.div`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const NotFoundSubtitle = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const NotFoundTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const NotFoundText = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 30px;
  line-height: 1.6;
`;

const NotFoundActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 15px;
  }
`;

const HomeButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 25px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const SearchButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 25px;
  background-color: white;
  color: ${props => props.theme.colors.text};
  border: 1px solid #ddd;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

export default NotFoundPage;