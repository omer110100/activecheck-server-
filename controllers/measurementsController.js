const Measurement = require('../models/Measurement');

async function list(req, res) {
  try {
    const items = await Measurement.find({ traineeId: req.user._id }).sort({ date: 1 });
    res.json({ measurements: items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load measurements' });
  }
}

async function create(req, res) {
  try {
    const { date, weightKg } = req.body;
    if (!date || weightKg == null) {
      return res.status(400).json({ error: 'Date and weight required' });
    }
    const item = await Measurement.create({ traineeId: req.user._id, date, weightKg });
    res.status(201).json({ measurement: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add measurement' });
  }
}

async function remove(req, res) {
  try {
    const existing = await Measurement.findById(req.params.id);
    if (!existing || String(existing.traineeId) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    await Measurement.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete measurement' });
  }
}

module.exports = { list, create, remove };
