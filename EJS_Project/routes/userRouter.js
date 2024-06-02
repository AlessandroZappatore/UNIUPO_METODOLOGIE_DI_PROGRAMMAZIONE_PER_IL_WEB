"use strict";

const express = require('express');
const router = express.Router();
const userDao = require('../models/user-dao.js'); 
const multer = require('multer');
const path = require('path');

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
        const serieViste = await userDao.getSerieUtente(user.email);

        res.render('profilo', { profilo: user, films: filmVisti, serieTV: serieViste });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/registrazione', profileUpload.single('profiloImmagine'), async (req, res) => {
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

router.post('/add-comment', async (req, res) => {
    const { utente, contenuto, commento } = req.body;
    
    try {
        await userDao.addComment(utente, contenuto, commento);
        res.json({ message: 'Commento aggiunto con successo' });  // Modifica qui per restituire JSON
    } catch (error) {
        console.error('Errore nell\'aggiunta del commento:', error);
        res.status(500).json({ message: 'Errore nell\'aggiunta del commento' });  // Modifica qui per restituire JSON
    }
});

  
router.post('/mark-as-watched', async (req, res) => {
    const { email, contenuto } = req.body;
    
    try {
        await userDao.markAsWatched(email, contenuto);
        res.send('Contenuto segnato come visto');
    } catch (error) {
        console.error('Errore nel salvataggio:', error);
        res.status(500).send('Errore nel salvataggio');
    }
});

module.exports = router;