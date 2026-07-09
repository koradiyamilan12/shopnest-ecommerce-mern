import { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axiosInstance from "../utils/axiosInstance";
import { FiUploadCloud, FiArrowLeft, FiImage } from "react-icons/fi";
import "../styles/admin.css";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      description: Yup.string().required("Product description is required"),
      price: Yup.number().positive("Price must be positive").required("Price is required"),
      category: Yup.string().required("Category is required"),
      stock: Yup.number().integer("Stock must be integer").min(0, "Stock cannot be negative").required("Stock is required"),
    }),
    onSubmit: async (values) => {
      if (!image) {
        toast.error("Please upload a product cover image first.");
        return;
      }

      setLoading(true);
      const loadToast = toast.loading("Uploading image and creating product...");
      
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("stock", values.stock);
      formData.append("image", image);

      try {
        await axiosInstance.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.dismiss(loadToast);
        toast.success("Product created successfully!");
        navigate("/admin/products");
      } catch (err) {
        toast.dismiss(loadToast);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="admin-layout fade-in">
      <AdminSidebar />

      <main className="admin-content-area">
        <div className="admin-header-row">
          <div>
            <h1 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Add Product</h1>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
              Publish a new listing to the catalog.
            </p>
          </div>
          <button onClick={() => navigate("/admin/products")} className="btn btn-secondary">
            <FiArrowLeft size={14} /> Back
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="admin-form-grid">
          {/* Left Column Details */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Product Title</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="MacBook Pro M3 Max"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="form-error">{formik.errors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                className="form-input"
                rows="6"
                placeholder="Detailed specifications and product properties..."
                style={{ resize: "none" }}
                {...formik.getFieldProps("description")}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="form-error">{formik.errors.description}</div>
              )}
            </div>

            <div className="grid-responsive" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="price">Price ($)</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="3199.00"
                  {...formik.getFieldProps("price")}
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="form-error">{formik.errors.price}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="stock">Stock Inventory</label>
                <input
                  id="stock"
                  type="number"
                  className="form-input"
                  placeholder="15"
                  {...formik.getFieldProps("stock")}
                />
                {formik.touched.stock && formik.errors.stock && (
                  <div className="form-error">{formik.errors.stock}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                className="form-input"
                placeholder="Mac"
                {...formik.getFieldProps("category")}
              />
              {formik.touched.category && formik.errors.category && (
                <div className="form-error">{formik.errors.category}</div>
              )}
            </div>
          </div>

          {/* Right Column Media Dropzone */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              <h3 style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", textTransform: "uppercase" }}>Cover Image</h3>
              
              <label className="upload-dropzone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <FiUploadCloud className="upload-dropzone-icon" />
                <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)" }}>Click to Upload</span>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>PNG, JPG, WEBP up to 5MB</span>
              </label>

              {imagePreview && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <img src={imagePreview} alt="Preview" className="upload-preview" />
                  <span style={{ fontSize: "11px", color: "var(--success)", marginTop: "4px" }}>Selected: {image.name}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? <span className="spinner"></span> : "Publish Product"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
