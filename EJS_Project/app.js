var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const moment = require('moment');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home', { title: 'Home', page: 'home' });
});

app.get('/home', (req, res) => {
  res.render('home',  { title: 'Home', page: 'home' });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/film', (req, res) => {
  res.render('contenuti',  { title: 'FILM', page: 'film' });
});

app.get('/serieTV', (req, res) => {
  res.render('contenuti',  { title: 'SERIE TV', page: 'serieTV' });
});

app.get('/contatti', (req, res) => {
  res.render('contatti',  { title: 'Contatti', page: 'contatti' });
});

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
