const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: "*", // Allow all origins; secure it later if needed
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Allowed users (emails in lowercase)
const allowedUsers = [
  "sruhunage@collectivercm.com",
  "bherath@collectivercm.com"
];

app.post("/api/token", (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.trim().toLowerCase(); // Normalize email

  console.log("Received email:", normalizedEmail);

  if (!allowedUsers.includes(normalizedEmail)) {
    console.log("Unauthorized email attempt:", normalizedEmail);
    return res.status(403).json({ error: "Unauthorized email" });
  }

  // Generate JWT for Tableau
  const token = jwt.sign(
    {
      iss: process.env.CLIENT_ID,
      sub: normalizedEmail,
      aud: "tableau",
      exp: Math.floor(Date.now() / 1000) + 5 * 60, // Token valid for 5 mins
      jti: Math.random().toString(36).substring(7)
    },
    process.env.CLIENT_SECRET,
    { algorithm: "HS256" }
  );

  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
