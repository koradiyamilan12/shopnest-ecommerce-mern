import { Link } from "react-router-dom";
import { FiCheckCircle, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import "../styles/cart.css";

const OrderSuccess = () => {
  return (
    <div className="fade-in">
      <div className="success-card card">
        <div className="success-icon">
          <FiCheckCircle />
        </div>
        <h2 className="success-title">Order Placed Successfully!</h2>
        <p className="success-desc">
          Thank you for choosing ShopNest. We have securely processed your transaction. 
          A confirmation email has been dispatched with your receipt details.
        </p>

        <div className="success-details">
          <div className="success-detail-row">
            <span className="success-detail-label">Status</span>
            <span className="success-detail-val" style={{ color: "var(--success)" }}>Paid & Confirmed</span>
          </div>
          <div className="success-detail-row">
            <span className="success-detail-label">Delivery Schedule</span>
            <span className="success-detail-val">3 - 5 Business Days</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "var(--spacing-md)", width: "100%" }}>
          <Link to="/profile" className="btn btn-secondary" style={{ flex: 1 }}>
            <FiShoppingBag size={14} /> Track Orders
          </Link>
          <Link to="/shop" className="btn btn-primary" style={{ flex: 1 }}>
            Shop More <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
