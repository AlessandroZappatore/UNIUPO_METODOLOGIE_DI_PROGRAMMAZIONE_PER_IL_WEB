'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const contentDao = require('../models/content-dao.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const posterStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'poster'));
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const sanitizedTitolo = req.body.Titolo.replace(/[^a-zA-Z0-9_\-]/g, '_');
        cb(null, sanitizedTitolo + extension);
    }
});

const posterUpload = multer({ storage: posterStorage });

router.get('/aggiungi_contenuto', (req, res) => {
    res.render('aggiungi_contenuto', { title: 'Aggiungi', button: 'Crea', contenuto: {} });
});

router.post('/aggiungi_contenuto',posterUpload.single('poster'), [
    check('tipoContenuto').isIn(['film', 'serieTV']).withMessage('Tipo contenuto non valido'),
    check('Titolo').isLength({ min: 1 }).isString().withMessage('Inserisci un titolo'),
    check('Genere').optional().isString().withMessage('Inserisci un genere'),
    check('Registi').optional().isString().withMessage('Inserisci almeno un regista'),
    check('Attori').optional().isString().withMessage('Inserisci almeno un attore'),
    check('Data_uscita').optional({ checkFalsy: true }).isISO8601().withMessage('Inserisci una data di uscita valida'),
    check('Num_stagioni').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Inserisci un numero di stagioni valido'),
    check('Num_episodi').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Inserisci un numero di episodi valido'),
    check('Durata').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Inserisci una durata valida'),
    check('Dove_vederlo').optional().isString().withMessage('Inserisci dove vederlo'),
    check('Trama').optional().isString().withMessage('Inserisci una trama')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).render("error", { message: errorMessages, buttonAction: "Back" });
    }
    
    const { tipoContenuto, Titolo, Genere, Registi, Attori, Data_uscita, Num_stagioni, Num_episodi, Durata, Dove_vederlo, Trama } = req.body;
    const poster = req.file ? req.file.filename : null;

    if (!poster) {
        console.error('Poster upload failed');
        return res.status(400).send('Errore durante l\'upload del poster');
    }

    try {
        const contentTitolo = await contentDao.createContent(tipoContenuto, Titolo, poster, Genere, Registi, Attori, Data_uscita, Num_stagioni, Num_episodi, Durata, Dove_vederlo, Trama);
        res.redirect(`/visualizza_contenuto/${contentTitolo}`);
    } catch (error) {
        console.error('Error during content creation:', error); 
        res.status(500).render("error", {message: "Errore durante l'aggiunta del contenuto",  buttonAction: "Back"});
    }
});

router.post('/elimina-contenuto',[
    check('id').isInt().withMessage('ID contenuto non valido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).render("error", { message: errors, buttonAction: "Back" });
    }
    const { id } = req.body;

    try {
        const content = await contentDao.getContentById(id);
        if (!content) {
            return res.status(404).render("error", {message: "Contenuto non trovato", buttonAction: "Home"});
        }

        await contentDao.deleteContent(id);

        const posterPath = path.join(__dirname, '..', 'public', 'images', 'poster', content.poster);

        fs.unlink(posterPath, (err) => {
            if (err) {
                console.error('Errore durante l\'eliminazione del poster:', err);
                return res.status(500);
            }
            else
                console.log('Poster eliminato con successo:', posterPath);
        });

        res.json({ message: 'Contenuto eliminato con successo' });
    } catch (error) {
        console.error('Error eliminazione contenuto:', error);
        res.status(500).render("error", {message: error, buttonAction: "Home"});
    }
});

router.get('/modifica_contenuto/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const content = await contentDao.getContentById(id);
        if (content.error) {
            res.status(404).render("error", {message: content.error, buttonAction: "Home"});
        } else {
            res.render('aggiungi_contenuto', { title: 'Modifica', button: 'Modifica', contenuto: content });
        }
    } catch (error) {
        console.error('Error fetching content by id for edit:', error);
        res.status(500).send(error);
    }
});

router.post('/modifica_contenuto/:id', [
    check('tipoContenuto').optional().isIn(['film', 'serieTV']).withMessage('Tipo contenuto non valido'),
    check('Titolo').optional().isString().withMessage('Inserisci un titolo'),
    check('Genere').optional().isString().withMessage('Inserisci un genere'),
    check('Registi').optional().isString().withMessage('Inserisci almeno un regista'),
    check('Attori').optional().isString().withMessage('Inserisci almeno un attore'),
    check('Data_uscita').optional({ checkFalsy: true }).isISO8601().withMessage('Inserisci una data di uscita valida'),
    check('Num_stagioni').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Inserisci un numero di stagioni valido'),
    check('Num_episodi').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Inserisci un numero di episodi valido'),
    check('Durata').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Inserisci una durata valida'),
    check('Dove_vederlo').optional().isString().withMessage('Inserisci dove vederlo'),
    check('Trama').optional().isString().withMessage('Inserisci una trama')
],posterUpload.single('poster'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).render("error", { message: errorMessages, buttonAction: "Back" });
    }

    const id = req.params.id;
    const { tipoContenuto, Titolo, Genere, Registi, Attori, Data_uscita, Num_stagioni, Num_episodi, Durata, Dove_vederlo, Trama } = req.body;
    const poster = req.file ? req.file.filename : null;

    try {
        const content = await contentDao.getContentById(id);
        if (!content) {
            return res.status(404).render("error", {message: "Contenuto non trovato", buttonAction: "Home"});
        }

        const updatedContent = {
            tipoContenuto,
            Titolo,
            Genere,
            Registi,
            Attori,
            Data_uscita,
            Num_stagioni,
            Num_episodi,
            Durata,
            Dove_vederlo,
            Trama,
            poster: poster || content.poster
        };

        if (poster && content.poster) {
            const oldPosterPath = path.join(__dirname, '..', 'public', 'images', 'poster', content.poster);
            fs.unlink(oldPosterPath, (err) => {
                if (err) {
                    console.error('Errore durante l\'eliminazione del vecchio poster:', err);
                } else {
                    console.log('Vecchio poster eliminato con successo:', oldPosterPath);
                }
            });
        }

        await contentDao.updateContent(id, updatedContent);
        res.redirect(`/visualizza_contenuto/${Titolo}`);
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del contenuto:', error);
        res.status(500).render("error", {message: "Errore durante la modifica del contenuto", buttonAction: "Back"});
    }
});



module.exports = router;