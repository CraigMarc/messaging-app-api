const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("./models/user");
const compression = require("compression");
const helmet = require("helmet");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(compression());

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);


app.use(
  cors({
    origin: ["http://localhost:5173", "https://blog-public-two.vercel.app", "https://blog-user-beta.vercel.app"],
    credentials: true,
  })
);

/*
app.use(cors());*/

// connect database

const mongoDB = process.env.MONGODB_URI 

main().catch((err) => console.log(err));
async function main() {
await mongoose.connect(mongoDB);
}

//added auth route


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY; //normally store this in process.env.secret
//opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT')

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  
  try {
  let userDb = User.findOne({userName: jwt_payload.userName})
    
    if (userDb) {
        return done(null, true);
    } else {
        return done(null, false);
        
    }
  }
  catch (error) {
    console.log(error)
  }
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));
app.use('/', indexRouter);
//app.use('/users', usersRouter);
// protect users routess
app.use('/users', passport.authenticate('jwt', {session: false}), usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
