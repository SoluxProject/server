const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const solux_db = require('../models/db')();
const connection = solux_db.init();
solux_db.test_open(connection);

const join = async (req, res, next) => {
    const { id, pw, email, major, name, tel } = req.body;
    try {
        const sqlSearch = "SELECT * from user where id=?";

        connection.query(sqlSearch, id, async (err, result) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: "회원가입 실패" })
            }
            else {
                console.log(result);
                if (result.length != 0) { //해당 id가 존재할때
                    console.log('이미 존재하는 id');
                    return res.json({ success: false, message: "이미 존재하는 id 입니다." })
                }
                const hash = await bcrypt.hash(pw, 12);
                const sqlInsert = "INSERT INTO user (id,pw,email,major,name,tel) VALUES (?,?,?,?,?,?)"
                connection.query(sqlInsert, [id, hash, email, major, name, tel], (err, result) => {
                    if (err) console.log(err);
                    else {
                        console.log('회원가입 성공 후 이동');
                        const timerDayInsert = "INSERT INTO timerDay (timerDayid) VALUES (?)";
                        connection.query(timerDayInsert, [id], (err, result) => {
                            if (err) console.log(err);
                            else {
                                console.log('timerDay 추가');
                                const timerWeekInsert = "INSERT INTO timerWeek (timerWeekid) VALUES (?)";
                                connection.query(timerWeekInsert, [id], (err, result) => {
                                    if (err) console.log(err);
                                    else {
                                        console.log('timerWeek 추가');
                                        return res.json({ success: true, message: "회원가입 성공" });
                                    }
                                })
                            }
                        })
                    }
                });
            }
        });

    } catch (err) {
        console.log(err);
        return next(err);
    }
};

const login = (req, res, next) => {
    passport.authenticate('local', { session: false }, (authError, user, info) => {
        if (authError) {//서버 에러의 경우
            console.error(authError);
            return next(authError);
        }
        if (!user) { //로그인 실패
            console.log('회원이 아닙니다');
            return res.json({ success: false, message: info.message });
        }
        return req.login(user, { session: false }, (loginError) => {//로그인 성공
            if (loginError) {//index의 serializeUser 성공 후 실행
                console.error(loginError);
                return next(loginError);
            }
            const token = jwt.sign(
                { id: user.id }, process.env.JWT_SECRET, { expiresIn: "1m" });
            console.log('로그인 성공');
            console.log(user.id);
            //세션 쿠키를 브라우저로 보내줘요.
            //return res.json({success : true, message : "로그인 성공", token});
            console.log(token);
            res.cookie("loginToken", token, { maxAge: 60000 });
            return res.json({ success: true, message: "로그인 성공" });
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

const logout = (req, res) => {
    console.log('로그아웃');
    res.clearCookie("loginToken");
    req.logout();
    req.session.destroy();
    return res.status(205).json({ success: true, message: "로그아웃 성공" });
};

const searchId = (req, res) => {
    const { name, tel } = req.body;
    try {
        console.log(name + "," + tel);
        const sqlSearch = "SELECT id from user WHERE name = ? AND tel = ?";
        connection.query(sqlSearch, [name, tel], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                if (result.length == 0) {
                    console.log('존재하지 않는 회원');
                    return res.json({ result: false, message: '존재하지 않는 회원입니다.' });
                }
                else {
                    console.log('ID 찾기 성공');
                    return res.json({ result: true, message: result });
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
};

const searchPw = (req, res) => {
    const { id, name, newPw } = req.body;
    try {
        console.log(id + "," + name);
        const sqlSearch = "SELECT * from user WHERE id = ? AND name = ?";
        connection.query(sqlSearch, [id, name], async (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                if (result.length == 0) {
                    console.log('존재하지 않는 회원');
                    return res.json({ result: false, message: '존재하지 않는 회원입니다.' });
                }
                else {
                    const pwUpdate = "UPDATE user SET pw = ? WHERE id=? AND name = ?";
                    const hash = await bcrypt.hash(newPw, 12);
                    connection.query(pwUpdate, [hash, id, name], async (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.json({ result: false, message: '비밀번호 변경 오류입니다.' });
                        }
                        else {
                            console.log('pw변경 성공');
                            return res.json({ result: true, message: '비밀번호 변경 완료' });
                        }
                    })
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
};

const checkId = (req, res) => {
    const id = req.body.id;
    try {
        console.log(id);
        const checkId = "SELECT * from user WHERE id=?";
        connection.query(checkId, id, async (err, result) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: 'ID 중복확인 오류' });
            }
            if (result.length != 0) {
                console.log('이미 사용중인 ID');
                return res.json({ success: false, message: '이미 사용중인 ID 입니다.' });
            }
            else {
                console.log('사용가능한 ID');
                return res.json({ success: true, message: '사용가능한 ID 입니다.' });
            }
        })
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    join,
    login, 
    logout,
    searchId,
    searchPw,
    checkId
}