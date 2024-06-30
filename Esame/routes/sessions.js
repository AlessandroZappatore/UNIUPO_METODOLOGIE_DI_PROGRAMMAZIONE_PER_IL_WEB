"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');
const userDao = require('../models/user-dao.js'); 

router.get('/login', (req, res) => {
    res.render('login');
  });

  router.post('/sessions', function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if(err) { return next(err) }
        if(!user) { return res.render('login', { info, page: 'login' }) }
        req.login(user, function(err){
            if(err) { return next(err); }
                userDao.getUserById(user.id).then((user) =>{
                    res.redirect('/home');
                });
        });
    })(req, res, next);
});

router.post('/sessions/updateUser/', function(req, res, next) {
    userDao.updateUser(req.body).then((id)=>{
        res.json(id);
    });
});

router.delete('/sessions/current', function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        res.end();
    });
});

module.exports = router;
