const express = require('express');
const db = require('../models/db')();
const connection = db.init();
db.test_open(connection);

const rank = (req,res)=>{
    try{
        const rankSelect = "SELECT * FROM timerWeek ORDER BY recordWeek DESC Limit 5";
        connection.query(rankSelect, (err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                return res.json({
                    success : true, 
                    data : result
                })
            }
        } )
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    rank
};