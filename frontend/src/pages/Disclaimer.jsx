const Disclaimer = () => {
  return (
    <div className="card fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2
        style={{
          color: "var(--foreground)",
          marginBottom: "var(--spacing-md)",
          borderBottom: "1px solid var(--surface-border)",
          paddingBottom: "var(--spacing-sm)",
          fontSize: "var(--text-xxl)",
          fontWeight: "var(--weight-bold)",
        }}
      >
        Legal & Site Disclaimer
      </h2>

      <p style={{ color: "var(--muted)", marginBottom: "var(--spacing-md)", lineHeight: "1.7", fontSize: "var(--text-sm)" }}>
        The data, interfaces, and graphical components represented across the
        ShopNest domain strictly act uniquely as an educational development
        platform. This codebase models rigorous application structures and
        architectures for purely demonstrative, portfolio-oriented engineering
        usage.
      </p>

      <h4 style={{ color: "var(--brand)", marginTop: "var(--spacing-lg)", marginBottom: "var(--spacing-xs)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-base)" }}>
        1. Accuracy of Materials
      </h4>
      <p style={{ color: "var(--muted)", marginBottom: "var(--spacing-sm)", lineHeight: "1.7", fontSize: "var(--text-sm)" }}>
        The materials spanning the ShopNest interface may heavily include
        dynamic technical, typographical, or dummy photographic elements.
        Product matrices mapped in the DB pipeline do absolutely not correlate
        to strictly real physical outputs and are safely populated via generic
        Unsplash imagery protocols.
      </p>

      <h4 style={{ color: "var(--brand)", marginTop: "var(--spacing-lg)", marginBottom: "var(--spacing-xs)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-base)" }}>
        2. Payment Processing Restrictions
      </h4>
      <p style={{ color: "var(--muted)", marginBottom: "var(--spacing-sm)", lineHeight: "1.7", fontSize: "var(--text-sm)" }}>
        No authentic financial variables are handled natively within this
        environment. All payment endpoints forcefully bind exclusively to
        external testing-based networks (Sandbox Razorpay environments). No
        exact deductibles exist.
      </p>

      <h4 style={{ color: "var(--brand)", marginTop: "var(--spacing-lg)", marginBottom: "var(--spacing-xs)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-base)" }}>
        3. External Binding Links
      </h4>
      <p style={{ color: "var(--muted)", marginBottom: "var(--spacing-sm)", lineHeight: "1.7", fontSize: "var(--text-sm)" }}>
        ShopNest operates completely independent domains and takes strictly zero
        absolute parameter responsibility over the specific contents or
        behaviors populated via external routing anchors generated implicitly by
        third-party configurations.
      </p>

      <p style={{ marginTop: "var(--spacing-lg)", fontStyle: "italic", fontSize: "var(--text-xs)", color: "var(--muted)" }}>
        By interacting natively within this codebase, you unconditionally signal
        acceptance bounded by these parameters efficiently.
      </p>
    </div>
  );
};

export default Disclaimer;
