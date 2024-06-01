'use strict';

const db = require('../db.js');
const bcrypt = require('bcrypt');

// Funzione per ottenere un utente dal database
exports.getUser = function(email, password) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utente WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: 'User not found.' });
      } else {
        const user = {
          id: row.email, // Cambiato da row.id a row.email
          username: row.nome_utente // Cambiato da row.email a row.Nome_utente
        };
        const check = bcrypt.compareSync(password, row.password);
        resolve({ user, check });
      }
    });
  });
};

// Funzione per creare un nuovo utente nel database
exports.createUser = function(email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente, profiloImmagine) {
  return new Promise(async (resolve, reject) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO utente (email, nome, cognome, data_nascita, nome_utente, password, tipologia, profilo_immagine) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [email, nome, cognome, dataDiNascita, nomeUtente, hashedPassword, tipoUtente, profiloImmagine], function(err) {
      if (err) {
        console.error('Error inserting user:', err.message);
        reject(err);
      } else {
        resolve(email);
      }
    });
  });
};


// Funzione per ottenere un utente dal database tramite il nome utente
exports.getUserByUsername = function(username) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utente WHERE Nome_utente = ?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: 'User not found.' });
      } else {
        const user = {
          email: row.email,
          nome_utente: row.nome_utente,
          nome: row.nome,
          cognome: row.cognome,
          data_nascita: row.data_nascita,
          tipologia: row.tipologia,
          immagineProfilo: row.profilo_immagine
        };
        resolve(user);
      }
    });
  });
};