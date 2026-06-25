const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  traineeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  includeInAnalytics: { type: Boolean, default: true },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    weight: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', workoutSchema);
