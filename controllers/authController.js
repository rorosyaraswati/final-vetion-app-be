// controllers/authController.js

const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi untuk menghasilkan token JWT
function generateAccessToken(user) {
  return jwt.sign({ userId: user.id, username: user.username }, process.env.TOKEN_KEY, { expiresIn: '2h' });
}

function generateRefreshToken(user) {
  return jwt.sign({ userId: user.id, username: user.username }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
}

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validasi apakah username sudah digunakan
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna ke dalam database
    const newUser = await User.create({ username, password: hashedPassword });
    
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari pengguna berdasarkan username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Periksa apakah password cocok
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT access token dan refresh token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Simpan refresh token di database
    await User.update({ refreshToken }, { where: { id: user.id } });

    // Atur cookie dengan access token dan refresh token
    res.cookie('token', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.status(200).json({ message: "Logged in successfully", accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Hapus refresh token dari database
    await User.update({ refreshToken: null }, { where: { id: userId } });

    // Hapus cookie token dan refresh token
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
