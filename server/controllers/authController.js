const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
const jwtSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// In-memory store for refresh tokens (for demo; use DB/Redis in production)
let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign({ userId: user._id, username: user.username }, jwtSecret, { expiresIn: accessTokenExpiry });
}
function generateRefreshToken(user) {
  const token = jwt.sign({ userId: user._id, username: user.username }, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
  refreshTokens.push(token);
  return token;
}

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });
    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    // Issue tokens on registration
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(201).json({ message: 'User registered successfully', accessToken, refreshToken, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ accessToken, refreshToken, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.token = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: 'Refresh token not found, login again' });
  }
  try {
    const user = jwt.verify(refreshToken, refreshTokenSecret);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

exports.logout = (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  res.json({ message: 'Logged out' });
};
