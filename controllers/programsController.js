const Program = require('../models/Program');
const User = require('../models/User');

// A program can be managed by the trainee it belongs to,
// or by the coach who created it.
function canManage(program, user) {
  if (String(program.traineeId) === String(user._id)) return true;
  if (program.coachId && String(program.coachId) === String(user._id)) return true;
  return false;
}

async function list(req, res) {
  try {
    if (req.user.role === 'coach') {
      const filter = { coachId: req.user._id };
      if (req.query.traineeId) filter.traineeId = req.query.traineeId;
      const programs = await Program.find(filter).sort({ createdAt: -1 });
      // attach each program's trainee name for display
      const out = [];
      for (const p of programs) {
        const t = await User.findById(p.traineeId);
        const obj = p.toObject();
        obj.traineeName = t ? t.name : 'Unknown';
        out.push(obj);
      }
      return res.json({ programs: out });
    }
    const programs = await Program.find({ traineeId: req.user._id }).sort({ createdAt: -1 });
    res.json({ programs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load programs' });
  }
}

async function create(req, res) {
  try {
    const { title, sessionsPerWeek, items, traineeId } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Program name is required' });
    }

    const doc = {
      title: title,
      sessionsPerWeek: sessionsPerWeek || 0,
      items: items || []
    };

    if (req.user.role === 'coach') {
      if (!traineeId) {
        return res.status(400).json({ error: 'traineeId is required' });
      }
      doc.traineeId = traineeId;
      doc.coachId = req.user._id;
    } else {
      // trainee creates their own program
      doc.traineeId = req.user._id;
      doc.coachId = req.user.coachId || null;
    }

    const program = await Program.create(doc);
    res.status(201).json({ program });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create program' });
  }
}

async function update(req, res) {
  try {
    const existing = await Program.findById(req.params.id);
    if (!existing || !canManage(existing, req.user)) {
      return res.status(404).json({ error: 'Program not found' });
    }
    const { title, sessionsPerWeek, items } = req.body;
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { title, sessionsPerWeek, items },
      { new: true }
    );
    res.json({ program });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update program' });
  }
}

async function remove(req, res) {
  try {
    const existing = await Program.findById(req.params.id);
    if (!existing || !canManage(existing, req.user)) {
      return res.status(404).json({ error: 'Program not found' });
    }
    await Program.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete program' });
  }
}

module.exports = { list, create, update, remove };
