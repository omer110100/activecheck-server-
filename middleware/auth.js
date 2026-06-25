const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const header = req.get('Authorization') || '';
    const token = header.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const users = await User.find({ token });
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = users[0];
    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth check failed' });
  }
}

function requireCoach(req, res, next) {
  if (!req.user || req.user.role !== 'coach') {
    return res.status(403).json({ error: 'Coaches only' });
  }
  next();
}

module.exports = { requireAuth, requireCoach };
