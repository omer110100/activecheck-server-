const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  traineeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  weightKg: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Measurement', measurementSchema);
