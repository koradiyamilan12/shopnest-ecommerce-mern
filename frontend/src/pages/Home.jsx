import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/authContext";
import { FiArrowRight, FiCpu, FiMonitor, FiSmartphone, FiHeadphones, FiGrid } from "react-icons/fi";
import "../styles/product.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await axiosInstance.get("/products");
        setProducts(prodRes.data.slice(0, 4));

        if (user) {
          const wishRes = await axiosInstance.get("/wishlist");
          setWishlistIds(wishRes.data.map(item => item.id));
        }
      } catch (error) {
        // Handled by axiosInstance interceptors
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleWishlistToggle = (prodId, isAdded) => {
    if (isAdded) {
      setWishlistIds(prev => [...prev, prodId]);
    } else {
      setWishlistIds(prev => prev.filter(id => id !== prodId));
    }
  };

  const categories = [
    { name: "Mac", icon: <FiMonitor size={20} />, path: "/shop?category=Mac" },
    { name: "iPad", icon: <FiCpu size={20} />, path: "/shop?category=iPad" },
    { name: "iPhone", icon: <FiSmartphone size={20} />, path: "/shop?category=iPhone" },
    { name: "Audio", icon: <FiHeadphones size={20} />, path: "/shop?category=Audio" },
    { name: "Accessories", icon: <FiGrid size={20} />, path: "/shop?category=Accessories" },
  ];

  return (
    <div className="fade-in">
      {/* Sleek Hero Banner */}
      <section className="hero-section">
        <span className="hero-subtitle">Elevate Your Workflow</span>
        <h1 className="hero-title">ShopNest Technology</h1>
        <p className="hero-desc">
          Premium tech hardware and accessories designed for professionals, engineers, and creators.
        </p>
        <div style={{ marginTop: "var(--spacing-md)", display: "flex", gap: "var(--spacing-sm)" }}>
          <Link to="/shop" className="btn btn-primary">
            Browse Store <FiArrowRight size={14} />
          </Link>
          <a href="#featured" className="btn btn-secondary">
            Featured Products
          </a>
        </div>
      </section>

      {/* Visual Category Cards */}
      <section style={{ marginBottom: "var(--spacing-xxl)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--spacing-md)" }}>Explore Categories</h2>
        <div className="grid-responsive" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--spacing-md)" }}>
          {categories.map((cat, idx) => (
            <Link
              to={cat.path}
              key={idx}
              className="card flex-center"
              style={{
                flexDirection: "column",
                gap: "var(--spacing-sm)",
                padding: "var(--spacing-lg)",
                textAlign: "center",
                transition: "var(--transition-fast)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--brand)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--surface-border)"}
            >
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--muted-background)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--brand)"
              }}>
                {cat.icon}
              </div>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)" }}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" style={{ marginBottom: "var(--spacing-xxl)" }}>
        <div className="flex-between" style={{ marginBottom: "var(--spacing-md)" }}>
          <h2 style={{ fontSize: "var(--text-lg)", margin: 0 }}>Featured Products</h2>
          <Link to="/shop" style={{ fontSize: "var(--text-sm)", color: "var(--brand)", fontWeight: "var(--weight-semibold)", display: "flex", alignItems: "center", gap: "4px" }}>
            See All Catalog <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid-responsive">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="card" style={{ height: "360px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="skeleton" style={{ flex: 1 }}></div>
                <div className="skeleton" style={{ height: "16px", width: "60%" }}></div>
                <div className="skeleton" style={{ height: "24px", width: "40%" }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-responsive">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlistedInitial={wishlistIds.includes(product.id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
