const dotenv = require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var fs = require('fs');
let mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
  console.log("Well done! , connected with mongoDB database");
}).on('error', error => {
  console.log("Oops! database connection error:" + error);
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
const apispaths = [
	{ pathUrl: '/register', routeFile: 'register' },
	{ pathUrl: '/login', routeFile: 'login' },
  { pathUrl: '/profile', routeFile: 'profile' }
];
apispaths.forEach((path) => {
	app.use('/apis/v1' + path.pathUrl, require('./routes/apis/v1/' + path.routeFile));
});
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
