const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    const { name, email, message, admin } = data;

    if (!admin) {
      return { statusCode: 400, body: "Missing admin email" };
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Form Bot" <${process.env.SMTP_USER}>`,
      to: admin,
      subject: "New Form Submission",
      text: `New message from ${name} (${email}):\n\n${message}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error("Error sending email:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" })
    };
  }
};
