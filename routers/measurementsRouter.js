const { Router } = require('express');
const ctrl = require('../controllers/measurementsController');
const { requireAuth } = require('../middleware/auth');

const router = new Router();
router.use(requireAuth);
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.remove);

module.exports = router;
