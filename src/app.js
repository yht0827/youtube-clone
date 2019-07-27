import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import session from 'express-session';
import path from 'path';
import MongoStore from 'connect-mongo';
import flash from 'express-flash';
import globalRouter from './routers/globalRouter';
import apiRouter from './routers/apiRrouter';
import { localsMiddleware } from './middlewares';
import './passport';

const app = express();

const CookieStore = MongoStore(session); // session을 mongodb에 저장

// view engine(jade)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// static
app.use('/static', express.static(path.join(__dirname, 'static')));

// middlewares

app.use(helmet()); // secure
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
  session({
    // express에서 세션을 관리하기 위한 미들웨어
    secret: process.env.COOKIE_SECRET, // 랜덤한 문자열 저장
    resave: true, // session을 강제로 저장
    saveUninitialized: false, // 초기화 되지 않은 세션을 저장소에 저장
    store: new CookieStore({ mongooseConnection: mongoose.connection }) // moongoose는 저장소를 mongodb에 연결
  })
);
app.use(passport.initialize());
app.use(passport.session()); // 쿠키에대한 사용자 찾아주고 쿠키를 req.user로 만들어준다.
app.use(flash());

// locals middlewares

app.use(localsMiddleware);

// routes

app.use('/', globalRouter);
app.use('/api', apiRouter);

export default app;
