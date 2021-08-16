const express = require('express');
const solux_db = require('../models/db')();
const connection = solux_db.init();
solux_db.test_open(connection);

const list = (req, res) => {
    const manageid = req.decoded.id;
    try{
        const searchList = "SELECT * from manage WHERE manageid = ?";
        connection.query(searchList, manageid, (err,result)=>{
            console.log(result);
            if (result.length==0){
                return res.json({success : true, message : '등록된 시험일정 없음'});
            }
            return res.send(result);
        })
    }catch(err){
        console.error(err);
        return res.json({success : false, message : '시험일정 조회 오류'});
    }
}

const insert = (req, res) => {
    const manageid = req.decoded.id;
    const { date, subject } = req.body;
    try {
        console.log(manageid);
        const insertTodo = 'INSERT INTO manage (manageid, subject, date) VALUES(?,?,?)';
        connection.query(insertTodo, [manageid, subject, date], async (err, result) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: '시험일정 추가 오류' });
            }
            else {
                console.log('시험일정 추가 완료');
                return res.redirect('/manage/list');
            }
        });
    } catch (err) {
        console.log(err);
    }
}

const del = (req, res) =>{
    const index = req.body.index;
    try{
        const sqlDelete = "DELETE FROM manage WHERE `index` = ?";
        connection.query(sqlDelete, index, (err, result)=>{
            console.log(result);
            if(err){
                console.log(err);
                return res.json({success : false, message : '시험일정 삭제 오류'});
            }
            else{
                console.log("Number of records deleted: " + result.affectedRows);
                return res.redirect('/manage/list');
            }
        });
    }catch(err){
        console.log(err);
    }
}

const changeSub = (req, res) => {
    const index =req.body.index;
    const subject  = req.body.subject;
    try{
        const sqlCheck = "UPDATE manage SET subject = ? WHERE `index` = ?";
        connection.query(sqlCheck, [subject, index] , (err, result)=>{
            if(err){
                console.log(err);
                return res.json({success : false, message : '시험일정 시험명 변경 오류'});
            }else{
                console.log('시험명 변경 완료');
                return res.redirect('/manage/list');
            }
        })
    }catch(err){
        console.log(err);
    }
}

const changeDate = (req, res) => {
    const index =req.body.index;
    const date  = req.body.date;
    try{
        const sqlCheck = "UPDATE manage SET date = ? WHERE `index` = ?";
        connection.query(sqlCheck, [date, index] , (err, result)=>{
            if(err){
                console.log(err);
                return res.json({success : false, message : '시험일정 날짜 변경 오류'});
            }else{
                console.log('시험 날짜 변경 완료');
                return res.redirect('/manage/list');
            }
        })
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    list,
    insert,
    del,
    changeSub,
    changeDate
};