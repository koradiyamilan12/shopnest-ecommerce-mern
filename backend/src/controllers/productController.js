const asyncHandler = require("express-async-handler");
const {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
} = require("../services/product.service");
const generalResponse = require("../utils/generalResponse");
const {
  getCreatedResponse,
  getDeletedResponse,
  getOkResponse,
  getUpdatedResponse,
} = require("../utils/response");
const { SUCCESS_MESSAGES } = require("../constants/messages");

const getProducts = asyncHandler(async (req, res) => {
  const products = await getAllProductsService();
  return generalResponse(
    res,
    products,
    getOkResponse(SUCCESS_MESSAGES.PRODUCTS_FETCHED),
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await getProductByIdService(req.params.id);
  return generalResponse(
    res,
    product,
    getOkResponse(SUCCESS_MESSAGES.PRODUCT_FETCHED),
  );
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService(req.body, req.file);
  return generalResponse(
    res,
    product,
    getCreatedResponse(SUCCESS_MESSAGES.PRODUCT_CREATED),
  );
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService(
    req.params.id,
    req.body,
    req.file,
  );
  return generalResponse(
    res,
    product,
    getUpdatedResponse(SUCCESS_MESSAGES.PRODUCT_UPDATED),
  );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const result = await deleteProductService(req.params.id);
  return generalResponse(
    res,
    result,
    getDeletedResponse(SUCCESS_MESSAGES.PRODUCT_DELETED),
  );
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
