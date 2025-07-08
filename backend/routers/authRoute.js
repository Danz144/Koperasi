const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");
const router = express.Router();
require("dotenv").config();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const [rows] = await db.execute(
      `
  SELECT 
    u.id,
    u.username, 
    u.password_hash,
    r.name AS role_name, 
    u.created_at, 
    u.updated_at 
  FROM users AS u 
  INNER JOIN roles AS r ON r.id = u.role_id 
  WHERE u.username = ?
`,
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const user = rows[0];
    console.log("User row:", user);

    if (!user.password_hash) {
      return res.status(500).json({ message: "User Password Not Found" });
    }

    console.log("Input password:", password);
    console.log("Stored hash:", user.password_hash);

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      id: user.id,
      username: user.username,
      role_name: user.role_name,
    });
  } catch (err) {
    console.error("[LOGIN ERROR]", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout Success" });
});

module.exports = router;
