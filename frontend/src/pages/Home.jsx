import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/authContext";
import { FiArrowRight, FiCpu, FiMonitor, FiSmartphone, FiHeadphones, FiGrid, FiBook, FiHome, FiActivity, FiSearch, FiStar, FiTrendingUp, FiShield } from "react-icons/fi";
import "../styles/product.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await axiosInstance.get("/products");
        setProducts(prodRes.data.slice(0, 4));

        if (user) {
          const wishRes = await axiosInstance.get("/wishlist");
          setWishlistIds(wishRes.data.map(item => Number(item.productId)));
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: "Electronics", icon: <FiMonitor size={20} />, path: "/shop?category=Electronics" },
    { name: "Furniture", icon: <FiGrid size={20} />, path: "/shop?category=Furniture" },
    { name: "Clothing", icon: <FiCpu size={20} />, path: "/shop?category=Clothing" },
    { name: "Home & Kitchen", icon: <FiHome size={20} />, path: "/shop?category=Home%20%26%20Kitchen" },
    { name: "Sports & Outdoors", icon: <FiActivity size={20} />, path: "/shop?category=Sports%20%26%20Outdoors" },
    { name: "Books", icon: <FiBook size={20} />, path: "/shop?category=Books" },
  ];

  return (
    <div className="fade-in">
      {/* Sleek Hero Banner */}
      <section className="hero-section">
        <span className="hero-subtitle">Discover Everything You Need</span>
        <h1 className="hero-title">Welcome to ShopNest</h1>
        <p className="hero-desc">
          Your ultimate shopping destination for electronics, fashion, furniture, and more. Explore our premium collections and enjoy a seamless shopping experience.
        </p>

        <form className="hero-search-form" onSubmit={handleSearch}>
          <FiSearch className="hero-search-icon" size={20} />
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search for products, brands, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="hero-search-btn">
            Search
          </button>
        </form>

        <div className="hero-badges">
          <div className="hero-badge-item"><FiShield size={14} /> Secure Payments</div>
          <div className="hero-badge-item"><FiTrendingUp size={14} /> Fast Delivery</div>
          <div className="hero-badge-item"><FiStar size={14} /> Top Quality Products</div>
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
                isWishlistedInitial={wishlistIds.includes(Number(product.id))}
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
