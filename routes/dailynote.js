const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const router = express.Router();
const path = require('path');
const { verifyToken } = require('./middlewares');
const solux_db = require('../models/db')();
const connection = solux_db.init();
solux_db.test_open(connection);

router.get('/list', verifyToken, (req,res)=>{
    const dailyid = req.decoded.id;
    try{
        console.log("dailyid: "+dailyid);
        //console.log("req.cookies: "+req.cookies);
        const searchList = "SELECT * from daily WHERE dailyid = ?";
        connection.query(searchList, dailyid, (err,result)=>{
            console.log(result);
            if (result.length==0){
                console.log('아직 daily 없음');
            }
            return res.send(result);
        })
    }catch(err){
        console.error(err);
        return err;
    }
});

router.post('/change', (req,res)=>{
    const index =req.body.index;
    const content = req.body.content;
    try{
        const sqlCheck = "UPDATE daily SET content = ? WHERE `index` = ?";
        connection.query(sqlCheck, [content, index] , (err, result)=>{
            console.log(result);
            if(err){
                console.log(err);
                console.log('daily change 오류');
            }else{
                console.log('daily 완료');
                return res.redirect('/dailynote/list');
            }
        })
    }catch(err){
        console.log(err);
    }
});

router.post('/check', (req,res)=>{
    const index =req.body.index;
    try{
        const sqlSearch = "SELECT `check` from daily WHERE `index`=?";
        connection.query(sqlSearch, index, (err,result)=>{
            console.log(result[0].check);
            const ck = result[0].check;
            console.log(ck);

            const sqlCheck = "UPDATE daily SET `check` = ? WHERE `index` = ?";
            if (ck==1){
                connection.query(sqlCheck, [0, index] , (err, result2)=>{
                    console.log(result2);
                    if(err){
                        console.log(err);
                        console.log('daily check 오류');
                    }else{
                        console.log('update to 0 완료');
                        return res.redirect('/dailynote/list');
                    }
                })
            }else{
                connection.query(sqlCheck, [1, index ], (err, result2)=>{
                    console.log(result2);
                    if(err){
                        console.log(err);
                        console.log('daily check 오류');
                    }else{
                        console.log('update to 1 완료');
                        return res.redirect('/dailynote/list');
                    }
                })
            }
        })
    }catch(err){
        console.log(err);
    }
});

router.post('/delete', (req, res)=>{
    console.log('delete 실행 시작');
    const index = req.body.index;
    try{
        const sqlDelete = "DELETE FROM daily WHERE `index` = ?";
        connection.query(sqlDelete, index, (err, result)=>{
            console.log(result);
            if(err){
                console.log(err);
                console.log('daily delete 오류');
            }
            else{
                console.log("Number of records deleted: " + result.affectedRows);
                return res.redirect('/dailynote/list');
            }
        });
    }catch(err){
        console.log(err);
    }
}
);

router.post('/insert', verifyToken, (req,res)=>{
    const dailyid = req.decoded.id;
    const { date, content, subject } = req.body;
    try{
        console.log(dailyid);
        console.log(content);

        const insertTodo = 'INSERT INTO daily (dailyid, content, subject, date, `check`) VALUES(?,?,?,?,?)';
        connection.query(insertTodo, [dailyid, content, subject, date, 0 ] , async(err,result)=>{
            if(err) console.log(err);
            else{
                console.log('daily 추가 성공');
                return res.redirect('/dailynote/list');
                //return res.send(content);
            }
        });
    }catch(err){
        console.log(err);
    }
});

module.exports = router;