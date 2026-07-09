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

const getAllProductsService = () => getAllProducts();

const getProductByIdService = async (id) => {
  const product = await getProductById(id);
  if (!product) {
    throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

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
  return createProduct({ ...data, imageUrl });
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

  return saveProduct(product);
};

const deleteProductService = async (id) => {
  const product = await getProductByIdService(id);
  await deleteProduct(product);

  return { id };
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};
