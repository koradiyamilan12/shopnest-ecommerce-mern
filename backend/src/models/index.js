const sequelize = require("../config/db");
const logger = require("../config/logger");
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const Review = require("./Review");

User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
  onDelete: "CASCADE",
});
Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Review, {
  foreignKey: "userId",
  as: "reviews",
  onDelete: "CASCADE",
});
Review.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Product.hasMany(Review, {
  foreignKey: "productId",
  as: "reviews",
  onDelete: "CASCADE",
});
Review.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

const syncDatabase = () =>
  sequelize.sync({ alter: true })
    .then(() => {
      logger.info("Database Connected");
    })
    .catch((err) => {
      logger.error("Failed to connect database: %o", err);
      throw err;
    });

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Product,
  Order,
  Review,
};
