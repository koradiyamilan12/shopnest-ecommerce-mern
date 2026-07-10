import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axiosInstance from "../utils/axiosInstance";
import { FiTrendingUp, FiShoppingBag, FiBox, FiUsers, FiDollarSign } from "react-icons/fi";
import Chart from "react-apexcharts";
import "../styles/admin.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeMode, setThemeMode] = useState(() => {
    return document.documentElement.getAttribute("data-theme") || "dark";
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      setThemeMode(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

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

  const categories = stats?.monthlySales?.map((item) => item.month) || [];
  const data = stats?.monthlySales?.map((item) => item.revenue) || [];

  const chartSeries = [
    {
      name: "Revenue",
      data: data,
    },
  ];

  const isDark = themeMode === "dark";
  
  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      background: "transparent",
      foreColor: isDark ? "var(--muted)" : "#71717a",
      fontFamily: "var(--font-family)",
    },
    colors: ["#3b82f6"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: isDark ? 0.35 : 0.45,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: isDark ? "var(--surface-border)" : "#e4e4e7",
      strokeDashArray: 4,
      padding: {
        top: 10,
        right: 15,
        bottom: 0,
        left: 15,
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      },
    },
    theme: {
      mode: themeMode,
    },
    tooltip: {
      theme: themeMode,
      y: {
        formatter: (val) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
    },
  };

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

        {/* Visual Charts Card */}
        <div className="card" style={{ padding: "var(--spacing-lg)" }}>
          <h3 style={{ margin: 0, fontSize: "var(--text-base)", marginBottom: "var(--spacing-md)" }}>Monthly Sales Performance</h3>
          <div style={{ minHeight: "350px" }}>
            {stats?.monthlySales && stats.monthlySales.length > 0 ? (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={350}
              />
            ) : (
              <div className="flex-center" style={{ height: "350px", color: "var(--muted)" }}>
                No sales data available to display.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
