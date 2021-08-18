const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middlewares');
const schedule = require('node-schedule');
const ctrl = require("../controllers/timerDay.ctrl");
const db = require('../models/db')();
const connection = db.init();

router.get('/list', verifyToken, ctrl.list);
router.post('/update', verifyToken, ctrl.update);

schedule.scheduleJob('0 0 0 * * *',  async () => {
    try {
        const sqlSelectWeek = "SELECT recordWeek from timerWeek";
        connection.query(sqlSelectWeek, (err, result1) => {
            if (err) console.log('select 오류' + err);
            else {
                const sqlSelectDay = "SELECT * from timerDay";
                connection.query(sqlSelectDay, (err, result2) => {
                    if (err) console.log('day select 오류' + err);
                    else {
                        console.log('affect:'+result1.length);
                        for(let i =0; i < result1.length; i ++){
                            const result3 = parseInt(result1[i].recordWeek) + parseInt(result2[i].recordDay);
                        const sqlChangeWeek = "UPDATE timerWeek SET recordWeek = ? WHERE timerWeekid = ?";
                        connection.query(sqlChangeWeek, [result3,result2[i].timerDayid], (err, fin) => {
                            if (err) console.log('week change 오류'+err);
                            else {
                                const sqlDelete = "UPDATE timerDay SET recordDay = 0 WHERE timerDayid = ?";
                                connection.query(sqlDelete, result2[i].timerDayid, (err, result4) => {
                                    if (err) console.log(err);
                                    else console.log('timer day 초기화 완료');
                                })
                            }
                        })
                        }
                    }
                })
            }
        })
    } catch (err) {
        console.log(err);
    }
})


module.exports = router;