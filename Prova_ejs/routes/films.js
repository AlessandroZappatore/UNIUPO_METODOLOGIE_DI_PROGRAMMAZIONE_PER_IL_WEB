var express = require('express');
var router = express.Router();
const dao = require('../models/contenuto-dao');

router.get('/', function(req, res, next){
    dao.getAllFilms().then((courses) =>{
        res.render('login');
    });
});

module.exports = router;