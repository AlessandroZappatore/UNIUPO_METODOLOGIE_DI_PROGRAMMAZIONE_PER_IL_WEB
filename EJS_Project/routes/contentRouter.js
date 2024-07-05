'use strict';

const express = require('express');
const router = express.Router();
const contentDao = require('../models/content-dao.js');
const userDao = require('../models/user-dao.js');
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
    const hasWatched = req.user ? await userDao.hasWatched(req.user.email, titolo) : false;
    const rating = req.user ? await userDao.getRatingByUser(req.user.email, titolo) : false;
    const avgRating = await contentDao.getAvgRating(titolo);
    if (result.error) {
      res.status(404).send(result.error);
    } else {
      res.render('visualizza_contenuto', { contenuto: result, comments: commenti, hasWatched: hasWatched, rating: rating, avgRating: avgRating });
    }
  } catch (error) {
    console.error('Error fetching content by title:', error);
    res.status(500).send(error);
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.isUnauthenticated = true;
    return next();
  }
}

router.get('/search_no_log', async (req, res) => {
  const query = req.query.query;
  const searchBy = "titolo";

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
