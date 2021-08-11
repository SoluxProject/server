const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const path = require('path');
const { verifyToken } = require('./middlewares');
const solux_db = require('../models/db')();
const connection = solux_db.init();
solux_db.test_open(connection);
const schedule = require('node-schedule');

router.get('/list', verifyToken, (req, res) => {
    const id = req.decoded.id;
    try {
        console.log('id : ' + id);
        const sqlSearch = "SELECT * from timerDay WHERE timerDayid = ?";
        connection.query(sqlSearch, id, (err, result) => {
            if (err) console.log(err);
            else {
                if (result.length == 0) { //존재하지 않는 회원
                    return res.json({ success: true, message: '아직 기록된 timer record 없음' });
                }
                return res.send(result);
            }
        });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: 'timer list 오류' });
    }
});

router.post('/update', verifyToken, (req, res) => {
    const recordDay = req.body.recordDay;
    const timerDayid = req.decoded.id;
    try {
        const sqlSelect = "SELECT recordDay from timerDay WHERE timerDayid =?";
        connection.query(sqlSelect, timerDayid, (err, result) => {
            if (err) console.log('select 오류 ' + err);
            else {
                const newrecord = parseInt(recordDay) + parseInt(result[0].recordDay);
                console.log(newrecord);
                const sqlChangeDate = "UPDATE timerDay SET recordDay = ? WHERE timerDayid = ?";
                connection.query(sqlChangeDate, [newrecord, timerDayid], (err, result) => {
                    if (err) console.log("update 오류 " + err);
                    else {
                        console.log('timerDay record 수정 완료');
                        res.redirect('/timerDay/list');
                    }
                })
            }
        })
    } catch (err) {
        console.log(err);
    }
})


schedule.scheduleJob('0 0 0 * * *', async()=>{
    const timerDayid = req.decoded.id;
    try {
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
                                    else console.log('timer day 초기화 완료');
                                })
                            }
                        })
                    }
                })
            }
        })
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: "자동 실행 실패" });
    }
})

module.exports = router;