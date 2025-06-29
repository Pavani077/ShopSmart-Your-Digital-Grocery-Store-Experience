import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaShoppingBasket, 
  FaLeaf, 
  FaTruck, 
  FaStar, 
  FaArrowRight, 
  FaTag, 
  FaSeedling 
} from 'react-icons/fa';

// Sample data (replace with API data)
const featuredProducts = [
  {
    id: 1,
    name: 'Organic Avocados',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1587915598582-c841544gu8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    category: 'Fresh Produce',
    rating: 4.8,
    discount: 10,
  },
  {
    id: 2,
    name: 'Artisanal Sourdough Bread',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1598373154817-1293e5a5f1a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    category: 'Bakery',
    rating: 4.9,
    discount: 0,
  },
  {
    id: 3,
    name: 'Free-Range Organic Eggs',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1599248839210-2b1551a33753?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    category: 'Dairy & Eggs',
    rating: 4.7,
    discount: 5,
  },
  {
    id: 4,
    name: 'Fresh Salmon Fillet',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    category: 'Meat & Seafood',
    rating: 4.8,
    discount: 0,
  },
];

const categories = [
  { id: 1, name: 'Fresh Produce', image: 'https://images.unsplash.com/photo-1518977956812-4a3e5e6042ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', count: 89 },
  { id: 2, name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1628088062854-59e564d61c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', count: 45 },
  { id: 3, name: 'Bakery', image: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', count: 32 },
  { id: 4, name: 'Meat & Seafood', image: 'https://images.unsplash.com/photo-1612267295745-789d2c9dc537?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', count: 56 },
];

const features = [
  {
    icon: <FaLeaf />,
    title: 'Farm-Fresh Quality',
    description: 'Directly from local farms to your table.',
  },
  {
    icon: <FaTruck />,
    title: 'Fast Delivery',
    description: 'Get your groceries in as little as 30 minutes.',
  },
  {
    icon: <FaTag />,
    title: 'Amazing Deals',
    description: 'Daily discounts on your favorite items.',
  },
  {
    icon: <FaSeedling />,
    title: '100% Organic',
    description: 'Certified organic produce and products.',
  },
];

const HomePage = () => {
  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <div className="container">
          <HeroContent>
            <HeroTextContent>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <HeroSubtitle>Your Daily Dose of Freshness</HeroSubtitle>
                <HeroTitle>Groceries Delivered to Your Doorstep</HeroTitle>
                <HeroDescription>
                  Shop from a wide range of fresh produce, pantry staples, and gourmet items. Quick, easy, and always fresh!
                </HeroDescription>
                <HeroButtons>
                  <PrimaryButton to="/products">
                    Shop Now <FaShoppingBasket />
                  </PrimaryButton>
                  <SecondaryButton to="/deals">
                    View Deals
                  </SecondaryButton>
                </HeroButtons>
              </motion.div>
            </HeroTextContent>
            
            <HeroImageContainer>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <HeroImage src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Fresh Groceries" />
              </motion.div>
            </HeroImageContainer>
          </HeroContent>
        </div>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <div className="container">
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </div>
      </FeaturesSection>
      
      {/* Category Section */}
      <SectionContainer>
        <div className="container">
          <SectionHeader>
            <SectionTitle>Shop by Category</SectionTitle>
            <SectionSubtitle>Browse our top categories</SectionSubtitle>
          </SectionHeader>
          
          <CategoriesGrid>
            {categories.map((category) => (
              <CategoryCard 
                key={category.id}
                to={`/products?category=${category.name.toLowerCase()}`}
                whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <CategoryImage src={category.image} alt={category.name} />
                <CategoryContent>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryCount>{category.count} Products</CategoryCount>
                </CategoryContent>
              </CategoryCard>
            ))}
          </CategoriesGrid>
        </div>
      </SectionContainer>

      {/* Featured Products Section */}
      <SectionContainer style={{ backgroundColor: '#fff' }}>
        <div className="container">
          <SectionHeader>
            <SectionTitle>Featured Products</SectionTitle>
            <SectionSubtitle>Explore our best-selling items</SectionSubtitle>
          </SectionHeader>
          
          <ProductsGrid>
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <ProductLink to={`/products/${product.id}`}>
                  {product.discount > 0 && (
                    <DiscountBadge>{product.discount}% OFF</DiscountBadge>
                  )}
                  <ProductImage src={product.image} alt={product.name} />
                  <ProductCategory>{product.category}</ProductCategory>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>
                    {product.discount > 0 ? (
                      <>
                        <OldPrice>${product.price.toFixed(2)}</OldPrice>
                        <CurrentPrice>${(product.price * (1 - product.discount / 100)).toFixed(2)}</CurrentPrice>
                      </>
                    ) : (
                      <CurrentPrice>${product.price.toFixed(2)}</CurrentPrice>
                    )}
                  </ProductPrice>
                  <ProductRating>
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar key={i} color={i < product.rating ? '#ffc107' : '#e4e5e9'} />
                    ))}
                  </ProductRating>
                </ProductLink>
                <AddToCartButton>Add to Cart</AddToCartButton>
              </ProductCard>
            ))}
          </ProductsGrid>
          
          <ViewAllButton to="/products">
            View All Products <FaArrowRight />
          </ViewAllButton>
        </div>
      </SectionContainer>

      {/* Promotional Banner */}
      <PromoBanner>
        <div className="container">
          <PromoContent>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <PromoTitle>Get 25% Off Your First Order!</PromoTitle>
              <PromoDescription>
                Use code <PromoCode>FRESH25</PromoCode> at checkout to get fresh groceries delivered for less.
              </PromoDescription>
              <PromoButton to="/products">
                Start Shopping <FaArrowRight />
              </PromoButton>
            </motion.div>
          </PromoContent>
        </div>
      </PromoBanner>

      {/* Newsletter Section */}
      <NewsletterSection>
        <div className="container">
          <NewsletterContent>
            <NewsletterTitle>Join Our Newsletter</NewsletterTitle>
            <NewsletterDescription>
              Get the latest updates on new products and upcoming promotions.
            </NewsletterDescription>
            <NewsletterForm>
              <NewsletterInput type="email" placeholder="Your email address" />
              <NewsletterButton>Subscribe</NewsletterButton>
            </NewsletterForm>
          </NewsletterContent>
        </div>
      </NewsletterSection>
    </HomeContainer>
  );
};

// Styled Components
const HomeContainer = styled.div`
  width: 100%;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  padding: 80px 0;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 60px 0;
  }
`;

const HeroContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroTextContent = styled.div`
  flex: 1;
  padding-right: 40px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding-right: 0;
    margin-bottom: 40px;
  }
`;

const HeroSubtitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #388E3C;
    transform: translateY(-3px);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: transparent;
  color: ${props => props.theme.colors.text};
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  border: 1px solid ${props => props.theme.colors.lightText};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: translateY(-3px);
  }
`;

const HeroImageContainer = styled.div`
  flex: 1;
`;

const HeroImage = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const FeaturesSection = styled.section`
  padding: 60px 0;
  background-color: ${props => props.theme.colors.white};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.white};
  padding: 30px 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.small};
  transition: ${props => props.theme.transitions.default};
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
`;

const SectionContainer = styled.section`
  padding: 80px 0;
  
  &:nth-child(odd) {
    background-color: ${props => props.theme.colors.background};
  }
  
  &:nth-child(even) {
    background-color: ${props => props.theme.colors.white};
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled(motion(Link))`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  transition: ${props => props.theme.transitions.default};
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: ${props => props.theme.transitions.default};
  
  ${CategoryCard}:hover & {
    transform: scale(1.05);
  }
`;

const CategoryContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: white;
`;

const CategoryName = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
`;

const CategoryCount = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.white};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  transition: ${props => props.theme.transitions.default};
  position: relative;
  padding-bottom: 60px;
`;

const DiscountBadge = styled.span`
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

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductCategory = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background-color: rgba(74, 144, 226, 0.1);
  color: ${props => props.theme.colors.primary};
  font-size: 0.8rem;
  border-radius: 4px;
  margin: 15px 15px 5px;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 15px 10px;
  height: 2.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 15px 10px;
`;

const CurrentPrice = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const OldPrice = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  text-decoration: line-through;
`;

const ProductRating = styled.div`
  margin: 0 15px 15px;
  color: #f9a825;
  font-size: 0.9rem;
`;

const AddToCartButton = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  font-weight: 600;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const ViewAllButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 40px auto 0;
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  border: 1px solid ${props => props.theme.colors.primary};
  transition: ${props => props.theme.transitions.default};
  width: fit-content;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    transform: translateY(-3px);
  }
`;

const PromoBanner = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors.secondary} 0%, #F57C00 100%);
  padding: 60px 0;
  color: white;
`;

const PromoContent = styled.div`
  max-width: 600px;
`;

const PromoTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const PromoDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const PromoButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  color: ${props => props.theme.colors.primary};
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-3px);
  }
`;

const PromoCode = styled.span`
  font-weight: 700;
  background-color: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 4px;
`;

const NewsletterSection = styled.section`
  padding: 80px 0;
  background-color: ${props => props.theme.colors.white};
`;

const NewsletterContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const NewsletterTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const NewsletterDescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 2rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 10px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const NewsletterButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

export default HomePage;