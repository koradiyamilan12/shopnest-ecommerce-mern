import * as Yup from "yup";

export const productSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Product description is required"),
  price: Yup.number().positive("Price must be positive").required("Price is required"),
  category: Yup.string().required("Category is required"),
  stock: Yup.number().integer("Stock must be integer").min(0, "Stock cannot be negative").required("Stock is required"),
});
