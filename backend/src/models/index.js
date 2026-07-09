const sequelize = require("../config/db");
const logger = require("../config/logger");
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const Review = require("./Review");
const Wishlist = require("./Wishlist");

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

User.hasMany(Wishlist, {
  foreignKey: "userId",
  as: "wishlist",
  onDelete: "CASCADE",
});
Wishlist.belongsTo(User, {
  foreignKey: "userId",
});

Product.hasMany(Wishlist, {
  foreignKey: "productId",
  as: "wishlists",
  onDelete: "CASCADE",
});
Wishlist.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

const syncDatabase = () =>
  sequelize
    .sync({ alter: true })
    // sequelize.sync({ force: true })
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
  Wishlist,
};
