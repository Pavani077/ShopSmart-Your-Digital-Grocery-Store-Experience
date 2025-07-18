import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSort, FaSearch, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

// Sample product data (would normally come from an API)
const sampleProducts = [
  { id: 1, name: 'Organic Avocados (3 pack)', price: 4.99, image: 'https://images.unsplash.com/photo-1587915598582-c841544gu8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Produce', rating: 4.8, discount: 10 },
  { id: 2, name: 'Artisanal Sourdough Bread', price: 6.50, image: 'https://images.unsplash.com/photo-1598373154817-1293e5a5f1a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Bakery', rating: 4.9, discount: 0 },
  { id: 3, name: 'Free-Range Organic Eggs (dozen)', price: 7.99, image: 'https://images.unsplash.com/photo-1599248839210-2b1551a33753?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Dairy & Eggs', rating: 4.7, discount: 5 },
  { id: 4, name: 'Fresh Salmon Fillet (1 lb)', price: 12.99, image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Meat & Seafood', rating: 4.8, discount: 0 },
  { id: 5, name: 'Organic Whole Milk (1/2 gallon)', price: 4.29, image: 'https://images.unsplash.com/photo-1620189507195-68309c04c4d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Dairy & Eggs', rating: 4.6, discount: 0 },
  { id: 6, name: 'Organic Gala Apples (2 lb bag)', price: 5.49, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Produce', rating: 4.5, discount: 8 },
  { id: 7, name: 'Whole Wheat Bread', price: 3.99, image: 'https://images.unsplash.com/photo-1550989460-0d97b5e39e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Bakery', rating: 4.4, discount: 0 },
  { id: 8, name: 'Ground Beef (90% lean)', price: 8.99, image: 'https://images.unsplash.com/photo-1603048200681-3d2412e15234?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', category: 'Meat & Seafood', rating: 4.7, discount: 12 },
];

// Sample categories
const categories = [
  'All Categories',
  'Produce',
  'Dairy & Eggs',
  'Bakery',
  'Meat & Seafood',
  'Pantry',
  'Snacks',
  'Beverages'
];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch products (simulated)
  useEffect(() => {
    // In a real app, you would fetch products from an API
    setTimeout(() => {
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      setLoading(false);
    }, 500);
  }, []);
  
  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    result = result.filter(product => {
      const discountedPrice = product.discount > 0 
        ? product.price * (1 - product.discount / 100) 
        : product.price;
      return discountedPrice >= priceRange[0] && discountedPrice <= priceRange[1];
    });
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        result.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      default:
        // Default sorting (newest first, would normally be by ID or date)
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, sortOption, priceRange, searchQuery]);
  
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
  
  const handlePriceRangeChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = Number(e.target.value);
    setPriceRange(newRange);
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading products...</LoadingText>
      </LoadingContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>Grocery Products</PageTitle>
          <PageDescription>
            Find the freshest produce, pantry staples, and more.
          </PageDescription>
        </PageHeader>
        
        <SearchBar>
          <SearchInput 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
        </SearchBar>
        
        <ProductsSection>
          <FilterToggle onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </FilterToggle>
          
          <ProductsLayout>
            <AnimatePresence>
              {showFilters && (
                <FiltersPanel
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '250px', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FilterSection>
                    <FilterTitle>Categories</FilterTitle>
                    <CategoryList>
                      {categories.map((category, index) => (
                        <CategoryItem key={index}>
                          <CategoryButton 
                            active={selectedCategory === category}
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </CategoryButton>
                        </CategoryItem>
                      ))}
                    </CategoryList>
                  </FilterSection>
                  
                  <FilterSection>
                    <FilterTitle>Price Range</FilterTitle>
                    <PriceRangeInputs>
                      <PriceInput>
                        <PriceLabel>Min:</PriceLabel>
                        <PriceField 
                          type="number" 
                          min="0" 
                          max={priceRange[1]}
                          value={priceRange[0]}
                          onChange={(e) => handlePriceRangeChange(e, 0)}
                        />
                      </PriceInput>
                      <PriceInput>
                        <PriceLabel>Max:</PriceLabel>
                        <PriceField 
                          type="number" 
                          min={priceRange[0]}
                          value={priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(e, 1)}
                        />
                      </PriceInput>
                    </PriceRangeInputs>
                  </FilterSection>
                </FiltersPanel>
              )}
            </AnimatePresence>
            
            <ProductsContainer>
              <ProductsHeader>
                <ProductCount>{filteredProducts.length} Products</ProductCount>
                <SortContainer>
                  <SortLabel><FaSort /> Sort by:</SortLabel>
                  <SortSelect 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="discount">Discount</option>
                  </SortSelect>
                </SortContainer>
              </ProductsHeader>
              
              {filteredProducts.length === 0 ? (
                <NoProductsMessage>
                  No products found matching your criteria.
                </NoProductsMessage>
              ) : (
                <ProductsGrid>
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      as={motion.div}
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
                              <CurrentPrice>
                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </CurrentPrice>
                            </>
                          ) : (
                            <CurrentPrice>${product.price.toFixed(2)}</CurrentPrice>
                          )}
                        </ProductPrice>
                        <ProductRating>
                          {renderStars(product.rating)}
                        </ProductRating>
                      </ProductLink>
                    </ProductCard>
                  ))}
                </ProductsGrid>
              )}
            </ProductsContainer>
          </ProductsLayout>
        </ProductsSection>
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

const SearchBar = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto 40px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  padding-right: 50px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 1rem;
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.lightText};
`;

const ProductsSection = styled.div`
  margin-bottom: 60px;
`;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.desktop}) {
    display: none;
  }
`;

const ProductsLayout = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    flex-direction: column;
  }
`;

const FiltersPanel = styled(motion.div)`
  width: 250px;
  flex-shrink: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CategoryItem = styled.li`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryButton = styled.button`
  background: none;
  border: none;
  padding: 5px 0;
  font-size: 0.95rem;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.lightText};
  font-weight: ${props => props.active ? 600 : 400};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  text-align: left;
  width: 100%;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const PriceRangeInputs = styled.div`
  display: flex;
  gap: 10px;
`;

const PriceInput = styled.div`
  flex: 1;
`;

const PriceLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.lightText};
`;

const PriceField = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ProductsContainer = styled.div`
  flex: 1;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const ProductCount = styled.div`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.lightText};
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SortLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.lightText};
`;

const SortSelect = styled.select`
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  
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

const ProductCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  transition: ${props => props.theme.transitions.default};
`;

const ProductLink = styled(Link)`
  display: block;
  padding: 15px;
  text-decoration: none;
  color: inherit;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const ProductCategory = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 8px;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
  line-height: 1.3;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const CurrentPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const OldPrice = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  text-decoration: line-through;
`;

const ProductRating = styled.div`
  display: flex;
  color: #f9a825;
  font-size: 0.9rem;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const NoProductsMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
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

export default ProductsPage;