# ShopNest E-Commerce Platform

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). ShopNest provides a complete online shopping experience with user authentication, product management, order processing, payment integration, and an admin dashboard.

## 🚀 Features

### Customer Features
- **User Authentication**: Register, login, and profile management
- **Product Browsing**: Browse products with search and filtering
- **Shopping Cart**: Add, remove, and update cart items
- **Checkout Process**: Secure checkout with multiple payment options
- **Order Management**: Track order history and status
- **Product Reviews**: Read and write product reviews
- **User Profile**: Manage personal information and order history

### Admin Features
- **Admin Dashboard**: Overview of sales, orders, and user statistics
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **User Management**: View and manage registered users
- **Analytics**: Track sales performance and business metrics

### Technical Features
- **Payment Integration**: Razorpay payment gateway
- **Image Storage**: Cloudinary for product images
- **Email Notifications**: Nodemailer for order confirmations
- **State Management**: Redux Toolkit for global state
- **Responsive Design**: Mobile-friendly UI
- **JWT Authentication**: Secure token-based authentication

## 🛠️ Tech Stack

### Frontend
- **React 19**: UI library
- **Vite**: Build tool and dev server
- **Redux Toolkit**: State management
- **React Router**: Client-side routing
- **React Hot Toast**: Notification system
- **Axios**: HTTP client

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **Cloudinary**: Cloud image storage
- **Razorpay**: Payment gateway
- **Nodemailer**: Email service

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd shopnest-ecommerce-mern
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopnest
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## 🚦 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Mode

**Build the frontend:**
```bash
cd frontend
npm run build
```

**Start the backend:**
```bash
cd backend
NODE_ENV=production npm start
```

The backend will serve the frontend in production mode.

## 📁 Project Structure

```
shopnest-ecommerce-mern/
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   ├── server.js         # Entry point
│   ├── seed.js           # Database seeding
│   └── .env.example      # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── admin/        # Admin panel components
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store and slices
│   │   └── styles/       # Global styles
│   ├── index.html
│   └── vite.config.js
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

### Analytics
- `GET /api/analytics/sales` - Get sales data (admin)
- `GET /api/analytics/users` - Get user statistics (admin)

## 👤 Default Admin

To seed the database with sample data including an admin user:

```bash
cd backend
npm run seed
```

## 🌐 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `GMAIL_USER` | Gmail for email notifications |
| `GMAIL_PASS` | Gmail app password |
| `FRONTEND_URL` | Frontend URL for CORS |
| `NODE_ENV` | Environment (development/production) |

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Milan Koradiya**

---

Built with ❤️ using MERN Stack
