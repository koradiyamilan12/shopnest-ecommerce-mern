import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { addToCart } from "../redux/cartSlice";
import { AuthContext } from "../context/authContext";
import axiosInstance from "../utils/axiosInstance";
import { FiHeart, FiStar, FiMinus, FiPlus, FiMessageSquare, FiSliders } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import "../styles/product.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Specifications mock keys for high fidelity
  const specs = [
    { label: "Category", val: product?.category },
    { label: "Model Number", val: `SN-PRO-${String(product?.id || "").slice(-4).toUpperCase() || "M3X"}` },
    { label: "Availability", val: product?.stock > 0 ? "In Stock" : "Out of Stock" },
    { label: "Warranty", val: "1 Year Limited Brand Warranty" },
    { label: "Box Contents", val: `${product?.name}, Charging Adapter, USB-C Cable, User Guide` }
  ];

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      setProduct(res.data);

      if (user) {
        const wishRes = await axiosInstance.get("/wishlist");
        const list = wishRes.data.map(item => item.id);
        setIsWishlisted(list.includes(id));
      }
    } catch (error) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please sign in to update your wishlist");
      navigate("/login");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await axiosInstance.delete(`/wishlist/${id}`);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await axiosInstance.post("/wishlist", { productId: id });
        setIsWishlisted(true);
        toast.success("Saved to wishlist");
      }
    } catch (err) {
      // Handled
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          qty,
        }),
      );
      toast.success(`${qty}x ${product.name} added to cart.`);
    }
  };

  // Formik for review additions
  const reviewFormik = useFormik({
    initialValues: {
      rating: 5,
      comment: "",
    },
    validationSchema: Yup.object({
      rating: Yup.number().min(1).max(5).required(),
      comment: Yup.string()
        .min(6, "Review text must be at least 6 characters")
        .required("Review comment is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      if (!user) {
        toast.error("Please log in to leave a review");
        navigate("/login");
        return;
      }
      try {
        await axiosInstance.post(`/products/${id}/reviews`, {
          rating: Number(values.rating),
          comment: values.comment,
        });
        toast.success("Review posted successfully!");
        resetForm();
        fetchProduct(); // Reload reviews list
      } catch (err) {
        // Handled
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) {
    return (
      <div className="empty-state">
        <span className="spinner" style={{ width: "36px", height: "36px" }}></span>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state card">
        <h3 style={{ color: "var(--error)" }}>Product Not Found</h3>
        <p>The product you are trying to view does not exist or has been removed.</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: "var(--spacing-md)" }}>
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Breadcrumbs */}
      <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginBottom: "var(--spacing-lg)", display: "flex", gap: "var(--spacing-xs)" }}>
        <Link to="/" style={{ color: "var(--brand)" }}>Home</Link> / 
        <Link to="/shop" style={{ color: "var(--brand)" }}>Shop</Link> / 
        <Link to={`/shop?category=${product.category}`} style={{ color: "var(--brand)" }}>{product.category}</Link> / 
        <span style={{ color: "var(--foreground)" }}>{product.name}</span>
      </div>

      <div className="product-detail-layout">
        {/* Left Side Gallery */}
        <div className="product-gallery">
          <div className="product-gallery-main">
            <img src={product.imageUrl} alt={product.name} />
          </div>
          <div className="product-gallery-thumbs">
            <div className="product-gallery-thumb active">
              <img src={product.imageUrl} alt={product.name} />
            </div>
          </div>
        </div>

        {/* Right Side Options & Info */}
        <div className="product-info-details">
          <div className="product-meta-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--spacing-md)" }}>
              <h1 className="product-detail-title" style={{ fontSize: "var(--text-xxl)", margin: 0 }}>{product.name}</h1>
              <button
                onClick={handleWishlistToggle}
                className="navbar-icon-btn"
                disabled={wishlistLoading}
                style={{ flexShrink: 0 }}
              >
                {isWishlisted ? (
                  <FaHeart size={18} style={{ color: "var(--error)" }} />
                ) : (
                  <FiHeart size={18} />
                )}
              </button>
            </div>

            <div className="product-detail-rating" style={{ marginTop: "var(--spacing-xs)" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar
                    key={s}
                    size={14}
                    color={s <= Math.round(product.ratings) ? "var(--warning)" : "var(--surface-border)"}
                  />
                ))}
              </div>
              <span>
                {product.ratings.toFixed(1)} ({product.numReviews} Reviews)
              </span>
            </div>

            <div className="product-detail-price">${product.price.toLocaleString()}</div>
          </div>

          <p className="product-detail-desc">{product.description}</p>

          <div className="product-detail-controls">
            {product.stock > 0 ? (
              <>
                <div className="quantity-selector">
                  <span className="form-label" style={{ margin: 0 }}>Quantity</span>
                  <div className="quantity-btn-row">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="quantity-btn"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="quantity-val">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="quantity-btn"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--success-text)" }}>
                    {product.stock} units available
                  </span>
                </div>

                <div className="detail-actions-row">
                  <button onClick={handleAddToCart} className="btn btn-primary">
                    Add to Bag
                  </button>
                </div>
              </>
            ) : (
              <div className="badge badge-danger" style={{ padding: "0.75rem", width: "fit-content" }}>
                Temporarily Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Layout specs, review form */}
      <div className="product-tabs-container">
        <div className="product-tabs-nav">
          <button
            onClick={() => setActiveTab("overview")}
            className={`product-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`product-tab-btn ${activeTab === "specs" ? "active" : ""}`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`product-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          >
            Reviews ({product.numReviews})
          </button>
        </div>

        <div style={{ minHeight: "200px" }}>
          {activeTab === "overview" && (
            <div className="fade-in" style={{ fontSize: "var(--text-sm)", color: "var(--muted)", lineHeight: 1.7 }}>
              <h3 style={{ fontSize: "var(--text-lg)" }}>Product Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="fade-in">
              <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--spacing-md)" }}>Technical Details</h3>
              <table className="product-specs-table">
                <tbody>
                  {specs.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.label}</td>
                      <td>{item.val || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="fade-in reviews-grid">
              <div className="reviews-summary">
                <h3 style={{ fontSize: "var(--text-lg)" }}>Customer Ratings</h3>
                <div className="reviews-summary-score">{product.ratings.toFixed(1)}</div>
                <div style={{ display: "flex", gap: "2px", color: "var(--warning)" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar
                      key={s}
                      size={18}
                      color={s <= Math.round(product.ratings) ? "var(--warning)" : "var(--surface-border)"}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>
                  Based on {product.numReviews} customer reviews.
                </span>

                <div className="dropdown-divider" style={{ margin: "var(--spacing-md) 0" }}></div>

                {/* Add Review section */}
                <form onSubmit={reviewFormik.handleSubmit} className="add-review-form">
                  <h4 style={{ margin: 0, fontSize: "var(--text-sm)" }}>Write a review</h4>
                  
                  <div className="form-group">
                    <label className="form-label">Score Rating</label>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => reviewFormik.setFieldValue("rating", r)}
                          style={{ cursor: "pointer" }}
                        >
                          {r <= reviewFormik.values.rating ? (
                            <FaStar size={20} color="var(--warning)" />
                          ) : (
                            <FiStar size={20} color="var(--muted)" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="comment">Comment</label>
                    <textarea
                      id="comment"
                      className="form-input"
                      rows="4"
                      placeholder="Share your thoughts about this product..."
                      style={{ resize: "none" }}
                      {...reviewFormik.getFieldProps("comment")}
                    />
                    {reviewFormik.touched.comment && reviewFormik.errors.comment && (
                      <div className="form-error">{reviewFormik.errors.comment}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={reviewFormik.isSubmitting}
                  >
                    {reviewFormik.isSubmitting ? <span className="spinner"></span> : "Post Review"}
                  </button>
                </form>
              </div>

              <div className="reviews-list">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div className="review-card" key={rev.id}>
                      <div className="review-header">
                        <div className="review-author">{rev.user?.name || "Anonymous User"}</div>
                        <div className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: "flex", gap: "2px", color: "var(--warning)", marginBottom: "var(--spacing-xs)" }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            size={12}
                            color={s <= rev.rating ? "var(--warning)" : "var(--surface-border)"}
                          />
                        ))}
                      </div>
                      <p className="review-text">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-state" style={{ padding: "var(--spacing-xl) 0" }}>
                    <FiMessageSquare />
                    <h4>No reviews yet</h4>
                    <p>Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
