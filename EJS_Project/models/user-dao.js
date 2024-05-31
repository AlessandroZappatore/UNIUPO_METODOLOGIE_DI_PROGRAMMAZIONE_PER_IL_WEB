'use strict';

const db = require('../db.js');
const bcrypt = require('bcrypt');

exports.getUserById = function(id) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM utente WHERE id = ?';
      db.get(sql, [id], (err, row) => {
          if (err) 
              reject(err);
          else if (row === undefined)
              resolve({error: 'User not found.'});
          else {
              const user = {id: row.id, username: row.email}
              resolve(user);
          }
      });
  });
};

exports.getUser = function(email, password) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM utente WHERE email = ?';
      db.get(sql, [email], (err, row) => {
          if (err) 
              reject(err);
          else if (row === undefined)
              resolve({error: 'User not found.'});
          else {
            const user = {id: row.id, username: row.email};
            let check = false;
            
            if(bcrypt.compareSync(password, row.password))
              check = true;

            resolve({user, check});
          }
      });
  });
};

exports.createUser = function(email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente, profiloImmagine) {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO utente (email, Nome, Cognome, Data_nascita, Nome_utente, Password, Tipologia, profiloImmagine) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.run(sql, [email, nome, cognome, dataDiNascita, nomeUtente, hashedPassword, tipoUtente, profiloImmagine], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID); // ritorna l'id del nuovo utente creato
        }
      });
    });
  };