"use strict";

const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const userDao = require('../models/user-dao.js');
const contentDao = require('../models/content-dao.js');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'profile'));
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const sanitizedNomeUtente = req.body.nomeUtente.replace(/[^a-zA-Z0-9_\-]/g, '_');
        cb(null, sanitizedNomeUtente + extension);
    }
});

const profileUpload = multer({ storage: profileStorage });

router.post('/add-comment', [
    check('utente').isString(),
    check('contenuto').isString(),
    check('commento').isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).json({ message: errorMessages, buttonAction: "Home" });
    }
    const { utente, contenuto, commento } = req.body;

    try {
        await userDao.addComment(utente, contenuto, commento);
        res.json({ message: 'Commento aggiunto con successo' });
    } catch (error) {
        console.error('Errore nell\'aggiunta del commento:', error);
        res.status(500).json({ message: 'Errore nell\'aggiunta del commento' });  
    }
});

router.post('/mark-as-watched',[
    check('email').isEmail(),
    check('contenuto').isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).json({ message: errorMessages, buttonAction: "Home" });
    }
    const { email, contenuto } = req.body;

    try {
        await userDao.markAsWatched(email, contenuto);
        res.send('Contenuto segnato come visto');
    } catch (error) {
        console.error('Errore nel salvataggio:', error);
        res.status(500).render("error", {message: "Errore durante il salvataggio", buttonAction: "Home"});
    }
});

router.post('/mark-as-not-watched', [
    check('email').isEmail(),
    check('contenuto').isString()
],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).json({ message: errorMessages, buttonAction: "Home" });
    }
    const { email, contenuto } = req.body;

    try {
        await userDao.markAsNotWatched(email, contenuto);
        res.json({ message: 'Contenuto segnato come NON visto' });
    }
    catch (error) {
        console.error('Errore nella rimozione:', error);
        res.status(500).render("error", {message: "Errore durante la rimozione", buttonAction: "Home"});
    }
});

router.get('/modifica-profilo/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await userDao.getUserById(id);
        if (user.error) {
            res.status(404).render("error", {message: user.error, buttonAction: "Home"});
        } else {
            res.render('registrazione', { title: 'Modifica', button: 'Modifica', profilo: user });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).render("error", {message: "Errore interno al server", buttonAction: "Home"});
    }
});

router.post('/modifica-profilo/:id', [
    check('email').isEmail().withMessage('Inserisci un indirizzo email valido'),
    check('nome').isLength({ min: 1 }).withMessage('Inserisci un nome valido'),
    check('cognome').isString().isLength({ min: 1 }).withMessage('Inserisci un cognome valido'),
    check('dataDiNascita').isISO8601().withMessage('Inserisci una data di nascita valida'),
    check('nomeUtente').isString().isLength({ min: 1 }).withMessage('Inserisci un nome utente'),
    check('password').isString().isLength({ min: 4 }).withMessage('La password deve contenere almeno 4 caratteri'),
    check('tipoUtente').isIn(['standard', 'amministratore']).withMessage('Tipo utente non valido')
], profileUpload.single('profiloImmagine'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).render("error", { message: errorMessages, buttonAction: "Back" });
    }
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

router.post('/elimina-commento',[
    check('id_commento').isInt().withMessage('ID commento non valido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors, buttonAction: "Home" });
    }
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

router.post('/add-rating', [
    check('utente').isEmail(),
    check('contenuto').isString(),
    check('voto').isInt({ min: 1, max: 5 })
],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).json({ message: errorMessages, buttonAction: "Home" });
    }
    const { utente, contenuto, voto } = req.body;
    try {
        await userDao.addRating(utente, contenuto, voto);
        res.json({ message: 'Rating aggiunto con successo' });
    } catch (error) {
        console.error('Errore nell\'aggiunta del rating:', error);
        res.status(500).json({ message: 'Errore nell\'aggiunta del rating' });
    }
});

router.post('/delete-rating', [
    check('email').isEmail(),
    check('contenuto').isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).json({ message: errorMessages, buttonAction: "Home" });
    }  
    const { contenuto, email } = req.body; // Assicurati che sia 'email'
    try {
        await userDao.deleteRating(email, contenuto); // Usa 'email' qui
        res.json({ message: 'Rating eliminato con successo' });
    } catch (error) {
        console.error('Errore nell\'eliminazione del rating:', error);
        res.status(500).json({ message: 'Errore nell\'eliminazione del rating' });
    }
});


router.get('/search', async (req, res) => {
    const query = req.query.query;
    const searchBy = req.query.searchBy;
  
    try {
      let result = await contentDao.getAllContent();
  
      if (result.error) return res.status(404).send(result.error);
  
      result = filterData(searchBy, query, result);
      res.render('contenuti', { title: `Risultati per: ${query}`, page: 'search', contents: result });
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).send(error);
    }
  });
  
  function filterData(searchBy, query, data) {
    if (!searchBy || !query) return data;
  
    return data.filter(row => {
      if (row[searchBy] === undefined) return false; 
      return row[searchBy].toLowerCase().includes(query.toLowerCase());
    });
  }
module.exports = router;