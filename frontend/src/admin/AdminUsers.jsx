import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import ConfirmModal from "../components/ConfirmModal";
import axiosInstance from "../utils/axiosInstance";
import { FiUsers, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import "../styles/admin.css";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);

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

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await axiosInstance.delete(`/auth/users/${userToDelete}`);
      setUsers(users.filter((u) => u.id !== userToDelete));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setUserToDelete(null);
    }
  };

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
                    <th>Actions</th>
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
                      <td>
                        <button
                          onClick={() => setUserToDelete(u.id)}
                          className="btn btn-outline"
                          style={{
                            padding: "0.25rem 0.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            borderColor: "var(--danger)",
                            color: "var(--danger)",
                          }}
                          disabled={u.id === user?.id}
                          title={u.id === user?.id ? "Cannot delete yourself" : "Delete User"}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={!!userToDelete}
        title="Delete User"
        message="Are you sure you want to permanently delete this user account? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
        confirmText="Delete User"
      />
    </div>
  );
};

export default AdminUsers;
