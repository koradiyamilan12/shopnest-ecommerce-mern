import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axiosInstance from "../utils/axiosInstance";
import { FiUsers } from "react-icons/fi";
import "../styles/admin.css";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/auth/users");
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user, navigate]);

  return (
    <div className="admin-layout fade-in">
      <AdminSidebar />

      <main className="admin-content-area">
        <div className="admin-header-row">
          <div>
            <h1 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>User Directory</h1>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
              Directory list of all registered platform user accounts.
            </p>
          </div>
        </div>

        <div className="admin-card-table">
          <div className="table-header">
            <span style={{ fontWeight: "var(--weight-semibold)" }}>Total Accounts ({users.length})</span>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div className="empty-state">
                <span className="spinner"></span>
                <p>Loading users database...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <FiUsers size={32} />
                <h4>No users found</h4>
                <p>Register standard accounts to populate directory.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Account Role</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: "var(--weight-semibold)", fontSize: "var(--text-xs)", color: "var(--muted)" }}>
                        {String(u.id).substring(0, 8)}...
                      </td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={u.role === "admin" ? "badge badge-warning" : "badge badge-success"}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
