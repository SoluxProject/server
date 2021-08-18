const express = require('express');
const schedule = require('node-schedule');
const router = express.Router();
const ctrl = require("../controllers/timerWeek.ctrl");
const db = require('../models/db')();
const connection = db.init();

router.get('/rank', ctrl.rank);

schedule.scheduleJob('0 0 0 * * 1', async()=>{
    const sqlReset = "UPDATE timerWeek SET recordWeek=0";
    connection.query(sqlReset, (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log('0으로 초기화 완료');
        }
    })
})

module.exports = router;