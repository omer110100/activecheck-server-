const Workout = require('../models/Workout');

async function list(req, res) {
  try {
    const query = { traineeId: req.user._id };
    if (req.query.from || req.query.to) {
      query.date = {};
      if (req.query.from) query.date.$gte = new Date(req.query.from);
      if (req.query.to) query.date.$lte = new Date(req.query.to);
    }
    const sortDir = req.query.sort === 'asc' ? 1 : -1;
    let workouts = await Workout.find(query).sort({ date: sortDir });
    if (req.query.type) {
      const t = req.query.type.toLowerCase();
      workouts = workouts.filter((w) =>
        w.exercises.some((e) => e.name.toLowerCase().includes(t)));
    }
    res.json({ workouts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load workouts' });
  }
}

async function getOne(req, res) {
  try {
    const w = await Workout.findById(req.params.id);
    if (!w || String(w.traineeId) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json({ workout: w });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load workout' });
  }
}

async function create(req, res) {
  try {
    const { date, includeInAnalytics, exercises } = req.body;
    if (!date || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ error: 'Date and at least one exercise required' });
    }
    const workout = await Workout.create({
      traineeId: req.user._id, date, includeInAnalytics, exercises
    });
    res.status(201).json({ workout });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
}

async function update(req, res) {
  try {
    const existing = await Workout.findById(req.params.id);
    if (!existing || String(existing.traineeId) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    const { date, includeInAnalytics, exercises } = req.body;
    const workout = await Workout.findByIdAndUpdate(
      req.params.id, { date, includeInAnalytics, exercises }, { new: true });
    res.json({ workout });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
}

async function remove(req, res) {
  try {
    const existing = await Workout.findById(req.params.id);
    if (!existing || String(existing.traineeId) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
}

// Complex query #1: stats computed in JS from find()
async function stats(req, res) {
  try {
    const workouts = await Workout.find({ traineeId: req.user._id });
    const totalWorkouts = workouts.length;
    let totalVolume = 0;
    const exerciseCounts = {};
    workouts.forEach((w) => {
      w.exercises.forEach((e) => {
        totalVolume += (e.sets || 0) * (e.reps || 0) * (e.weight || 0);
        exerciseCounts[e.name] = (exerciseCounts[e.name] || 0) + 1;
      });
    });
    let mostFrequent = null;
    let max = 0;
    Object.keys(exerciseCounts).forEach((name) => {
      if (exerciseCounts[name] > max) { max = exerciseCounts[name]; mostFrequent = name; }
    });
    res.json({ totalWorkouts, totalVolume, mostFrequentExercise: mostFrequent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats' });
  }
}

module.exports = { list, getOne, create, update, remove, stats };
