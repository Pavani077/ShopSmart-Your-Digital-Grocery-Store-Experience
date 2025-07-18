import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaLock, FaCreditCard, FaPaypal } from 'react-icons/fa';

// Sample cart data (would normally come from context or state management)
const sampleCartItems = [
  {
    id: 1,
    name: 'Organic Avocados (3 pack)',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1587915598582-c841544gu8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80',
    quantity: 1,
    discount: 10,
  },
  {
    id: 2,
    name: 'Artisanal Sourdough Bread',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1598373154817-1293e5a5f1a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80',
    quantity: 1,
    discount: 0,
  },
  {
    id: 3,
    name: 'Free-Range Organic Eggs (dozen)',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1599248839210-2b1551a33753?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80',
    quantity: 2,
    discount: 5,
  },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    // Payment Information
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    savePaymentInfo: false,
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  
  // Fetch cart items (simulated)
  useEffect(() => {
    // In a real app, you would fetch cart items from context or API
    setTimeout(() => {
      setCartItems(sampleCartItems);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleNextStep = () => {
    setActiveStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };
  
  const handlePreviousStep = () => {
    setActiveStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would process the order here
    // For now, we'll just simulate a successful order
    alert('Order placed successfully!');
    navigate('/profile');
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discount > 0 
        ? item.price * (1 - item.discount / 100) 
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };
  
  const calculateShipping = () => {
    // Free shipping over $100, otherwise $10
    const subtotal = calculateSubtotal();
    return subtotal >= 100 ? 0 : 10;
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    return subtotal + shipping;
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading checkout...</LoadingText>
      </LoadingContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>Checkout</PageTitle>
          <PageDescription>
            Complete your order by providing your shipping and payment details
          </PageDescription>
        </PageHeader>
        
        <CheckoutSteps>
          <CheckoutStep active={activeStep >= 1} completed={activeStep > 1}>
            <StepNumber>1</StepNumber>
            <StepTitle>Shipping</StepTitle>
          </CheckoutStep>
          <StepConnector completed={activeStep > 1} />
          <CheckoutStep active={activeStep >= 2} completed={activeStep > 2}>
            <StepNumber>2</StepNumber>
            <StepTitle>Payment</StepTitle>
          </CheckoutStep>
          <StepConnector completed={activeStep > 2} />
          <CheckoutStep active={activeStep >= 3} completed={activeStep > 3}>
            <StepNumber>3</StepNumber>
            <StepTitle>Review</StepTitle>
          </CheckoutStep>
        </CheckoutSteps>
        
        <CheckoutSection>
          <CheckoutForm onSubmit={handleSubmit}>
            {/* Step 1: Shipping Information */}
            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FormTitle>Shipping Information</FormTitle>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>First Name *</FormLabel>
                    <FormInput 
                      type="text" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Last Name *</FormLabel>
                    <FormInput 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>Email Address *</FormLabel>
                    <FormInput 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormInput 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </FormRow>
                
                <FormGroup>
                  <FormLabel>Address *</FormLabel>
                  <FormInput 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>City *</FormLabel>
                    <FormInput 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>State/Province *</FormLabel>
                    <FormInput 
                      type="text" 
                      name="state" 
                      value={formData.state} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>ZIP/Postal Code *</FormLabel>
                    <FormInput 
                      type="text" 
                      name="zipCode" 
                      value={formData.zipCode} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Country *</FormLabel>
                    <FormSelect 
                      name="country" 
                      value={formData.country} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </FormSelect>
                  </FormGroup>
                </FormRow>
                
                <FormActions>
                  <BackButton as={Link} to="/cart">
                    <FaArrowLeft /> Back to Cart
                  </BackButton>
                  <NextButton type="button" onClick={handleNextStep}>
                    Continue to Payment
                  </NextButton>
                </FormActions>
              </motion.div>
            )}
            
            {/* Step 2: Payment Information */}
            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FormTitle>Payment Method</FormTitle>
                
                <PaymentMethods>
                  <PaymentMethod 
                    active={paymentMethod === 'credit-card'}
                    onClick={() => setPaymentMethod('credit-card')}
                  >
                    <PaymentMethodIcon>
                      <FaCreditCard />
                    </PaymentMethodIcon>
                    <PaymentMethodTitle>Credit Card</PaymentMethodTitle>
                  </PaymentMethod>
                  
                  <PaymentMethod 
                    active={paymentMethod === 'paypal'}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <PaymentMethodIcon>
                      <FaPaypal />
                    </PaymentMethodIcon>
                    <PaymentMethodTitle>PayPal</PaymentMethodTitle>
                  </PaymentMethod>
                </PaymentMethods>
                
                {paymentMethod === 'credit-card' && (
                  <div>
                    <FormGroup>
                      <FormLabel>Name on Card *</FormLabel>
                      <FormInput 
                        type="text" 
                        name="cardName" 
                        value={formData.cardName} 
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Card Number *</FormLabel>
                      <FormInput 
                        type="text" 
                        name="cardNumber" 
                        value={formData.cardNumber} 
                        onChange={handleInputChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        required
                      />
                    </FormGroup>
                    
                    <FormRow>
                      <FormGroup>
                        <FormLabel>Expiry Date *</FormLabel>
                        <FormInput 
                          type="text" 
                          name="expiryDate" 
                          value={formData.expiryDate} 
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>CVV *</FormLabel>
                        <FormInput 
                          type="text" 
                          name="cvv" 
                          value={formData.cvv} 
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                        />
                      </FormGroup>
                    </FormRow>
                    
                    <FormCheckbox>
                      <input 
                        type="checkbox" 
                        name="savePaymentInfo" 
                        checked={formData.savePaymentInfo} 
                        onChange={handleInputChange}
                      />
                      <span>Save this card for future purchases</span>
                    </FormCheckbox>
                  </div>
                )}
                
                {paymentMethod === 'paypal' && (
                  <PaypalInfo>
                    <p>You will be redirected to PayPal to complete your purchase securely.</p>
                  </PaypalInfo>
                )}
                
                <FormActions>
                  <BackButton type="button" onClick={handlePreviousStep}>
                    <FaArrowLeft /> Back to Shipping
                  </BackButton>
                  <NextButton type="button" onClick={handleNextStep}>
                    Review Order
                  </NextButton>
                </FormActions>
              </motion.div>
            )}
            
            {/* Step 3: Order Review */}
            {activeStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FormTitle>Review Your Order</FormTitle>
                
                <ReviewSection>
                  <ReviewTitle>Shipping Information</ReviewTitle>
                  <ReviewContent>
                    <p><strong>{formData.firstName} {formData.lastName}</strong></p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p>{formData.country}</p>
                    <p>Email: {formData.email}</p>
                    <p>Phone: {formData.phone}</p>
                  </ReviewContent>
                </ReviewSection>
                
                <ReviewSection>
                  <ReviewTitle>Payment Method</ReviewTitle>
                  <ReviewContent>
                    {paymentMethod === 'credit-card' ? (
                      <p>
                        <FaCreditCard /> Credit Card ending in {formData.cardNumber.slice(-4)}
                      </p>
                    ) : (
                      <p>
                        <FaPaypal /> PayPal
                      </p>
                    )}
                  </ReviewContent>
                </ReviewSection>
                
                <ReviewSection>
                  <ReviewTitle>Order Items</ReviewTitle>
                  <OrderItems>
                    {cartItems.map((item) => {
                      const itemPrice = item.discount > 0 
                        ? item.price * (1 - item.discount / 100) 
                        : item.price;
                      return (
                        <OrderItem key={item.id}>
                          <OrderItemImage src={item.image} alt={item.name} />
                          <OrderItemDetails>
                            <OrderItemName>{item.name}</OrderItemName>
                            <OrderItemPrice>
                              ${itemPrice.toFixed(2)} x {item.quantity}
                            </OrderItemPrice>
                          </OrderItemDetails>
                          <OrderItemTotal>
                            ${(itemPrice * item.quantity).toFixed(2)}
                          </OrderItemTotal>
                        </OrderItem>
                      );
                    })}
                  </OrderItems>
                </ReviewSection>
                
                <OrderSummary>
                  <SummaryRow>
                    <SummaryLabel>Subtotal</SummaryLabel>
                    <SummaryValue>${calculateSubtotal().toFixed(2)}</SummaryValue>
                  </SummaryRow>
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
                  <TotalRow>
                    <TotalLabel>Total</TotalLabel>
                    <TotalValue>${calculateTotal().toFixed(2)}</TotalValue>
                  </TotalRow>
                </OrderSummary>
                
                <SecureCheckoutNotice>
                  <FaLock /> Your payment information is secure. We use encryption to protect your data.
                </SecureCheckoutNotice>
                
                <FormActions>
                  <BackButton type="button" onClick={handlePreviousStep}>
                    <FaArrowLeft /> Back to Payment
                  </BackButton>
                  <PlaceOrderButton type="submit">
                    Place Order
                  </PlaceOrderButton>
                </FormActions>
              </motion.div>
            )}
          </CheckoutForm>
          
          <OrderSummaryCard>
            <SummaryCardTitle>Order Summary</SummaryCardTitle>
            
            <SummaryItems>
              {cartItems.map((item) => {
                const itemPrice = item.discount > 0 
                  ? item.price * (1 - item.discount / 100) 
                  : item.price;
                return (
                  <SummaryItem key={item.id}>
                    <SummaryItemName>
                      {item.name} <SummaryItemQuantity>x{item.quantity}</SummaryItemQuantity>
                    </SummaryItemName>
                    <SummaryItemPrice>
                      ${(itemPrice * item.quantity).toFixed(2)}
                    </SummaryItemPrice>
                  </SummaryItem>
                );
              })}
            </SummaryItems>
            
            <SummaryDivider />
            
            <SummaryRow>
              <SummaryLabel>Subtotal</SummaryLabel>
              <SummaryValue>${calculateSubtotal().toFixed(2)}</SummaryValue>
            </SummaryRow>
            
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
            
            <TotalRow>
              <TotalLabel>Total</TotalLabel>
              <TotalValue>${calculateTotal().toFixed(2)}</TotalValue>
            </TotalRow>
          </OrderSummaryCard>
        </CheckoutSection>
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

const CheckoutSteps = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`;

const CheckoutStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  
  ${({ active, completed }) => {
    if (completed) {
      return `
        color: ${props => props.theme.colors.primary};
      `;
    } else if (active) {
      return `
        color: ${props => props.theme.colors.primary};
      `;
    } else {
      return `
        color: ${props => props.theme.colors.lightText};
      `;
    }
  }}
`;

const StepNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 8px;
  
  ${({ active, completed }) => {
    if (completed) {
      return `
        background-color: ${props => props.theme.colors.primary};
        color: white;
      `;
    } else if (active) {
      return `
        background-color: ${props => props.theme.colors.primary};
        color: white;
      `;
    } else {
      return `
        background-color: #e0e0e0;
        color: ${props => props.theme.colors.lightText};
      `;
    }
  }}
`;

const StepTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;

const StepConnector = styled.div`
  width: 80px;
  height: 2px;
  background-color: ${props => props.completed ? props.theme.colors.primary : '#e0e0e0'};
  margin: 0 15px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 40px;
  }
`;

const CheckoutSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.form`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  padding: 30px;
`;

const FormTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: ${props => props.theme.colors.text};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 15px;
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
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  background-color: white;
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const FormCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  cursor: pointer;
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 15px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  text-decoration: none;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

const NextButton = styled.button`
  padding: 12px 25px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const PlaceOrderButton = styled(NextButton)`
  background-color: ${props => props.theme.colors.accent};
  
  &:hover {
    background-color: #e55c5c;
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const PaymentMethod = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : '#ddd'};
  border-radius: 8px;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const PaymentMethodIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primary};
`;

const PaymentMethodTitle = styled.div`
  font-weight: 500;
  font-size: 1rem;
`;

const PaypalInfo = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  
  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.lightText};
  }
`;

const ReviewSection = styled.div`
  margin-bottom: 25px;
`;

const ReviewTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const ReviewContent = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  
  p {
    margin-bottom: 5px;
    font-size: 0.95rem;
    color: ${props => props.theme.colors.text};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const OrderItems = styled.div`
  background-color: #f9f9f9;
  border-radius: 4px;
  overflow: hidden;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const OrderItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-right: 15px;
`;

const OrderItemDetails = styled.div`
  flex-grow: 1;
`;

const OrderItemName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const OrderItemPrice = styled.div`
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
`;

const OrderItemTotal = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const OrderSummary = styled.div`
  margin-top: 30px;
`;

// Loading and Error Components
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

const SummaryCardTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: ${props => props.theme.colors.text};
`;

const SummaryItems = styled.div`
  margin-bottom: 20px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const SummaryItemName = styled.div`
  font-weight: 500;
`;

const SummaryItemQuantity = styled.div`
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
`;

const SummaryItemPrice = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const SummaryDivider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 20px 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;

const SummaryValue = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const FreeShipping = styled.span`
  color: ${props => props.theme.colors.accent};
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const TotalLabel = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;

const TotalValue = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const SecureCheckoutNotice = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OrderSummaryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  padding: 30px;
`;

export default CheckoutPage;