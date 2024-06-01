var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');
const userDao = require('./models/user-dao.js');
const contentDao = require('./models/content-dao.js');


var app = express();

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'images', 'profile'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const profileUpload = multer({ storage: profileStorage });

// Configurazione view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Importa il contentRouter
const contentRouter = require('./routes/contentRouter');

// Routing
app.get('/', async (req, res) => {
  try {
    const ultimeUscite = await contentDao.getUltimeUscite(3);
    const top3Contenuti = await contentDao.getTopContenuti(3);
    res.render('home', { title: 'Home', page: 'home', ultimeUscite: ultimeUscite, top3: top3Contenuti });
  } catch (error) {
    console.error('Error during fetching homepage', error);
    res.status(500).send('Errore durante il recupero della homepage');
  }
});

app.get('/home', async (req, res) => {
  try {
    const ultimeUscite = await contentDao.getUltimeUscite(3);
    const top3Contenuti = await contentDao.getTopContenuti(3);
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

app.get('/profilo/:Nome_utente', async (req, res) => {
  const nomeUtente = req.params.Nome_utente;
  try {
    const result = await userDao.getUserByUsername(nomeUtente);
    if (result.error) {
      res.status(404).send(result.error);
    } else {
      res.render('profilo', { profilo: result });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/registrazione', profileUpload.single('profiloImmagine'), async (req, res) => {
  const { email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente } = req.body;
  const profiloImmagine = req.file ? req.file.filename : null;

  try {
    const userId = await userDao.createUser(email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente, profiloImmagine);
    res.redirect('/login');
  } catch (error) {
    console.error('Error during user registration', error);
    res.status(500).send('Errore durante la registrazione');
  }
});

// Usa il contentRouter per le rotte dei contenuti
app.use('/', contentRouter);

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
