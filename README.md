# ShopNest E-Commerce Platform

A full-stack e-commerce application built with PostgreSQL, Express, React, and Node.js. ShopNest provides a complete online shopping experience with user authentication, product management, order processing, payment integration, and an admin dashboard.

## 🚀 Features
.

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
- **PostgreSQL**: Database
- **Sequelize**: ORM for PostgreSQL
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **Cloudinary**: Cloud image storage
- **Razorpay**: Payment gateway
- **Nodemailer**: Email service

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
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
DB_NAME=shopnest
DB_USER=postgres
DB_PASS=your_postgres_password
DB_HOST=127.0.0.1
DB_PORT=5432
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

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## 🗄️ Multi-Environment Database Configuration

The backend supports multiple database environments (development, production, and test). The database configurations are located in `backend/src/config/database.json`.

The system determines which database config to use based on the `NODE_ENV` environment variable (`development`, `production`, or `test`).

You can also override any configuration value by defining the corresponding environment variables in your `.env` file:
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `DB_HOST`
- `DB_PORT`

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

**Build and host the frontend separately:**
```bash
cd frontend
npm run build
```

**Start the backend:**
```bash
cd backend
NODE_ENV=production npm start
```

The backend runs as an API server only. Point the separately hosted frontend at the backend API URL.

## 📁 Project Structure

```
shopnest-ecommerce-mern/
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration & Passport setup
│   │   ├── controllers/  # Route controllers
│   │   ├── docs/         # Swagger/OpenAPI documentation specifications
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Sequelize models
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
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

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

## 📖 API Documentation (Swagger)

Interactive API documentation is generated using Swagger.

- **Interactive UI**: `http://localhost:5000/api-docs` (Available when the backend is running)
- **Raw OpenAPI Spec (JSON)**: `http://localhost:5000/api-docs.json`

The documentation specs are modular and located in `/backend/src/docs`. They are dynamically merged at server runtime.

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
| `DB_NAME` | PostgreSQL database name (Overriding default in database.json) |
| `DB_USER` | PostgreSQL user (Overriding default in database.json) |
| `DB_PASS` | PostgreSQL password (Overriding default in database.json) |
| `DB_HOST` | PostgreSQL host (Overriding default in database.json) |
| `DB_PORT` | PostgreSQL port (Overriding default in database.json) |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `GMAIL_USER` | Gmail for email notifications |
| `GMAIL_PASS` | Gmail app password |
| `FRONTEND_URL` | Frontend URL for CORS |
| `NODE_ENV` | Environment (development/production/test) |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret |
| `GOOGLE_CALLBACK_URL` | Google OAuth 2.0 Callback URL |

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Milan Koradiya**

---

Built with ❤️ using PostgreSQL, Express, React, and Node.js
