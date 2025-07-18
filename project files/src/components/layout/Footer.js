import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeart, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <div className="container">
        <FooterTop>
          <FooterColumn>
            <FooterLogo>FreshMart</FooterLogo>
            <FooterText>
              Your trusted source for fresh groceries and household essentials. We deliver quality products right to your doorstep with the freshest ingredients for your family.
            </FooterText>
            <SocialLinks>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </SocialLink>
              <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
              </SocialLink>
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink to="/">Home</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/products">Products</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/about">About Us</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/contact">Contact</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/blog">Blog</FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Customer Service</FooterTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink to="/account">My Account</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/orders">Order History</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/faq">FAQ</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/shipping">Shipping & Returns</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Contact Info</FooterTitle>
            <ContactInfo>
              <ContactItem>
                <ContactIcon>
                  <FaMapMarkerAlt />
                </ContactIcon>
                <ContactText>123 Fresh Street, Grocery District, GD 12345</ContactText>
              </ContactItem>
              <ContactItem>
                <ContactIcon>
                  <FaPhoneAlt />
                </ContactIcon>
                <ContactText>+1 (123) 456-7890</ContactText>
              </ContactItem>
              <ContactItem>
                <ContactIcon>
                  <FaEnvelope />
                </ContactIcon>
                <ContactText>support@freshmart.com</ContactText>
              </ContactItem>
            </ContactInfo>
          </FooterColumn>
        </FooterTop>
        
        <FooterBottom>
          <Copyright>
            © {currentYear} FreshMart. All rights reserved. Made with <FaHeart /> for fresh food.
          </Copyright>
          <PaymentMethods>
            <PaymentText>Payment Methods: Visa • MasterCard • PayPal • Apple Pay</PaymentText>
          </PaymentMethods>
        </FooterBottom>
      </div>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 80px 0 30px;
  color: ${props => props.theme.colors.text};
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 50px;
  
  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    margin-bottom: 20px;
  }
`;

const FooterLogo = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 20px;
`;

const FooterText = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 20px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.9rem;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #3a7bc8;
    transform: translateY(-3px);
  }
`;

const FooterTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 10px;
`;

const FooterLink = styled(Link)`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  text-decoration: none;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    padding-left: 5px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ContactIcon = styled.div`
  margin-right: 10px;
  color: ${props => props.theme.colors.primary};
  font-size: 1rem;
  padding-top: 3px;
`;

const ContactText = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  line-height: 1.5;
  margin: 0;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  display: flex;
  align-items: center;
  gap: 5px;
  
  svg {
    color: ${props => props.theme.colors.accent};
    font-size: 0.8rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

const PaymentMethods = styled.div`
  img {
    max-height: 30px;
  }
`;

const PaymentText = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  line-height: 1.5;
  margin: 0;
`;

export default Footer;