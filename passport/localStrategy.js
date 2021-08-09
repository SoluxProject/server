const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const jwtStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const db_solux = require('../models/db')();
const connection = db_solux.init();

db_solux.test_open(connection);

module.exports = ()=>{
    passport.use(new LocalStrategy({
        usernameField : 'id', //req.body.id
        passwordField : 'pw', //req.body.pw
    }, async (id, pw, done)=>{
        try{
            console.log('******* passport / local ', id, pw);
            const searchId = "SELECT * FROM user WHERE id=?";
            connection.query(searchId, id, async(err, exUser)=>{
                console.log('exUser : '+exUser.length);
                if(exUser.length!=0){ 
                    console.log('로그인 중'+exUser[0].id);
                    const result = await bcrypt.compare(pw, exUser[0].pw);
                    
                    
                    if (result){
                        done(null,exUser[0]);
                    }else{
                        done(null,false, {message : '비밀번호가 일치하지 않습니다'});
                    }
                }else{
                    done(null,false,{message : '가입되지 않은 회원입니다.'});
                }
            })
        }catch(err){
            console.error(err);
            done(err);
        }
    }));
    /*
    passport.use(new jwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),        secretOrKey : 'jwt-secret-key',
    }, async(payload, done)=>{
        var user;
        try{
            const searchId = "SELECT * FROM user WHERE id=?";
            await connection.query(searchId, [payload.id], async(err,results)=>{
                if(!result[0]) return done(null,false);
                user = result[0];

                console.log(user);
                return done(null,user);
            });
        }catch(err){
            return done(err);
        }
    }))
    */
}

//done(서버에러, 로그인 성공시 user 객체, 로그인 실패시 메세지)