const { Router } = require('express');
const ctrl = require('../controllers/usersController');
const { requireAuth } = require('../middleware/auth');

const router = new Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/logout', requireAuth, ctrl.logout);
router.get('/me', requireAuth, ctrl.me);
router.put('/me', requireAuth, ctrl.updateMe);
router.get('/coaches', requireAuth, ctrl.listCoaches);

module.exports = router;
