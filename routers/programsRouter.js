const { Router } = require('express');
const ctrl = require('../controllers/programsController');
const { requireAuth } = require('../middleware/auth');

const router = new Router();
router.use(requireAuth);

// Both trainees (own program) and coaches (for a trainee) can manage programs.
// Ownership is enforced per-record in the controller.
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
