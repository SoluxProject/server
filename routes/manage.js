const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middlewares');
const ctrl = require("../controllers/manage");

router.get('/list', verifyToken, ctrl.list);
router.post('/insert', verifyToken, ctrl.insert);
router.post('/del', ctrl.del);
router.post('/changeSub', ctrl.changeSub);
router.post('/changeDate', ctrl.changeDate);

module.exports = router;