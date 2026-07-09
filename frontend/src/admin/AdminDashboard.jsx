import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axiosInstance from "../utils/axiosInstance";
import { FiTrendingUp, FiShoppingBag, FiBox, FiUsers, FiDollarSign } from "react-icons/fi";
import "../styles/admin.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/analytics");
        setStats(res.data);
      } catch (error) {
        setStats({
          totalOrders: 0,
          totalProducts: 0,
          totalUsers: 0,
          totalRevenue: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="empty-state">
        <span className="spinner"></span>
        <p>Loading analytics metrics...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout fade-in">
      <AdminSidebar />
      
      <main className="admin-content-area">
        <div className="admin-header-row">
          <div>
            <h1 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Dashboard Overview</h1>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
              Welcome back, {user?.name}. Here's the store health today.
            </p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="kpi-label">Total Revenue</span>
              <FiDollarSign size={16} style={{ color: "var(--brand)" }} />
            </div>
            <span className="kpi-val">${stats?.totalRevenue ? stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</span>
            <div className="kpi-trend up">
              <FiTrendingUp size={12} /> +12.5% <span style={{ color: "var(--muted)" }}>vs last month</span>
            </div>
          </div>

          <div className="kpi-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="kpi-label">Total Orders</span>
              <FiShoppingBag size={16} style={{ color: "var(--brand)" }} />
            </div>
            <span className="kpi-val">{stats?.totalOrders || 0}</span>
            <div className="kpi-trend up">
              <FiTrendingUp size={12} /> +8.1% <span style={{ color: "var(--muted)" }}>vs last month</span>
            </div>
          </div>

          <div className="kpi-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="kpi-label">Active Products</span>
              <FiBox size={16} style={{ color: "var(--brand)" }} />
            </div>
            <span className="kpi-val">{stats?.totalProducts || 0}</span>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>In Catalog</div>
          </div>

          <div className="kpi-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="kpi-label">Total Customers</span>
              <FiUsers size={16} style={{ color: "var(--brand)" }} />
            </div>
            <span className="kpi-val">{stats?.totalUsers || 0}</span>
            <div className="kpi-trend up">
              <FiTrendingUp size={12} /> +15.2% <span style={{ color: "var(--muted)" }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Visual Charts Mock Card */}
        <div className="card" style={{ padding: "var(--spacing-lg)" }}>
          <h3 style={{ margin: 0, fontSize: "var(--text-base)", marginBottom: "var(--spacing-md)" }}>Monthly Sales Performance</h3>
          <div style={{ height: "180px", display: "flex", alignItems: "flex-end", gap: "var(--spacing-md)", borderBottom: "1px solid var(--surface-border)", borderLeft: "1px solid var(--surface-border)", padding: "var(--spacing-md)" }}>
            {[40, 55, 45, 60, 75, 65, 80, 95].map((h, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: "rgba(59, 130, 246, 0.15)", border: "1px solid var(--brand)", height: `${h}%`, borderTopLeftRadius: "4px", borderTopRightRadius: "4px", position: "relative" }} className="flex-center">
                <span style={{ fontSize: "9px", position: "absolute", top: "-18px", color: "var(--muted)" }}>${(h * 120).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--muted)", marginTop: "4px" }}>
            <span>Oct 1</span>
            <span>Oct 5</span>
            <span>Oct 10</span>
            <span>Oct 15</span>
            <span>Oct 20</span>
            <span>Oct 25</span>
            <span>Oct 28</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
