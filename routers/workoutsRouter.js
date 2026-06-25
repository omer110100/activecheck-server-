const { Router } = require('express');
const ctrl = require('../controllers/workoutsController');
const { requireAuth } = require('../middleware/auth');

const router = new Router();
router.use(requireAuth);

router.get('/stats', ctrl.stats);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
