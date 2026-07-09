const ReturnPolicy = () => {
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
        Return & Refund Policy
      </h2>

      <p style={{ color: "var(--muted)", marginBottom: "var(--spacing-md)", lineHeight: "1.7", fontSize: "var(--text-sm)" }}>
        At ShopNest, we proudly stand behind the quality of our merchandise. If
        for any reason you are completely dissatisfied with your purchase, you
        may securely initiate a return within 30 days of receiving your order.
      </p>

      <h4 style={{ color: "var(--brand)", marginTop: "var(--spacing-lg)", marginBottom: "var(--spacing-xs)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-base)" }}>
        1. Eligibility for Returns
      </h4>
      <p style={{ color: "var(--muted)", marginBottom: "var(--spacing-sm)", lineHeight: "1.7", fontSize: "var(--text-sm)" }}>
        To be eligible for a return, the item must be completely unused, housed
        in the same absolute condition that it was received, and maintained
        within its original factory packaging. Receipts or proof of purchase
        mappings are strictly required.
      </p>

      <h4 style={{ color: "var(--brand)", marginTop: "var(--spacing-lg)", marginBottom: "var(--spacing-xs)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-base)" }}>
        2. Refund Processing
      </h4>
      <p style={{ color: "var(--muted)", marginBottom: "var(--spacing-sm)", lineHeight: "1.7", fontSize: "var(--text-sm)" }}>
        Once your return is physically received and internally inspected, an
        immediate email protocol will fire notifying you of the approval status.
        Approved refunds will cleanly propagate to your original designated
        Razorpay gateway endpoint within 5-7 business working days naturally.
      </p>

      <h4 style={{ color: "var(--brand)", marginTop: "var(--spacing-lg)", marginBottom: "var(--spacing-xs)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-base)" }}>
        3. Exempted Output Goods
      </h4>
      <p style={{ color: "var(--muted)", marginBottom: "var(--spacing-sm)", lineHeight: "1.7", fontSize: "var(--text-sm)" }}>
        Certain explicit categories such as perishable items, custom software,
        digital media, or physically tampered items are heavily restricted and
        do not qualify for any standard refund sequence.
      </p>

      <h4 style={{ color: "var(--brand)", marginTop: "var(--spacing-lg)", marginBottom: "var(--spacing-xs)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-base)" }}>
        4. Shipping Transit Costs
      </h4>
      <p style={{ color: "var(--muted)", lineHeight: "1.7", fontSize: "var(--text-sm)" }}>
        You will actively remain strictly responsible for covering your own
        outbound logistical shipping rates associated with returning the item.
        Restocking fees may conditionally apply.
      </p>
    </div>
  );
};

export default ReturnPolicy;
