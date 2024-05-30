'use strict';

const db = require('../db.js');
const bcrypt = require('bcrypt');

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const querySql = 'SELECT * FROM utente WHERE id = ?';
        db.get(querySql, [id], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) resolve({ error: 'Utente non trovato' });
            else {
                const user = { id: row.id, username: row.email };
                resolve(user);
            }
        });
    });
};

exports.getUser = function (email, password) {
    return new Promise((resolve, reject) => {
        const querySql = 'SELECT * FROM utente WHERE email = ?';
        db.get(querySql, [email], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) resolve({ error: 'Utente non trovato' });
            else {
                const user = { id: row.id, username: row.email };
                let check = false;

                if (bcrypt.compareSync(password, row.password)) check = true;

                resolve({ user, check });
            }
        });
    });
};