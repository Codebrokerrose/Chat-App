const express = require('express');
const router = express.Router();
const anonSession = require('../controller/anonSession');

router.post('/anon-session', anonSession.createSession);
router.post('/anon-session/join', anonSession.joinSession);

module.exports = router;
