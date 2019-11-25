import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan"; // logger middleware
import bodyParser from "body-parser";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import session from "express-session";

const app = express();
app.set('view engine', "pug");
// globally middlewares ex) ip ban... check log..
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(session({
    key: 'sid', 
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
    }
  }))

//--------------------------------
app.use(routes.home, userRouter);

export default app;