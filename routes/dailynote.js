const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middlewares');
const ctrl = require("../controllers/dailynote.ctrl");

router.get('/list', verifyToken, ctrl.list);
router.post('/insert', verifyToken, ctrl.insert);
router.post('/delete', ctrl.del);
router.post('/change', ctrl.change);
router.post('/check', ctrl.check);

module.exports = router;