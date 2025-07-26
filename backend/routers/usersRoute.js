const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all users
router.get("/users", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        user_id, 
        name, 
        email, 
        role, 
        phone, 
        address, 
        status, 
        created_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get single user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(z
      `SELECT user_id, name, email, role, phone, address, status, created_at FROM users WHERE user_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Create user
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const sql = `
      INSERT INTO users (name, email, password, role, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [name, email, password, role, phone, address]);
    res.status(201).json({ message: "User berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ message: "Email sudah digunakan" });
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  }
});

// Update user
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, address, status } = req.body;

    const [result] = await db.execute(
      `
      UPDATE users 
      SET name = ?, email = ?, role = ?, phone = ?, address = ?, status = ?
      WHERE user_id = ?
    `,
      [name, email, role, phone, address, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Soft delete user (ubah status ke nonaktif)
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      `UPDATE users SET status = 'nonaktif' WHERE user_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil dinonaktifkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
