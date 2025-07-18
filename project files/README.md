# FreshMart - Grocery E-Commerce Platform

A modern, full-featured grocery e-commerce platform built with React, Node.js, and MongoDB. FreshMart provides a seamless shopping experience for fresh groceries, household essentials, and more.

## 🛒 Features

### Customer Features
- **Fresh Produce Shopping**: Browse and order fresh fruits, vegetables, and organic products
- **Smart Search & Filters**: Find products quickly with advanced search and category filters
- **Shopping Cart**: Add items, manage quantities, and apply coupons
- **Secure Checkout**: Multiple payment options with secure processing
- **Order Tracking**: Real-time order status and delivery tracking
- **User Profiles**: Manage addresses, order history, and preferences
- **Wishlist**: Save favorite products for later
- **Reviews & Ratings**: Read and write product reviews
- **Mobile Responsive**: Optimized for all devices

### Admin Features
- **Product Management**: Add, edit, and manage products with variants
- **Category Management**: Organize products into categories
- **Order Management**: Process orders, update status, and manage inventory
- **User Management**: View and manage customer accounts
- **Analytics Dashboard**: Sales reports and customer insights
- **Inventory Control**: Track stock levels and set alerts

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations
- **React Icons** - Icon library

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads
- **cors** - Cross-origin requests
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freshmart
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/freshmart
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d
   ```

4. **Setup Database**
   ```bash
   # Run the setup script to populate with sample data
   node setup.js
   ```

5. **Start the application**
   ```bash
   # Start backend server
   cd backend
   npm start
   
   # Start frontend (in a new terminal)
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 Sample Data

The setup script creates:
- **7 Categories**: Fresh Produce, Dairy & Eggs, Meat & Seafood, Pantry Staples, Beverages, Frozen Foods, Household
- **6 Products**: Organic Avocados, Free-Range Eggs, Fresh Salmon, Sourdough Bread, Organic Bananas, Greek Yogurt
- **2 Users**: Admin and Customer accounts

### Login Credentials
- **Admin**: admin@freshmart.com / password123
- **Customer**: john@example.com / password123

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create category (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)

## 📁 Project Structure

```
freshmart/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── userController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Header.js
│   │   │       └── Footer.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── NotFoundPage.js
│   │   ├── styles/
│   │   │   └── GlobalStyle.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── setup.js
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: #FF6B35 (Fresh Orange)
- **Secondary**: #4ECDC4 (Fresh Teal)
- **Accent**: #45B7D1 (Ocean Blue)
- **Text**: #2C3E50 (Dark Blue)
- **Background**: #F8F9FA (Light Gray)

### Typography
- **Font Family**: Poppins
- **Weights**: 300, 400, 500, 600, 700

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Security headers with Helmet
- Input validation and sanitization
- Protected admin routes

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@freshmart.com
- Create an issue in the repository

---

**FreshMart** - Bringing fresh groceries to your doorstep! 🛒🥬