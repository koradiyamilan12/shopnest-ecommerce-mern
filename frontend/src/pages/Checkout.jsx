import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import { clearCart } from "../redux/cartSlice";
import { apiUrl, unwrapApiResponse } from "../utils/api";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const handlePayment = async () => {
    try {
      const orderRes = await fetch(apiUrl("/payment/order"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const orderPayload = await orderRes.json();
      const orderData = unwrapApiResponse(orderPayload);

      if (!orderRes.ok) {
        // Razorpay unconfigured exception handler
        const fallback = window.confirm(
          "Razorpay keys unconfigured on backend. Use Student Bypass Mode to place test order?",
        );
        if (fallback) {
          return bypassPayment();
        } else {
          toast.error("Payment could not be initialized.");
          return;
        }
      }

      const options = {
        key: "rzp_test_dummykey123", // Student dummy fallback
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopNest",
        description: "Test Transaction",
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch(apiUrl("/payment/verify"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            const saveOrderRes = await fetch(apiUrl("/orders"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                items: cartItems,
                totalAmount: totalPrice,
                address,
                paymentId: response.razorpay_payment_id,
              }),
            });

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              toast.success("Order placed successfully!");
              navigate("/ordersuccess");
            } else {
              toast.error("We could not save your order. Please try again.");
            }
          } else {
            toast.error("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: "9999999999",
        },
        theme: {
          color: "#f97316",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while processing your payment.");
    }
  };

  const bypassPayment = async () => {
    const saveOrderRes = await fetch(apiUrl("/orders"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        items: cartItems,
        totalAmount: totalPrice,
        address,
        paymentId: createBypassPaymentId(),
      }),
    });
    if (saveOrderRes.ok) {
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate("/ordersuccess");
    } else {
      toast.error("We could not save your order. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in before placing an order.");
      navigate("/login");
      return;
    }
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={address.fullName}
            onChange={(e) =>
              setAddress({ ...address, fullName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Street"
            required
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            required
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Postal Code"
            required
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Country"
            required
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
          />
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn">
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const createBypassPaymentId = () => `bypass_txn_${Date.now()}`;

export default Checkout;
