const AssignmentRequest = require('../models/AssignmentRequest');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Measurement = require('../models/Measurement');
const Program = require('../models/Program');

// Trainee requests a coach
async function create(req, res) {
  try {
    const { coachId } = req.body;
    if (!coachId) return res.status(400).json({ error: 'coachId required' });
    const existing = await AssignmentRequest.find({
      traineeId: req.user._id, coachId, status: 'pending'
    });
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Request already pending' });
    }
    const request = await AssignmentRequest.create({ traineeId: req.user._id, coachId });
    res.status(201).json({ request });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create request' });
  }
}

// Coach: pending requests (with trainee name)
async function pending(req, res) {
  try {
    const requests = await AssignmentRequest.find({ coachId: req.user._id, status: 'pending' });
    const out = [];
    for (const r of requests) {
      const trainee = await User.findById(r.traineeId);
      out.push({
        _id: r._id, requestedAt: r.requestedAt,
        trainee: trainee ? { _id: trainee._id, name: trainee.name } : null
      });
    }
    res.json({ requests: out });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load requests' });
  }
}

// Coach: approve/reject. On approve, set trainee.coachId
async function decide(req, res) {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const request = await AssignmentRequest.findById(req.params.id);
    if (!request || String(request.coachId) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Request not found' });
    }
    await AssignmentRequest.findByIdAndUpdate(req.params.id, { status });
    if (status === 'approved') {
      await User.findByIdAndUpdate(request.traineeId, { coachId: req.user._id });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request' });
  }
}

// Complex query #2: coach's trainees + each one's latest workout/weight (manual join)
async function myTrainees(req, res) {
  try {
    const trainees = await User.find({ coachId: req.user._id, role: 'trainee' });
    const out = [];
    for (const t of trainees) {
      const workouts = await Workout.find({ traineeId: t._id }).sort({ date: -1 });
      const measurements = await Measurement.find({ traineeId: t._id }).sort({ date: -1 });
      out.push({
        _id: t._id, name: t.name,
        lastWorkout: workouts.length ? workouts[0].date : null,
        currentWeight: measurements.length ? measurements[0].weightKg : null
      });
    }
    res.json({ trainees: out });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load trainees' });
  }
}

// Coach views a single trainee's full profile (must be their trainee)
async function traineeProfile(req, res) {
  try {
    const trainee = await User.findById(req.params.id);
    if (!trainee || String(trainee.coachId) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Trainee not found' });
    }
    const workouts = await Workout.find({ traineeId: trainee._id }).sort({ date: -1 });
    const measurements = await Measurement.find({ traineeId: trainee._id }).sort({ date: 1 });
    const programs = await Program.find({ traineeId: trainee._id }).sort({ createdAt: -1 });
    res.json({
      trainee: {
        _id: trainee._id, name: trainee.name, gender: trainee.gender,
        height: trainee.height, yearOfBirth: trainee.yearOfBirth, phone: trainee.phone
      },
      workouts: workouts,
      measurements: measurements,
      programs: programs
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load trainee profile' });
  }
}

// Trainee: their own assignment requests (so the UI can reflect state)
async function mine(req, res) {
  try {
    const requests = await AssignmentRequest.find({ traineeId: req.user._id });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load your requests' });
  }
}

// Coach: remove (unassign) one of their trainees
async function removeTrainee(req, res) {
  try {
    const trainee = await User.findById(req.params.id);
    if (!trainee || String(trainee.coachId) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Trainee not found' });
    }
    await User.findByIdAndUpdate(trainee._id, { coachId: null });
    // remove the assignment request(s) between them so the relationship resets
    const reqs = await AssignmentRequest.find({ traineeId: trainee._id, coachId: req.user._id });
    for (const r of reqs) {
      await AssignmentRequest.findByIdAndDelete(r._id);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove trainee' });
  }
}

module.exports = { create, pending, decide, myTrainees, traineeProfile, mine, removeTrainee };
