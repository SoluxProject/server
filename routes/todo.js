const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middlewares');
const ctrl = require('../controllers/todo.ctrl');

router.get('/list', verifyToken, ctrl.list);
router.post('/change', ctrl.change);
router.post('/check', ctrl.check);
router.post('/delete', ctrl.del);
router.post('/insert', verifyToken, ctrl.insert);

module.exports = router;