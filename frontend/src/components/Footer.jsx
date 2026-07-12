import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { toast } from "react-hot-toast";
import "../styles/footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col">
            <Link to="/" className="footer-logo-link">
              <img src="/ShopNestLogo.png" alt="ShopNest" className="footer-logo-img" />
              <span className="footer-brand-name">ShopNest</span>
            </Link>
            <p className="footer-description">
              High-performance, premium tech storefront. Elevating your digital lifestyle with handpicked hardware.
            </p>
            <div className="footer-social-list">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="YouTube"
              >
                <FaYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Pages */}
          <div className="footer-col">
            <h4 className="footer-col-title">Shop Pages</h4>
            <ul className="footer-links">
              <li>
                <Link to="/shop" className="footer-link">Shop Products</Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">My Cart</Link>
              </li>
              <li>
                <Link to="/checkout" className="footer-link">Checkout</Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link">My Account</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links">
              <li>
                <Link to="/return" className="footer-link">Return Policy</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="footer-link">Disclaimer</Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="footer-link">Register</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col">
            <h4 className="footer-col-title">Stay Updated</h4>
            <p className="footer-newsletter-text">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleSubscribe} className="footer-newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="footer-newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="footer-newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright and payment badges */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} ShopNest. All rights reserved. Designed with precision.
          </p>
          <div className="footer-payment-icons">
            {/* Visa */}
            <div className="footer-payment-badge" title="Visa">
              <svg viewBox="0 0 24 16" width="34" height="20">
                <rect width="24" height="16" rx="2" fill="#1A1F71" />
                <path
                  d="M10.1 11.2h1.6l1-6.1h-1.6zm4.9-6.1c-.3 0-.6.1-.8.4l-2.4 5.7h1.7l.3-.9h2.1l.2.9h1.5l-1.3-6.1zm-.8 3.9l.7-2 1 2zm-9.3-3.9h-1.6L2 9.5l.2-.9c.9-.2 1.6-.6 2.2-1.3l.5 3.9zm-2.8 6.1l.1-.3C3 10.6 3 9.4 3 8.3L3.8 5.1h1.7l-2.6 6.1z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>
            {/* Mastercard */}
            <div className="footer-payment-badge" title="Mastercard">
              <svg viewBox="0 0 24 16" width="34" height="20">
                <rect width="24" height="16" rx="2" fill="#0A0A0A" />
                <circle cx="9.5" cy="8" r="5.5" fill="#EB001B" />
                <circle cx="14.5" cy="8" r="5.5" fill="#F79E1B" fillOpacity="0.8" />
              </svg>
            </div>
            {/* PayPal */}
            <div className="footer-payment-badge" title="PayPal">
              <svg viewBox="0 0 24 16" width="34" height="20">
                <rect width="24" height="16" rx="2" fill="#003087" />
                <path
                  d="M8.5 4.5h3.8c1.3 0 2.2.3 2.7.9.5.5.6 1.3.4 2.2-.3 1.6-1.4 2.7-3.1 2.7H10l-.8 4.2H7.6l2.1-10zm2.9 4c.8 0 1.3-.4 1.5-1.1.1-.6 0-1-.3-1.2-.2-.2-.6-.3-1.1-.3H9.8l-.5 2.6h1.7z"
                  fill="#0079C1"
                />
                <path
                  d="M10.5 6.5h3.8c1.3 0 2.2.3 2.7.9.5.5.6 1.3.4 2.2-.3 1.6-1.4 2.7-3.1 2.7H12l-.8 4.2H9.6l2.1-10zm2.9 4c.8 0 1.3-.4 1.5-1.1.1-.6 0-1-.3-1.2-.2-.2-.6-.3-1.1-.3H11.8l-.5 2.6h1.7z"
                  fill="#00457C"
                  opacity="0.6"
                />
              </svg>
            </div>
            {/* Apple Pay */}
            <div className="footer-payment-badge" title="Apple Pay">
              <svg viewBox="0 0 24 16" width="34" height="20">
                <rect width="24" height="16" rx="2" fill="#FFFFFF" stroke="#D3D3D3" strokeWidth="0.5" />
                <path
                  d="M6.2 9.5c-.3.4-.6.8-1 1.1c-.2-.1-.5-.2-.7-.2c-.3 0-.6.1-.8.3C3.5 10.9 3.2 11.2 3 11.6c-.2.4-.3.8-.3 1.2c0 .6.2 1.1.6 1.4c.4.3.9.5 1.4.5c.5 0 .9-.1 1.3-.4c.4-.3.7-.7.9-1.2h.1l.1.5c.1.3.3.5.5.6c.2.1.4.2.7.2c.4 0 .7-.1.9-.4c.2-.3.3-.7.3-1.2v-2.3h-1.3v.6zm-.9 2.5c-.2.2-.4.3-.6.3c-.2 0-.3-.1-.4-.2c-.1-.1-.1-.3-.1-.5c0-.4.1-.7.4-.9c.2-.2.5-.3.8-.3v1.6zm6.3-2.5h-1.3l.8 3.9h1.3zm3-1.5c-.4 0-.8.1-1.2.3c-.4.2-.7.5-.9.9h-.1v-.9h-1.2v5.1h1.3v-2.1c0-.4.1-.7.3-1c.2-.2.5-.3.8-.3c.4 0 .7.3.7.8v2.6h1.3V10c0-.6-.1-1.1-.4-1.5c-.3-.3-.8-.5-1.4-.5zm4.8 1.5l-1.3 4h-.1l-1.3-4h-1.4l2.1 5.4l-1.3 3.1h1.4l3.1-8.5z"
                  fill="#000000"
                />
                <path
                  d="M8.2 6.8c.2-.3.4-.7.4-1.2c0-.5-.2-.9-.4-1.2c-.2-.3-.6-.5-1-.5c-.4 0-.8.2-1 .5c-.2.3-.4.7-.4 1.2c0 .5.2.9.4 1.2c.2.3.6.5 1 .5c.4 0 .8-.2 1-.5z"
                  fill="#000000"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

