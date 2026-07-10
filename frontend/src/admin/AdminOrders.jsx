import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axiosInstance from "../utils/axiosInstance";
import { FiCalendar, FiShoppingBag, FiTruck } from "react-icons/fi";
import toast from "react-hot-toast";
import "../styles/admin.css";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/orders/${id}/status`, { status });
      setOrders(prev =>
        prev.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
      toast.success(`Order status updated to ${status}`);
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
            <h1 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Order Shipments</h1>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
              Overview and transition status parameters for customer purchases.
            </p>
          </div>
        </div>

        <div className="admin-card-table">
          <div className="table-header">
            <span style={{ fontWeight: "var(--weight-semibold)" }}>Incoming Orders ({orders.length})</span>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div className="empty-state">
                <span className="spinner"></span>
                <p>Loading orders ledger...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <FiShoppingBag size={32} />
                <h4>No orders placed yet</h4>
                <p>Orders submitted by customers will show up here.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Subtotal</th>
                    <th>Order Date</th>
                    <th>Status Transition</th>
                    <th style={{ textAlign: "right" }}>Items Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: "var(--weight-semibold)", fontSize: "var(--text-xs)", color: "var(--muted)" }}>
                        {String(order.id).substring(0, 8)}...
                      </td>
                      <td>{order.userId?.name || "Customer Account"}</td>
                      <td>₹{order.totalAmount.toLocaleString()}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="form-input"
                          style={{
                            padding: "0.4rem 0.5rem",
                            fontSize: "12px",
                            width: "120px",
                            backgroundColor: "var(--muted-background)",
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="btn btn-secondary"
                          style={{ padding: "0.4rem 0.6rem", fontSize: "12px" }}
                        >
                          {expandedOrder === order.id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Expandable Order details list */}
        {expandedOrder && (
          <div className="card fade-in" style={{ padding: "var(--spacing-lg)" }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-base)", marginBottom: "var(--spacing-md)", display: "flex", alignItems: "center", gap: "8px" }}>
              <FiTruck /> Shipping Breakdown: {String(expandedOrder).substring(0, 8)}
            </h3>

            {(() => {
              const matched = orders.find(o => o.id === expandedOrder);
              if (!matched) return null;
              return (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-lg)" }}>
                  <div>
                    <h4 style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase" }}>Purchased Items</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", marginTop: "var(--spacing-xs)" }}>
                      {matched.items.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "center" }}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>{item.name}</div>
                            <div style={{ fontSize: "10px", color: "var(--muted)" }}>Quantity: {item.qty}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ paddingLeft: "var(--spacing-md)", borderLeft: "1px solid var(--surface-border)" }}>
                    <h4 style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase" }}>Delivery Address</h4>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--foreground)", marginTop: "var(--spacing-xs)", lineHeight: 1.5 }}>
                      Name: {matched.address?.fullName || matched.userId?.name}<br />
                      Street: {matched.address?.street || "N/A"}<br />
                      City: {matched.address?.city || "N/A"}, {matched.address?.postalCode || "N/A"}<br />
                      Country: {matched.address?.country || "N/A"}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;
