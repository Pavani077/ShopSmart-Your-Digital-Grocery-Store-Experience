import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaShoppingBag, FaHeart, FaAddressCard, FaCreditCard, FaSignOutAlt } from 'react-icons/fa';

// Sample user data (would normally come from context or API)
const sampleUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (123) 456-7890',
  avatar: 'https://via.placeholder.com/150',
  addresses: [
    {
      id: 1,
      type: 'Home',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Work',
      street: '456 Office Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: 1,
      type: 'Credit Card',
      cardType: 'Visa',
      lastFour: '4242',
      expiryDate: '12/24',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Credit Card',
      cardType: 'Mastercard',
      lastFour: '5678',
      expiryDate: '06/25',
      isDefault: false,
    },
  ],
};

// Sample orders data
const sampleOrders = [
  {
    id: 'ORD-12345',
    date: '2023-06-15',
    status: 'Delivered',
    total: 25.97,
    items: [
      {
        id: 1,
        name: 'Organic Avocados',
        price: 4.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1587915598582-c841544gu8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80',
      },
      {
        id: 2,
        name: 'Free-Range Organic Eggs',
        price: 7.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599248839210-2b1551a33753?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80',
      },
      {
        id: 3,
        name: 'Fresh Salmon Fillet',
        price: 12.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80',
      },
    ],
  },
  {
    id: 'ORD-12346',
    date: '2023-05-28',
    status: 'Delivered',
    total: 19.98,
    items: [
      {
        id: 5,
        name: 'Organic Bananas',
        price: 3.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80',
      },
      {
        id: 7,
        name: 'Greek Yogurt',
        price: 5.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80',
      },
    ],
  },
];

// Sample wishlist data
const sampleWishlist = [
  {
    id: 4,
    name: 'Artisanal Sourdough Bread',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1598373154817-1293e5a5f1a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    category: 'Bakery',
    discount: 12,
  },
  {
    id: 8,
    name: 'Fresh Organic Strawberries',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    category: 'Fresh Produce',
    discount: 0,
  },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch user data (simulated)
  useEffect(() => {
    // In a real app, you would fetch user data from context or API
    setTimeout(() => {
      setUser(sampleUser);
      setOrders(sampleOrders);
      setWishlist(sampleWishlist);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleRemoveWishlistItem = (id) => {
    setWishlist(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading profile...</LoadingText>
      </LoadingContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>My Account</PageTitle>
          <PageDescription>
            Manage your account information, orders, and preferences
          </PageDescription>
        </PageHeader>
        
        <ProfileSection>
          <ProfileSidebar>
            <UserInfo>
              <UserAvatar src={user.avatar} alt={user.name} />
              <UserName>{user.name}</UserName>
              <UserEmail>{user.email}</UserEmail>
            </UserInfo>
            
            <ProfileNavigation>
              <ProfileNavItem 
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              >
                <ProfileNavIcon><FaUser /></ProfileNavIcon>
                <span>Account Overview</span>
              </ProfileNavItem>
              
              <ProfileNavItem 
                active={activeTab === 'orders'}
                onClick={() => setActiveTab('orders')}
              >
                <ProfileNavIcon><FaShoppingBag /></ProfileNavIcon>
                <span>My Orders</span>
              </ProfileNavItem>
              
              <ProfileNavItem 
                active={activeTab === 'wishlist'}
                onClick={() => setActiveTab('wishlist')}
              >
                <ProfileNavIcon><FaHeart /></ProfileNavIcon>
                <span>Wishlist</span>
              </ProfileNavItem>
              
              <ProfileNavItem 
                active={activeTab === 'addresses'}
                onClick={() => setActiveTab('addresses')}
              >
                <ProfileNavIcon><FaAddressCard /></ProfileNavIcon>
                <span>Addresses</span>
              </ProfileNavItem>
              
              <ProfileNavItem 
                active={activeTab === 'payment'}
                onClick={() => setActiveTab('payment')}
              >
                <ProfileNavIcon><FaCreditCard /></ProfileNavIcon>
                <span>Payment Methods</span>
              </ProfileNavItem>
              
              <ProfileNavItem as="button">
                <ProfileNavIcon><FaSignOutAlt /></ProfileNavIcon>
                <span>Sign Out</span>
              </ProfileNavItem>
            </ProfileNavigation>
          </ProfileSidebar>
          
          <ProfileContent>
            {/* Account Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TabTitle>Account Overview</TabTitle>
                
                <OverviewGrid>
                  <OverviewCard>
                    <OverviewCardTitle>
                      <FaUser /> Personal Information
                    </OverviewCardTitle>
                    <OverviewCardContent>
                      <p><strong>Name:</strong> {user.name}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Phone:</strong> {user.phone}</p>
                    </OverviewCardContent>
                    <OverviewCardAction>
                      <ActionButton>Edit</ActionButton>
                    </OverviewCardAction>
                  </OverviewCard>
                  
                  <OverviewCard>
                    <OverviewCardTitle>
                      <FaAddressCard /> Default Address
                    </OverviewCardTitle>
                    <OverviewCardContent>
                      {user.addresses.find(addr => addr.isDefault) ? (
                        <>
                          <p><strong>{user.addresses.find(addr => addr.isDefault).type}</strong></p>
                          <p>{user.addresses.find(addr => addr.isDefault).street}</p>
                          <p>{user.addresses.find(addr => addr.isDefault).city}, {user.addresses.find(addr => addr.isDefault).state} {user.addresses.find(addr => addr.isDefault).zipCode}</p>
                          <p>{user.addresses.find(addr => addr.isDefault).country}</p>
                        </>
                      ) : (
                        <p>No default address set</p>
                      )}
                    </OverviewCardContent>
                    <OverviewCardAction>
                      <ActionButton onClick={() => setActiveTab('addresses')}>Manage</ActionButton>
                    </OverviewCardAction>
                  </OverviewCard>
                  
                  <OverviewCard>
                    <OverviewCardTitle>
                      <FaCreditCard /> Default Payment
                    </OverviewCardTitle>
                    <OverviewCardContent>
                      {user.paymentMethods.find(pm => pm.isDefault) ? (
                        <>
                          <p><strong>{user.paymentMethods.find(pm => pm.isDefault).cardType}</strong></p>
                          <p>**** **** **** {user.paymentMethods.find(pm => pm.isDefault).lastFour}</p>
                          <p>Expires: {user.paymentMethods.find(pm => pm.isDefault).expiryDate}</p>
                        </>
                      ) : (
                        <p>No default payment method set</p>
                      )}
                    </OverviewCardContent>
                    <OverviewCardAction>
                      <ActionButton onClick={() => setActiveTab('payment')}>Manage</ActionButton>
                    </OverviewCardAction>
                  </OverviewCard>
                  
                  <OverviewCard>
                    <OverviewCardTitle>
                      <FaShoppingBag /> Recent Orders
                    </OverviewCardTitle>
                    <OverviewCardContent>
                      {orders.length > 0 ? (
                        <RecentOrdersList>
                          {orders.slice(0, 2).map(order => (
                            <RecentOrderItem key={order.id}>
                              <div>
                                <p><strong>{order.id}</strong></p>
                                <p>{new Date(order.date).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <OrderStatus status={order.status}>{order.status}</OrderStatus>
                                <p>${order.total.toFixed(2)}</p>
                              </div>
                            </RecentOrderItem>
                          ))}
                        </RecentOrdersList>
                      ) : (
                        <p>No orders yet</p>
                      )}
                    </OverviewCardContent>
                    <OverviewCardAction>
                      <ActionButton onClick={() => setActiveTab('orders')}>View All</ActionButton>
                    </OverviewCardAction>
                  </OverviewCard>
                </OverviewGrid>
              </motion.div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TabTitle>My Orders</TabTitle>
                
                {orders.length > 0 ? (
                  <OrdersList>
                    {orders.map(order => (
                      <OrderCard key={order.id}>
                        <OrderHeader>
                          <OrderHeaderLeft>
                            <OrderId>{order.id}</OrderId>
                            <OrderDate>{new Date(order.date).toLocaleDateString()}</OrderDate>
                          </OrderHeaderLeft>
                          <OrderHeaderRight>
                            <OrderStatus status={order.status}>{order.status}</OrderStatus>
                            <OrderTotal>${order.total.toFixed(2)}</OrderTotal>
                          </OrderHeaderRight>
                        </OrderHeader>
                        
                        <OrderItems>
                          {order.items.map(item => (
                            <OrderItem key={item.id}>
                              <OrderItemImage src={item.image} alt={item.name} />
                              <OrderItemDetails>
                                <OrderItemName>{item.name}</OrderItemName>
                                <OrderItemPrice>
                                  ${item.price.toFixed(2)} x {item.quantity}
                                </OrderItemPrice>
                              </OrderItemDetails>
                            </OrderItem>
                          ))}
                        </OrderItems>
                        
                        <OrderActions>
                          <OrderActionButton>Track Order</OrderActionButton>
                          <OrderActionButton>View Details</OrderActionButton>
                        </OrderActions>
                      </OrderCard>
                    ))}
                  </OrdersList>
                ) : (
                  <EmptyState>
                    <EmptyStateIcon><FaShoppingBag /></EmptyStateIcon>
                    <EmptyStateTitle>No Orders Yet</EmptyStateTitle>
                    <EmptyStateText>You haven't placed any orders yet.</EmptyStateText>
                    <EmptyStateButton to="/products">Start Shopping</EmptyStateButton>
                  </EmptyState>
                )}
              </motion.div>
            )}
            
            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TabTitle>My Wishlist</TabTitle>
                
                {wishlist.length > 0 ? (
                  <WishlistGrid>
                    {wishlist.map(item => (
                      <WishlistCard key={item.id}>
                        <WishlistImageContainer>
                          <WishlistImage src={item.image} alt={item.name} />
                          <WishlistRemove onClick={() => handleRemoveWishlistItem(item.id)}>
                            &times;
                          </WishlistRemove>
                        </WishlistImageContainer>
                        <WishlistCategory>{item.category}</WishlistCategory>
                        <WishlistName>{item.name}</WishlistName>
                        <WishlistPrice>
                          {item.discount > 0 ? (
                            <>
                              <WishlistOldPrice>${item.price.toFixed(2)}</WishlistOldPrice>
                              <WishlistCurrentPrice>
                                ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                              </WishlistCurrentPrice>
                            </>
                          ) : (
                            <WishlistCurrentPrice>${item.price.toFixed(2)}</WishlistCurrentPrice>
                          )}
                        </WishlistPrice>
                        <WishlistActions>
                          <WishlistActionButton to={`/products/${item.id}`}>View Product</WishlistActionButton>
                          <WishlistAddToCart>Add to Cart</WishlistAddToCart>
                        </WishlistActions>
                      </WishlistCard>
                    ))}
                  </WishlistGrid>
                ) : (
                  <EmptyState>
                    <EmptyStateIcon><FaHeart /></EmptyStateIcon>
                    <EmptyStateTitle>Your Wishlist is Empty</EmptyStateTitle>
                    <EmptyStateText>Save items you like to your wishlist and they'll appear here.</EmptyStateText>
                    <EmptyStateButton to="/products">Browse Products</EmptyStateButton>
                  </EmptyState>
                )}
              </motion.div>
            )}
            
            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TabTitleWithAction>
                  <TabTitle>My Addresses</TabTitle>
                  <AddButton>Add New Address</AddButton>
                </TabTitleWithAction>
                
                <AddressList>
                  {user.addresses.map(address => (
                    <AddressCard key={address.id}>
                      <AddressType>
                        {address.type}
                        {address.isDefault && <DefaultBadge>Default</DefaultBadge>}
                      </AddressType>
                      <AddressDetails>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                      </AddressDetails>
                      <AddressActions>
                        <AddressActionButton>Edit</AddressActionButton>
                        {!address.isDefault && (
                          <AddressActionButton>Set as Default</AddressActionButton>
                        )}
                        {!address.isDefault && (
                          <AddressActionButton danger>Delete</AddressActionButton>
                        )}
                      </AddressActions>
                    </AddressCard>
                  ))}
                </AddressList>
              </motion.div>
            )}
            
            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TabTitleWithAction>
                  <TabTitle>Payment Methods</TabTitle>
                  <AddButton>Add New Card</AddButton>
                </TabTitleWithAction>
                
                <PaymentMethodsList>
                  {user.paymentMethods.map(method => (
                    <PaymentCard key={method.id}>
                      <PaymentCardType>
                        {method.cardType}
                        {method.isDefault && <DefaultBadge>Default</DefaultBadge>}
                      </PaymentCardType>
                      <PaymentCardDetails>
                        <p>**** **** **** {method.lastFour}</p>
                        <p>Expires: {method.expiryDate}</p>
                      </PaymentCardDetails>
                      <PaymentCardActions>
                        {!method.isDefault && (
                          <PaymentCardActionButton>Set as Default</PaymentCardActionButton>
                        )}
                        {!method.isDefault && (
                          <PaymentCardActionButton danger>Remove</PaymentCardActionButton>
                        )}
                      </PaymentCardActions>
                    </PaymentCard>
                  ))}
                </PaymentMethodsList>
              </motion.div>
            )}
          </ProfileContent>
        </ProfileSection>
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

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
  max-width: 700px;
  margin: 0 auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const ProfileSection = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const UserInfo = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  padding: 25px;
  text-align: center;
  margin-bottom: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    max-width: 400px;
  }
`;

const UserAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
`;

const UserName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const ProfileNavigation = styled.nav`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    max-width: 400px;
  }
`;

const ProfileNavItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px 20px;
  background-color: ${props => props.active ? props.theme.colors.primary + '10' : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const ProfileNavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 1.2rem;
`;

const ProfileContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  padding: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 20px 15px;
  }
`;

const TabTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: ${props => props.theme.colors.text};
`;

const TabTitleWithAction = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const AddButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const OverviewCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const OverviewCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${props => props.theme.colors.background};
  padding: 15px 20px;
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const OverviewCardContent = styled.div`
  padding: 20px;
  
  p {
    margin-bottom: 8px;
  }
`;

const OverviewCardAction = styled.div`
  padding: 0 20px 20px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const RecentOrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RecentOrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 10px;
  }
`;

const OrderHeaderLeft = styled.div``;

const OrderId = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.text};
`;

const OrderDate = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const OrderHeaderRight = styled.div`
  text-align: right;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    text-align: left;
  }
`;

const OrderStatus = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 5px;
  
  ${props => {
    switch(props.status) {
      case 'Delivered':
        return `
          background-color: #e6f7ee;
          color: #2e7d32;
        `;
      case 'Processing':
        return `
          background-color: #e3f2fd;
          color: #1976d2;
        `;
      case 'Shipped':
        return `
          background-color: #fff8e1;
          color: #f57c00;
        `;
      case 'Cancelled':
        return `
          background-color: #ffebee;
          color: #c62828;
        `;
      default:
        return `
          background-color: #f5f5f5;
          color: #757575;
        `;
    }
  }};
`;

const OrderTotal = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const OrderItems = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const OrderItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const OrderItemDetails = styled.div`
  flex: 1;
`;

const OrderItemName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.text};
`;

const OrderItemPrice = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const OrderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const OrderActionButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 20px;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 20px;
  max-width: 400px;
`;

const EmptyStateButton = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const WishlistCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const WishlistImageContainer = styled.div`
  position: relative;
`;

const WishlistImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const WishlistRemove = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: white;
  color: #666;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const WishlistCategory = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.lightText};
  padding: 10px 15px 0;
`;

const WishlistName = styled.div`
  font-weight: 500;
  padding: 5px 15px 10px;
  color: ${props => props.theme.colors.text};
`;

const WishlistPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px 10px;
`;

const WishlistCurrentPrice = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const WishlistOldPrice = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  text-decoration: line-through;
`;

const WishlistActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const WishlistActionButton = styled(Link)`
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  padding: 8px 0;
  font-size: 0.85rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const WishlistAddToCart = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 0;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const AddressList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const AddressCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const AddressType = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: ${props => props.theme.colors.background};
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const DefaultBadge = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 500;
`;

const AddressDetails = styled.div`
  padding: 15px;
  
  p {
    margin-bottom: 5px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const AddressActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 15px 15px;
`;

const AddressActionButton = styled.button`
  background-color: transparent;
  color: ${props => props.danger ? props.theme.colors.error : props.theme.colors.primary};
  border: 1px solid ${props => props.danger ? props.theme.colors.error : props.theme.colors.primary};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.danger ? props.theme.colors.error : props.theme.colors.primary};
    color: white;
  }
`;

const PaymentMethodsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const PaymentCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const PaymentCardType = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: ${props => props.theme.colors.background};
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PaymentCardDetails = styled.div`
  padding: 15px;
  
  p {
    margin-bottom: 5px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const PaymentCardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 15px 15px;
`;

const PaymentCardActionButton = styled.button`
  background-color: transparent;
  color: ${props => props.danger ? props.theme.colors.error : props.theme.colors.primary};
  border: 1px solid ${props => props.danger ? props.theme.colors.error : props.theme.colors.primary};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.danger ? props.theme.colors.error : props.theme.colors.primary};
    color: white;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
`;

export default ProfilePage;