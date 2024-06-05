'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const moment = require('moment');
const contentDao = require('./models/content-dao.js');
const userDao = require('./models/user-dao.js'); 
const contentRouter = require('./routes/contentRouter');
const userRouter = require('./routes/userRouter');
const loggedRouter = require('./routes/loggedRouter');
const administratorRouter = require('./routes/administratorRouter');
const sessionsRouter = require('./routes/sessions'); // Assicurati di importare il sessionsRouter

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const app = express();

app.use(function (req, res, next) {
  app.locals.moment = moment;
  app.locals.title = '';
  app.locals.message = '';
  app.locals.active = '';
  next();
});

// Configurazione view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then(({user, check}) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      if (!check) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      return done(null, user);
    }).catch(err => done(err));
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userDao.getUserById(id).then(user => {
    done(null, user);
  }).catch(err => done(err));
});

app.use(session({
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    next();
  else
    res.redirect('/login');
}

function isLoggedInAsAdministrator(req, res, next) {

  if (req.isAuthenticated()) {
    if (req.user.tipologia === 'amministratore') {
      return next();
    } else {
      res.redirect('/registrazione');
    }
  } else {
    res.redirect('/login');
  }
}

app.get('/', async (req, res) => {
  try {
    const ultimeUscite = await contentDao.getUltimeUscite();
    const top3Contenuti = await contentDao.getTopContenuti();
    res.render('home', { title: 'Home', page: 'home', ultimeUscite: ultimeUscite, top3: top3Contenuti });
  } catch (error) {
    console.error('Error during fetching homepage', error);
    res.status(500).send('Errore durante il recupero della homepage');
  }
});

app.get('/home', async (req, res) => {
  try {
    const ultimeUscite = await contentDao.getUltimeUscite();
    const top3Contenuti = await contentDao.getTopContenuti();
    res.render('home', { title: 'Home', page: 'home', ultimeUscite: ultimeUscite, top3: top3Contenuti });
  } catch (error) {
    console.error('Error during fetching homepage', error);
    res.status(500).send('Errore durante il recupero della homepage');
  }
});

app.get('/registrazione', (req, res) => {
  res.render('registrazione', {title: 'Registrazione', button: 'Registrati', profilo: {} });
});

app.get('/contatti', (req, res) => {
  res.render('contatti', { title: 'Contatti', page: 'contatti' });
});

app.use('/', contentRouter);
app.use('/', userRouter);
app.use('/', sessionsRouter); 
app.use('/', isLoggedIn, loggedRouter);
app.use('/', isLoggedInAsAdministrator, administratorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;