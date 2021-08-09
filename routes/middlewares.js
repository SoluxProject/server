const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
    if(req.cookies.loginToken)  { 
  //if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send('로그인 필요');
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if(!req.cookies.loginToken){
    //if (!req.isAuthenticated()) {
      next();
    } else {  
      const message = encodeURIComponent('로그인한 상태입니다.');
      res.redirect(`/?error=${message}`);
    }
  };

  exports.verifyToken = (req,res,next)=>{
    try{
      const token = req.cookies.loginToken;
      //const token = req.headers.authorization.split('Bearer')[1];

      req.decoded = jwt.verify(token,process.env.JWT_SECRET);
      return next();
      
    }catch(err){
      if(err.name == 'TokenExpiredError'){
        return res.status(419).json({success : false, message : "token 만료"});
      }
      return res.status(401).json({success : false, message : "token이 유효하지 않습니다."});
    }
  };