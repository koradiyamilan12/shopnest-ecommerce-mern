import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axiosInstance from "../utils/axiosInstance";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import "../styles/admin.css";

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products");
        setProducts(res.data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to permanently delete this product?");
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts(prev => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      // Handled
    }
  };

  return (
    <div className="admin-layout fade-in">
      <AdminSidebar />

      <main className="admin-content-area">
        <div className="admin-header-row">
          <div>
            <h1 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Product Catalog</h1>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
              Create, update, and manage products on the catalog.
            </p>
          </div>
          <Link to="/admin/add-product" className="btn btn-primary">
            <FiPlus size={14} /> Add Product
          </Link>
        </div>

        <div className="admin-card-table">
          <div className="table-header">
            <span style={{ fontWeight: "var(--weight-semibold)" }}>Total Products ({products.length})</span>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div className="empty-state">
                <span className="spinner"></span>
                <p>Loading products list...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <FiTrash2 size={32} />
                <h4>No products found</h4>
                <p>Add a new item to populate the store catalog.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--surface-border)" }}
                        />
                      </td>
                      <td style={{ fontWeight: "var(--weight-semibold)" }}>{product.name}</td>
                      <td>${product.price.toLocaleString()}</td>
                      <td>{product.category}</td>
                      <td>
                        <span className={product.stock > 0 ? "badge badge-success" : "badge badge-danger"}>
                          {product.stock} units
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="admin-action-btn-row" style={{ justifyContent: "flex-end" }}>
                          <Link
                            to={`/admin/edit-product/${product.id}`}
                            className="btn btn-secondary"
                            style={{ padding: "0.4rem 0.6rem", fontSize: "12px" }}
                            title="Edit"
                          >
                            <FiEdit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="btn btn-outline"
                            style={{ padding: "0.4rem 0.6rem", fontSize: "12px", color: "var(--error)" }}
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;
