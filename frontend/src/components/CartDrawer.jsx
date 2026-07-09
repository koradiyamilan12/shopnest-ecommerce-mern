import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/cartSlice';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi';

const CartDrawer = ({ isOpen, onClose }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleQtyChange = (item, newQty) => {
    if (newQty <= 0) {
      dispatch(removeFromCart(item.productId));
      return;
    }
    if (newQty > item.stock) {
      return; // Cannot exceed stock
    }
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose} />
      <div className="cart-drawer fade-in">
        <div className="cart-drawer-header">
          <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Your Cart ({cartItems.length})</h3>
          <button onClick={onClose} className="navbar-icon-btn">
            <FiX size={20} />
          </button>
        </div>

        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div className="empty-state" style={{ height: '100%' }}>
              <FiShoppingCart size={40} />
              <h4>Your cart is empty</h4>
              <p>Explore our premium devices and add them here!</p>
              <Link to="/shop" onClick={onClose} className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
                Browse Products
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-drawer-item" key={item.productId}>
                <img src={item.imageUrl} alt={item.name} className="cart-drawer-img" />
                <div className="cart-drawer-details">
                  <div>
                    <div className="cart-drawer-title">{item.name}</div>
                    <div className="cart-drawer-qty-control" style={{ marginTop: 'var(--spacing-xs)' }}>
                      <button
                        onClick={() => handleQtyChange(item, item.qty - 1)}
                        className="cart-drawer-qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="cart-drawer-qty-val">{item.qty}</span>
                      <button
                        onClick={() => handleQtyChange(item, item.qty + 1)}
                        className="cart-drawer-qty-btn"
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)' }}>
                      ${(item.price * item.qty).toLocaleString()}
                    </span>
                    <button
                      onClick={() => dispatch(removeFromCart(item.productId))}
                      style={{ color: 'var(--muted)', cursor: 'pointer' }}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-summary">
              <div className="flex-between">
                <span style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>Subtotal</span>
                <span style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-base)' }}>
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 'var(--spacing-xs)', margin: 0 }}>
                Shipping and taxes calculated at checkout.
              </p>
            </div>
            <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%' }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
