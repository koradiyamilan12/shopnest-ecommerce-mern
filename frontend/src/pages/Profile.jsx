import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ConfirmModal from "../components/ConfirmModal";
import axiosInstance from "../utils/axiosInstance";
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiCalendar, FiCreditCard, FiEdit2, FiTrash2, FiMail, FiShield, FiLock, FiCheck, FiX, FiSettings, FiInfo, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from "react-hot-toast";
import "../styles/profile.css";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Address Book State
  const [addresses, setAddresses] = useState([]);

  // Address Addition Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressName, setAddressName] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [addressCountry, setAddressCountry] = useState("");

  // Tab State
  const activeTab = searchParams.get("tab") || "account";

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
    toast.success("Address removed successfully");
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressName || !addressStreet || !addressCity || !addressPostalCode || !addressCountry) {
      toast.error("Please fill in all address fields");
      return;
    }
    const newAddress = {
      id: Date.now(),
      name: addressName,
      street: addressStreet,
      city: addressCity,
      postalCode: addressPostalCode,
      country: addressCountry
    };
    setAddresses(prev => [...prev, newAddress]);
    setShowAddressModal(false);
    // Clear fields
    setAddressName("");
    setAddressStreet("");
    setAddressCity("");
    setAddressPostalCode("");
    setAddressCountry("");
    toast.success("New address added successfully!");
  };

  const handleWishlistToggle = (prodId, isAdded) => {
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

  const handleConfirmDelete = async () => {
    try {
      await deleteProfile();
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-dashboard">
      {/* Top Banner Dashboard Summary */}
      <div className="profile-banner">
        <div className="profile-user-info">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-large">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
          </div>
          <div className="profile-details">
            <h2>{user.name}</h2>
            <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FiMail size={14} /> {user.email}
            </p>
            <span className="profile-role-badge">{user.role || "Customer"}</span>
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-val">{loadingOrders ? "..." : orders.length}</div>
            <div className="profile-stat-lbl">Orders</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-val">{loadingWishlist ? "..." : wishlist.length}</div>
            <div className="profile-stat-lbl">Wishlist</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-val">{addresses.length}</div>
            <div className="profile-stat-lbl">Addresses</div>
          </div>
        </div>
      </div>

      {/* Main Profile Layout */}
      <div className="profile-layout">
        {/* Left Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-nav-menu">
            <button
              onClick={() => handleTabChange("account")}
              className={`profile-nav-btn ${activeTab === "account" ? "active" : ""}`}
            >
              <FiUser size={16} /> Profile & Settings
            </button>
            <button
              onClick={() => handleTabChange("orders")}
              className={`profile-nav-btn ${activeTab === "orders" ? "active" : ""}`}
            >
              <FiShoppingBag size={16} /> Order History
            </button>
            <button
              onClick={() => handleTabChange("wishlist")}
              className={`profile-nav-btn ${activeTab === "wishlist" ? "active" : ""}`}
            >
              <FiHeart size={16} /> My Wishlist
            </button>
          </div>

          <div className="profile-sidebar-footer">
            <button onClick={logout} className="btn btn-danger" style={{ width: "100%", padding: "0.6rem" }}>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="profile-content-card">
          {activeTab === "account" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xxl)" }}>
              
              {/* Combined Account Settings & Personal Details */}
              <section>
                <div className="profile-section-header">
                  <div>
                    <h3 className="profile-section-title">
                      <FiUser size={20} color="var(--brand)" /> Personal Info & Settings
                    </h3>
                    <p className="profile-section-desc" style={{ margin: 0 }}>
                      Manage your profile credentials and login attributes.
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={handleEditClick}
                      className="btn btn-secondary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "0.5rem 1.2rem",
                        fontSize: "13px",
                        fontWeight: "var(--weight-semibold)",
                        borderRadius: "var(--radius-full)"
                      }}
                    >
                      <FiEdit2 size={14} /> Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="profile-form-container" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", borderBottom: "1px solid var(--surface-border)", paddingBottom: "var(--spacing-sm)", marginBottom: "var(--spacing-xs)" }}>
                      <FiEdit2 size={16} color="var(--brand)" />
                      <h4 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: "var(--weight-semibold)" }}>Update Credentials</h4>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: "var(--spacing-lg)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <FiUser size={13} color="var(--muted)" /> FULL NAME
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                          className="form-control"
                          style={{
                            width: "100%",
                            backgroundColor: "var(--muted-background)",
                            border: "1px solid var(--surface-border)",
                            padding: "12px 14px",
                            borderRadius: "var(--radius-md)",
                            fontSize: "var(--text-sm)"
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <FiMail size={13} color="var(--muted)" /> EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          required
                          className="form-control"
                          style={{
                            width: "100%",
                            backgroundColor: "var(--muted-background)",
                            border: "1px solid var(--surface-border)",
                            padding: "12px 14px",
                            borderRadius: "var(--radius-md)",
                            fontSize: "var(--text-sm)"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FiLock size={13} color="var(--muted)" /> NEW PASSWORD{" "}
                        <span style={{ color: "var(--muted)", fontWeight: "normal", fontStyle: "italic", marginLeft: "4px" }}>
                          (Leave blank to keep current)
                        </span>
                      </label>
                      <input
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="form-control"
                        minLength="6"
                        placeholder="Enter a secure password"
                        style={{
                          width: "100%",
                          backgroundColor: "var(--muted-background)",
                          border: "1px solid var(--surface-border)",
                          padding: "12px 14px",
                          borderRadius: "var(--radius-md)",
                          fontSize: "var(--text-sm)"
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "var(--spacing-md)", justifyContent: "flex-end", marginTop: "var(--spacing-sm)" }}>
                      <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FiX size={15} /> Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", borderRadius: "var(--radius-full)" }}>
                        <FiCheck size={15} /> Save Settings
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-grid">
                    <div className="dashboard-panel-card">
                      <div style={{ backgroundColor: "var(--brand)", color: "white", padding: "10px", borderRadius: "var(--radius-md)", display: "flex" }}>
                        <FiUser size={18} />
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "var(--weight-semibold)" }}>
                          Full Name
                        </div>
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", marginTop: "4px", color: "var(--foreground)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                          {user.name}
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-panel-card">
                      <div style={{ backgroundColor: "var(--success)", color: "white", padding: "10px", borderRadius: "var(--radius-md)", display: "flex" }}>
                        <FiMail size={18} />
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "var(--weight-semibold)" }}>
                          Email Address
                        </div>
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", marginTop: "4px", color: "var(--foreground)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-panel-card">
                      <div style={{ backgroundColor: "var(--warning)", color: "white", padding: "10px", borderRadius: "var(--radius-md)", display: "flex" }}>
                        <FiShield size={18} />
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "var(--weight-semibold)" }}>
                          Provider
                        </div>
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", marginTop: "4px", color: "var(--foreground)", textTransform: "capitalize", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                          {user.authProvider || "Local Account"}
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-panel-card">
                      <div style={{ backgroundColor: "var(--foreground)", color: "var(--background)", padding: "10px", borderRadius: "var(--radius-md)", display: "flex" }}>
                        <FiSettings size={18} />
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "var(--weight-semibold)" }}>
                          Authority
                        </div>
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", marginTop: "4px", color: "var(--foreground)", textTransform: "capitalize", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                          {user.role}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Address Book Section */}
              <section>
                <div className="profile-section-header">
                  <div>
                    <h3 className="profile-section-title">
                      <FiMapPin size={20} color="var(--brand)" /> Address Book
                    </h3>
                    <p className="profile-section-desc" style={{ margin: 0 }}>
                      Add or modify dispatch addresses for fast express checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="btn btn-primary"
                    style={{ padding: "0.5rem 1.2rem", fontSize: "13px", fontWeight: "var(--weight-semibold)", borderRadius: "var(--radius-full)" }}
                  >
                    + Add New Address
                  </button>
                </div>

                <div className="address-grid">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="address-item-card">
                      <div style={{ flex: 1 }}>
                        <div className="address-tag">
                          <FiMapPin size={16} color="var(--brand)" /> {addr.name}
                        </div>
                        <div className="address-body">
                          {addr.street}
                          <br />
                          {addr.city}, {addr.postalCode}
                          <br />
                          {addr.country}
                        </div>
                      </div>
                      <div className="address-actions">
                        <button
                          onClick={() => handleRemoveAddress(addr.id)}
                          className="btn btn-ghost"
                          style={{ padding: "0.4rem 0.8rem", color: "var(--error)", fontSize: "13px", fontWeight: "var(--weight-medium)" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="address-add-placeholder" onClick={() => setShowAddressModal(true)}>
                    <FiMapPin size={22} style={{ marginBottom: "8px" }} />
                    <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)" }}>Add New Address</span>
                  </div>
                </div>
              </section>

              {/* Danger Zone Section */}
              <section>
                <div
                  style={{
                    padding: "var(--spacing-xl)",
                    border: "1px solid var(--error-bg)",
                    borderRadius: "var(--radius-xl)",
                    backgroundColor: "var(--error-bg)",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "var(--spacing-lg)"
                  }}
                >
                  <div style={{ backgroundColor: "var(--error)", color: "white", padding: "14px", borderRadius: "50%", display: "flex", boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)" }}>
                    <FiTrash2 size={24} />
                  </div>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <h3 style={{ margin: 0, fontSize: "var(--text-lg)", marginBottom: "var(--spacing-xs)", color: "var(--error-text)", fontWeight: "var(--weight-bold)" }}>
                      Danger Zone
                    </h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--error-text)", margin: 0, opacity: 0.9, lineHeight: 1.5, maxWidth: "600px" }}>
                      Once deleted, all files, wishlist saves, address presets, and previous payment profiles will be irreversibly erased from our nodes.
                    </p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="btn btn-danger"
                      style={{ padding: "0.75rem 1.5rem", fontSize: "14px", fontWeight: "var(--weight-bold)", borderRadius: "var(--radius-md)" }}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="fade-in">
              <div className="profile-section-header">
                <div>
                  <h3 className="profile-section-title">
                    <FiShoppingBag size={20} color="var(--brand)" /> Purchase History
                  </h3>
                  <p className="profile-section-desc" style={{ margin: 0 }}>
                    Track status and inspect invoices of your previous orders.
                  </p>
                </div>
              </div>

              {loadingOrders ? (
                <div className="empty-state" style={{ minHeight: "250px" }}>
                  <span className="spinner"></span>
                  <p>Fetching purchase data...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state" style={{ padding: "var(--spacing-xl) 0", minHeight: "300px" }}>
                  <FiShoppingBag size={48} style={{ color: "var(--muted)", marginBottom: "12px" }} />
                  <h4>No orders found</h4>
                  <p>You have not placed any orders yet.</p>
                  <Link to="/shop" className="btn btn-primary" style={{ marginTop: "var(--spacing-sm)", borderRadius: "var(--radius-full)" }}>
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div className="order-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-history-card">
                      <div className="order-header-premium">
                        <div className="order-metadata">
                          <div className="order-meta-item">
                            <span className="order-meta-lbl">Order ID</span>
                            <span className="order-meta-val" style={{ fontFamily: "monospace", fontSize: "12px" }}>{order.id}</span>
                          </div>
                          <div className="order-meta-item">
                            <span className="order-meta-lbl">Placed On</span>
                            <span className="order-meta-val">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="order-meta-item">
                            <span className="order-meta-lbl">Total Amount</span>
                            <span className="order-meta-val" style={{ color: "var(--brand)" }}>₹{order.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="order-meta-item">
                            <span className="order-meta-lbl">Dispatch City</span>
                            <span className="order-meta-val">{order.address?.city || "Info Saved"}</span>
                          </div>
                        </div>
                        <div>
                          <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                        </div>
                      </div>

                      <div className="order-body-premium">
                        {/* Interactive tracking progress line */}
                        <div className="order-timeline-container">
                          <div className="order-timeline">
                            <div
                              className="order-timeline-progress"
                              style={{
                                width:
                                  order.status === "Delivered"
                                    ? "100%"
                                    : order.status === "Shipped"
                                    ? "50%"
                                    : "0%"
                              }}
                            ></div>
                            <div className="order-timeline-step active">
                              <div className="order-timeline-dot"></div>
                              <span className="order-timeline-step-name">Placed</span>
                            </div>
                            <div className={`order-timeline-step ${order.status === "Shipped" || order.status === "Delivered" ? "active" : ""}`}>
                              <div className="order-timeline-dot"></div>
                              <span className="order-timeline-step-name">Shipped</span>
                            </div>
                            <div className={`order-timeline-step ${order.status === "Delivered" ? "active" : ""}`}>
                              <div className="order-timeline-dot"></div>
                              <span className="order-timeline-step-name">Delivered</span>
                            </div>
                          </div>
                        </div>

                        {/* Collapsible toggle */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="btn btn-secondary"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "0.4rem 0.8rem",
                              fontSize: "12px"
                            }}
                          >
                            {expandedOrder === order.id ? (
                              <>
                                Hide Ordered Items <FiChevronUp size={14} />
                              </>
                            ) : (
                              <>
                                View Ordered Items <FiChevronDown size={14} />
                              </>
                            )}
                          </button>
                        </div>

                        {expandedOrder === order.id && (
                          <div className="order-items-grid" style={{ marginTop: "var(--spacing-lg)", paddingTop: "var(--spacing-md)", borderTop: "1px solid var(--surface-border)" }}>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="order-item-row">
                                <img
                                  src={item.imageUrl || "/placeholder.png"}
                                  alt={item.name}
                                  className="order-item-thumb"
                                />
                                <div className="order-item-info">
                                  <div className="order-item-name">{item.name}</div>
                                  <div className="order-item-qty">Quantity: {item.qty}</div>
                                </div>
                                <div className="order-item-total">
                                  ₹{(item.price * item.qty).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="fade-in">
              <div className="profile-section-header">
                <div>
                  <h3 className="profile-section-title">
                    <FiHeart size={20} color="var(--brand)" /> My Wishlist
                  </h3>
                  <p className="profile-section-desc" style={{ margin: 0 }}>
                    Keep tabs on your favorite products and catalog items.
                  </p>
                </div>
              </div>

              {loadingWishlist ? (
                <div className="empty-state" style={{ minHeight: "250px" }}>
                  <span className="spinner"></span>
                  <p>Reading wishlist...</p>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="empty-state" style={{ padding: "var(--spacing-xl) 0", minHeight: "300px" }}>
                  <FiHeart size={48} style={{ color: "var(--muted)", marginBottom: "12px" }} />
                  <h4>Wishlist is empty</h4>
                  <p>Add products to your wishlist by clicking the heart badge in the shop.</p>
                  <Link to="/shop" className="btn btn-primary" style={{ marginTop: "var(--spacing-sm)", borderRadius: "var(--radius-full)" }}>
                    Shop Products
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="wishlist-count-info">
                    <FiInfo size={16} /> You have <strong>{wishlist.length}</strong> items saved in your wishlist
                  </div>
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
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Account Deletion Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Account Permanently"
        message="Are you absolutely sure? This action is permanent. All orders, wishlists, and shipping profiles will be deleted, and you will be signed out."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Confirm Delete"
      />

      {/* Address Addition Modal */}
      {showAddressModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-container">
            <div className="profile-modal-header">
              <h3 className="profile-modal-title">Add New Address</h3>
              <div className="profile-modal-close" onClick={() => setShowAddressModal(false)}>
                <FiX size={18} />
              </div>
            </div>
            <form onSubmit={handleAddAddressSubmit}>
              <div className="profile-modal-body" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>Address Label (e.g. Home, Work)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vacation Cabin"
                    value={addressName}
                    onChange={(e) => setAddressName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      backgroundColor: "var(--muted-background)",
                      border: "1px solid var(--surface-border)",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--text-sm)"
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>Street Details</label>
                  <input
                    type="text"
                    placeholder="123 Ocean Blvd, Apt 2"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      backgroundColor: "var(--muted-background)",
                      border: "1px solid var(--surface-border)",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--text-sm)"
                    }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>City</label>
                    <input
                      type="text"
                      placeholder="Miami"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        backgroundColor: "var(--muted-background)",
                        border: "1px solid var(--surface-border)",
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "var(--text-sm)"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>Postal Code</label>
                    <input
                      type="text"
                      placeholder="33101"
                      value={addressPostalCode}
                      onChange={(e) => setAddressPostalCode(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        backgroundColor: "var(--muted-background)",
                        border: "1px solid var(--surface-border)",
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "var(--text-sm)"
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>Country</label>
                  <input
                    type="text"
                    placeholder="United States"
                    value={addressCountry}
                    onChange={(e) => setAddressCountry(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      backgroundColor: "var(--muted-background)",
                      border: "1px solid var(--surface-border)",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--text-sm)"
                    }}
                  />
                </div>
              </div>
              <div className="profile-modal-footer">
                <button type="button" onClick={() => setShowAddressModal(false)} className="btn btn-ghost" style={{ padding: "0.5rem 1rem" }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 1.2rem", borderRadius: "var(--radius-full)" }}>
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
