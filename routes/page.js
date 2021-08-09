const express = require('express');
const mysql = require('mysql');
const { isLoggedIn, isNotLoggedIn, verifyToken } = require('./middlewares');

const router = express.Router();

const solux_db = require('../models/db')();
const connection = solux_db.init();

solux_db.test_open(connection);

router.get('/join', isNotLoggedIn, (req,res)=>{
    console.log('회원가입으로 이동');
    res.redirect('/auth/join');
});

router.get('/login', isNotLoggedIn, (req,res)=>{
    console.log('로그인으로 이동');
    res.redirect('/auth/login');
})

/*
router.get('/todo',verifyToken, (req,res)=>{
    console.log('todo로 이동');
    res.redirect('/todo/list');
})
*/

router.get('/', (req,res,next)=>{
    //res.render('todo.html');
    console.log(req.cookies.user_id);
    res.sendFile('index.html');
    /*
    const sqlConnect = "SELECT * FROM user";
    connection.query(sqlConnect, (err,rows, fileds)=>{
        if(!err){
            for(var i=0;i<rows.length;i++){
                console.log(rows[i]);
            }
            res.redirect('/join');
        }else {
            console.log('query error : '+error);
        }
    });
    */
});




module.exports = router;