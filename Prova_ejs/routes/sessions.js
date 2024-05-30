'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/login', function(req, res, next){
    res.render('login');
});

router.post('/sessions', function(req, res, next){
    passport.authenticate('local', function(err, user, info){
        if(err) { return next(err)}
        if(!user){ return res.render('login', {'message': info.message});}

        req.login(user, function(err){
            if(err) { return next(err);}
            res.redirect('/login');
        });
    }) (req, res, next);
});

router.delete('/sessions/current', function(req, res, next){
    req.logout();
    res.end();
});

module.exports = router;