import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaShoppingBag, 
  FaHeart, 
  FaAddressCard, 
  FaCreditCard, 
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaTruck,
  FaStar,
  FaEye
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Sample data (would normally come from API)
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setOrders([
        {
          id: 'ORD-12345',
          date: '2023-06-15',
          status: 'Delivered',
          total: 25.97,
          items: [
            { name: 'Organic Avocados', quantity: 2, price: 4.99 },
            { name: 'Free-Range Organic Eggs', quantity: 1, price: 7.99 },
            { name: 'Fresh Salmon Fillet', quantity: 1, price: 12.99 }
          ]
        },
        {
          id: 'ORD-12346',
          date: '2023-05-28',
          status: 'Delivered',
          total: 19.98,
          items: [
            { name: 'Organic Bananas', quantity: 2, price: 3.99 },
            { name: 'Greek Yogurt', quantity: 2, price: 5.99 }
          ]
        }
      ]);
      
      setWishlist([
        {
          id: 1,
          name: 'Artisanal Sourdough Bread',
          price: 6.50,
          image: 'https://images.unsplash.com/photo-1598373154817-1293e5a5f1a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
          category: 'Bakery'
        },
        {
          id: 2,
          name: 'Fresh Organic Strawberries',
          price: 4.99,
          image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
          category: 'Fresh Produce'
        }
      ]);
      
      setRecentActivity([
        { type: 'order', message: 'Order ORD-12345 delivered', date: '2023-06-15' },
        { type: 'wishlist', message: 'Added Artisanal Sourdough Bread to wishlist', date: '2023-06-14' },
        { type: 'review', message: 'Left a review for Organic Avocados', date: '2023-06-13' }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#4CAF50';
      case 'Shipped': return '#2196F3';
      case 'Processing': return '#FF9800';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading dashboard...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container">
        <DashboardHeader>
          <WelcomeSection>
            <WelcomeTitle>Welcome back, {user?.firstName || 'User'}!</WelcomeTitle>
            <WelcomeSubtitle>Here's what's happening with your account</WelcomeSubtitle>
          </WelcomeSection>
          <HeaderActions>
            <NotificationButton>
              <FaBell />
            </NotificationButton>
            <SettingsButton to="/settings">
              <FaCog />
            </SettingsButton>
          </HeaderActions>
        </DashboardHeader>

        <DashboardContent>
          <DashboardSidebar>
            <SidebarNav>
              <SidebarNavItem 
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              >
                <SidebarNavIcon><FaUser /></SidebarNavIcon>
                <span>Overview</span>
              </SidebarNavItem>
              
              <SidebarNavItem 
                active={activeTab === 'orders'}
                onClick={() => setActiveTab('orders')}
              >
                <SidebarNavIcon><FaShoppingBag /></SidebarNavIcon>
                <span>My Orders</span>
              </SidebarNavItem>
              
              <SidebarNavItem 
                active={activeTab === 'wishlist'}
                onClick={() => setActiveTab('wishlist')}
              >
                <SidebarNavIcon><FaHeart /></SidebarNavIcon>
                <span>Wishlist</span>
              </SidebarNavItem>
              
              <SidebarNavItem 
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              >
                <SidebarNavIcon><FaAddressCard /></SidebarNavIcon>
                <span>Profile</span>
              </SidebarNavItem>
              
              <SidebarNavItem 
                active={activeTab === 'addresses'}
                onClick={() => setActiveTab('addresses')}
              >
                <SidebarNavIcon><FaAddressCard /></SidebarNavIcon>
                <span>Addresses</span>
              </SidebarNavItem>
              
              <SidebarNavItem 
                active={activeTab === 'payment'}
                onClick={() => setActiveTab('payment')}
              >
                <SidebarNavIcon><FaCreditCard /></SidebarNavIcon>
                <span>Payment Methods</span>
              </SidebarNavItem>
            </SidebarNav>
            
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Sign Out</span>
            </LogoutButton>
          </DashboardSidebar>

          <DashboardMain>
            {activeTab === 'overview' && (
              <OverviewTab>
                <StatsGrid>
                  <StatCard>
                    <StatIcon><FaShoppingBag /></StatIcon>
                    <StatContent>
                      <StatNumber>{orders.length}</StatNumber>
                      <StatLabel>Total Orders</StatLabel>
                    </StatContent>
                  </StatCard>
                  
                  <StatCard>
                    <StatIcon><FaHeart /></StatIcon>
                    <StatContent>
                      <StatNumber>{wishlist.length}</StatNumber>
                      <StatLabel>Wishlist Items</StatLabel>
                    </StatContent>
                  </StatCard>
                  
                  <StatCard>
                    <StatIcon><FaStar /></StatIcon>
                    <StatContent>
                      <StatNumber>4.8</StatNumber>
                      <StatLabel>Average Rating</StatLabel>
                    </StatContent>
                  </StatCard>
                  
                  <StatCard>
                    <StatIcon><FaTruck /></StatIcon>
                    <StatContent>
                      <StatNumber>2</StatNumber>
                      <StatLabel>Active Orders</StatLabel>
                    </StatContent>
                  </StatCard>
                </StatsGrid>

                <RecentOrdersSection>
                  <SectionTitle>Recent Orders</SectionTitle>
                  <OrdersList>
                    {orders.slice(0, 3).map((order) => (
                      <OrderCard key={order.id}>
                        <OrderHeader>
                          <OrderId>{order.id}</OrderId>
                          <OrderStatus color={getStatusColor(order.status)}>
                            {order.status}
                          </OrderStatus>
                        </OrderHeader>
                        <OrderDate>{order.date}</OrderDate>
                        <OrderTotal>${order.total.toFixed(2)}</OrderTotal>
                        <ViewOrderButton to={`/orders/${order.id}`}>
                          <FaEye /> View Details
                        </ViewOrderButton>
                      </OrderCard>
                    ))}
                  </OrdersList>
                </RecentOrdersSection>

                <RecentActivitySection>
                  <SectionTitle>Recent Activity</SectionTitle>
                  <ActivityList>
                    {recentActivity.map((activity, index) => (
                      <ActivityItem key={index}>
                        <ActivityIcon type={activity.type}>
                          {activity.type === 'order' && <FaTruck />}
                          {activity.type === 'wishlist' && <FaHeart />}
                          {activity.type === 'review' && <FaStar />}
                        </ActivityIcon>
                        <ActivityContent>
                          <ActivityMessage>{activity.message}</ActivityMessage>
                          <ActivityDate>{activity.date}</ActivityDate>
                        </ActivityContent>
                      </ActivityItem>
                    ))}
                  </ActivityList>
                </RecentActivitySection>
              </OverviewTab>
            )}

            {activeTab === 'orders' && (
              <OrdersTab>
                <SectionTitle>My Orders</SectionTitle>
                <OrdersTable>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.date}</td>
                        <td>
                          <StatusBadge color={getStatusColor(order.status)}>
                            {order.status}
                          </StatusBadge>
                        </td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>
                          <ActionButton to={`/orders/${order.id}`}>
                            <FaEye /> View
                          </ActionButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </OrdersTable>
              </OrdersTab>
            )}

            {activeTab === 'wishlist' && (
              <WishlistTab>
                <SectionTitle>My Wishlist</SectionTitle>
                <WishlistGrid>
                  {wishlist.map((item) => (
                    <WishlistCard key={item.id}>
                      <WishlistImage src={item.image} alt={item.name} />
                      <WishlistContent>
                        <WishlistName>{item.name}</WishlistName>
                        <WishlistCategory>{item.category}</WishlistCategory>
                        <WishlistPrice>${item.price.toFixed(2)}</WishlistPrice>
                        <WishlistActions>
                          <AddToCartButton>Add to Cart</AddToCartButton>
                          <RemoveButton>Remove</RemoveButton>
                        </WishlistActions>
                      </WishlistContent>
                    </WishlistCard>
                  ))}
                </WishlistGrid>
              </WishlistTab>
            )}

            {activeTab === 'profile' && (
              <ProfileTab>
                <SectionTitle>Profile Information</SectionTitle>
                <ProfileForm>
                  <FormRow>
                    <FormGroup>
                      <FormLabel>First Name</FormLabel>
                      <FormInput defaultValue={user?.firstName || ''} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Last Name</FormLabel>
                      <FormInput defaultValue={user?.lastName || ''} />
                    </FormGroup>
                  </FormRow>
                  <FormGroup>
                    <FormLabel>Email</FormLabel>
                    <FormInput type="email" defaultValue={user?.email || ''} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Phone</FormLabel>
                    <FormInput defaultValue={user?.phone || ''} />
                  </FormGroup>
                  <SaveButton>Save Changes</SaveButton>
                </ProfileForm>
              </ProfileTab>
            )}

            {activeTab === 'addresses' && (
              <AddressesTab>
                <SectionTitle>My Addresses</SectionTitle>
                <AddressesList>
                  <AddressCard>
                    <AddressType>Home</AddressType>
                    <AddressText>123 Main Street, New York, NY 10001</AddressText>
                    <AddressActions>
                      <EditButton>Edit</EditButton>
                      <DeleteButton>Delete</DeleteButton>
                    </AddressActions>
                  </AddressCard>
                </AddressesList>
                <AddAddressButton>Add New Address</AddAddressButton>
              </AddressesTab>
            )}

            {activeTab === 'payment' && (
              <PaymentTab>
                <SectionTitle>Payment Methods</SectionTitle>
                <PaymentMethodsList>
                  <PaymentCard>
                    <PaymentType>Visa ending in 4242</PaymentType>
                    <PaymentExpiry>Expires 12/24</PaymentExpiry>
                    <PaymentActions>
                      <EditButton>Edit</EditButton>
                      <DeleteButton>Delete</DeleteButton>
                    </PaymentActions>
                  </PaymentCard>
                </PaymentMethodsList>
                <AddPaymentButton>Add Payment Method</AddPaymentButton>
              </PaymentTab>
            )}
          </DashboardMain>
        </DashboardContent>
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

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
`;

const WelcomeSection = styled.div``;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
`;

const NotificationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: white;
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SettingsButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: white;
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  text-decoration: none;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const DashboardSidebar = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  padding: 20px;
  height: fit-content;
`;

const SidebarNav = styled.nav`
  margin-bottom: 30px;
`;

const SidebarNavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  margin-bottom: 5px;
  
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : '#f5f5f5'};
  }
`;

const SidebarNavIcon = styled.div`
  font-size: 1.1rem;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-radius: 6px;
  background: #f44336;
  color: white;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #d32f2f;
  }
`;

const DashboardMain = styled.main`
  background: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  padding: 30px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
`;

const StatContent = styled.div``;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const OrdersList = styled.div`
  display: grid;
  gap: 15px;
`;

const OrderCard = styled.div`
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #f8f9fa;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const OrderId = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const OrderStatus = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => props.color}20;
  color: ${props => props.color};
`;

const OrderDate = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 5px;
`;

const OrderTotal = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 15px;
`;

const ViewOrderButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #e55a2b;
  }
`;

const ActivityList = styled.div`
  display: grid;
  gap: 15px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #f8f9fa;
`;

const ActivityIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'order': return '#2196F3';
      case 'wishlist': return '#E91E63';
      case 'review': return '#FF9800';
      default: return '#757575';
    }
  }};
  color: white;
`;

const ActivityContent = styled.div``;

const ActivityMessage = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
`;

const ActivityDate = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.lightText};
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    background: #f8f9fa;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => props.color}20;
  color: ${props => props.color};
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.8rem;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #e55a2b;
  }
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const WishlistCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

const WishlistImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const WishlistContent = styled.div`
  padding: 15px;
`;

const WishlistName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.text};
`;

const WishlistCategory = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 10px;
`;

const WishlistPrice = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 15px;
`;

const WishlistActions = styled.div`
  display: flex;
  gap: 10px;
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #e55a2b;
  }
`;

const RemoveButton = styled.button`
  padding: 8px 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #d32f2f;
  }
`;

const ProfileForm = styled.form`
  max-width: 600px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
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

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SaveButton = styled.button`
  padding: 12px 30px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #e55a2b;
  }
`;

const AddressesList = styled.div`
  margin-bottom: 20px;
`;

const AddressCard = styled.div`
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #f8f9fa;
  margin-bottom: 15px;
`;

const AddressType = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
`;

const AddressText = styled.div`
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 15px;
`;

const AddressActions = styled.div`
  display: flex;
  gap: 10px;
`;

const EditButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #e55a2b;
  }
`;

const DeleteButton = styled.button`
  padding: 6px 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #d32f2f;
  }
`;

const AddAddressButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #e55a2b;
  }
`;

const PaymentMethodsList = styled.div`
  margin-bottom: 20px;
`;

const PaymentCard = styled.div`
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #f8f9fa;
  margin-bottom: 15px;
`;

const PaymentType = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
`;

const PaymentExpiry = styled.div`
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 15px;
`;

const PaymentActions = styled.div`
  display: flex;
  gap: 10px;
`;

const AddPaymentButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #e55a2b;
  }
`;

// Tab Components
const OverviewTab = styled.div``;

const RecentOrdersSection = styled.div`
  margin-bottom: 40px;
`;

const RecentActivitySection = styled.div``;

const OrdersTab = styled.div``;

const WishlistTab = styled.div``;

const ProfileTab = styled.div``;

const AddressesTab = styled.div``;

const PaymentTab = styled.div``;

export default DashboardPage; 