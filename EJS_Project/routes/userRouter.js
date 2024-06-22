"use strict";

const express = require('express');
const router = express.Router();
const userDao = require('../models/user-dao.js');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const { check, validationResult } = require('express-validator');

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'profile')); // Corretto il percorso
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const profileUpload = multer({ storage: profileStorage });

router.get('/profilo/:Nome_utente', async (req, res) => {
    const nomeUtente = req.params.Nome_utente;

    try {
        const user = await userDao.getUserByUsername(nomeUtente);
        if (user.error) {
            return res.status(404).send(user.error);
        }

        const filmVisti = await userDao.getFilmUtente(user.email);
        let totalMinutesFilm = 0;
        for (let i = 0; i < filmVisti.length; i++) {
            totalMinutesFilm += filmVisti[i].durata;
        }
        let durationFilm = moment.duration(totalMinutesFilm, 'minutes');
        let daysFilm = parseFloat(durationFilm.asDays().toFixed(3));
        const serieViste = await userDao.getSerieUtente(user.email);
        let totalMinutesSerie = 0;
        for (let i = 0; i < serieViste.length; i++) {
            totalMinutesSerie += serieViste[i].durata;
        }
        let durationSerie = moment.duration(totalMinutesSerie, 'minutes');
        let daysSerie = parseFloat(durationSerie.asDays().toFixed(3));
        res.render('profilo', { profilo: user, films: filmVisti, totalMinutesFilm: daysFilm, totalMinutesSerie: daysSerie, serieTV: serieViste });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/registrazione', [
    check('email').isEmail().withMessage('Inserisci un indirizzo email valido'),
    check('nome').isLength({ min: 1 }).withMessage('Inserisci il tuo nome'),
    check('cognome').isLength({ min: 1 }).withMessage('Inserisci il tuo cognome'),
    check('dataDiNascita').isDate().withMessage('Inserisci una data di nascita valida'),
    check('nomeUtente').isLength({ min: 1 }).withMessage('Inserisci un nome utente'),
    check('password').isLength({ min: 8 }).withMessage('La password deve contenere almeno 8 caratteri'),
    check('tipoUtente').isIn(['standard', 'amministratore']).withMessage('Tipo utente non valido')
],profileUpload.single('profiloImmagine'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
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



module.exports = router;