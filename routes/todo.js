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
    //const todoid = req.body.todoid;
    //const token = req.body.token;
    //const todoid = 'ex2';
    const todoid = req.decoded.id;
    try{
        console.log("todoid: "+todoid);
        //console.log("req.cookies: "+req.cookies);
        const searchList = "SELECT * from todo WHERE todoid = ?";
        connection.query(searchList, todoid, (err,result)=>{
            console.log(result);
            if (result.length==0){
                return res.json({success : true, message : '아직 todo 없음'});
            }
            return res.send(result);
        })
    }catch(err){
        console.error(err);
        return res.json({success : false, message : 'todo list 오류'});
    }
});

router.post('/change', (req,res)=>{
    const index =req.body.index;
    const content = req.body.content;
    try{
        const sqlCheck = "UPDATE todo SET content = ? WHERE `index` = ?";
        connection.query(sqlCheck, [content, index] , (err, result)=>{
            console.log(result);
            if(err){
                console.log(err);
                return res.json({success : false, message : 'todo change 오류'});
            }else{
                console.log('change 성공');
                return res.redirect('/todo/list');
            }
        })
    }catch(err){
        console.log(err);
    }
});

router.post('/check', (req,res)=>{
    const index =req.body.index;
    try{
        const sqlSearch = "SELECT `check` from todo WHERE `index`=?";
        connection.query(sqlSearch, index, (err,result)=>{
            console.log(result[0].check);
            const ck = result[0].check;
            console.log(ck);

            const sqlCheck = "UPDATE todo SET `check` = ? WHERE `index` = ?";
            if (ck==1){
                connection.query(sqlCheck, [0, index] , (err, result2)=>{
                    console.log(result2);
                    if(err){
                        console.log(err);
                        return res.json({success : false, message : 'todo check to 0 오류'});
                    }else{
                        console.log('update 성공');
                        return res.redirect('/todo/list');
                    }
                })
            }else{
                connection.query(sqlCheck, [1, index ], (err, result2)=>{
                    console.log(result2);
                    if(err){
                        console.log(err);
                        return res.json({success : false, message : 'todo check to 1 오류'});
                    }else{
                        console.log('update 성공');
                        return res.redirect('/todo/list');
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
        const sqlDelete = "DELETE FROM todo WHERE `index` = ?";
        connection.query(sqlDelete, index, (err, result)=>{
            console.log(result);
            if(err){
                console.log(err);
                return res.json({success : false, message : 'todo delete 오류'});
            }
            else{
                console.log("Number of records deleted: " + result.affectedRows);
                return res.redirect('/todo/list');
            }
        });
    }catch(err){
        console.log(err);
    }
}
);


router.post('/insert', verifyToken, (req,res)=>{
    const todoid = req.decoded.id;
    const content = req.body.content;
    try{
        console.log(todoid);
        console.log(content);
        console.log(moment().format("YYYY-MM-DD"));
        const insertTodo = 'INSERT INTO todo (todoid, content, date, `check`) VALUES(?,?,?,?)';
        connection.query(insertTodo, [todoid, content, moment().format("YYYY-MM-DD"), 0 ] , async(err,result)=>{
            if(err) console.log(err);
            else{
                console.log('todo 추가 성공');
                return res.redirect('/todo/list');
                //return res.send(content);
            }
        });
    }catch(err){
        console.log(err);
        return res.json({success : false, message : 'todo 추가 오류'});
    }

});

module.exports = router;