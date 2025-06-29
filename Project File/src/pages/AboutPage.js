import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const AboutPage = () => (
  <PageContainer>
    <AboutSection
      as={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Title>About Us</Title>
      <Description>
        Welcome to ShopSmart, your trusted digital grocery store! We are dedicated to providing fresh, high-quality groceries and household essentials delivered right to your doorstep. Our mission is to make grocery shopping convenient, affordable, and enjoyable for everyone.
      </Description>
      <Highlight as={motion.div} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
        <span>Fresh Daily Deliveries</span>
        <span>Trusted by 50,000+ Customers</span>
        <span>Fast & Secure Delivery</span>
      </Highlight>
    </AboutSection>
    <TeamSection>
      <SectionTitle>Meet Our Team</SectionTitle>
      <TeamGrid>
        <TeamMember as={motion.div} whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(74,144,226,0.15)' }} transition={{ type: 'spring', stiffness: 300 }}>
          <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team Member" />
          <MemberName>Dr. John Smith</MemberName>
          <MemberRole>Chief Medical Officer</MemberRole>
        </TeamMember>
        <TeamMember as={motion.div} whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(74,144,226,0.15)' }} transition={{ type: 'spring', stiffness: 300 }}>
          <Avatar src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member" />
          <MemberName>Jane Doe</MemberName>
          <MemberRole>Head of Operations</MemberRole>
        </TeamMember>
        <TeamMember as={motion.div} whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(74,144,226,0.15)' }} transition={{ type: 'spring', stiffness: 300 }}>
          <Avatar src="https://randomuser.me/api/portraits/men/54.jpg" alt="Team Member" />
          <MemberName>Michael Lee</MemberName>
          <MemberRole>Lead Engineer</MemberRole>
        </TeamMember>
      </TeamGrid>
    </TeamSection>
  </PageContainer>
);

const PageContainer = styled.div`
  padding: 120px 0 80px;
  background: ${props => props.theme.colors.background};
`;

const AboutSection = styled.section`
  max-width: 800px;
  margin: 0 auto 60px auto;
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 48px 36px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 18px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 32px;
  line-height: 1.7;
`;

const Highlight = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.secondary};
  font-weight: 600;
  margin-top: 18px;
  flex-wrap: wrap;
`;

const TeamSection = styled.section`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 32px;
`;

const TeamGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
`;

const TeamMember = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadows.small};
  padding: 32px 24px 24px 24px;
  width: 220px;
  transition: ${props => props.theme.transitions.default};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 18px;
  border: 3px solid ${props => props.theme.colors.primary};
`;

const MemberName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
`;

const MemberRole = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.lightText};
`;

export default AboutPage; 