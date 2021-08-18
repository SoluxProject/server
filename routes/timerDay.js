const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middlewares');
const schedule = require('node-schedule');
const ctrl = require("../controllers/timerDay.ctrl");
const db = require('../models/db')();
const connection = db.init();

router.get('/list', verifyToken, ctrl.list);
router.post('/update', verifyToken, ctrl.update);

schedule.scheduleJob('0 37 11 * * *',  async () => {
    try {
        //const timerDayid = req.decoded.id; //현재 로그인한 사용자 뿐만 아니라 전체 사용자의 기록 갱신 (수정)
        const sqlSelectWeek = "SELECT recordWeek from timerWeek WHERE timerWeekid = ?";
        connection.query(sqlSelectWeek, timerDayid, (err, result1) => {
            if (err) console.log('select 오류' + err);
            else {
                const sqlSelectDay = "SELECT recordDay from timerDay WHERE timerDayid = ?";
                connection.query(sqlSelectDay, timerDayid, (err, result2) => {
                    if (err) console.log('day select 오류' + err);
                    else {
                        const result3 = parseInt(result1[0].recordWeek) + parseInt(result2[0].recordDay);
                        const sqlChangeWeek = "UPDATE timerWeek SET recordWeek = ? WHERE timerWeekid = ?";
                        connection.query(sqlChangeWeek, [result3, timerDayid], (err, fin) => {
                            if (err) console.log('week change 오류');
                            else {
                                const sqlDelete = "UPDATE timerDay SET recordDay = 0 ";
                                connection.query(sqlDelete, (err, result4) => {
                                    if (err) console.log(err);
                                    else console.log('timer day 초기화 완료 (login)');
                                })
                            }
                        })
                    }
                })
            }
        })
    } catch (err) {
        console.log(err);
        const sqlDelete = "UPDATE timerDay SET recordDay = 2 ";
        connection.query(sqlDelete, (err, result4) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('timer day 초기화 완료');
            }
        })
    }
})

module.exports = router;