"use strict";

const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const userDao = require('../models/user-dao.js');
const multer = require('multer');
const path = require('path');
const moment = require('moment');


const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'profile'));
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const sanitizedNomeUtente = (req.body.nomeUtente || '').replace(/[^a-zA-Z0-9_\-]/g, '_');
        cb(null, sanitizedNomeUtente + extension);
    }
});

const profileUpload = multer({ storage: profileStorage });

router.get('/profilo/:Nome_utente', async (req, res) => {
    const nomeUtente = req.params.Nome_utente;

    try {
        const user = await userDao.getUserByUsername(nomeUtente);
        if (user.error) {
            return res.status(404).render("error", { message: user.error, buttonAction: "Home" });
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
            totalMinutesSerie += serieViste[i].durata * serieViste[i].num_stagioni * serieViste[i].num_episodi;
        }
        let durationSerie = moment.duration(totalMinutesSerie, 'minutes');
        let daysSerie = parseFloat(durationSerie.asDays().toFixed(3));
        res.render('profilo', { profilo: user, films: filmVisti, totalMinutesFilm: daysFilm, totalMinutesSerie: daysSerie, serieTV: serieViste });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).render("error", { message: "Errore interno al server", buttonAction: "Home" });
    }
});

router.post('/registrazione', profileUpload.single('profiloImmagine'), [
    check('email').isEmail().withMessage('Inserisci un indirizzo email valido'),
    check('nome').isLength({ min: 1 }).withMessage('Inserisci un nome valido'),
    check('cognome').isString().isLength({ min: 1 }).withMessage('Inserisci un cognome valido'),
    check('dataDiNascita').isISO8601().withMessage('Inserisci una data di nascita valida'),
    check('nomeUtente').isString().isLength({ min: 1 }).withMessage('Inserisci un nome utente'),
    check('password').isString().isLength({ min: 4 }).withMessage('La password deve contenere almeno 4 caratteri'),
    check('tipoUtente').isIn(['standard', 'amministratore']).withMessage('Tipo utente non valido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).render("error", { message: errorMessages, buttonAction: "Back" });
    }

    const { email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente } = req.body;
    const profiloImmagine = req.file ? req.file.filename : null;

    try {
        const userId = await userDao.createUser(email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente, profiloImmagine);
        res.redirect('/login');
    } catch (error) {
        console.error('Error during user registration', error);
        res.status(500).render("error", { message: "Errore durante la registrazione", buttonAction: "Home" });
    }
});

module.exports = router;
