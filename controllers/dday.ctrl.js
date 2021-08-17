const express = require('express');
const solux_db = require('../models/db')();
const connection = solux_db.init();
solux_db.test_open(connection);

const list = (req,res)=>{
    const id = req.decoded.id;
    try{
        console.log('id : '+id);
        const sqlSearch = "SELECT * from dday WHERE ddayid = ?";
        connection.query(sqlSearch, id, (err,result)=>{
            if(err) console.log(err);
            else{
                if(result.length==0){
                    return res.json({success : true, message : '아직 dday 없음'});
                }
                return res.send(result);
            }
        });
    }catch(err){
        console.log(err);
    }
};

const insert = (req,res)=>{ 
    const { id, date, content } = req.body;
    try{
        console.log('id : '+id);
        const sqlInsert = "INSERT INTO dday (ddayid, date, content) VALUES (?,?,?)";
        connection.query(sqlInsert, [id,date,content], (err, result)=>{
            if(err){
                console.log(err);
                return res.json({success : false, message : 'dday insert 오류'});
            }
            else{
                return res.redirect('/dday/list');
            }
        });
    }catch(err){
        console.log(err);
    }   
};

const del = (req,res)=>{
    console.log('delete 실행 시작');
    const index = req.body.index;
    try{
        const sqlDelete = "DELETE FROM dday WHERE `index` = ?";
        connection.query(sqlDelete, index, (err, result)=>{
            console.log(result);
            if(err){
                console.log(err);
                return res.json({success : false, message : 'dday delete 오류'});
            }
            else{
                console.log("Number of records deleted: " + result.affectedRows);
                return res.redirect('/dday/list');
            }
        });
    }catch(err){
        console.log(err);
    }
};

const changeDate = (req,res)=>{
    const { idx, date } = req.body;
    try{
        const sqlChangeDate = "UPDATE dday SET date = ? WHERE `index`= ?";
        connection.query(sqlChangeDate, [date, idx], (err,result)=>{
            if(err) console.log(err);
            else{
                console.log('수정 성공');
                res.redirect('/dday/list');
            }
        })
    }catch(err){
        console.log(err);
        return res.json({success : false, message : 'dday 날짜 수정 오류'});
    }  
};

const changeCont = (req,res)=>{
    const { idx, content } = req.body;
    try{
        const sqlChangeDate = "UPDATE dday SET content = ? WHERE `index`= ?";
        connection.query(sqlChangeDate, [content, idx], (err,result)=>{
            if(err) console.log(err);
            else{
                console.log('수정 성공');
                res.redirect('/dday/list');
            }
        })
    }catch(err){
        console.log(err);
        return res.json({success : false, message : 'dday 내용 수정 오류'});
    }
};

module.exports = {
    list,
    insert,
    del,
    changeCont,
    changeDate
}