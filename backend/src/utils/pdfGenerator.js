const puppeteer = require("puppeteer");

/**
 * Generates a PDF invoice for a given order and user.
 * @param {Object} order - The Order database object/data
 * @param {Object} user - The User database object/data
 * @returns {Promise<Buffer>} - Resolves to the PDF buffer
 */
const generateInvoicePdf = async (order, user) => {
  const items = order.items || [];
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = Number(order.totalAmount || (subtotal + shipping + tax));
  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const address = order.address || {};
  const street = address.street || "";
  const city = address.city || "";
  const postalCode = address.postalCode || "";
  const country = address.country || "";
  const fullName = address.fullName || user.name || "Customer";

  const itemRows = items.map((item, idx) => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: left;">${idx + 1}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: left; font-weight: 500; color: #1e293b;">${item.name || 'Product'}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: right;">₹${Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.qty}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 500; color: #1e293b;">₹${Number(item.price * item.qty).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
    </tr>
  `).join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${order.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 40px;
          color: #334155;
          background-color: #ffffff;
          line-height: 1.5;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 24px;
          margin-bottom: 30px;
        }
        .brand {
          font-size: 28px;
          font-weight: 700;
          color: #10b981;
          letter-spacing: -0.5px;
        }
        .brand span {
          color: #0f172a;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h1 {
          margin: 0;
          font-size: 24px;
          color: #0f172a;
          font-weight: 700;
        }
        .invoice-title p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #64748b;
        }
        .details-grid {
          display: flex;
          justify-content: space-between;
          margin-bottom: 35px;
          gap: 40px;
        }
        .details-col {
          flex: 1;
        }
        .details-col h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          font-weight: 600;
        }
        .details-col p {
          margin: 0 0 6px 0;
          font-size: 14px;
          color: #0f172a;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background-color: #f8fafc;
          padding: 12px 8px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          color: #64748b;
          border-bottom: 2px solid #e2e8f0;
        }
        .summary-container {
          display: flex;
          justify-content: flex-end;
        }
        .summary-table {
          width: 300px;
          margin-bottom: 0;
        }
        .summary-table td {
          padding: 8px 0;
          font-size: 14px;
          color: #64748b;
          border-bottom: 1px solid #f1f5f9;
        }
        .summary-table td.amount {
          text-align: right;
          color: #0f172a;
          font-weight: 500;
        }
        .summary-table tr.total-row td {
          border-bottom: none;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          padding-top: 15px;
        }
        .summary-table tr.total-row td.amount {
          color: #10b981;
        }
        .footer {
          margin-top: 60px;
          border-top: 1px solid #f1f5f9;
          padding-top: 20px;
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 30px;">
        <div>
          <div class="brand">Shop<span>Nest</span></div>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b;">
            123 E-commerce Boulevard<br>
            Bangalore, Karnataka - 560001<br>
            support@shopnest.com
          </p>
        </div>
        <div style="text-align: right;">
          <h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 700;">INVOICE</h1>
          <p style="margin: 4px 0 0; font-size: 14px; color: #64748b;">Order ID: #${order.id}</p>
          <p style="margin: 4px 0 0; font-size: 14px; color: #64748b;">Date: ${formattedDate}</p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 35px; gap: 40px;">
        <div class="details-col">
          <h3>Billed & Shipped To</h3>
          <p><strong>${fullName}</strong></p>
          <p>${street}</p>
          <p>${city}, ${postalCode}</p>
          <p>${country}</p>
          <p style="margin-top: 8px;"><strong>Email:</strong> ${user.email}</p>
        </div>
        <div class="details-col" style="text-align: right;">
          <h3>Payment Details</h3>
          <p><strong>Method:</strong> Online Payment</p>
          ${order.paymentId ? `<p><strong>Transaction ID:</strong> ${order.paymentId}</p>` : ''}
          <p><strong>Status:</strong> Paid</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 5%; text-align: left;">#</th>
            <th style="width: 50%; text-align: left;">Item</th>
            <th style="width: 15%; text-align: right;">Unit Price</th>
            <th style="width: 10%; text-align: center;">Qty</th>
            <th style="width: 20%; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <div class="summary-container">
        <table class="summary-table">
          <tr>
            <td>Subtotal</td>
            <td class="amount">₹${Number(subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>Shipping</td>
            <td class="amount">${shipping === 0 ? 'Free' : `₹${Number(shipping).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</td>
          </tr>
          <tr>
            <td>Tax (8%)</td>
            <td class="amount">₹${Number(tax).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr class="total-row">
            <td>Grand Total</td>
            <td class="amount">₹${Number(total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        <p>Thank you for shopping with ShopNest!</p>
        <p>If you have any questions about this invoice, please contact support.</p>
      </div>
    </body>
    </html>
  `;

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new"
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px"
      }
    });
    return pdfBuffer;
  } catch (error) {
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = {
  generateInvoicePdf
};
