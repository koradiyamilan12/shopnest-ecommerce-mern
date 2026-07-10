import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { FiHeart, FiStar } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import "../styles/product.css";

const ProductCard = ({ product, isWishlistedInitial = false, onWishlistToggle }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isWishlisted, setIsWishlisted] = useState(isWishlistedInitial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsWishlisted(isWishlistedInitial);
  }, [isWishlistedInitial]);

  if (!product) return null;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to add items to your wishlist");
      navigate("/login");
      return;
    }

    if (!product.id) return;

    setLoading(true);
    try {
      if (isWishlisted) {
        await axiosInstance.delete(`/wishlist/${product.id}`);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
        if (onWishlistToggle) onWishlistToggle(product.id, false);
      } else {
        await axiosInstance.post("/wishlist", { productId: product.id });
        setIsWishlisted(true);
        toast.success("Saved to wishlist");
        if (onWishlistToggle) onWishlistToggle(product.id, true);
      }
    } catch (err) {
      // Handled by axiosInstance interceptors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card fade-in">
      <div className="product-card-media">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name || "Product"}
            className="product-card-img"
            loading="lazy"
          />
        </Link>
        <button
          onClick={handleWishlistToggle}
          className="product-card-wishlist"
          disabled={loading}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <FaHeart size={16} style={{ color: "var(--error)" }} />
          ) : (
            <FiHeart size={16} />
          )}
        </button>
      </div>

      <div className="product-card-content">
        <span className="product-card-category">{product.category || ""}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card-title" title={product.name || ""}>
            {product.name || ""}
          </h3>
        </Link>

        {product.ratings > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--warning)", fontSize: "var(--text-xs)" }}>
            <FiStar size={12} fill="var(--warning)" />
            <span>{product.ratings.toFixed(1)} ({product.numReviews || 0})</span>
          </div>
        )}

        <div className="product-card-footer">
          <span className="product-card-price">₹{product.price ? product.price.toLocaleString() : "0"}</span>
          <Link to={`/product/${product.id}`} className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "12px" }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
