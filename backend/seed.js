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
        description: "Immersive sound experience with advanced active noise cancellation.",
        price: 23999.0,
        category: "Electronics",
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.8,
        numReviews: 24,
      },
      {
        name: "Minimalist Modern Chair",
        description: "A stylish and comfortable addition to any contemporary living room.",
        price: 12000.0,
        category: "Furniture",
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.2,
        numReviews: 12,
      },
      {
        name: "Professional DSLR Camera",
        description: "Capture stunning moments with high-resolution clarity and speed.",
        price: 95999.0,
        category: "Electronics",
        stock: 8,
        imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.9,
        numReviews: 50,
      },
      {
        name: "Classic White Sneakers",
        description: "Versatile and comfortable, a staple for any casual outfit.",
        price: 6800.0,
        category: "Clothing",
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 89,
      },
      {
        name: "Mechanical Gaming Keyboard",
        description: "Tactile mechanical switches with customizable RGB backlighting.",
        price: 7199.0,
        category: "Electronics",
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.6,
        numReviews: 18,
      },
      {
        name: "Smart Fitness Smartwatch",
        description: "Track your workouts, heart rate, and sleep with this sleek, waterproof smartwatch.",
        price: 11999.0,
        category: "Electronics",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.4,
        numReviews: 32,
      },
      {
        name: "Leather Messenger Bag",
        description: "Handcrafted genuine leather bag with compartments for laptops and tablets.",
        price: 4799.0,
        category: "Clothing",
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.7,
        numReviews: 15,
      },
      {
        name: "Ceramic Plant Pot Set",
        description: "Set of three modern ceramic planters with drainage holes and bamboo trays.",
        price: 2399.0,
        category: "Furniture",
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.3,
        numReviews: 8,
      },
      {
        name: "Ergonomic Office Chair",
        description: "High-back office chair with adjustable lumbar support and 3D armrests.",
        price: 15499.0,
        category: "Furniture",
        stock: 12,
        imageUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.6,
        numReviews: 45,
      },
      {
        name: "UltraWide Gaming Monitor",
        description: "34-inch curved gaming monitor with 144Hz refresh rate and HDR support.",
        price: 34999.0,
        category: "Electronics",
        stock: 10,
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.7,
        numReviews: 29,
      },
      {
        name: "Portable Bluetooth Speaker",
        description: "IPX7 waterproof wireless speaker with deep bass and 20-hour playtime.",
        price: 4999.0,
        category: "Electronics",
        stock: 60,
        imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 124,
      },
      {
        name: "4K Action Camera",
        description: "Ultra HD action camera with touchscreen, image stabilization, and waterproof housing.",
        price: 18999.0,
        category: "Electronics",
        stock: 22,
        imageUrl: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.3,
        numReviews: 38,
      },
      {
        name: "Smart LED Light Bulb",
        description: "Wi-Fi enabled multicolor LED bulb compatible with Alexa and Google Assistant.",
        price: 1299.0,
        category: "Electronics",
        stock: 150,
        imageUrl: "https://images.unsplash.com/photo-1550537687-c91072c4792d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.1,
        numReviews: 210,
      },
      {
        name: "Wireless Charging Pad",
        description: "Fast wireless charger for Qi-enabled smartphones with non-slip design.",
        price: 1999.0,
        category: "Electronics",
        stock: 80,
        imageUrl: "https://images.unsplash.com/photo-1622445262465-2481c4574875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.4,
        numReviews: 95,
      },
      {
        name: "Solid Wood Coffee Table",
        description: "Handcrafted rustic coffee table made from sustainably sourced pine wood.",
        price: 8999.0,
        category: "Furniture",
        stock: 18,
        imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 17,
      },
      {
        name: "Modern Sofa Bed",
        description: "Multi-functional convertible sofa bed with premium fabric upholstery.",
        price: 28999.0,
        category: "Furniture",
        stock: 5,
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.2,
        numReviews: 14,
      },
      {
        name: "Desk Organizer Set",
        description: "5-piece mesh metal office desk organizer set with document tray and pen holder.",
        price: 1499.0,
        category: "Furniture",
        stock: 45,
        imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.4,
        numReviews: 33,
      },
      {
        name: "Floor Standing Lamp",
        description: "Elegant metal arc floor lamp with a hanging fabric drum shade for cozy lighting.",
        price: 3999.0,
        category: "Furniture",
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.6,
        numReviews: 22,
      },
      {
        name: "Bookshelf Display Unit",
        description: "5-tier modern industrial bookshelf with wood shelves and metal frame.",
        price: 7499.0,
        category: "Furniture",
        stock: 14,
        imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.7,
        numReviews: 19,
      },
      {
        name: "Cotton Crewneck T-Shirt",
        description: "Pack of 3 premium combed cotton crewneck t-shirts for everyday wear.",
        price: 1199.0,
        category: "Clothing",
        stock: 120,
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.3,
        numReviews: 140,
      },
      {
        name: "Slim Fit Denim Jeans",
        description: "Classic stretchable blue denim jeans with a modern slim fit silhouette.",
        price: 2999.0,
        category: "Clothing",
        stock: 85,
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.4,
        numReviews: 98,
      },
      {
        name: "Hooded Sweatshirt",
        description: "Unisex cozy fleece pullover hoodie with front kangaroo pocket.",
        price: 2499.0,
        category: "Clothing",
        stock: 70,
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 67,
      },
      {
        name: "Waterproof Rain Jacket",
        description: "Lightweight windbreaker and rain jacket with adjustable hood.",
        price: 4500.0,
        category: "Clothing",
        stock: 35,
        imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd654cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.2,
        numReviews: 29,
      },
      {
        name: "Running Shoes",
        description: "High-performance lightweight running shoes with responsive cushioning.",
        price: 5499.0,
        category: "Clothing",
        stock: 65,
        imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.6,
        numReviews: 112,
      },
      {
        name: "Leather Wallet",
        description: "Genuine leather bi-fold wallet with RFID blocking technology.",
        price: 1799.0,
        category: "Clothing",
        stock: 90,
        imageUrl: "https://images.unsplash.com/photo-1627124765138-b717b0788390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 54,
      },
      {
        name: "Stainless Steel Water Bottle",
        description: "Double-walled vacuum insulated bottle that keeps drinks cold for 24 hours.",
        price: 1299.0,
        category: "Home & Kitchen",
        stock: 110,
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.6,
        numReviews: 87,
      },
      {
        name: "Non-Stick Cookware Set",
        description: "10-piece aluminum non-stick pots and pans set with glass lids.",
        price: 6499.0,
        category: "Home & Kitchen",
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.4,
        numReviews: 41,
      },
      {
        name: "French Press Coffee Maker",
        description: "1-liter borosilicate glass coffee press with double-mesh stainless steel filter.",
        price: 1899.0,
        category: "Home & Kitchen",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 63,
      },
      {
        name: "Air Fryer",
        description: "Healthy oil-free digital air fryer with 8-in-1 presets and touch display.",
        price: 8499.0,
        category: "Home & Kitchen",
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.7,
        numReviews: 76,
      },
      {
        name: "Chef's Knife",
        description: "Professional-grade 8-inch high-carbon stainless steel kitchen knife.",
        price: 2199.0,
        category: "Home & Kitchen",
        stock: 35,
        imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.7,
        numReviews: 48,
      },
      {
        name: "Electric Kettle",
        description: "1.5-liter double-wall cool touch electric kettle with auto shut-off.",
        price: 1599.0,
        category: "Home & Kitchen",
        stock: 55,
        imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.3,
        numReviews: 92,
      },
      {
        name: "Silicon Baking Mats",
        description: "Pack of 2 non-stick food-safe silicone baking mats, heat resistant.",
        price: 899.0,
        category: "Home & Kitchen",
        stock: 75,
        imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 27,
      },
      {
        name: "Yoga Mat",
        description: "High-density 6mm non-slip exercise mat with carrying strap.",
        price: 1499.0,
        category: "Sports & Outdoors",
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.4,
        numReviews: 83,
      },
      {
        name: "Adjustable Dumbbells Set",
        description: "All-in-one adjustable strength training dumbbells, weight selector dial.",
        price: 12999.0,
        category: "Sports & Outdoors",
        stock: 12,
        imageUrl: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.8,
        numReviews: 39,
      },
      {
        name: "Hydration Backpack",
        description: "Lightweight running and cycling backpack with 2L water bladder.",
        price: 2799.0,
        category: "Sports & Outdoors",
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.3,
        numReviews: 41,
      },
      {
        name: "Camping Tent",
        description: "Waterproof 4-person family camping dome tent with rainfly.",
        price: 5999.0,
        category: "Sports & Outdoors",
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 23,
      },
      {
        name: "Sleeping Bag",
        description: "Lightweight 3-season warm sleeping bag for outdoor camping and hiking.",
        price: 2499.0,
        category: "Sports & Outdoors",
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.2,
        numReviews: 18,
      },
      {
        name: "Resistance Bands Set",
        description: "Set of 5 heavy-duty latex workout bands with door anchor and handles.",
        price: 999.0,
        category: "Sports & Outdoors",
        stock: 120,
        imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.6,
        numReviews: 104,
      },
      {
        name: "Noise-Isolating Earbuds",
        description: "Wired high-fidelity earbuds with microphone and ergonomic fit.",
        price: 2999.0,
        category: "Electronics",
        stock: 75,
        imageUrl: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.3,
        numReviews: 47,
      },
      {
        name: "High-Speed External SSD",
        description: "1TB pocket-sized external solid state drive with USB-C connection.",
        price: 8999.0,
        category: "Electronics",
        stock: 28,
        imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.8,
        numReviews: 53,
      },
      {
        name: "Graphic Novel Anthology",
        description: "A collected volume of stunning illustrations and storytelling from top creators.",
        price: 1499.0,
        category: "Books",
        stock: 35,
        imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.7,
        numReviews: 22,
      },
      {
        name: "Sci-Fi Best Seller Novel",
        description: "Award-winning futuristic science fiction novel exploring humanity and technology.",
        price: 599.0,
        category: "Books",
        stock: 60,
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.6,
        numReviews: 78,
      },
      {
        name: "Self-Improvement Guide",
        description: "Practical strategies for productivity, focus, and breaking bad habits.",
        price: 499.0,
        category: "Books",
        stock: 95,
        imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 132,
      },
      {
        name: "Cookbook for Beginners",
        description: "100 simple and healthy recipes for any home cook, full-color photos.",
        price: 799.0,
        category: "Books",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.4,
        numReviews: 19,
      },
      {
        name: "Professional Notebook",
        description: "Hardcover ruled journal with pocket, thick bleed-free paper.",
        price: 399.0,
        category: "Books",
        stock: 140,
        imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.6,
        numReviews: 44,
      },
      {
        name: "Cozy Fleece Blanket",
        description: "Ultra-soft microfiber flannel blanket for bed or couch, navy blue.",
        price: 1999.0,
        category: "Home & Kitchen",
        stock: 45,
        imageUrl: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.7,
        numReviews: 51,
      },
      {
        name: "Digital Kitchen Scale",
        description: "Precision cooking food scale with LCD display and tare function.",
        price: 999.0,
        category: "Home & Kitchen",
        stock: 80,
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.4,
        numReviews: 68,
      },
      {
        name: "Essential Oil Diffuser",
        description: "Ultrasonic cool mist humidifier with 7 color LED lights and auto-shutoff.",
        price: 1599.0,
        category: "Home & Kitchen",
        stock: 35,
        imageUrl: "https://images.unsplash.com/photo-1602928321679-560bb453f190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.3,
        numReviews: 39,
      },
      {
        name: "Ceramic Coffee Mug Set",
        description: "Set of 4 large matte finish stoneware mugs for morning coffee.",
        price: 1199.0,
        category: "Home & Kitchen",
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 28,
      },
      {
        name: "Men's Leather Belt",
        description: "Reversible classic design formal dress belt in black and brown.",
        price: 1499.0,
        category: "Clothing",
        stock: 75,
        imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.4,
        numReviews: 37,
      }
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
