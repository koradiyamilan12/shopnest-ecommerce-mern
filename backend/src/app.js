const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./middleware/errorHandler");
const { ERROR_MESSAGES, SERVER_MESSAGES } = require("./constants/messages");
const { NotFoundError } = require("./utils/errors");
const passport = require("passport");
const { getCookieSecret } = require("./utils/cookies");

dotenv.config();

// Passport Configuration
require("./config/passport");

const { syncDatabase } = require("./models");
syncDatabase().catch(() => {});
const { connectRedis } = require("./config/redis");
connectRedis();
require("./workers/email.worker");

const app = express();

const swaggerSpec = require("./docs/swagger");

// Allow requests from the separately hosted frontend.
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser(getCookieSecret()));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send(SERVER_MESSAGES.API_RUNNING);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

app.use("/api/v1", require("./routes/v1"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

app.use("/api", (req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGES.ROUTE_NOT_FOUND));
});

app.use((req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGES.ROUTE_NOT_FOUND));
});

app.use(errorHandler);

module.exports = app;
