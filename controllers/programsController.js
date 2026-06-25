const Program = require('../models/Program');

async function list(req, res) {
  try {
    const filter = req.user.role === 'coach'
      ? { coachId: req.user._id }
      : { traineeId: req.user._id };
    if (req.query.traineeId) filter.traineeId = req.query.traineeId;
    const programs = await Program.find(filter).sort({ createdAt: -1 });
    res.json({ programs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load programs' });
  }
}

async function create(req, res) {
  try {
    const { traineeId, title, items } = req.body;
    if (!traineeId || !title) {
      return res.status(400).json({ error: 'traineeId and title required' });
    }
    const program = await Program.create({
      coachId: req.user._id, traineeId, title, items: items || []
    });
    res.status(201).json({ program });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create program' });
  }
}

async function update(req, res) {
  try {
    const existing = await Program.findById(req.params.id);
    if (!existing || String(existing.coachId) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Program not found' });
    }
    const { title, items } = req.body;
    const program = await Program.findByIdAndUpdate(
      req.params.id, { title, items }, { new: true });
    res.json({ program });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update program' });
  }
}

async function remove(req, res) {
  try {
    const existing = await Program.findById(req.params.id);
    if (!existing || String(existing.coachId) !== String(req.user._id)) {
      return res.status(404).json({ error: 'Program not found' });
    }
    await Program.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete program' });
  }
}

module.exports = { list, create, update, remove };
