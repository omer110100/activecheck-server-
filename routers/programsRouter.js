const { Router } = require('express');
const ctrl = require('../controllers/programsController');
const { requireAuth, requireCoach } = require('../middleware/auth');

const router = new Router();
router.use(requireAuth);
router.get('/', ctrl.list);
router.post('/', requireCoach, ctrl.create);
router.put('/:id', requireCoach, ctrl.update);
router.delete('/:id', requireCoach, ctrl.remove);

module.exports = router;
