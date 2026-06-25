const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  coachId: { type: mongoose.Schema.Types.ObjectId, required: true },
  traineeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  items: [{
    exercise: { type: String, required: true },
    sets: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    notes: { type: String, default: '' }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Program', programSchema);
