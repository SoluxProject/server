const mysql = require('mysql');

module.exports = function () {
  return {
    init: function () {
      return mysql.createConnection({
        host: 'standingdb.ccmxiwd7rqpg.us-east-2.rds.amazonaws.com',
        port: '3306',
        user: 'standing',
        password: 'standing1011',
        database: 'solux'
      })
    },
    
    test_open: function (con) {
      con.connect(function (err) {
        if (err) {
          console.error('mysql connection error :' + err);
        } else {
          console.info('mysql is connected successfully.');
        }
      })
    }
  }
};