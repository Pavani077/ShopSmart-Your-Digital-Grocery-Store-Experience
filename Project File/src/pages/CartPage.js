import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

// Sample cart data (would normally come from context or state management)
const sampleCartItems = [
  {
    id: 1,
    name: 'Organic Avocados',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1587915598582-c841544gu8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    quantity: 2,
    discount: 10,
  },
  {
    id: 2,
    name: 'Free-Range Organic Eggs',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1599248839210-2b1551a33753?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    quantity: 1,
    discount: 0,
  },
  {
    id: 3,
    name: 'Fresh Salmon Fillet',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    quantity: 1,
    discount: 5,
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Fetch cart items (simulated)
  useEffect(() => {
    // In a real app, you would fetch cart items from context or API
    setTimeout(() => {
      setCartItems(sampleCartItems);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleQuantityChange = (id, action) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          if (action === 'increase') {
            return { ...item, quantity: item.quantity + 1 };
          } else if (action === 'decrease' && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      })
    );
  };
  
  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleApplyCoupon = () => {
    // Simulate coupon validation
    if (couponCode.toLowerCase() === 'discount20') {
      setCouponApplied(true);
      setCouponDiscount(20);
    } else {
      alert('Invalid coupon code');
    }
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discount > 0 
        ? item.price * (1 - item.discount / 100) 
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };
  
  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return couponApplied ? (subtotal * (couponDiscount / 100)) : 0;
  };
  
  const calculateShipping = () => {
    // Free shipping over $100, otherwise $10
    const subtotal = calculateSubtotal();
    return subtotal >= 100 ? 0 : 10;
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = calculateShipping();
    return subtotal - discount + shipping;
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading cart...</LoadingText>
      </LoadingContainer>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <PageContainer>
        <div className="container">
          <EmptyCartContainer>
            <EmptyCartIcon>
              <FaShoppingCart />
            </EmptyCartIcon>
            <EmptyCartTitle>Your cart is empty</EmptyCartTitle>
            <EmptyCartText>
              Looks like you haven't added any products to your cart yet.
            </EmptyCartText>
            <ContinueShoppingButton to="/products">
              <FaArrowLeft /> Continue Shopping
            </ContinueShoppingButton>
          </EmptyCartContainer>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>Your Cart</PageTitle>
          <PageDescription>
            Review your items and proceed to checkout
          </PageDescription>
        </PageHeader>
        
        <CartSection>
          <CartItemsContainer>
            <CartHeader>
              <CartHeaderItem flex="3">Product</CartHeaderItem>
              <CartHeaderItem flex="1">Price</CartHeaderItem>
              <CartHeaderItem flex="2">Quantity</CartHeaderItem>
              <CartHeaderItem flex="1">Total</CartHeaderItem>
              <CartHeaderItem flex="0.5"></CartHeaderItem>
            </CartHeader>
            
            {cartItems.map((item) => {
              const itemPrice = item.discount > 0 
                ? item.price * (1 - item.discount / 100) 
                : item.price;
              const itemTotal = itemPrice * item.quantity;
              
              return (
                <CartItem 
                  key={item.id}
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CartItemContent flex="3">
                    <CartItemImage src={item.image} alt={item.name} />
                    <CartItemDetails>
                      <CartItemName>{item.name}</CartItemName>
                      {item.discount > 0 && (
                        <CartItemDiscount>{item.discount}% OFF</CartItemDiscount>
                      )}
                    </CartItemDetails>
                  </CartItemContent>
                  
                  <CartItemPrice flex="1">
                    {item.discount > 0 ? (
                      <>
                        <OldPrice>${item.price.toFixed(2)}</OldPrice>
                        <CurrentPrice>${itemPrice.toFixed(2)}</CurrentPrice>
                      </>
                    ) : (
                      <CurrentPrice>${item.price.toFixed(2)}</CurrentPrice>
                    )}
                  </CartItemPrice>
                  
                  <CartItemQuantity flex="2">
                    <QuantitySelector>
                      <QuantityButton 
                        onClick={() => handleQuantityChange(item.id, 'decrease')}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </QuantityButton>
                      <QuantityInput value={item.quantity} readOnly />
                      <QuantityButton 
                        onClick={() => handleQuantityChange(item.id, 'increase')}
                      >
                        <FaPlus />
                      </QuantityButton>
                    </QuantitySelector>
                  </CartItemQuantity>
                  
                  <CartItemTotal flex="1">
                    <CurrentPrice>${itemTotal.toFixed(2)}</CurrentPrice>
                  </CartItemTotal>
                  
                  <CartItemRemove flex="0.5">
                    <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                      <FaTrash />
                    </RemoveButton>
                  </CartItemRemove>
                </CartItem>
              );
            })}
            
            <CartActions>
              <ContinueShoppingLink to="/products">
                <FaArrowLeft /> Continue Shopping
              </ContinueShoppingLink>
            </CartActions>
          </CartItemsContainer>
          
          <CartSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            <SummaryRow>
              <SummaryLabel>Subtotal</SummaryLabel>
              <SummaryValue>${calculateSubtotal().toFixed(2)}</SummaryValue>
            </SummaryRow>
            
            {couponApplied && (
              <SummaryRow>
                <SummaryLabel>Discount ({couponDiscount}%)</SummaryLabel>
                <SummaryValue>-${calculateDiscount().toFixed(2)}</SummaryValue>
              </SummaryRow>
            )}
            
            <SummaryRow>
              <SummaryLabel>Shipping</SummaryLabel>
              <SummaryValue>
                {calculateShipping() === 0 ? (
                  <FreeShipping>Free</FreeShipping>
                ) : (
                  `$${calculateShipping().toFixed(2)}`
                )}
              </SummaryValue>
            </SummaryRow>
            
            <CouponSection>
              <CouponInput 
                type="text" 
                placeholder="Enter coupon code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
              />
              <CouponButton 
                onClick={handleApplyCoupon}
                disabled={couponApplied || !couponCode}
              >
                Apply
              </CouponButton>
            </CouponSection>
            
            {couponApplied && (
              <CouponApplied>
                Coupon "DISCOUNT20" applied successfully!
              </CouponApplied>
            )}
            
            <TotalRow>
              <TotalLabel>Total</TotalLabel>
              <TotalValue>${calculateTotal().toFixed(2)}</TotalValue>
            </TotalRow>
            
            <CheckoutButton to="/checkout">
              Proceed to Checkout
            </CheckoutButton>
            
            <SecureCheckout>
              <SecureText>Secure Checkout</SecureText>
              <PaymentMethods>
                <PaymentText>Visa • MasterCard • PayPal • Apple Pay</PaymentText>
              </PaymentMethods>
            </SecureCheckout>
          </CartSummary>
        </CartSection>
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

const CartSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
`;

const CartHeader = styled.div`
  display: flex;
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const CartHeaderItem = styled.div`
  flex: ${props => props.flex};
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

const CartItemContent = styled.div`
  flex: ${props => props.flex};
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex: 1 0 100%;
  }
`;

const CartItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const CartItemDetails = styled.div`
  flex: 1;
`;

const CartItemName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.text};
`;

const CartItemDiscount = styled.span`
  display: inline-block;
  padding: 3px 6px;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  font-size: 0.7rem;
  border-radius: 3px;
`;

const CartItemPrice = styled.div`
  flex: ${props => props.flex};
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex: 1;
  }
`;

const CurrentPrice = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const OldPrice = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.lightText};
  text-decoration: line-through;
`;

const CartItemQuantity = styled.div`
  flex: ${props => props.flex};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex: 1;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background: #f5f5f5;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #e0e0e0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 40px;
  height: 30px;
  border: none;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  -moz-appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const CartItemTotal = styled.div`
  flex: ${props => props.flex};
  font-weight: 600;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex: 1;
    text-align: right;
  }
`;

const CartItemRemove = styled.div`
  flex: ${props => props.flex};
  display: flex;
  justify-content: center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    position: absolute;
    top: 20px;
    right: 20px;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.lightText};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const CartActions = styled.div`
  padding: 20px;
  display: flex;
  justify-content: flex-start;
`;

const ContinueShoppingLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    text-decoration: underline;
  }
`;

const CartSummary = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  padding: 25px;
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const SummaryLabel = styled.span`
  color: ${props => props.theme.colors.lightText};
`;

const SummaryValue = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const FreeShipping = styled.span`
  color: ${props => props.theme.colors.secondary};
  font-weight: 600;
`;

const CouponSection = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

const CouponInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    background-color: #f9f9f9;
  }
`;

const CouponButton = styled.button`
  padding: 0 20px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CouponApplied = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 20px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 25px 0;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

const TotalLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TotalValue = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const CheckoutButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 15px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-align: center;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const SecureCheckout = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const SecureText = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 10px;
`;

const PaymentMethods = styled.div`
  img {
    max-width: 100%;
    height: auto;
  }
`;

const PaymentText = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 10px;
`;

const EmptyCartContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 20px;
`;

const EmptyCartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const EmptyCartText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const ContinueShoppingButton = styled(Link)`
  display: inline-flex;
  align-items: center;
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150px 0;
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

export default CartPage;