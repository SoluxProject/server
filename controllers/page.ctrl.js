const express = require('express');
const solux_db = require('../models/db')();
const connection = solux_db.init();

const join = (req, res) => {
    console.log('회원가입으로 이동');
    res.redirect('/auth/join');
};

const login = (req,res)=>{
    console.log('로그인으로 이동');
    res.redirect('/auth/login');
}

const main = (req,res,next)=>{
    //console.log(req.cookies.user_id);
    res.sendFile('index.html');
};

/*
router.get('/', (req,res,next)=>{
    //res.render('todo.html');
    console.log(req.cookies.user_id);
    res.sendFile('index.html');
    });
 */

module.exports = {
    main,
    login,
    join
};