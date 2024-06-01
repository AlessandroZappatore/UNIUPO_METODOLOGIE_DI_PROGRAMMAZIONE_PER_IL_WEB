"use strict";

const express = require('express');
const router = express.Router();
const contentDao = require('../models/content-dao.js');
const multer = require('multer');
const path = require('path');

const posterStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'poster'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const posterUpload = multer({ storage: posterStorage });

router.get('/film', async (req, res) => {
  try {
    const movies = await contentDao.getAllMovies();
    res.render('contenuti', { title: 'FILM', page: 'film', contents: movies });
  } catch (error) {
    console.error('Error fetching homepage', error);
    res.status(500).send('Error fetching film page');
  }
});

router.get('/serieTV', async (req, res) => {
  try {
    const series = await contentDao.getAllSeries();
    res.render('contenuti', { title: 'SERIE TV', page: 'serieTV', contents: series });
  } catch (error) {
    console.error('Error fetching homepage', error);
    res.status(500).send('Error fetching serie TV page');
  }
});

router.get('/visualizza_contenuto', (req, res) => {
  res.render('visualizza_contenuto');
});

router.get('/visualizza_contenuto/:Titolo', async (req, res) => {
  const titolo = req.params.Titolo;
  try {
    const result = await contentDao.getContentByTitolo(titolo);
    const commenti = await contentDao.getAllComments(titolo);
    if (result.error) {
      res.status(404).send(result.error);
    } else {
      res.render('visualizza_contenuto', { contenuto: result, comments: commenti });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/aggiungi_contenuto', (req, res) => {
  res.render('aggiungi_contenuto');
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
    console.error('Error during content creation', error);
    res.status(500).send('Errore durante l\'aggiunta del contenuto');
  }
});

module.exports = router;
