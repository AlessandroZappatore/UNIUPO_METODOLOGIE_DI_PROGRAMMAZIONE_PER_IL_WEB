"use strict";

const express = require('express');
const router = express.Router();
const userDao = require('../models/user-dao.js'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');


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

router.post('/elimina-commento', async (req, res) => {
    const { id_commento } = req.body;
    
    try {
        await userDao.deleteComment(id_commento);
        res.json({ message: 'Commento eliminato con successo' });  // Modifica qui per restituire JSON
    } catch (error) {
        console.error('Errore nell\'eliminazione del commento:', error);
        res.status(500).json({ message: 'Errore nell\'eliminazione del commento' });  // Modifica qui per restituire JSON
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
            res.render('registrazione', {title: 'Modifica', button: 'Modifica', profilo: user });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/modifica-profilo/:id', profileUpload.single('profiloImmagine'), async (req, res) => {
    const id = req.params.id;
    const { email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente } = req.body;
    const profiloImmagine = req.file ? req.file.filename : null;

    try{
        const user = await userDao.getUserById(id);
        if(!user){
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
            profiloImmagine: profiloImmagine || user.profiloImmagine
        };

        if(profiloImmagine && user.profiloImmagine){
            const profileImagePath = path.join(__dirname, '..', 'public', 'images', 'profile', user.profiloImmagine);
            fs.unlink(profileImagePath, (err) => {
                if(err){
                    console.error('Errore durante l\'eliminazione dell\'immagine del profilo:', err);
                }
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

module.exports = router;