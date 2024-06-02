'use strict';

const db = require('../db.js');
const bcrypt = require('bcrypt');

exports.getUserById = function(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utente WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: 'User not found.' });
      else {
        const user = {
          id: row.id,
          email: row.email,
          nome_utente: row.nome_utente,
          tipologia: row.tipologia,
          profilo_immagine: row.profilo_immagine
        };
        resolve(user);
      }
    });
  });
};

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
          id: row.id,
          email: row.email,
          nome_utente: row.nome_utente,
          tipologia: row.tipologia,
          profilo_immagine: row.profilo_immagine
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
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO utente (email, nome, cognome, data_nascita, nome_utente, password, tipologia, profilo_immagine) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.run(sql, [email, nome, cognome, dataDiNascita, nomeUtente, hashedPassword, tipoUtente, profiloImmagine], function(err) {
        if (err) {
          console.error('Error inserting user:', err.message);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

// Funzione per ottenere un utente dal database tramite il nome utente
exports.getUserByUsername = function(username) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utente WHERE nome_utente = ?';
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

exports.updateUser = function(id, email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente, profiloImmagine) {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'UPDATE utente SET email = ?, nome = ?, cognome = ?, data_nascita = ?, nome_utente = ?, password = ?, tipologia = ?, profilo_immagine = ? WHERE id = ?';
      db.run(sql, [email, nome, cognome, dataDiNascita, nomeUtente, hashedPassword, tipoUtente, profiloImmagine, id], function(err) {
        if (err) {
          console.error('Error updating user:', err.message);
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.getFilmUtente = function(email) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT c.* FROM contenuto c INNER JOIN profilo p ON c.titolo = p.contenuto WHERE p.utente = ? AND c.tipologia = 'film'`;
    db.all(sql, [email], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getSerieUtente = function(email) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT c.* FROM contenuto c INNER JOIN profilo p ON c.titolo = p.contenuto WHERE p.utente = ? AND c.tipologia = 'serieTV'`;
    db.all(sql, [email], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
