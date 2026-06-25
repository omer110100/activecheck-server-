const { Router } = require('express');
const ctrl = require('../controllers/requestsController');
const { requireAuth, requireCoach } = require('../middleware/auth');

const router = new Router();
router.use(requireAuth);

router.post('/', ctrl.create);
router.get('/pending', requireCoach, ctrl.pending);
router.get('/my-trainees', requireCoach, ctrl.myTrainees);
router.get('/trainee/:id', requireCoach, ctrl.traineeProfile);
router.put('/:id', requireCoach, ctrl.decide);

module.exports = router;
