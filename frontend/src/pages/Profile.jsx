import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axiosInstance from "../utils/axiosInstance";
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiCalendar, FiCreditCard } from "react-icons/fi";
import "../styles/cart.css";

const Profile = () => {
  const { user, logout, refreshProfile, updateProfile, deleteProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  // Tab State
  const activeTab = searchParams.get("tab") || "account";

  const [addresses, setAddresses] = useState([
    { id: 1, name: "Home Address", street: "123 Maple St, Apt 4B", city: "San Francisco", postalCode: "94107", country: "United States" },
    { id: 2, name: "Work Address", street: "456 Tech Way, Suite 100", city: "Palo Alto", postalCode: "94301", country: "United States" }
  ]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders/myorders");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get("/wishlist");
        const items = Array.isArray(res.data) ? res.data : [];
        setWishlist(items.filter(item => item && item.product));
      } catch (error) {
        setWishlist([]);
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchMyOrders();
    fetchWishlist();
  }, [user, navigate]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleRemoveAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleWishlistToggle = (prodId, isAdded) => {
    // If removed from wishlist within tab, filter it out immediately
    if (!isAdded) {
      setWishlist(prev => prev.filter(item => item.productId !== prodId && item.product?.id !== prodId));
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === "Delivered") return "badge badge-success";
    if (status === "Shipped") return "badge badge-warning";
    return "badge badge-info"; // Pending
  };

  const handleEditClick = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword("");
    setIsEditing(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(editName, editEmail, editPassword || undefined);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteProfile();
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="fade-in">
      <div style={{ borderBottom: "1px solid var(--surface-border)", paddingBottom: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Account Settings</h1>
        <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>Manage your profile settings, track purchases, and check your wishlist.</p>
      </div>

      <div className="cart-layout">
        {/* Left Side Navigation Sidebar */}
        <aside className="summary-panel" style={{ padding: "var(--spacing-md)", gap: "var(--spacing-sm)", position: "sticky", top: "84px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", padding: "var(--spacing-sm)" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "var(--muted-background)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              fontWeight: "var(--weight-bold)",
              border: "1px solid var(--surface-border)"
            }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)" }}>{user.name}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>{user.email}</div>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <button
              onClick={() => handleTabChange("account")}
              className={`btn btn-ghost ${activeTab === "account" ? "btn-secondary" : ""}`}
              style={{ justifyContent: "flex-start", padding: "0.6rem 0.75rem", fontSize: "13px" }}
            >
              <FiUser size={14} style={{ marginRight: "var(--spacing-xs)" }} /> Personal details
            </button>
            <button
              onClick={() => handleTabChange("orders")}
              className={`btn btn-ghost ${activeTab === "orders" ? "btn-secondary" : ""}`}
              style={{ justifyContent: "flex-start", padding: "0.6rem 0.75rem", fontSize: "13px" }}
            >
              <FiShoppingBag size={14} style={{ marginRight: "var(--spacing-xs)" }} /> Order History
            </button>
            <button
              onClick={() => handleTabChange("wishlist")}
              className={`btn btn-ghost ${activeTab === "wishlist" ? "btn-secondary" : ""}`}
              style={{ justifyContent: "flex-start", padding: "0.6rem 0.75rem", fontSize: "13px" }}
            >
              <FiHeart size={14} style={{ marginRight: "var(--spacing-xs)" }} /> My Wishlist
            </button>
          </div>

          <div className="dropdown-divider"></div>

          <button onClick={logout} className="btn btn-danger" style={{ width: "100%", padding: "0.5rem" }}>
            Sign Out
          </button>
        </aside>

        {/* Right Active Panel */}
        <main className="card" style={{ minHeight: "400px" }}>
          {activeTab === "account" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "var(--text-lg)", marginBottom: "var(--spacing-xs)" }}>Personal Details</h3>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", margin: 0 }}>Review account metadata credentials linked to your session.</p>
                </div>
                {!isEditing && (
                  <button onClick={handleEditClick} className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "12px" }}>
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", padding: "var(--spacing-md)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--muted-background)" }}>
                  <div className="form-group">
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", fontWeight: "var(--weight-semibold)" }}>FULL NAME</label>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="form-control" />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", fontWeight: "var(--weight-semibold)" }}>EMAIL ADDRESS</label>
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required className="form-control" />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", fontWeight: "var(--weight-semibold)" }}>NEW PASSWORD (Leave blank to keep current)</label>
                    <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="form-control" minLength="6" />
                  </div>
                  <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost">Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                  <div style={{ padding: "var(--spacing-md)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--muted-background)" }}>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>FULL NAME</div>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", marginTop: "2px" }}>{user.name}</div>
                  </div>
                  <div style={{ padding: "var(--spacing-md)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--muted-background)" }}>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>EMAIL ADDRESS</div>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", marginTop: "2px" }}>{user.email}</div>
                  </div>
                  <div style={{ padding: "var(--spacing-md)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--muted-background)" }}>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>PROVIDER TYPE</div>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", marginTop: "2px", textTransform: "uppercase" }}>
                      {user.authProvider || "local"}
                    </div>
                  </div>
                  <div style={{ padding: "var(--spacing-md)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--muted-background)" }}>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>ACCOUNT AUTHORITY</div>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", marginTop: "2px", textTransform: "uppercase" }}>
                      {user.role}
                    </div>
                  </div>
                </div>
              )}

              <div className="dropdown-divider"></div>

              <div>
                <h3 style={{ margin: 0, fontSize: "var(--text-lg)", marginBottom: "var(--spacing-xs)", color: "var(--error)" }}>Danger Zone</h3>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginBottom: "var(--spacing-md)" }}>Once you delete your account, there is no going back. Please be certain.</p>
                <button onClick={handleDeleteAccount} className="btn btn-danger" style={{ padding: "0.5rem 1rem", fontSize: "12px" }}>
                  Delete Account
                </button>
              </div>

              <div className="dropdown-divider"></div>

              <div>
                <h3 style={{ margin: 0, fontSize: "var(--text-lg)", marginBottom: "var(--spacing-xs)" }}>Address Book</h3>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginBottom: "var(--spacing-md)" }}>Manage shipping locations configured for fast checkout.</p>

                <div className="address-grid">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="address-select-card" style={{ cursor: "default" }}>
                      <div className="address-name">{addr.name}</div>
                      <div className="address-details">
                        {addr.street}<br />
                        {addr.city}, {addr.postalCode}<br />
                        {addr.country}
                      </div>
                      <button
                        onClick={() => handleRemoveAddress(addr.id)}
                        className="btn btn-ghost"
                        style={{ padding: "0.25rem 0", color: "var(--error)", fontSize: "11px", fontWeight: "var(--weight-semibold)", marginTop: "var(--spacing-sm)" }}
                      >
                        Remove Location
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="fade-in">
              <h3 style={{ margin: 0, fontSize: "var(--text-lg)", marginBottom: "var(--spacing-md)" }}>Purchase History</h3>

              {loadingOrders ? (
                <div className="empty-state">
                  <span className="spinner"></span>
                  <p>Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state" style={{ padding: "var(--spacing-xl) 0" }}>
                  <FiShoppingBag size={32} />
                  <h4>No orders found</h4>
                  <p>Configure items inside cart and complete checkout.</p>
                  <Link to="/shop" className="btn btn-primary" style={{ marginTop: "var(--spacing-sm)" }}>
                    Go shopping
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                  {orders.map((order) => (
                    <div key={order.id} style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                      <div className="flex-between" style={{ padding: "var(--spacing-md)", backgroundColor: "var(--muted-background)" }}>
                        <div>
                          <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>ORDER ID</div>
                          <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)" }}>{order.id}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                        </div>
                      </div>

                      <div style={{ padding: "var(--spacing-md)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--spacing-sm)", fontSize: "var(--text-xs)", color: "var(--muted)" }}>
                          <div>
                            <FiCalendar style={{ marginRight: "4px" }} /> Placed:{" "}
                            <strong style={{ color: "var(--foreground)" }}>{new Date(order.createdAt).toLocaleDateString()}</strong>
                          </div>
                          <div>
                            <FiCreditCard style={{ marginRight: "4px" }} /> Total:{" "}
                            <strong style={{ color: "var(--foreground)" }}>₹{order.totalAmount.toLocaleString()}</strong>
                          </div>
                          <div>
                            <FiMapPin style={{ marginRight: "4px" }} /> Ship to:{" "}
                            <strong style={{ color: "var(--foreground)" }}>{order.address?.city || "Address Info"}</strong>
                          </div>
                        </div>

                        {/* Order expansion */}
                        <div style={{ marginTop: "var(--spacing-sm)" }}>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="btn btn-secondary"
                            style={{ padding: "0.25rem 0.5rem", fontSize: "11px" }}
                          >
                            {expandedOrder === order.id ? "Collapse Items" : "View Items List"}
                          </button>

                          {expandedOrder === order.id && (
                            <div className="fade-in" style={{ marginTop: "var(--spacing-md)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", borderTop: "1px solid var(--surface-border)", paddingTop: "var(--spacing-md)" }}>
                              {order.items.map((item, idx) => (
                                <div key={idx} style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "center" }}>
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                                  />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>{item.name}</div>
                                    <div style={{ fontSize: "10px", color: "var(--muted)" }}>Qty: {item.qty}</div>
                                  </div>
                                  <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)" }}>
                                    ₹{(item.price * item.qty).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="fade-in">
              <h3 style={{ margin: 0, fontSize: "var(--text-lg)", marginBottom: "var(--spacing-md)" }}>My Wishlist</h3>

              {loadingWishlist ? (
                <div className="empty-state">
                  <span className="spinner"></span>
                  <p>Loading wishlist items...</p>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="empty-state" style={{ padding: "var(--spacing-xl) 0" }}>
                  <FiHeart size={32} />
                  <h4>Wishlist is empty</h4>
                  <p>Explore catalog and click the heart icon on any products card.</p>
                  <Link to="/shop" className="btn btn-primary" style={{ marginTop: "var(--spacing-sm)" }}>
                    Go to shop
                  </Link>
                </div>
              ) : (
                <div className="grid-responsive" style={{ gap: "var(--spacing-md)" }}>
                  {wishlist.map((item) => (
                    <ProductCard
                      key={item.productId || item.product?.id || item.id}
                      product={item.product}
                      isWishlistedInitial={true}
                      onWishlistToggle={handleWishlistToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
