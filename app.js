const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('./passport');

dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const todoRouter = require('./routes/todo');
const ddayRouter = require('./routes/dday');
const mypageRouter = require('./routes/mypage');
const dailyRouter = require('./routes/dailynote');
const timerWRouter = require('./routes/timerWeek');
const timerDRouter = require('./routes/timerDay');
const manageRouter = require('./routes/manage');

const app = express();

app.set('port', process.env.PORT || 3001);
app.set("etag",false);
const options = { etag : false };
passportConfig();

app.use(morgan('dev'));
//app.use(express.static(path.join(__dirname, 'public'),options));
app.use(express.static(path.join(__dirname, '../client/build/'),options));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/',pageRouter);
app.use('/auth',authRouter);
app.use('/todo',todoRouter);
app.use('/dday',ddayRouter);
app.use('/mypage', mypageRouter);
app.use('/dailynote', dailyRouter);
app.use('/timerWeek', timerWRouter);
app.use('/timerDay', timerDRouter);
app.use('/manage', manageRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});