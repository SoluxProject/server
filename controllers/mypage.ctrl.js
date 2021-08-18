const express = require('express');
//const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const { isLoggedIn, isNotLoggedIn, verifyToken } = require('./middlewares');
const db = require('../models/db')();
const connection = db.init();
db.test_open(connection);

const info = (req,res)=>{
    const id = req.decoded.id;
    try{
      console.log(id);
      const sqlInfo = "SELECT * from user WHERE id = ?";
      connection.query(sqlInfo, id, (err,result)=>{
        if(result.length!=0){
          console.log(result);
          return res.json({ success : true, data : result});
        }
        else{
          console.log('잘못된 ID');
          return res.json({ success : false, message : '잘못된 ID'});
        }
      })
    }catch(err){
      console.log(err);
    }
  }

const changePw = (req,res)=>{
    const id = req.decoded.id;
    const { name, newPw } = req.body;
    try{
      console.log(id+","+name);
      const sqlSearch = "SELECT * from user WHERE id = ? AND name = ?";
      connection.query(sqlSearch, [id, name], async(err,result)=>{
        if(err) {
          console.log(err);
          return res.json({success : false, message : '비밀번호 변경 오류입니다.'});

        }
        else{
        if(result.length ==0 ){
          console.log('존재하지 않는 회원');
          return res.json({success : false, message : '존재하지 않는 회원입니다.'});
        }
        else{
          const pwUpdate = "UPDATE user SET pw = ? WHERE id=? AND name = ?";
          const hash = await bcrypt.hash(newPw,12);
          connection.query(pwUpdate, [hash, id, name] , async(err,result)=>{
            if(err){
              console.log(err);
              return res.json({success : false, message : '비밀번호 변경 오류입니다.'});
            }
            else{
              console.log('pw변경 성공');
              return res.json({success : true, message : '비밀번호 변경 완료'});
            }
        })}
      }});
    }catch(err){
      console.log(err);
    }
  } 

const changeEmail = (req,res)=>{
    const id = req.decoded.id;
    const { newEmail } = req.body;
    try{  
        console.log(id+","+newEmail);
        const sqlSearch = "SELECT * from user WHERE id=?";
        connection.query(sqlSearch, id, (err,result)=>{
            if(err){
                console.log(err);
                return res.json({success : false, message : 'email 변경 오류'});
            }
            else{
                if(result.length==0){
                    console.log('존재하지 않는 회원');
                    return res.json({success : false, message : '존재하지 않는 회원입니다.'});
                }
                else{
                    const emailUpdate = "UPDATE user SET email = ? WHERE id = ?";
                    connection.query(emailUpdate, [newEmail, id], (err,result)=>{
                        if(err) {
                            console.log(err);
                            return res.json({success : false, message : 'email 변경 오류'});
                        }
                        else{
                            console.log('email 변경 성공');
                            return res.json({success: true, message : 'email 변경 완료'});
                        }
                    })
                }
            }
        })
    }catch(err){
        console.log(err);
    }  
}

const changeMajor = (req,res)=>{
    const id = req.decoded.id;
    const { newMajor } = req.body;
    try{
        console.log(id+","+newMajor);
        const sqlSearch = "SELECT * from user WHERE id = ?";
        connection.query(sqlSearch, id, (err,result)=>{
            if(err) {
               console.log(err);
               return res.json({success : false, message : 'major 변경 오류'});
            }
            else{
                if(result.length==0){
                    console.log('존재하지 않는 회원');
                    return res.json({success : false, message : '존재하지 않는 회원입니다.'});
                }
                else{
                    const majorUpdate = "UPDATE user SET major = ? WHERE id = ?";
                    connection.query(majorUpdate, [newMajor, id], (err,result)=>{
                        if(err){
                            console.log(err);
                            return res.json({success : false, message : 'major 변경 오류'});
                        }
                        else{
                            console.log('major 변경 성공');
                            return res.json({success : true, message : 'major 변경 완료'});
                        }
                    })
                }
            }
        })
    }catch(err){
        console.log(err);
    }
}

const changeTel = (req,res)=>{
  const id = req.decoded.id;
  const { newTel } = req.body;
  try{
    console.log(id+","+newTel);
    const sqlSearch = "SELECT * from user WHERE id = ?";
    connection.query(sqlSearch, id, (err,result)=>{
      if(err) {
        console.log(err);
        return res.json({success : false, message : 'tel 변경 오류'});
      }
      else{
        if(result.length==0){
          console.log('존재하지 않는 회원');
          return res.json({success : false, message : '존재하지 않는 회원입니다.'});
        }
        else{
          const telUpdate = "UPDATE user SET tel = ? WHERE id = ?";
          connection.query(telUpdate, [newTel, id], (err,result)=>{
            if(err){
              console.log(err);
              return res.json({success : false, message : 'tel 변경 오류'});
            }
            else{
              console.log('tel 변경 성공');
              return res.json({success : true, message : 'tel 변경 완료'});
            }
          })
        }
      }
    })
  }catch(err){
    console.log(err);
  }
}

module.exports = {
    info,
    changePw,
    changeEmail,
    changeMajor,
    changeTel
};