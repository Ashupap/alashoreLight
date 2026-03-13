"use strict";

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Load .env manually
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (key && !key.startsWith("#") && rest.length) {
        process.env[key.trim()] = rest.join("=").trim();
      }
    });
}

const PORT = process.env.PORT || 5100;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

// --- Email transport setup ---
let transporter = null;

if (GMAIL_USER && GMAIL_APP_PASSWORD && NOTIFICATION_EMAIL) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
  transporter.verify((err) => {
    if (err) console.error("❌ Gmail SMTP error:", err.message);
    else console.log("✅ Gmail SMTP ready — sending to " + NOTIFICATION_EMAIL);
  });
} else {
  console.warn("⚠️  Email not configured. Set GMAIL_USER, GMAIL_APP_PASSWORD, NOTIFICATION_EMAIL in .env");
}

// --- HTML email templates (exact copies from production email-service.ts) ---
function buildAdminEmailHtml(inquiry) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Inquiry - Alashore Marine</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e40af, #0891b2); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .info-item { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #0891b2; }
    .label { font-weight: bold; color: #1e40af; font-size: 12px; text-transform: uppercase; }
    .value { margin-top: 5px; font-size: 16px; }
    .message-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e2e8f0; }
    .topic-badge { display: inline-block; background: #0891b2; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: capitalize; }
    .footer { text-align: center; margin-top: 30px; padding: 20px; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐟 New Inquiry Received</h1>
      <p>Alashore Marine Exports Pvt. Ltd.</p>
    </div>
    <div class="content">
      <p><strong>You have received a new inquiry through your website!</strong></p>
      <div class="info-grid">
        <div class="info-item"><div class="label">Customer Name</div><div class="value">${inquiry.firstName} ${inquiry.lastName}</div></div>
        <div class="info-item"><div class="label">Email Address</div><div class="value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></div></div>
        ${inquiry.phone ? `<div class="info-item"><div class="label">Phone Number</div><div class="value"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></div></div>` : ""}
        ${inquiry.company ? `<div class="info-item"><div class="label">Company</div><div class="value">${inquiry.company}</div></div>` : ""}
      </div>
      ${inquiry.topic ? `<div style="margin: 20px 0;"><div class="label">Inquiry Topic</div><span class="topic-badge">${inquiry.topic}</span></div>` : ""}
      <div class="message-box">
        <div class="label">Message</div>
        <div class="value" style="white-space: pre-wrap; margin-top: 10px;">${inquiry.message}</div>
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <a href="mailto:${inquiry.email}?subject=Re: Your inquiry to Alashore Marine"
           style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reply to Customer
        </a>
      </div>
    </div>
    <div class="footer">
      <p>This email was automatically generated from your website contact form.</p>
      <p><strong>Alashore Marine Exports Pvt. Ltd.</strong></p>
      <p>Plot No- D1/18(P), D1/19, D1/20 &amp; D1/37, D1/38, D1/39(P)<br>
         Somnathpur Industrial Estate, Balasore, Odisha, India, Pin- 755019</p>
    </div>
  </div>
</body>
</html>`;
}

function buildConfirmationHtml(inquiry) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You - Alashore Marine</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e40af, #0891b2); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    .message-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981; }
    .footer { text-align: center; margin-top: 30px; padding: 20px; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐟 Thank You for Your Inquiry!</h1>
      <p>Alashore Marine Exports Pvt. Ltd.</p>
    </div>
    <div class="content">
      <p>Dear <strong>${inquiry.firstName} ${inquiry.lastName}</strong>,</p>
      <p>Thank you for contacting Alashore Marine Exports! We have successfully received your inquiry and our team will review it promptly.</p>
      <div class="message-box">
        <h3>📋 Your Inquiry Details:</h3>
        <p><strong>Topic:</strong> ${inquiry.topic || "General Inquiry"}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f1f5f9; padding: 15px; border-radius: 4px;">${inquiry.message}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>
      <div style="background: #dbeafe; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h3>⏰ What Happens Next?</h3>
        <ul>
          <li>Our team will review your inquiry within 24 hours</li>
          <li>We'll get back to you with detailed information</li>
          <li>For urgent matters, call us at +91 7381050536</li>
        </ul>
      </div>
      <div style="background: #f0fdf4; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h3>🌊 About Alashore Marine</h3>
        <p>We are a leading seafood export company specializing in premium quality marine products. With our state-of-the-art processing facilities and commitment to excellence, we deliver the finest seafood to global markets.</p>
      </div>
    </div>
    <div class="footer">
      <p><strong>Alashore Marine Exports Pvt. Ltd.</strong></p>
      <p>📍 Plot No- D1/18(P), D1/19, D1/20 &amp; D1/37, D1/38, D1/39(P)<br>
         Somnathpur Industrial Estate, Balasore, Odisha, India, Pin- 755019</p>
      <p>📞 +91 7381050536 | ✉️ alashoremarine@gmail.com</p>
    </div>
  </div>
</body>
</html>`;
}

// --- Express app ---
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST /api/inquiries
app.post("/api/inquiries", (req, res) => {
  const { firstName, lastName, email, phone, company, topic, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ message: "firstName, lastName, email and message are required." });
  }

  const inquiry = { firstName, lastName, email, phone, company, topic, message };

  // Respond immediately — don't make the user wait for email
  res.status(201).json({ message: "Inquiry received", success: true });

  if (!transporter) {
    console.warn("Email not configured — skipping notifications.");
    return;
  }

  Promise.all([
    transporter.sendMail({
      from: `"Alashore Marine Website" <${GMAIL_USER}>`,
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `🐟 New Inquiry from ${firstName} ${lastName} - ${topic || "General"}`,
      html: buildAdminEmailHtml(inquiry),
    }),
    transporter.sendMail({
      from: `"Alashore Marine Exports" <${GMAIL_USER}>`,
      to: email,
      subject: `🐟 Thank you for your inquiry - Alashore Marine`,
      html: buildConfirmationHtml(inquiry),
    }),
  ]).then(() => {
    console.log(`✅ Emails sent for inquiry from ${firstName} ${lastName} <${email}>`);
  }).catch((err) => {
    console.error("❌ Failed to send emails:", err.message);
  });
});

// Serve static built frontend
const staticDir = path.join(__dirname, "dist/public");
console.log(`📂 Serving static files from: ${staticDir}`);
if (fs.existsSync(staticDir)) {
  app.use((req, res, next) => {
    console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
  
  // Serve build assets
  app.use(express.static(staticDir));
  
  // Serve external assets
  app.use("/attached_assets", express.static(path.join(__dirname, "attached_assets")));
  app.use("/CSR", express.static(path.join(__dirname, "CSR")));
  app.use("/Certifications", express.static(path.join(__dirname, "Certifications")));
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.get(/^(?!\/api).*/, (req, res) => {
    console.log(`📄 Serving index.html for: ${req.url}`);
    res.sendFile(path.join(staticDir, "index.html"));
  });
} else {
  console.warn("⚠️  dist/public not found — run `npm run build` first.");
}

app.listen(PORT, () => {
  console.log(`🚀 Alashore Marine Test Server running on http://localhost:${PORT}`);
});
