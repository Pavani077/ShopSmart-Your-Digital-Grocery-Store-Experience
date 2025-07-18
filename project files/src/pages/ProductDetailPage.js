import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaMinus, FaPlus, FaCheck, FaStar, FaStarHalfAlt, FaRegStar, FaArrowRight } from 'react-icons/fa';

// Sample product data (would normally come from an API)
const sampleProduct = {
  id: 1,
  name: 'Organic Hass Avocados',
  price: 5.99,
  discount: 15,
  rating: 4.8,
  reviewCount: 256,
  availability: true,
  sku: 'FRT-AVO-001',
  category: 'Produce',
  brand: 'GreenFarms',
  description: 'Creamy and delicious, these Organic Hass Avocados are perfect for toast, salads, and guacamole. Grown with care and packed with healthy fats and nutrients. This pack contains 3 large avocados, ripe and ready to eat.',
  features: [
    'USDA Certified Organic',
    'Rich, creamy texture and nutty flavor',
    'Excellent source of healthy monounsaturated fats',
    'Contains nearly 20 vitamins and minerals',
    'Perfect for a variety of dishes',
    'Pack of 3'
  ],
  specifications: [
    { name: 'Origin', value: 'California, USA' },
    { name: 'Grade', value: 'U.S. No. 1' },
    { name: 'Cultivation', value: 'Organic' },
    { name: 'Storage', value: 'Store at room temperature until ripe, then refrigerate' },
  ],
  images: [
    'https://images.unsplash.com/photo-1587915598582-c841544gu8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1601035232746-32d7a0c792a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1590322137373-a7f4a9764a5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1615485499939-2a1352d1d4f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  relatedProducts: [
    { id: 2, name: 'Artisanal Sourdough Bread', price: 6.50, image: 'https://images.unsplash.com/photo-1598373154817-1293e5a5f1a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Bakery', rating: 4.9, discount: 0 },
    { id: 3, name: 'Free-Range Organic Eggs', price: 7.99, image: 'https://images.unsplash.com/photo-1599248839210-2b1551a33753?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Dairy & Eggs', rating: 4.7, discount: 5 },
    { id: 4, name: 'Vine-Ripened Tomatoes', price: 3.99, image: 'https://images.unsplash.com/photo-1561138414-3a78946a4a6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Produce', rating: 4.6, discount: 0 },
  ]
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // Fetch product data (simulated)
  useEffect(() => {
    // In a real app, you would fetch the product data from an API
    // based on the id from useParams
    setTimeout(() => {
      setProduct(sampleProduct);
      setLoading(false);
    }, 500);
  }, [id]);
  
  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    
    return stars;
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading product details...</LoadingText>
      </LoadingContainer>
    );
  }
  
  if (!product) {
    return (
      <ErrorContainer>
        <ErrorMessage>Product not found</ErrorMessage>
        <BackButton to="/products">Back to Products</BackButton>
      </ErrorContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="container">
        <Breadcrumb>
          <BreadcrumbItem to="/">Home</BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem to="/products">Products</BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem to={`/products?category=${product.category.toLowerCase()}`}>{product.category}</BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbCurrent>{product.name}</BreadcrumbCurrent>
        </Breadcrumb>
        
        <ProductSection>
          <ProductGallery>
            <MainImage>
              <motion.img 
                key={selectedImage}
                src={product.images[selectedImage]} 
                alt={product.name} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </MainImage>
            <ThumbnailContainer>
              {product.images.map((image, index) => (
                <Thumbnail 
                  key={index} 
                  active={index === selectedImage}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} - Thumbnail ${index + 1}`} />
                </Thumbnail>
              ))}
            </ThumbnailContainer>
          </ProductGallery>
          
          <ProductInfo>
            <ProductCategory>{product.category}</ProductCategory>
            <ProductName>{product.name}</ProductName>
            
            <ProductMeta>
              <ProductRating>
                <RatingStars>{renderStars(product.rating)}</RatingStars>
                <RatingCount>({product.reviewCount} reviews)</RatingCount>
              </ProductRating>
              
              <ProductSKU>SKU: {product.sku}</ProductSKU>
              <ProductBrand>Brand: {product.brand}</ProductBrand>
            </ProductMeta>
            
            <ProductPrice>
              {product.discount > 0 ? (
                <>
                  <OldPrice>${product.price.toFixed(2)}</OldPrice>
                  <CurrentPrice>${(product.price * (1 - product.discount / 100)).toFixed(2)}</CurrentPrice>
                  <DiscountBadge>{product.discount}% OFF</DiscountBadge>
                </>
              ) : (
                <CurrentPrice>${product.price.toFixed(2)}</CurrentPrice>
              )}
            </ProductPrice>
            
            <Availability available={product.availability}>
              <FaCheck /> {product.availability ? 'In Stock' : 'Out of Stock'}
            </Availability>
            
            <ShortDescription>
              {product.description.substring(0, 150)}...
            </ShortDescription>
            
            <AddToCartSection>
              <QuantitySelector>
                <QuantityButton onClick={() => handleQuantityChange('decrease')}>
                  <FaMinus />
                </QuantityButton>
                <QuantityInput value={quantity} readOnly />
                <QuantityButton onClick={() => handleQuantityChange('increase')}>
                  <FaPlus />
                </QuantityButton>
              </QuantitySelector>
              
              <AddToCartButton>
                <FaShoppingCart /> Add to Cart
              </AddToCartButton>
              
              <WishlistButton>
                <FaHeart />
              </WishlistButton>
            </AddToCartSection>
          </ProductInfo>
        </ProductSection>
        
        <ProductTabs>
          <TabButtons>
            <TabButton 
              active={activeTab === 'description'}
              onClick={() => setActiveTab('description')}
            >
              Description
            </TabButton>
            <TabButton 
              active={activeTab === 'specifications'}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </TabButton>
            <TabButton 
              active={activeTab === 'reviews'}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount})
            </TabButton>
          </TabButtons>
          
          <TabContent>
            {activeTab === 'description' && (
              <DescriptionTab>
                <p>{product.description}</p>
                
                <FeaturesTitle>Key Features</FeaturesTitle>
                <FeaturesList>
                  {product.features.map((feature, index) => (
                    <FeatureItem key={index}>
                      <FaCheck /> {feature}
                    </FeatureItem>
                  ))}
                </FeaturesList>
              </DescriptionTab>
            )}
            
            {activeTab === 'specifications' && (
              <SpecificationsTab>
                <SpecificationsTable>
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={index}>
                        <SpecName>{spec.name}</SpecName>
                        <SpecValue>{spec.value}</SpecValue>
                      </tr>
                    ))}
                  </tbody>
                </SpecificationsTable>
              </SpecificationsTab>
            )}
            
            {activeTab === 'reviews' && (
              <ReviewsTab>
                <ReviewsSummary>
                  <AverageRating>
                    <AverageRatingNumber>{product.rating.toFixed(1)}</AverageRatingNumber>
                    <div>
                      <RatingStars>{renderStars(product.rating)}</RatingStars>
                      <TotalReviews>Based on {product.reviewCount} reviews</TotalReviews>
                    </div>
                  </AverageRating>
                </ReviewsSummary>
                
                <WriteReviewButton>
                  Write a Review
                </WriteReviewButton>
                
                {/* Sample reviews would go here */}
                <ReviewMessage>Login to view and write reviews</ReviewMessage>
              </ReviewsTab>
            )}
          </TabContent>
        </ProductTabs>
        
        <RelatedProductsSection>
          <SectionHeader>
            <SectionTitle>Related Products</SectionTitle>
            <ViewAllLink to="/products">View All <FaArrowRight /></ViewAllLink>
          </SectionHeader>
          
          <RelatedProductsGrid>
            {product.relatedProducts.map((relatedProduct) => (
              <RelatedProductCard 
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                {relatedProduct.discount > 0 && (
                  <RelatedProductDiscount>{relatedProduct.discount}% OFF</RelatedProductDiscount>
                )}
                <RelatedProductImage src={relatedProduct.image} alt={relatedProduct.name} />
                <RelatedProductCategory>{relatedProduct.category}</RelatedProductCategory>
                <RelatedProductName>{relatedProduct.name}</RelatedProductName>
                <RelatedProductPrice>
                  {relatedProduct.discount > 0 ? (
                    <>
                      <RelatedProductOldPrice>${relatedProduct.price.toFixed(2)}</RelatedProductOldPrice>
                      <RelatedProductCurrentPrice>
                        ${(relatedProduct.price * (1 - relatedProduct.discount / 100)).toFixed(2)}
                      </RelatedProductCurrentPrice>
                    </>
                  ) : (
                    <RelatedProductCurrentPrice>${relatedProduct.price.toFixed(2)}</RelatedProductCurrentPrice>
                  )}
                </RelatedProductPrice>
                <RelatedProductRating>
                  {renderStars(relatedProduct.rating)}
                </RelatedProductRating>
              </RelatedProductCard>
            ))}
          </RelatedProductsGrid>
        </RelatedProductsSection>
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

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const BreadcrumbItem = styled(Link)`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 10px;
  color: ${props => props.theme.colors.lightText};
`;

const BreadcrumbCurrent = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
`;

const ProductSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 60px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ProductGallery = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainImage = styled.div`
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  opacity: ${props => props.active ? 1 : 0.7};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    opacity: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ProductInfo = styled.div``;

const ProductCategory = styled.div`
  display: inline-block;
  padding: 5px 10px;
  background-color: rgba(74, 144, 226, 0.1);
  color: ${props => props.theme.colors.primary};
  font-size: 0.8rem;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const ProductName = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.8rem;
  }
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
`;

const RatingStars = styled.div`
  display: flex;
  color: #f9a825;
  font-size: 1rem;
  margin-right: 5px;
`;

const RatingCount = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const ProductSKU = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const ProductBrand = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const CurrentPrice = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const OldPrice = styled.span`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.lightText};
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Availability = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: ${props => props.available ? '#4caf50' : '#f44336'};
  margin-bottom: 20px;
`;

const ShortDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 30px;
`;

const AddToCartSection = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-wrap: wrap;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background: #f5f5f5;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background: #e0e0e0;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 40px;
  border: none;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  -moz-appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 30px;
  height: 42px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex: 1;
  }
`;

const WishlistButton = styled.button`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #e0e0e0;
    color: ${props => props.theme.colors.accent};
  }
`;

const ProductTabs = styled.div`
  margin-bottom: 60px;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 10px;
    border-bottom: none;
  }
`;

const TabButton = styled.button`
  padding: 15px 30px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.active ? 600 : 400};
  font-size: 1rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    text-align: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
    color: ${props => props.active ? 'white' : props.theme.colors.text};
  }
`;

const TabContent = styled.div`
  min-height: 300px;
`;

const DescriptionTab = styled.div`
  p {
    font-size: 1rem;
    line-height: 1.8;
    color: ${props => props.theme.colors.lightText};
    margin-bottom: 30px;
  }
`;

const FeaturesTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.lightText};
  
  svg {
    color: ${props => props.theme.colors.primary};
    flex-shrink: 0;
  }
`;

const SpecificationsTab = styled.div``;

const SpecificationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f0f0f0;
  }
`;

const SpecName = styled.td`
  padding: 15px;
  font-weight: 500;
  width: 40%;
  border-bottom: 1px solid #eee;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 50%;
  }
`;

const SpecValue = styled.td`
  padding: 15px;
  color: ${props => props.theme.colors.lightText};
  border-bottom: 1px solid #eee;
`;

const ReviewsTab = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ReviewsSummary = styled.div`
  margin-bottom: 30px;
  width: 100%;
  max-width: 500px;
`;

const AverageRating = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
`;

const AverageRatingNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const TotalReviews = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  margin-top: 5px;
`;

const WriteReviewButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  margin-bottom: 30px;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const ReviewMessage = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.lightText};
  text-align: center;
  padding: 30px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  width: 100%;
`;

const RelatedProductsSection = styled.section`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text}`

const RelatedProductRating = styled.div`
  display: flex;
  color: #f9a825;
  font-size: 0.9rem;
  justify-content: center;
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

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.accent};
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const BackButton = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 10px 24px;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: ${props => props.theme.transitions.default};
  &:hover {
    background-color: #3a7bc8;
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  transition: ${props => props.theme.transitions.default};
  &:hover {
    text-decoration: underline;
    color: #388E3C;
  }
`;

const RelatedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
`;

const RelatedProductCard = styled(motion(Link))`
  background-color: ${props => props.theme.colors.white};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  transition: ${props => props.theme.transitions.default};
`;

const RelatedProductDiscount = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 1;
`;

const RelatedProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const RelatedProductCategory = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.lightText};
  margin: 12px 15px 4px;
`;

const RelatedProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  line-height: 1.3;
  margin: 0 15px 10px;
  height: 2.6rem;
  overflow: hidden;
`;

const RelatedProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 15px 15px;
`;

const RelatedProductOldPrice = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  text-decoration: line-through;
`;

const RelatedProductCurrentPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

export default ProductDetailPage;