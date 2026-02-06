const express = require("express");
const router = express.Router();

// Mock login for demo
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Mock authentication
  if (email === "test@example.com" && password === "password123") {
    res.json({
      token: "mock-jwt-token-for-demo",
      user: { id: 1, email: "test@example.com" },
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Mock register
router.post("/register", (req, res) => {
  res.status(201).json({
    message: "User created successfully",
    user: { id: 1, email: req.body.email },
  });
});

module.exports = router;
