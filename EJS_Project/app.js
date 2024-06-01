'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const contentDao = require('./models/content-dao.js');
const userDao = require('./models/user-dao.js'); // Import userDao
const contentRouter = require('./routes/contentRouter');
const userRouter = require('./routes/userRouter');

const app = express();

// Configurazione view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/registrazione', (req, res) => {
  res.render('registrazione');
});

app.get('/contatti', (req, res) => {
  res.render('contatti', { title: 'Contatti', page: 'contatti' });
});

// Usa il contentRouter per le rotte dei contenuti
app.use('/', contentRouter);
// Usa il userRouter per le rotte degli utenti
app.use('/', userRouter);

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
