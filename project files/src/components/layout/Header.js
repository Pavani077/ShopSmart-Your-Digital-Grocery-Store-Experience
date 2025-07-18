import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  // Sample navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/products' },
    { 
      name: 'Categories', 
      path: '/categories',
      subItems: [
        { name: 'Fresh Produce', path: '/products?category=produce' },
        { name: 'Dairy & Eggs', path: '/products?category=dairy' },
        { name: 'Meat & Seafood', path: '/products?category=meat' },
        { name: 'Pantry Staples', path: '/products?category=pantry' },
      ]
    },
    { name: 'Deals', path: '/deals' },
    { name: 'About', path: '/about' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Simulate cart count (would normally come from a cart context or state management)
  useEffect(() => {
    setCartCount(3); // Example cart count
  }, []);

  return (
    <HeaderContainer scrolled={isScrolled}>
      <div className="container">
        <HeaderContent>
          <Logo to="/">
            <LogoText>ShopSmart</LogoText>
          </Logo>

          {/* Desktop Navigation */}
          <DesktopNav>
            <NavList>
              {navItems.map((item, index) => (
                <NavItem key={index}>
                  <NavLink 
                    to={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                  >
                    {item.name}
                  </NavLink>
                  {item.subItems && (
                    <DropdownMenu>
                      {item.subItems.map((subItem, subIndex) => (
                        <DropdownItem key={subIndex}>
                          <DropdownLink to={subItem.path}>
                            {subItem.name}
                          </DropdownLink>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  )}
                </NavItem>
              ))}
            </NavList>
          </DesktopNav>

          {/* Header Actions */}
          <HeaderActions>
            <SearchButton>
              <FaSearch />
            </SearchButton>
            
            {isAuthenticated() && (
              <CartButton to="/cart">
                <FaShoppingCart />
                {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
              </CartButton>
            )}
            
            {isAuthenticated() ? (
              <UserMenuContainer>
                <UserButton onClick={() => setShowUserMenu(!showUserMenu)}>
                  <FaUser />
                  <UserName>{user?.firstName || 'User'}</UserName>
                </UserButton>
                
                {showUserMenu && (
                  <UserDropdown>
                    <UserDropdownItem>
                      <UserDropdownLink to="/dashboard">
                        <FaUser /> Dashboard
                      </UserDropdownLink>
                    </UserDropdownItem>
                    <UserDropdownItem>
                      <UserDropdownLink to="/profile">
                        <FaUser /> Profile
                      </UserDropdownLink>
                    </UserDropdownItem>
                    <UserDropdownDivider />
                    <UserDropdownItem>
                      <LogoutButton onClick={logout}>
                        <FaSignOutAlt /> Sign Out
                      </LogoutButton>
                    </UserDropdownItem>
                  </UserDropdown>
                )}
              </UserMenuContainer>
            ) : (
              <AccountButton to="/login">
                <FaUser />
              </AccountButton>
            )}

            <MobileMenuToggle onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </MobileMenuToggle>
          </HeaderActions>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <MobileNav
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ duration: 0.3 }}
              >
                <MobileNavList>
                  {navItems.map((item, index) => (
                    <MobileNavItem key={index}>
                      <MobileNavLink 
                        to={item.path}
                        className={location.pathname === item.path ? 'active' : ''}
                      >
                        {item.name}
                      </MobileNavLink>
                      
                      {item.subItems && (
                        <MobileSubItems>
                          {item.subItems.map((subItem, subIndex) => (
                            <MobileNavItem key={subIndex}>
                              <MobileSubLink to={subItem.path}>
                                {subItem.name}
                              </MobileSubLink>
                            </MobileNavItem>
                          ))}
                        </MobileSubItems>
                      )}
                    </MobileNavItem>
                  ))}
                </MobileNavList>
              </MobileNav>
            )}
          </AnimatePresence>
        </HeaderContent>
      </div>
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: ${props => props.scrolled ? props.theme.colors.white : 'transparent'};
  box-shadow: ${props => props.scrolled ? props.theme.shadows.small : 'none'};
  transition: ${props => props.theme.transitions.default};
  padding: ${props => props.scrolled ? '10px 0' : '20px 0'};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoText = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin: 0;
`;

const DesktopNav = styled.nav`
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  position: relative;
  
  &:hover > ul {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const NavLink = styled(Link)`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  padding: 0.5rem 0;
  transition: ${props => props.theme.transitions.default};
  
  &:hover, &.active {
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    font-weight: 600;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${props => props.theme.colors.white};
  border-radius: 4px;
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 1rem 0;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: ${props => props.theme.transitions.default};
  z-index: 10;
`;

const DropdownItem = styled.li`
  padding: 0;
`;

const DropdownLink = styled(Link)`
  display: block;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${props => props.theme.colors.primary};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const CartButton = styled(Link)`
  position: relative;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  height: 18px;
  width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const AccountButton = styled(Link)`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileNav = styled(motion.nav)`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 300px;
  height: 100vh;
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.large};
  padding: 80px 20px 20px;
  z-index: 999;
  overflow-y: auto;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileNavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MobileNavItem = styled.li`
  margin-bottom: 10px;
`;

const MobileNavLink = styled(Link)`
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: ${props => props.theme.transitions.default};
  
  &:hover, &.active {
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    font-weight: 600;
  }
`;

const MobileSubItems = styled.ul`
  list-style: none;
  padding: 0 0 0 20px;
  margin: 0;
`;

const MobileSubLink = styled(Link)`
  display: block;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  padding: 8px 0;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const UserName = styled.span`
  margin-left: 0.5rem;
`;

const UserDropdown = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${props => props.theme.colors.white};
  border-radius: 4px;
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 1rem 0;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: ${props => props.theme.transitions.default};
  z-index: 10;
`;

const UserDropdownItem = styled.li`
  padding: 0;
`;

const UserDropdownLink = styled(Link)`
  display: block;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${props => props.theme.colors.primary};
  }
`;

const UserDropdownDivider = styled.div`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1.5rem;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${props => props.theme.colors.primary};
  }
`;

export default Header;