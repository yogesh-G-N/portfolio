const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yogi*021947',
  database: 'portfolio_db'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('✅ Connected to MySQL Database');
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yogeshgn2003@gmail.com',
    pass: 'ssqxenrvzfkxmwxh' // App password
  }
});

// Handle contact form POST
app.post('/submit-form', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Store in MySQL
  const sql = 'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, subject, message], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ success: false, error: 'DB insert error' });
    }

    // Send email
    const mailOptions = {
      from: 'yogeshgn2003@gmail.com',
      to: 'yogeshgn2003@gmail.com',
      subject: `New Contact Form: ${subject}`,
      text: `From: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email Error:', error);
        return res.status(500).json({ success: false, error: 'Email failed' });
      }
      console.log('📧 Email sent: ' + info.response);
      res.status(200).json({ success: true, message: 'Form submitted' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
