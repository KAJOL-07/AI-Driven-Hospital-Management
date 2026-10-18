const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Name, email, password, and role are required." });
    }
    const validRoles = ["admin", "doctor", "nurse", "receptionist"];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid role. Must be admin, doctor, nurse, or receptionist." });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered. Please login instead." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role.toLowerCase(),
      department: department || null,
      status: "active"
    });

    const token = generateToken(newUser);
    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, message: "Account created successfully.", data: { token, user: userObj } });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Registration failed.", error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim(), status: "active" });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar || null
        }
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed.", error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, message: "User profile retrieved.", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user profile.", error: error.message });
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name: name || req.user.name, phone: phone || null, avatar: avatar || null },
      { new: true, select: "-password" }
    );
    res.json({ success: true, message: "Profile updated successfully.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile.", error: error.message });
  }
};

module.exports = { signup, login, getMe, updateProfile };
