import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, addToCart } from "../redux/cartSlice";
import { FiMinus, FiPlus, FiTrash2, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { FaCcVisa, FaCcMastercard, FaCcApplePay, FaCcPaypal } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";
import "../styles/cart.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25; // Free shipping over $500
  const estimatedTax = subtotal * 0.08; // 8% sales tax estimation
  const total = subtotal - discount + shipping + estimatedTax;

  const handleUpdateQty = (item, newQty) => {
    if (newQty <= 0) {
      dispatch(removeFromCart(item.productId));
      return;
    }
    if (newQty > item.stock) {
      toast.error(`Only ${item.stock} items are in stock.`);
      return;
    }
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.toUpperCase() === "NEST10") {
      setDiscount(subtotal * 0.1);
      toast.success("Promo code NEST10 applied! 10% discount subtracted.");
    } else {
      toast.error("Invalid coupon code. Try NEST10!");
    }
  };

  return (
    <div className="fade-in">
      <div style={{ borderBottom: "1px solid var(--surface-border)", paddingBottom: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Your Shopping Bag</h1>
        <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>Review items in your cart and proceed to checkout.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state card">
          <FiShoppingCart size={48} />
          <h3>Your shopping cart is empty</h3>
          <p>You haven't added any products to your bag yet.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: "var(--spacing-md)" }}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart items list */}
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item-card">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-item-img"
                />
                
                <div className="cart-item-details">
                  <Link to={`/product/${item.productId}`}>
                    <h4 className="cart-item-title">{item.name}</h4>
                  </Link>
                  <span className="cart-item-meta">Unit Price: ${item.price.toLocaleString()}</span>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-item-qty">
                    <button
                      onClick={() => handleUpdateQty(item, item.qty - 1)}
                      className="cart-drawer-qty-btn"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="cart-drawer-qty-val">{item.qty}</span>
                    <button
                      onClick={() => handleUpdateQty(item, item.qty + 1)}
                      className="cart-drawer-qty-btn"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>

                  <span className="cart-item-price">${(item.price * item.qty).toLocaleString()}</span>

                  <button
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    className="cart-item-remove"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout summary panel */}
          <div className="summary-panel">
            <h3 className="summary-title" style={{ margin: 0 }}>Order Summary</h3>
            
            <form onSubmit={handleApplyCoupon} className="coupon-field">
              <input
                type="text"
                placeholder="Promo Code (NEST10)"
                className="form-input"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                style={{ padding: "0.5rem 0.75rem" }}
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>
                Apply
              </button>
            </form>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row" style={{ color: "var(--success-text)" }}>
                  <span>Discount (10%)</span>
                  <span>-${discount.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax (8%)</span>
                <span>${estimatedTax.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Checkout <FiArrowRight size={14} style={{ marginLeft: "4px" }} />
            </button>

            <div style={{ display: "flex", justifyContent: "center", gap: "var(--spacing-sm)", color: "var(--muted)", marginTop: "var(--spacing-xs)" }}>
              <FaCcVisa size={24} />
              <FaCcMastercard size={24} />
              <FaCcApplePay size={24} />
              <FaCcPaypal size={24} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
