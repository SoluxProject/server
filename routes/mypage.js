const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn, verifyToken } = require('./middlewares');
const router = express.Router();

const db = require('../models/db')();
const connection = db.init();

db.test_open(connection);

router.get('/info', verifyToken, (req,res)=>{
    const id = req.decoded.id;
    try{
      console.log(id);
      const sqlInfo = "SELECT * from user WHERE id = ?";
      connection.query(sqlInfo, id, (err,result)=>{
        if(result.length!=0){
          console.log(result);
          return res.send(result);
        }
        else{
          console.log('잘못된 ID');
  
        }
      })
    }catch(err){
      console.log(err);
    }
  })

router.post('/changePw', verifyToken, (req,res)=>{
    const id = req.decoded.id;
    const { name, newPw } = req.body;
    try{
      console.log(id+","+name);
      const sqlSearch = "SELECT * from user WHERE id = ? AND name = ?";
      connection.query(sqlSearch, [id, name], async(err,result)=>{
        if(err) {
          console.log(err);
        }
        else{
        if(result.length ==0 ){
          console.log('존재하지 않는 회원');
          return res.json({result : false, message : '존재하지 않는 회원입니다.'});
        }
        else{
          const pwUpdate = "UPDATE user SET pw = ? WHERE id=? AND name = ?";
          const hash = await bcrypt.hash(newPw,12);
          connection.query(pwUpdate, [hash, id, name] , async(err,result)=>{
            if(err){
              console.log(err);
              return res.json({result : false, message : '비밀번호 변경 오류입니다.'});
            }
            else{
              console.log('pw변경 성공');
              return res.json({result : true, message : '비밀번호 변경 완료'});
            }
        })}
      }});
    }catch(err){
      console.log(err);
    }
  })  

router.post('/changeEmail', verifyToken, (req,res)=>{
    const id = req.decoded.id;
    const { newEmail } = req.body;
    try{  
        console.log(id+","+newEmail);
        const sqlSearch = "SELECT * from user WHERE id=?";
        connection.query(sqlSearch, id, (err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result.length==0){
                    console.log('존재하지 않는 회원');
                    return res.json({result : false, message : '존재하지 않는 회원입니다.'});
                }
                else{
                    const emailUpdate = "UPDATE user SET email = ? WHERE id = ?";
                    connection.query(emailUpdate, [newEmail, id], (err,result)=>{
                        if(err) {
                            console.log(err);
                            return res.json({result : false, message : 'email 변경 오류'});
                        }
                        else{
                            console.log('email 변경 성공');
                            return res.json({result: true, message : 'email 변경 완료'});
                        }
                    })
                }
            }
        })
    }catch(err){
        console.log(err);
    }  
})  

router.post('/changeMajor', verifyToken, (req,res)=>{
    const id = req.decoded.id;
    const { newMajor } = req.body;
    try{
        console.log(id+","+newMajor);
        const sqlSearch = "SELECT * from user WHERE id = ?";
        connection.query(sqlSearch, id, (err,result)=>{
            if(err) console.log(err);
            else{
                if(result.length==0){
                    console.log('존재하지 않는 회원');
                    return res.json({result : false, message : '존재하지 않는 회원입니다.'});
                }
                else{
                    const majorUpdate = "UPDATE user SET major = ? WHERE id = ?";
                    connection.query(majorUpdate, [newMajor, id], (err,result)=>{
                        if(err){
                            console.log(err);
                            return res.json({result : false, message : 'major 변경 오류'});
                        }
                        else{
                            console.log('major 변경 성공');
                            return res.json({result : true, message : 'major 변경 완료'});
                        }
                    })
                }
            }
        })
    }catch(err){
        console.log(err);
    }
} )


 


  module.exports = router;