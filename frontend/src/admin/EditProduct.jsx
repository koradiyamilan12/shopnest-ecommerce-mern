import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import AdminSidebar from "./AdminSidebar";
import axiosInstance from "../utils/axiosInstance";
import { FiUploadCloud, FiArrowLeft } from "react-icons/fi";
import "../styles/admin.css";

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      setSubmitting(true);
      const loadToast = toast.loading("Updating product details...");
      
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("stock", values.stock);
      if (image) {
        formData.append("image", image);
      }

      try {
        await axiosInstance.put(`/products/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.dismiss(loadToast);
        toast.success("Product updated successfully!");
        navigate("/admin/products");
      } catch (err) {
        toast.dismiss(loadToast);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        const data = res.data;
        formik.setValues({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
        });
        setImagePreview(data.imageUrl);
      } catch (err) {
        // Handled
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (initialLoading) {
    return (
      <div className="empty-state">
        <span className="spinner"></span>
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout fade-in">
      <AdminSidebar />

      <main className="admin-content-area">
        <div className="admin-header-row">
          <div>
            <h1 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Edit Product</h1>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
              Update listing properties or upload a new catalog image.
            </p>
          </div>
          <button onClick={() => navigate("/admin/products")} className="btn btn-secondary">
            <FiArrowLeft size={14} /> Back
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="admin-form-grid">
          {/* Details Column */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Product Title</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Product Name"
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
                placeholder="Description"
                style={{ resize: "none" }}
                {...formik.getFieldProps("description")}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="form-error">{formik.errors.description}</div>
              )}
            </div>

            <div className="grid-responsive" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="price">Price (₹)</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="Price"
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
                  placeholder="Stock"
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
                placeholder="Category"
                {...formik.getFieldProps("category")}
              />
              {formik.touched.category && formik.errors.category && (
                <div className="form-error">{formik.errors.category}</div>
              )}
            </div>
          </div>

          {/* Media Column */}
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
                <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)" }}>Change image cover</span>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>Leave blank to keep existing cover</span>
              </label>

              {imagePreview && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <img src={imagePreview} alt="Preview" className="upload-preview" />
                  {image && (
                    <span style={{ fontSize: "11px", color: "var(--success)", marginTop: "4px" }}>Selected: {image.name}</span>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: "100%" }}
            >
              {submitting ? <span className="spinner"></span> : "Save Product Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProduct;
