const express = require('express');
const { isLoggedIn, isNotLoggedIn, verifyToken } = require('./middlewares');
const router = express.Router();
const ctrl = require("../controllers/page.ctrl");

router.get('/join', verifyToken, ctrl.join);
router.get('/login', isNotLoggedIn, ctrl.login);
router.get('/', ctrl.main);

module.exports = router;