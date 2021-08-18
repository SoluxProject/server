const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const ctrl = require("../controllers/auth.ctrl");
const router = express.Router();


router.post('/join', isNotLoggedIn, ctrl.join);

router.post('/login', isNotLoggedIn, ctrl.login);

router.get('/logout', isLoggedIn, ctrl.logout);

router.post('/searchId', isNotLoggedIn, ctrl.searchId);

router.post('/searchPw', isNotLoggedIn, ctrl.searchPw);

router.get('/checkId', ctrl.checkId);

module.exports = router;