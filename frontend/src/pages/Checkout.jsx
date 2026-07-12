import { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import { clearCart } from "../redux/cartSlice";
import axiosInstance from "../utils/axiosInstance";
import { FiMapPin, FiCreditCard, FiArrowLeft } from "react-icons/fi";
import "../styles/cart.css";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(1); // 1 = Address, 2 = Payment

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/shop");
    }
  }, [cartItems, navigate]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      street: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      postalCode: Yup.string().required("Postal/ZIP code is required"),
      country: Yup.string().required("Country is required"),
    }),
    onSubmit: (values) => {
      if (!user) {
        toast.error("Please log in to proceed.");
        navigate("/login");
        return;
      }
      setActiveStep(2); // Proceed to payment selection
    },
  });

  const handleRazorpayPayment = async () => {
    try {
      // Create Razorpay payment order on backend
      const res = await axiosInstance.post("/payment/order", { amount: total });
      const { order: orderData, keyId } = res.data;

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopNest",
        description: "Premium Tech Purchase",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Verify signature on backend
            await axiosInstance.post("/payment/verify", response);

            // Save order inside database
            await axiosInstance.post("/orders", {
              items: cartItems,
              totalAmount: total,
              address: formik.values,
              paymentId: response.razorpay_payment_id,
            });

            dispatch(clearCart());
            toast.success("Payment verified! Order placed.");
            navigate("/ordersuccess");
          } catch (err) {
            toast.error("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: formik.values.fullName,
          email: user?.email,
          contact: "9999999999",
        },
        theme: {
          color: "#3b82f6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay initiation failed:", error);
      const message = error?.status?.message || error?.message || "Failed to initiate payment. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="fade-in">
      <div className="checkout-stepper">
        <div className={`checkout-step ${activeStep >= 1 ? "active" : ""} ${activeStep > 1 ? "completed" : ""}`}>
          <div className="checkout-step-num">1</div>
          <span>Shipping</span>
        </div>
        <div className={`checkout-step ${activeStep >= 2 ? "active" : ""}`}>
          <div className="checkout-step-num">2</div>
          <span>Payment</span>
        </div>
      </div>

      <div className="cart-layout">
        {/* Step Panels */}
        <div className="card">
          {activeStep === 1 ? (
            <form onSubmit={formik.handleSubmit} className="auth-form" style={{ gap: "var(--spacing-md)" }}>
              <div className="checkout-section-title">
                <FiMapPin /> Shipping Details
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  className="form-input"
                  placeholder="Enter Full Name"
                  {...formik.getFieldProps("fullName")}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="form-error">{formik.errors.fullName}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="street">Street Address</label>
                <input
                  id="street"
                  type="text"
                  className="form-input"
                  placeholder="Enter Street Address"
                  {...formik.getFieldProps("street")}
                />
                {formik.touched.street && formik.errors.street && (
                  <div className="form-error">{formik.errors.street}</div>
                )}
              </div>

              <div className="grid-responsive" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    className="form-input"
                    placeholder="Enter City"
                    {...formik.getFieldProps("city")}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <div className="form-error">{formik.errors.city}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="postalCode">Postal Code</label>
                  <input
                    id="postalCode"
                    type="text"
                    className="form-input"
                    placeholder="Enter Postal/ZIP code"
                    {...formik.getFieldProps("postalCode")}
                  />
                  {formik.touched.postalCode && formik.errors.postalCode && (
                    <div className="form-error">{formik.errors.postalCode}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  className="form-input"
                  placeholder="Enter Country"
                  {...formik.getFieldProps("country")}
                />
                {formik.touched.country && formik.errors.country && (
                  <div className="form-error">{formik.errors.country}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--spacing-sm)" }}>
                Continue to Payment
              </button>
            </form>
          ) : (
            <div className="auth-form" style={{ gap: "var(--spacing-md)" }}>
              <div className="checkout-section-title">
                <FiCreditCard /> Payment Selection
              </div>

              <p style={{ fontSize: "var(--text-sm)", color: "var(--muted)", margin: 0 }}>
                We support secure transactions via Razorpay. Click pay to open the secure payment sheet.
              </p>

              <div style={{ padding: "var(--spacing-md)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--muted-background)" }}>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", marginBottom: "var(--spacing-xs)" }}>
                  Shipping Address
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", lineHeight: 1.4 }}>
                  {formik.values.fullName}<br />
                  {formik.values.street}, {formik.values.city}<br />
                  {formik.values.postalCode}, {formik.values.country}
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
                <button onClick={() => setActiveStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>
                  <FiArrowLeft size={14} /> Back
                </button>
                <button onClick={handleRazorpayPayment} className="btn btn-primary" style={{ flex: 2 }}>
                  Pay Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Items Summary */}
        <div className="summary-panel">
          <h3 className="summary-title" style={{ margin: 0 }}>Order Items</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", maxHeight: "240px", overflowY: "auto" }}>
            {cartItems.map((item) => (
              <div key={item.productId} style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "center" }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--surface-border)" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>{item.name}</div>
                  <div style={{ fontSize: "10px", color: "var(--muted)" }}>Qty: {item.qty}</div>
                </div>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)" }}>
                  ₹{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Items Total</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div className="summary-row">
              <span>Sales Tax (8%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total Price</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
