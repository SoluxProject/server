const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
//const pageRouter = require('./page');
const mysql = require('mysql');
const { isLoggedIn, isNotLoggedIn, verifyToken } = require('./middlewares');
const db = require('../models/db');
const path = require('path');

const router = express.Router();

const solux_db = require('../models/db')();
const connection = solux_db.init();

solux_db.test_open(connection);

router.post('/join', isNotLoggedIn, async(req,res,next)=>{
    const { id, pw, email, major, name } = req.body;
    try{
        const sqlSearch = "SELECT * from user where id=?";

        connection.query(sqlSearch, id, async(err,result)=>{
            console.log(result);
            if(result.length !=0 ){ //해당 id가 존재할때
                console.log('이미 존재하는 id');
                return res.send('이미 회원임');
            }
            const hash = await bcrypt.hash(pw, 12);
            const sqlInsert = "INSERT INTO user (id,pw,email,major,name) VALUES (?,?,?,?,?)"
            connection.query(sqlInsert, [id,hash,email,major,name], (err,result)=>{
            if (err) console.log(err);
            else {
                console.log('회원가입 성공 후 이동');
                return res.send(id);
            }
            });  
        } );
  
    }catch(err){
        console.log(err);
        return next(err);
    }
});

router.post('/login', isNotLoggedIn, (req,res,next)=>{
    passport.authenticate('local', {session : false},(authError, user, info) => {
        if (authError) {//서버 에러의 경우
          console.error(authError);
          return next(authError);
        }
        if (!user) { //로그인 실패
            console.log('회원이 아닙니다');
          return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user,{session : false}, (loginError) => {//로그인 성공
          if (loginError) {//index의 serializeUser 성공 후 실행
            console.error(loginError);
            return next(loginError);
          }
          //req.session.userid = user.id;
          //console.log(req.session);
          const token = jwt.sign(
            { id : user.id },process.env.JWT_SECRET, {expiresIn : "1m"});
          console.log('로그인 성공');
          console.log(user.id);
          //세션 쿠키를 브라우저로 보내줘요.
        //return res.json({success : true, message : "로그인 성공", token});
        console.log(token);
        res.cookie("loginToken", token , {maxAge : 60000});
        return res.json({ jwt: "token"});
        //return res.json({ result : 'ok', token });
        });
      })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
    });



router.get('/logout', isLoggedIn, (req,res)=>{
    console.log('로그아웃');
    //req.cookies.set('loginToken');
    //res.status=240;
    res.clearCookie("loginToken");
    req.logout();
    req.session.destroy();
    return res.status(205).send('로그아웃 성공');
});

router.get('/searchId', isNotLoggedIn, (req,res)=>{

})

router.post('/searchPw', isNotLoggedIn, (req,res)=>{
  const { id, name, newPw } = req.body;
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


module.exports = router;