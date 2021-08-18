const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
    if(req.cookies.loginToken)  { 
      next();
    } else {
      res.status(403).send('로그인 필요');
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if(!req.cookies.loginToken){
      next();
    } else {  
      res.json({success : false, message : '로그인한 상태입니다.'});
    }
  };

  exports.verifyToken = (req,res,next)=>{
    try{
      const token = req.cookies.loginToken;

      req.decoded = jwt.verify(token,process.env.JWT_SECRET);
      return next();
      
    }catch(err){
      if(err.name == 'TokenExpiredError'){
        return res.status(419).json({success : false, message : "token 만료"});
      }
      return res.status(401).json({success : false, message : "token이 유효하지 않습니다."});
    }
  };