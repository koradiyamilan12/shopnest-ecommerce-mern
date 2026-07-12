import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useSelector } from "react-redux";
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiMenu, FiX, FiActivity } from 'react-icons/fi';
import ThemeToggle from "./ThemeToggle";
import CartDrawer from "./CartDrawer";
import axiosInstance from "../utils/axiosInstance";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const location = useLocation();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync wishlist count when user logged in
  useEffect(() => {
    if (!user) {
      setWishlistCount(0);
      return;
    }
    const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get("/wishlist");
        setWishlistCount(res.data.length || 0);
      } catch (err) {
        // Silent error
      }
    };
    fetchWishlist();
  }, [user, location.pathname]); // Update on user change or page load

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <header className="navbar-wrapper">
        <nav className="navbar-container">
          <div className="navbar-brand">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src="/ShopNestLogo.png"
                alt="ShopNestLogo"
                style={{
                  height: "30px",
                  width: "30px",
                  borderRadius: "6px",
                  objectFit: "cover"
                }}
              />
              <span style={{ fontWeight: 'var(--weight-bold)' }}>ShopNest</span>
            </Link>
          </div>

          <div className="navbar-links">
            <Link to="/" className={`navbar-link ${isActive('/')}`}>Home</Link>
            <Link to="/shop" className={`navbar-link ${isActive('/shop')}`}>Shop</Link>
            <Link to="/disclaimer" className={`navbar-link ${isActive('/disclaimer')}`}>Disclaimer</Link>
            <Link to="/return" className={`navbar-link ${isActive('/return')}`}>Return Policy</Link>
          </div>

          <div className="navbar-actions">
            <ThemeToggle />

            {user && (
              <Link to="/profile?tab=wishlist" className="navbar-icon-btn" title="Wishlist">
                <FiHeart size={18} />
                {wishlistCount > 0 && <span className="navbar-cart-count">{wishlistCount}</span>}
              </Link>
            )}

            <button onClick={() => setIsCartOpen(true)} className="navbar-icon-btn" title="Cart" aria-label="Open cart">
              <FiShoppingCart size={18} />
              {cartItems.length > 0 && <span className="navbar-cart-count">{cartItems.length}</span>}
            </button>

            {user ? (
              <div className="navbar-user-menu">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="navbar-avatar"
                  aria-label="User menu"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <FiUser size={16} />
                  )}
                </button>

                {isUserDropdownOpen && (
                  <div className="dropdown-menu">
                    <div style={{ padding: '0.5rem 0.75rem', fontSize: '11px', color: 'var(--muted)' }}>
                      SIGNED IN AS<br/>
                      <strong style={{ color: 'var(--foreground)' }}>{user.email}</strong>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <FiUser size={14} /> Profile Settings
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <FiActivity size={14} /> Admin Dashboard
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item" style={{ width: '100%', color: 'var(--error)' }}>
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>
                Sign In
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu dropdown */}
        {isMobileMenuOpen && (
          <div className="navbar-mobile-menu">
            <Link to="/" className={`navbar-mobile-link ${isActive('/')}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className={`navbar-mobile-link ${isActive('/shop')}`} onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link to="/disclaimer" className={`navbar-mobile-link ${isActive('/disclaimer')}`} onClick={() => setIsMobileMenuOpen(false)}>Disclaimer</Link>
            <Link to="/return" className={`navbar-mobile-link ${isActive('/return')}`} onClick={() => setIsMobileMenuOpen(false)}>Return Policy</Link>
            
            <div className="navbar-mobile-divider"></div>
            
            {user ? (
              <div className="navbar-mobile-user-section">
                <div className="navbar-mobile-user-info">
                  SIGNED IN AS<br/>
                  <strong>{user.email}</strong>
                </div>
                <Link
                  to="/profile"
                  className="navbar-mobile-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUser size={14} /> Profile Settings
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="navbar-mobile-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiActivity size={14} /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="navbar-mobile-link logout-btn"
                  style={{ width: "100%", color: "var(--error)" }}
                >
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{ width: "100%", padding: "0.6rem" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
