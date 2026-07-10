import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/authContext";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import "../styles/product.css";

const Shop = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(4000);
  const [sortBy, setSortBy] = useState("default");

  // Read URL params (e.g. from Home page click)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await axiosInstance.get("/products");
        setProducts(prodRes.data);

        // Extract maximum price dynamically from catalog
        if (prodRes.data.length > 0) {
          const max = Math.max(...prodRes.data.map(p => p.price));
          setMaxPrice(max + 100);
        }

        if (user) {
          const wishRes = await axiosInstance.get("/wishlist");
          setWishlistIds(wishRes.data.map(item => item.id));
        }
      } catch (err) {
        // Intercepted
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

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("default");
    setSearchParams({});
    if (products.length > 0) {
      const max = Math.max(...products.map(p => p.price));
      setMaxPrice(max + 100);
    }
  };

  // Compute categories lists dynamically
  const categoriesList = ["All", ...new Set(products.map((p) => p.category))];

  // Filtering & Sorting Logic (Done on Client-Side as cached products:all does not paginate in backend repository)
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesPrice = p.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "ratings") return b.ratings - a.ratings;
      return 0; // Default
    });

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ borderBottom: "1px solid var(--surface-border)", paddingBottom: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Shop Catalog</h1>
          <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>Showing {filteredProducts.length} of {products.length} products</p>
        </div>
        
        <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input"
            style={{ width: "160px", padding: "0.5rem 0.75rem" }}
          >
            <option value="default">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="ratings">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="shop-layout">
        {/* Filters Sidebar */}
        <aside className="shop-sidebar">
          {/* Search box */}
          <div className="filter-section">
            <h3 className="filter-title">Search</h3>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Find products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "2.25rem" }}
              />
              <FiSearch style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
            </div>
          </div>

          {/* Category selection */}
          <div className="filter-section">
            <h3 className="filter-title">Categories</h3>
            <div className="filter-list">
              {categoriesList.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSearchParams(cat === "All" ? {} : { category: cat });
                  }}
                  className={`filter-item ${selectedCategory === cat ? "active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range selector */}
          <div className="filter-section">
            <h3 className="filter-title">Max Price</h3>
            <div className="range-slider-container">
              <input
                type="range"
                min="0"
                max={products.length > 0 ? Math.max(...products.map(p => p.price)) + 100 : 4000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <div className="range-slider-values">
                <span>$0</span>
                <span style={{ color: "var(--foreground)", fontWeight: "var(--weight-bold)" }}>
                  ${maxPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Clear trigger */}
          <button onClick={clearFilters} className="btn btn-secondary" style={{ width: "100%", padding: "0.5rem" }}>
            <FiX size={14} /> Reset Filters
          </button>
        </aside>

        {/* Product Cards Listing */}
        <main>
          {loading ? (
            <div className="grid-responsive">
              {[1, 2, 3, 6].map((n) => (
                <div key={n} className="card" style={{ height: "360px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="skeleton" style={{ flex: 1 }}></div>
                  <div className="skeleton" style={{ height: "16px", width: "60%" }}></div>
                  <div className="skeleton" style={{ height: "24px", width: "40%" }}></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state card">
              <FiSliders />
              <h3>No products found</h3>
              <p>We couldn't find matches matching your filter options. Try reset filters.</p>
              <button onClick={clearFilters} className="btn btn-primary" style={{ marginTop: "var(--spacing-md)" }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid-responsive">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlistedInitial={wishlistIds.includes(product.id)}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
