const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.post('/interactive', controller.interactive);
router.post('/events', controller.events);
router.post('/command', controller.commands);
router.get('/install', controller.install);

exports.router = router;
