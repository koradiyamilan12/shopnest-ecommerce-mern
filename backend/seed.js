const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const logger = require("./src/config/logger");

dotenv.config();

const {
  sequelize,
  syncDatabase,
  User,
  Product,
  Order,
  Review,
  Wishlist,
} = require("./src/models");

const importData = async () => {
  try {
    await syncDatabase();
    await Wishlist.destroy({ where: {} });
    await Review.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await User.destroy({ where: {} });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@shopnest.com",
      password: hashedPassword,
      role: "admin",
    });

    const products = [
      {
        name: "Wireless Noise-Cancelling Headphones",
        description:
          "Immersive sound experience with advanced active noise cancellation.",
        price: 299.99,
        category: "Electronics",
        stock: 15,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.8,
        numReviews: 24,
      },
      {
        name: "Minimalist Modern Chair",
        description:
          "A stylish and comfortable addition to any contemporary living room.",
        price: 150.0,
        category: "Furniture",
        stock: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.2,
        numReviews: 12,
      },
      {
        name: "Professional DSLR Camera",
        description:
          "Capture stunning moments with high-resolution clarity and speed.",
        price: 1199.99,
        category: "Electronics",
        stock: 8,
        imageUrl:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.9,
        numReviews: 50,
      },
      {
        name: "Classic White Sneakers",
        description:
          "Versatile and comfortable, a staple for any casual outfit.",
        price: 85.0,
        category: "Clothing",
        stock: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 89,
      },
      {
        name: "Mechanical Gaming Keyboard",
        description:
          "Tactile mechanical switches with customizable RGB backlighting.",
        price: 89.99,
        category: "Electronics",
        stock: 25,
        imageUrl:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.6,
        numReviews: 18,
      },
    ];

    await Product.bulkCreate(products);

    // Clear Redis cache to avoid outdated cache retrieval
    const redisConnection = require("./src/config/redis");
    try {
      await redisConnection.connect().catch(() => {});
      if (redisConnection.status === "ready") {
        await redisConnection.del("products:all");
        await redisConnection.del("analytics:stats");
        let cursor = "0";
        do {
          const reply = await redisConnection.scan(cursor, "MATCH", "products:*", "COUNT", 100);
          cursor = reply[0];
          const keys = reply[1];
          if (keys && keys.length > 0) {
            await redisConnection.del(...keys);
          }
        } while (cursor !== "0");
        logger.info("✅ Redis Cache Cleared!");
        await redisConnection.quit();
      }
    } catch (redisError) {
      logger.error(`⚠️ Failed to clear Redis cache: ${redisError.message}`);
    }

    logger.info("✅ Data Imported Successfully!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error(`❌ Error with data import: ${error.message}`);
    await sequelize.close();
    process.exit(1);
  }
};

importData();
