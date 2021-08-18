const express = require('express');
const solux_db = require('../models/db')();
const connection = solux_db.init();

const list = (req, res) => {
    const id = req.decoded.id;
    try {
        console.log('id : ' + id);
        const sqlSearch = "SELECT * from timerDay WHERE timerDayid = ?";
        connection.query(sqlSearch, id, (err, result) => {
            if (err) console.log(err);
            else {
                if (result.length == 0) {
                    return res.json({ success: true, message: '아직 기록된 timer record 없음' });
                }
                return res.send(result);
            }
        });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: 'timer list 오류' });
    }
};

const update = (req, res) => {
    const recordDay = req.body.recordDay;
    const timerDayid = req.decoded.id;
    try {
        const sqlSelect = "SELECT recordDay from timerDay WHERE timerDayid =?";
        connection.query(sqlSelect, timerDayid, (err, result) => {
            if (err) {
                console.log('select 오류 ' + err);
                return res.send({ success: false, message: "select 오류" });
            }
            else {
                const newrecord = parseInt(recordDay) + parseInt(result[0].recordDay);
                console.log(newrecord);
                const sqlChangeDate = "UPDATE timerDay SET recordDay = ? WHERE timerDayid = ?";
                connection.query(sqlChangeDate, [newrecord, timerDayid], (err, result) => {
                    if (err) {
                        console.log("update 오류 " + err);
                        return res.send({ success: false, message: "일일 타이머 기록 갱신 오류" });
                    }
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
};

module.exports = {
    list,
    update
};