'use strict';

const express = require('express');
const router = express.Router();
const contentDao = require('../models/content-dao.js');
const path = require('path');

router.get('/film', async (req, res) => {
  try {
    const movies = await contentDao.getAllMovies();
    res.render('contenuti', { title: 'FILM', page: 'film', contents: movies });
  } catch (error) {
    console.error('Error fetching film page', error);
    res.status(500).send('Error fetching film page');
  }
});

router.get('/serieTV', async (req, res) => {
  try {
    const series = await contentDao.getAllSeries();
    res.render('contenuti', { title: 'SERIE TV', page: 'serieTV', contents: series });
  } catch (error) {
    console.error('Error fetching serie TV page', error);
    res.status(500).send('Error fetching serie TV page');
  }
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
    console.error('Error fetching content by title:', error);
    res.status(500).send(error);
  }
});

module.exports = router;
