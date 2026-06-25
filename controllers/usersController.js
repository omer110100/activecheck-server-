const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

function publicUser(u) {
  return {
    _id: u._id, name: u.name, email: u.email, role: u.role,
    gender: u.gender, height: u.height, yearOfBirth: u.yearOfBirth,
    phone: u.phone, coachId: u.coachId
  };
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = await User.find({ email });
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const token = makeToken();
    const user = await User.create({ name, email, passwordHash, role, token });
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const users = await User.find({ email });
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = makeToken();
    await User.findByIdAndUpdate(user._id, { token });
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
}

async function logout(req, res) {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
}

async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

async function updateMe(req, res) {
  try {
    const { name, gender, height, yearOfBirth, phone } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, gender, height, yearOfBirth, phone },
      { new: true }
    );
    res.json({ user: publicUser(updated) });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
}

async function listCoaches(req, res) {
  try {
    const search = (req.query.search || '').toLowerCase();
    const coaches = await User.find({ role: 'coach' });
    const filtered = coaches
      .filter((c) => !search || c.name.toLowerCase().includes(search))
      .map(publicUser);
    res.json({ coaches: filtered });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load coaches' });
  }
}

module.exports = { register, login, logout, me, updateMe, listCoaches };
