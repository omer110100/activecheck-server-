const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['trainee', 'coach'], required: true },
  gender: { type: String, default: '' },
  height: { type: Number, default: null },
  yearOfBirth: { type: Number, default: null },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  coachId: { type: mongoose.Schema.Types.ObjectId, default: null },
  token: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
