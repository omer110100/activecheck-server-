const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  traineeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  coachId: { type: mongoose.Schema.Types.ObjectId, default: null },
  title: { type: String, required: true },
  sessionsPerWeek: { type: Number, default: 0 },
  items: [{
    exercise: { type: String, required: true },
    sets: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    weight: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Program', programSchema);
