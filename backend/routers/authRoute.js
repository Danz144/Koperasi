// routes/authRoute.js
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require("bcrypt");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// 🔑 LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE status = ? AND email = ?',
      ['aktif', email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
      }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res
      .cookie('token', token, { httpOnly: true })
      .json({ message: 'Login successful' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔑 REGISTER
router.post("/register", async (req, res) => {
  console.log("Register hit:", req.body);
  const { name, email, phone, role, address, password } = req.body;

  // Validasi data
  if (!name || !email || !phone || !role || !address || !password) {
    return res.status(400).json({ message: "Lengkapi semua data" });
  }

  if (!["ketua", "bendahara", "anggota"].includes(role.toLowerCase())) {
    return res.status(400).json({ message: "Role tidak valid" });
  }

  try {
    const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date();

    const [result] = await db.execute(
      `INSERT INTO users (name, email, phone, address, password, role, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, address, hashedPassword, role, "aktif", createdAt]
    );

    console.log("User inserted:", result);
    return res.status(201).json({ message: "Registrasi berhasil" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
});


// 🚪 LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

// 🔒 PROFILE
router.get('/profile', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
