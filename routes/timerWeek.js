const express = require('express');
const mysql = require('mysql');
const schedule = require('node-schedule');
const {verifyToken} = require('./middlewares')
const db = require('../models/db')();
const connection = db.init();
const router = express.Router();

db.test_open(connection);

router.get('/rank', (req,res)=>{
    try{
        const rankSelect = "SELECT * FROM timerWeek ORDER BY recordWeek DESC Limit 5";
        connection.query(rankSelect, (err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                return res.json({
                    success : true, 
                    data : result
                })
            }
        } )
    }catch(err){
        console.log(err);
    }
})

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