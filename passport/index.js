  
const passport = require('passport');
const local = require('./localStrategy');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const db_solux = require('../models/db')();
const connection = db_solux.init();

db_solux.test_open(connection);

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); //세션에 user의 id만 저장
  });

  passport.deserializeUser((id, done) => {
    //id로 user의 전체 정보 (id,pw,email,major,name)복구하는 작업
    const searchId = "SELECT * from user where id = ?";
    connection.query(searchId, id, (err,result)=>{
      try{
        if(result.length!=0){
          user=>done(null,user); //req.user, req.isAuthenticated()
        }
      }catch(err){
        console.error(err);
        err => done(err);
      }
    })
  });

  local();
};
//메모리의 효율성을 위해 serializeUser, deserializeUser 사용.