import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--surface-border)",
        padding: "var(--spacing-xl) 0",
        marginTop: "var(--spacing-xxl)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--spacing-md)",
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontWeight: "var(--weight-bold)", color: "var(--foreground)" }}>ShopNest</h4>
          <p style={{ color: "var(--muted)", fontSize: "var(--text-sm)", margin: 0, marginTop: "var(--spacing-xs)" }}>
            High-performance, premium tech storefront.
          </p>
        </div>

        <div style={{ display: "flex", gap: "var(--spacing-lg)" }}>
          <Link to="/shop" style={{ color: "var(--muted)", fontSize: "var(--text-sm)" }} className="navbar-link">
            Shop Products
          </Link>
          <Link to="/return" style={{ color: "var(--muted)", fontSize: "var(--text-sm)" }} className="navbar-link">
            Return Policy
          </Link>
          <Link to="/disclaimer" style={{ color: "var(--muted)", fontSize: "var(--text-sm)" }} className="navbar-link">
            Disclaimer
          </Link>
        </div>

        <div style={{ color: "var(--muted)", fontSize: "var(--text-xs)" }}>
          &copy; {new Date().getFullYear()} ShopNest. Built with pride.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
