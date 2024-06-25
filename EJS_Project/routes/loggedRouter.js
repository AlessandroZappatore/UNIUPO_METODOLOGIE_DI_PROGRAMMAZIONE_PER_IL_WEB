"use strict";

const express = require('express');
const router = express.Router();
const userDao = require('../models/user-dao.js');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
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

router.post('/add-comment', [
    check('utente').isEmail(),
    check('contenuto').isString(),
    check('commento').isString()
], async (req, res) => {
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

router.get('/modifica-profilo/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await userDao.getUserById(id);
        if (user.error) {
            res.status(404).send(user.error);
        } else {
            res.render('registrazione', { title: 'Modifica', button: 'Modifica', profilo: user });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/modifica-profilo/:id', [
    check('email').isEmail().withMessage('Inserisci un indirizzo email valido'),
    check('nome').isLength({ min: 1 }).withMessage('Inserisci il tuo nome'),
    check('cognome').isLength({ min: 1 }).withMessage('Inserisci il tuo cognome'),
    check('dataDiNascita').isDate().withMessage('Inserisci una data di nascita valida'),
    check('nomeUtente').isLength({ min: 1 }).withMessage('Inserisci un nome utente'),
    check('password').isLength({ min: 8 }).withMessage('La password deve contenere almeno 8 caratteri'),
    check('tipoUtente').isIn(['standard', 'amministratore']).withMessage('Tipo utente non valido')
] ,profileUpload.single('profiloImmagine'), async (req, res) => {
    const id = req.params.id;
    const { email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente } = req.body;
    const profiloImmagine = req.file ? req.file.filename : null;

    try {
        const user = await userDao.getUserById(id);
        if (!user) {
            return res.status(404).send('Utente non trovato');
        }

        const updatedUser = {
            email,
            nome,
            cognome,
            dataDiNascita,
            nomeUtente,
            password,
            tipoUtente,
            profiloImmagine: profiloImmagine || user.immagineProfilo
        };

        if (profiloImmagine && user.immagineProfilo) {
            const profileImagePath = path.join(__dirname, '..', 'public', 'images', 'profile', user.immagineProfilo);
            fs.unlink(profileImagePath, (err) => {
                if (err) {
                    console.error('Errore durante l\'eliminazione dell\'immagine del profilo:', err);
                }
                else
                    console.log('Immagine del profilo eliminata con successo:', profileImagePath);
            });
        }

        await userDao.updateUser(id, updatedUser);
        res.redirect('/profilo/' + updatedUser.nomeUtente);
    } catch (error) {
        console.error('Errore durante la modifica del profilo:', error);
        res.status(500).send('Errore durante la modifica del profilo');
    }
});

router.post('/elimina-commento', async (req, res) => {
    const { id_commento } = req.body;

    try {
        await userDao.deleteComment(id_commento);
        res.json({ message: 'Commento eliminato con successo' });
    } catch (error) {
        console.error('Errore nell\'eliminazione del commento:', error);
        res.status(500).json({ message: 'Errore nell\'eliminazione del commento' });
    }
});

router.post('/elimina-profilo', async (req, res) => {
    const { id } = req.body; 

    try {
        const user = await userDao.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Profilo non trovato' });
        }

        await userDao.deleteProfile(id);

        if (user.immagineProfilo !== "default_profile.jpg") { 
            const profileImagePath = path.join(__dirname, '..', 'public', 'images', 'profile', user.immagineProfilo);

            fs.unlink(profileImagePath, (err) => {
                if (err) {
                    console.error('Errore durante l\'eliminazione della foto profilo:', err);
                    return res.status(500).json({ message: 'Errore durante l\'eliminazione della foto profilo' });
                } else {
                    console.log('Foto profilo eliminata con successo:', profileImagePath); 
                }
            });
        }

        res.json({ message: 'Profilo eliminato con successo' });
    } catch (error) {
        console.error('Errore eliminazione profilo:', error);
        res.status(500).send(error);
    }
});

router.post('/add-rating', async (req, res) => {
    const { utente, contenuto, rating } = req.body;
    try {
        await userDao.addRating(utente, contenuto, rating);
        res.json({ message: 'Rating aggiunto con successo' });
    } catch (error) {
        console.error('Errore nell\'aggiunta del rating:', error);
        res.status(500).json({ message: 'Errore nell\'aggiunta del rating' });
    }
});
module.exports = router;