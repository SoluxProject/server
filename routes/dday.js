const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middlewares');
const ctrl = require("../controllers/dday.ctrl");

router.get('/list', verifyToken, ctrl.list);
router.post('/insert', verifyToken, ctrl.insert);
router.post('/del', ctrl.del);
router.post('/changeCont', ctrl.changeCont);
router.post('/changeDate', ctrl.changeDate);

module.exports = router;