const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  console.log(`Received contact message from ${name} (${email}): ${message}`);
  
  try {
    let transporter;

    // Use environment variables if set, otherwise fallback to Ethereal test account
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail', // or any other service
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Generate test SMTP service account from ethereal.email
      let testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user, 
          pass: testAccount.pass, 
        },
      });
      console.log('⚠️ Using Ethereal Mock Email Service (Set EMAIL_USER and EMAIL_PASS in .env to use real email)');
    }

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"${name}" <${email}>`, // sender address
      to: process.env.EMAIL_TO || "teamvajra_rc@mmcoe.edu.in", // list of receivers
      subject: `New Contact Form Submission from ${name}`, // Subject line
      text: message, // plain text body
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `, // html body
    });

    console.log("Message sent: %s", info.messageId);
    
    // Preview only available when sending through an Ethereal account
    if (!process.env.EMAIL_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
