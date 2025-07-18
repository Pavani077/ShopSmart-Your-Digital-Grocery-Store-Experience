const mongoose = require('./backend/node_modules/mongoose');
const bcrypt = require('./backend/node_modules/bcryptjs');
require('dotenv').config();

// Import models
const User = require('./backend/models/User');
const Product = require('./backend/models/Product');
const Category = require('./backend/models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freshmart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up FreshMart database...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log('✅ Cleared existing data');

    // Create categories
    const categories = [
      {
        name: 'Fresh Produce',
        slug: 'fresh-produce',
        description: 'Fresh fruits and vegetables from local farms',
        image: 'https://images.unsplash.com/photo-1518977956812-4a3e5e6042ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        icon: '🥬',
        featured: true,
        sortOrder: 1
      },
      {
        name: 'Dairy & Eggs',
        slug: 'dairy-eggs',
        description: 'Fresh dairy products and farm eggs',
        image: 'https://images.unsplash.com/photo-1628088062854-59e564d61c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        icon: '🥛',
        featured: true,
        sortOrder: 2
      },
      {
        name: 'Meat & Seafood',
        slug: 'meat-seafood',
        description: 'Premium quality meat and fresh seafood',
        image: 'https://images.unsplash.com/photo-1612267295745-789d2c9dc537?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        icon: '🥩',
        featured: true,
        sortOrder: 3
      },
      {
        name: 'Pantry Staples',
        slug: 'pantry-staples',
        description: 'Essential pantry items and cooking ingredients',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        icon: '🫘',
        featured: true,
        sortOrder: 4
      },
      {
        name: 'Beverages',
        slug: 'beverages',
        description: 'Fresh juices, coffee, tea, and soft drinks',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        icon: '🥤',
        featured: false,
        sortOrder: 5
      },
      {
        name: 'Frozen Foods',
        slug: 'frozen-foods',
        description: 'Frozen vegetables, meals, and desserts',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        icon: '🧊',
        featured: false,
        sortOrder: 6
      },
      {
        name: 'Household',
        slug: 'household',
        description: 'Cleaning supplies and household essentials',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        icon: '🧽',
        featured: false,
        sortOrder: 7
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Created categories');

    // Create products
    const products = [
      {
        name: 'Organic Avocados',
        slug: 'organic-avocados',
        description: 'Fresh organic avocados, perfect for guacamole or toast',
        price: 4.99,
        comparePrice: 6.99,
        category: createdCategories[0]._id, // Fresh Produce
        images: [
          'https://images.unsplash.com/photo-1587915598582-c841544gu8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1587915598582-c841544gu8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        ],
        stock: 50,
        sku: 'AVO-001',
        weight: 0.5,
        dimensions: { length: 10, width: 5, height: 5 },
        variants: [
          { name: 'Size', value: 'Medium', price: 4.99 },
          { name: 'Size', value: 'Large', price: 6.99 }
        ],
        tags: ['organic', 'fresh', 'healthy'],
        featured: true,
        rating: 4.8,
        reviewCount: 124
      },
      {
        name: 'Free-Range Organic Eggs',
        slug: 'free-range-organic-eggs',
        description: 'Farm fresh organic eggs from free-range chickens',
        price: 7.99,
        comparePrice: 9.99,
        category: createdCategories[1]._id, // Dairy & Eggs
        images: [
          'https://images.unsplash.com/photo-1599248839210-2b1551a33753?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1599248839210-2b1551a33753?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        ],
        stock: 100,
        sku: 'EGG-001',
        weight: 0.6,
        dimensions: { length: 15, width: 10, height: 8 },
        variants: [
          { name: 'Size', value: 'Dozen', price: 7.99 },
          { name: 'Size', value: 'Half Dozen', price: 4.99 }
        ],
        tags: ['organic', 'free-range', 'fresh'],
        featured: true,
        rating: 4.7,
        reviewCount: 89
      },
      {
        name: 'Fresh Salmon Fillet',
        slug: 'fresh-salmon-fillet',
        description: 'Premium Atlantic salmon fillet, perfect for grilling',
        price: 12.99,
        comparePrice: 15.99,
        category: createdCategories[2]._id, // Meat & Seafood
        images: [
          'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        ],
        stock: 25,
        sku: 'SAL-001',
        weight: 0.5,
        dimensions: { length: 20, width: 8, height: 3 },
        variants: [
          { name: 'Weight', value: '0.5 lb', price: 12.99 },
          { name: 'Weight', value: '1 lb', price: 24.99 }
        ],
        tags: ['fresh', 'premium', 'wild-caught'],
        featured: true,
        rating: 4.8,
        reviewCount: 67
      },
      {
        name: 'Artisanal Sourdough Bread',
        slug: 'artisanal-sourdough-bread',
        description: 'Freshly baked sourdough bread with perfect crust',
        price: 6.50,
        comparePrice: 8.50,
        category: createdCategories[3]._id, // Pantry Staples
        images: [
          'https://images.unsplash.com/photo-1598373154817-1293e5a5f1a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1598373154817-1293e5a5f1a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        ],
        stock: 30,
        sku: 'BRD-001',
        weight: 0.8,
        dimensions: { length: 25, width: 12, height: 8 },
        variants: [
          { name: 'Size', value: 'Regular', price: 6.50 },
          { name: 'Size', value: 'Large', price: 8.50 }
        ],
        tags: ['artisanal', 'fresh-baked', 'sourdough'],
        featured: true,
        rating: 4.9,
        reviewCount: 156
      },
      {
        name: 'Organic Bananas',
        slug: 'organic-bananas',
        description: 'Sweet organic bananas, perfect for smoothies',
        price: 3.99,
        comparePrice: 5.99,
        category: createdCategories[0]._id, // Fresh Produce
        images: [
          'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        ],
        stock: 75,
        sku: 'BAN-001',
        weight: 1.2,
        dimensions: { length: 18, width: 8, height: 6 },
        variants: [
          { name: 'Quantity', value: '1 Bunch', price: 3.99 },
          { name: 'Quantity', value: '2 Bunches', price: 6.99 }
        ],
        tags: ['organic', 'sweet', 'potassium'],
        featured: false,
        rating: 4.6,
        reviewCount: 203
      },
      {
        name: 'Greek Yogurt',
        slug: 'greek-yogurt',
        description: 'Creamy Greek yogurt with live cultures',
        price: 5.99,
        comparePrice: 7.99,
        category: createdCategories[1]._id, // Dairy & Eggs
        images: [
          'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        ],
        stock: 40,
        sku: 'YOG-001',
        weight: 0.5,
        dimensions: { length: 8, width: 8, height: 8 },
        variants: [
          { name: 'Size', value: '16 oz', price: 5.99 },
          { name: 'Size', value: '32 oz', price: 10.99 }
        ],
        tags: ['greek', 'protein', 'probiotics'],
        featured: false,
        rating: 4.5,
        reviewCount: 98
      }
    ];

    await Product.insertMany(products);
    console.log('✅ Created products');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@freshmart.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+1 (555) 123-4567',
        addresses: [
          {
            type: 'home',
            street: '123 Admin Street',
            city: 'Admin City',
            state: 'AC',
            zipCode: '12345',
            country: 'USA',
            isDefault: true
          }
        ],
        isEmailVerified: true,
        isActive: true
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'customer',
        phone: '+1 (555) 987-6543',
        addresses: [
          {
            type: 'home',
            street: '456 Customer Ave',
            city: 'Customer City',
            state: 'CC',
            zipCode: '54321',
            country: 'USA',
            isDefault: true
          }
        ],
        isEmailVerified: true,
        isActive: true
      }
    ];

    await User.insertMany(users);
    console.log('✅ Created users');

    console.log('\n🎉 FreshMart database setup completed successfully!');
    console.log('\n📋 Sample Data Created:');
    console.log(`   • ${categories.length} Categories`);
    console.log(`   • ${products.length} Products`);
    console.log(`   • ${users.length} Users`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@freshmart.com / password123');
    console.log('   Customer: john@example.com / password123');
    
    console.log('\n🚀 You can now start the application!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    mongoose.connection.close();
  }
};

setupDatabase(); 