const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  traineeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  coachId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AssignmentRequest', requestSchema);
