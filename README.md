# ShopNest E-Commerce Platform

A full-stack e-commerce application built with PostgreSQL, Express, React, Node.js, and Redis. ShopNest provides a complete online shopping experience with secure authentication, product browsing, dynamic cart, wishlist management, robust order processing, secure payment integration, and a comprehensive admin dashboard.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure JWT-based register, login, profile management, and Google OAuth 2.0 social login.
- **Product Browsing**: Discover products with responsive searching, category filtering, and product detail viewing.
- **Wishlist Management**: Save products to a personal wishlist and easily add or remove them.
- **Shopping Cart**: Real-time cart state management to add, update quantity, or remove items.
- **Checkout Process**: Multi-step checkout with delivery address and Razorpay payment integration.
- **Order Management**: View personal order history, order items, status, and tracking info.
- **Product Reviews & Ratings**: Submit ratings and reviews for purchased items.

### Admin Features
- **Admin Dashboard**: Overview of metrics including total sales, total orders, users, and product catalog counts.
- **Product Management**: Complete CRUD operations for products, including image uploads.
- **Order Management**: Overview of customer orders and status updates (e.g., pending, delivered).
- **User Management**: View registered customers list.

### Technical & Architectural Features
- **Multi-Environment Database Config**: Out-of-the-box configurations for development, production, and testing. Automatically runs checks and database creations using a setup script.
- **Passport.js Authentication**: Passport Google Strategy integration.
- **Background Jobs (BullMQ & Redis)**: Offloads asynchronous processes like email alerts (e.g., welcome messages, order confirmations) into high-performance Redis queues with exponential backoff retries.
- **Structured Winston Logger**: Centered logging wrapper tracking log levels (`error`, `warn`, `info`, `http`, `debug`) with execution caller (file name and line number) context. Saves to `logs/app.log` and console.
- **Modular Swagger UI**: Dynamically aggregates modular OpenAPI documentation YAML files and exposes an interactive API client/UI.
- **Image Storage & Uploads**: Cloudinary integration using Multer middleware.
- **State Management**: Redux Toolkit for clean, centralized client-side state.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Component-based user interface library
- **Vite** - High-speed bundler & dev environment
- **Redux Toolkit** - Global client state management
- **React Router Dom** - Single-page app routing
- **React Hot Toast** - Elegant pop-up notifications
- **Axios** - HTTP client for backend requests

### Backend
- **Node.js** & **Express** - Fast, unopinionated backend server
- **PostgreSQL** & **Sequelize ORM** - Relational SQL database and object mapper
- **Redis** & **BullMQ** - In-memory data store for background job queues
- **Winston** - Advanced logger with custom level formats
- **Passport.js** - Flexible authentication middleware (JWT & Google OAuth)
- **Multer** & **Cloudinary** - Image file handler and cloud asset storage
- **Razorpay SDK** - Secure payment gateway processing
- **Nodemailer** - Template-based email sender

---

## 📋 Prerequisites

Make sure you have the following installed locally:
- **Node.js** (v18.0.0 or higher)
- **PostgreSQL** (v14 or higher)
- **Redis** server running locally or hosted (default: port `6379`)
- **npm** or **yarn**

---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd shopnest-ecommerce-mern
```

### 2. Backend Setup
1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the backend root directory (see [Environment Variables](#-environment-variables) for configuration details). You can copy the example template:
   ```bash
   cp .env.example .env
   ```
3. Initialize/Create the databases for all environments:
   ```bash
   npm run db:setup
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🗄️ Multi-Environment Database Configuration

The backend supports environment-based database configurations out-of-the-box (`development`, `production`, and `test`). The database definitions are stored in `backend/src/config/database.json`.

The server selects the database using the `NODE_ENV` environment variable:
- `NODE_ENV=development` -> connects to `shopnest_dev`
- `NODE_ENV=production` -> connects to `shopnest_prod`
- `NODE_ENV=test` -> connects to `shopnest`

You can customize the credentials inside `database.json` or override them completely in your `.env` file with these keys:
`DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`.

---

## 🚦 Running the Application

Ensure PostgreSQL and Redis servers are running on your machine.

### Development Mode

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend App:**
```bash
cd frontend
npm run dev
```

- **Frontend client**: [http://localhost:3000](http://localhost:3000)
- **Backend API server**: [http://localhost:5000](http://localhost:5000)
- **Interactive Swagger Docs**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### Database Seeding (Admin & Demo Data)
To seed the database with products, categories, reviews, and a default admin user, run:
```bash
cd backend
npm run seed
```
- **Default Admin Login**:
  - **Email**: `admin@example.com`
  - **Password**: `123456`

### Production Mode
1. **Build the frontend production bundle:**
   ```bash
   cd frontend
   npm run build
   ```
2. **Start the production backend server:**
   ```bash
   cd ../backend
   npm start
   ```

---

## 🔐 API Endpoints

All endpoints support a `/api` or `/api/v1` prefix. For instance, `/api/auth/me` is equivalent to `/api/v1/auth/me`.

### Authentication & User Accounts
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate user & issue signed JWT cookie
- `POST /api/auth/logout` - Clear user authentication cookies
- `GET /api/auth/me` - Retrieve current logged-in user profile
- `GET /api/auth/users` - Retrieve list of all users (*Admin only*)
- `GET /api/auth/google` - Initiate Google OAuth 2.0 redirection flow
- `GET /api/auth/google/callback` - Handle Google OAuth authentication callback

### Products & Reviews
- `GET /api/products` - List all products (supports search & filter query parameters)
- `GET /api/products/:id` - Fetch single product details
- `POST /api/products` - Add a new product with image file upload (*Admin only*)
- `PUT /api/products/:id` - Update details or upload new image for a product (*Admin only*)
- `DELETE /api/products/:id` - Remove a product (*Admin only*)
- `POST /api/products/:id/reviews` - Add a review/rating (1-5 stars) to a product

### Wishlist
- `GET /api/wishlist` - Fetch current user's saved wishlist products
- `POST /api/wishlist` - Save a product to wishlist (expects `{ "productId": <id> }` in body)
- `DELETE /api/wishlist/:productId` - Remove a product from the wishlist

### Orders & Tracking
- `POST /api/orders` - Place a new order with checkout items
- `GET /api/orders/myorders` - Fetch all orders placed by the current user
- `GET /api/orders` - Fetch all customer orders (*Admin only*)
- `PUT /api/orders/:id/status` - Transition order shipping/delivery status (*Admin only*)

### Payments (Razorpay)
- `POST /api/payment/order` - Generate a new payment order request
- `POST /api/payment/verify` - Cryptographically verify payment signatures

### Analytics
- `GET /api/analytics` - Fetch general dashboard stats (revenue, order volume, catalog size, user counts) (*Admin only*)

---

## 📖 API Documentation (Swagger)

Interactive API documentation is generated dynamically at server start by merging modular specifications:
- **Interactive Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **JSON Specification File**: [http://localhost:5000/api-docs.json](http://localhost:5000/api-docs.json)

The OpenAPI schema modules are located under `/backend/src/docs`.

---

## 🌐 Environment Variables

Here are the environment configurations supported by the backend:

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port number (default: `5000`) |
| `NODE_ENV` | No | Operational environment (`development`, `production`, `test`) |
| `API_URL` | No | Base URI of the backend API (used for callback redirects / Swagger URLs) |
| `FRONTEND_URL` | Yes | CORS domain constraint (e.g. `http://localhost:3000`) |
| `JWT_SECRET` | Yes | Token signing secret key |
| `DB_NAME` | No | Custom override for PostgreSQL database name |
| `DB_USER` | No | Custom override for PostgreSQL user name |
| `DB_PASS` | No | Custom override for PostgreSQL password |
| `DB_HOST` | No | Custom override for PostgreSQL host address |
| `DB_PORT` | No | Custom override for PostgreSQL port number |
| `REDIS_HOST` | No | Host address of Redis server (default: `127.0.0.1`) |
| `REDIS_PORT` | No | Port number of Redis server (default: `6379`) |
| `REDIS_USERNAME` | No | Authentication username for Redis (default: `default`) |
| `REDIS_PASSWORD` | No | Authentication password for Redis |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary Cloud name identifier |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API access key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API access secret token |
| `RAZORPAY_KEY_ID` | Yes | Razorpay Gateway public client key |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay Gateway private merchant secret |
| `GMAIL_USER` | Yes | Gmail SMTP username for message dispatches |
| `GMAIL_PASS` | Yes | Gmail App passcode |
| `GOOGLE_CLIENT_ID` | Yes | Google Developer Console Client OAuth 2.0 ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google Developer Console Client OAuth 2.0 Secret |
| `GOOGLE_CALLBACK_URL` | No | Callback URL route matching Google Console settings |

---

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Milan Koradiya**
