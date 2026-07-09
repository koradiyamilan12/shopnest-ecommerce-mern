import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBox, FiShoppingBag, FiUsers, FiPlusCircle } from "react-icons/fi";
import "../styles/admin.css";

const AdminSidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { label: "Overview", icon: <FiHome size={16} />, path: "/admin" },
    { label: "Manage Products", icon: <FiBox size={16} />, path: "/admin/products" },
    { label: "Manage Orders", icon: <FiShoppingBag size={16} />, path: "/admin/orders" },
    { label: "Users Directory", icon: <FiUsers size={16} />, path: "/admin/users" },
    { label: "Add Product", icon: <FiPlusCircle size={16} />, path: "/admin/add-product" },
  ];

  const isActive = (itemPath) => path === itemPath ? "active" : "";

  return (
    <aside className="admin-sidebar">
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.5rem 1rem", marginBottom: "var(--spacing-md)" }}>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)", color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          ShopNest Console
        </span>
      </div>
      <div className="admin-sidebar-menu">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`admin-menu-item ${isActive(item.path)}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;
