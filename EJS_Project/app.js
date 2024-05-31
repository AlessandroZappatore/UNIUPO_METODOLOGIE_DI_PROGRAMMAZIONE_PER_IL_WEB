var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');
const userDao = require('./models/user-dao.js');
var app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/profile'); // Salva i file nella cartella public/images/profile
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Usa la data corrente come nome del file
  }
});

const upload = multer({ storage: storage });

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
  res.render('home', { title: 'Home', page: 'home' });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/registrazione', (req, res) => {
  res.render('registrazione');
});

app.post('/registrazione', upload.single('profiloImmagine'), async (req, res) => {
  const { email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente } = req.body;
  const profiloImmagine = req.file ? req.file.filename : null; // Ottiene il nome del file caricato

  try {
    const userId = await userDao.createUser(email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente, profiloImmagine);
    res.redirect('/login');
  } catch (error) {
    console.error('Error during user registration', error);
    res.status(500).send('Errore durante la registrazione');
  }
});

app.get('/film', (req, res) => {
  res.render('contenuti', { title: 'FILM', page: 'film' });
});

app.get('/serieTV', (req, res) => {
  res.render('contenuti', { title: 'SERIE TV', page: 'serieTV' });
});

app.get('/contatti', (req, res) => {
  res.render('contatti', { title: 'Contatti', page: 'contatti' });
});

app.get('/aggiungi_contenuto', (req, res) => {
  res.render('aggiungi_contenuto');
});

app.get('/profilo', (req, res) => {
  res.render('profilo');
});

app.get('/visualizza_contenuto', (req, res) => {
  res.render('visualizza_contenuto');
});

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
