// const MongoDB = require('mongodb');
// const mongoClient = MongoDB.MongoClient;
// // const url = 'mongodb://localhost/twitter-lab-development';

var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authController = require('./routes/authController');
const tweetsController = require("./routes/tweetsController");

//session no viene en el enunciado, solo la descarga
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
mongoose.connect('mongodb://localhost/twitter-lab-development');


// const url = `mongodb://localhost:27017/twitter-lab-development`
//
// mongoClient.connect(url, (error, db) => {
//   if (error) {
//     console.log('Error trying to connect to the Database');
//     console.log(error);
//   } else {
//     console.log('Connection established correctly!! 😬');
//
//   }
// });


// other code
//session no viene en el enunciado, solo la descarga
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use("/", authController);
app.use('/', index);
app.use('/users', users);
app.use("/tweets", tweetsController)


app.use(expressLayouts);
app.set("layout", "layouts/main-layout");



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
