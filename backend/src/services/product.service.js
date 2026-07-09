const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  saveProduct,
} = require("../repository/product.repository");
const { uploadImage } = require("../repository/cloudinary.repository");
const { ERROR_MESSAGES } = require("../constants/messages");
const {
  BadRequestError,
  NotFoundError,
  ThirdpartyError,
} = require("../utils/errors");
const { getCache, setCache, delCache } = require("../utils/redisCache");

const getAllProductsService = async () => {
  const cacheKey = "products:all";
  const cachedProducts = await getCache(cacheKey);
  if (cachedProducts) {
    return cachedProducts;
  }
  const products = await getAllProducts();
  await setCache(cacheKey, products, 3600);
  return products;
};

const getProductByIdService = async (id) => {
  const cacheKey = `products:${id}`;
  const cachedProduct = await getCache(cacheKey);
  if (cachedProduct) {
    return cachedProduct;
  }

  const product = await getProductById(id);
  if (!product) {
    throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  await setCache(cacheKey, product, 3600);
  return product;
};

const uploadProductImage = async (file) => {
  if (!file) {
    throw new BadRequestError(ERROR_MESSAGES.PRODUCT_IMAGE_REQUIRED);
  }

  try {
    const result = await uploadImage(file.path);
    return result.secure_url;
  } catch (error) {
    throw new ThirdpartyError(error.message);
  }
};

const createProductService = async (data, file) => {
  const imageUrl = await uploadProductImage(file);
  const product = await createProduct({ ...data, imageUrl });

  await delCache("products:all");
  await delCache("analytics:stats");

  return product;
};

const updateProductService = async (id, data, file) => {
  const product = await getProductByIdService(id);
  const fields = ["name", "description", "price", "category", "stock"];

  fields.forEach((field) => {
    if (data[field] !== undefined) {
      product[field] = data[field];
    }
  });

  if (file) {
    product.imageUrl = await uploadProductImage(file);
  }

  const updatedProduct = await saveProduct(product);

  await delCache("products:all");
  await delCache(`products:${id}`);
  await delCache("analytics:stats");

  return updatedProduct;
};

const deleteProductService = async (id) => {
  const product = await getProductByIdService(id);
  await deleteProduct(product);

  await delCache("products:all");
  await delCache(`products:${id}`);
  await delCache("analytics:stats");

  return { id };
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};

