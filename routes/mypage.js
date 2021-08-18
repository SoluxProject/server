const express = require('express');
const { verifyToken } = require('./middlewares');
const router = express.Router();
const ctrl = require("../controllers/mypage.ctrl");

router.get('/info', verifyToken, ctrl.info);
router.post('/changePw', verifyToken, ctrl.changePw);
router.post('/changeEmail', verifyToken, ctrl.changeEmail);
router.post('/changeMajor', verifyToken, ctrl.changeMajor);
router.post('/changeTel', verifyToken, ctrl.changeTel);

module.exports = router;