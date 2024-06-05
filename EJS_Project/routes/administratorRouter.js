'use strict';

const express = require('express');
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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const posterUpload = multer({ storage: posterStorage });

router.get('/aggiungi_contenuto', (req, res) => {
    res.render('aggiungi_contenuto', { title: 'Aggiungi', button: 'Crea', contenuto: {} });
});

router.post('/aggiungi_contenuto', posterUpload.single('poster'), async (req, res) => {
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
        console.error('Error during content creation:', error); // Log the error
        res.status(500).send('Errore durante l\'aggiunta del contenuto');
    }
});

router.post('/elimina-contenuto', async (req, res) => {
    const { id } = req.body;

    try {
        // Ottieni il contenuto dal database per ottenere il nome del file del poster
        const content = await contentDao.getContentById(id);
        if (!content) {
            return res.status(404).json({ message: 'Contenuto non trovato' });
        }

        await contentDao.deleteContent(id);

        const posterPath = path.join(__dirname, '..', 'public', 'images', 'poster', content.poster);

        fs.unlink(posterPath, (err) => {
            if (err) {
                console.error('Errore durante l\'eliminazione del poster:', err);
                return res.status(500).json({ message: 'Errore durante l\'eliminazione del poster' });
            }
            console.log('Poster eliminato con successo:', posterPath);
        });

        res.json({ message: 'Contenuto eliminato con successo' });
    } catch (error) {
        console.error('Error eliminazione contenuto:', error);
        res.status(500).send(error);
    }
});

router.get('/modifica_contenuto/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const content = await contentDao.getContentById(id);
        if (content.error) {
            res.status(404).send(content.error);
        } else {
            res.render('aggiungi_contenuto', { title: 'Modifica', button: 'Modifica', contenuto: content });
        }
    } catch (error) {
        console.error('Error fetching content by id for edit:', error);
        res.status(500).send(error);
    }
});

router.post('/modifica_contenuto/:id', posterUpload.single('poster'), async (req, res) => {
    const id = req.params.id;
    const { tipoContenuto, Titolo, Genere, Registi, Attori, Data_uscita, Num_stagioni, Num_episodi, Durata, Dove_vederlo, Trama } = req.body;
    const poster = req.file ? req.file.filename : null;

    try {
        const content = await contentDao.getContentById(id);
        if (!content) {
            return res.status(404).send('Contenuto non trovato');
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
        res.status(500).send('Errore durante l\'aggiornamento del contenuto');
    }
});



module.exports = router;