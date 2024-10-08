'use strict';

const db = require('../db.js');
const bcrypt = require('bcrypt');

exports.getUserById = function (id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utente WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: 'Utente non trovato' });
      else {
        const user = {
          id: row.id,
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

exports.getUser = function (email, password) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utente WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: 'Utente non trovato' });
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

exports.deleteProfile = function (id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM utente WHERE id = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.createUser = function (email, nome, cognome, dataDiNascita, nomeUtente, password, tipoUtente, profiloImmagine) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!profiloImmagine) profiloImmagine = 'default_profile.jpg';
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO utente (email, nome, cognome, data_nascita, nome_utente, password, tipologia, profilo_immagine) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.run(sql, [email, nome, cognome, dataDiNascita, nomeUtente, hashedPassword, tipoUtente, profiloImmagine], function (err) {
        if (err) {
          console.error('Errore aggiunta utente:', err.message);
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

exports.getUserByUsername = function (username) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM utente WHERE nome_utente = ?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: 'Utente non trovato' });
      } else {
        const user = {
          id: row.id,
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

exports.updateUser = function (id, updatedUser) {
  return new Promise(async (resolve, reject) => {
    let hashedPassword;
    if (updatedUser.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(updatedUser.password, salt);
    } else {
      const user = await this.getUserById(id);
      hashedPassword = user.password;
    }

    const sql = `
      UPDATE utente 
      SET 
        email = ?,
        nome = ?,
        cognome = ?,
        data_nascita = ?,
        nome_utente = ?,
        password = ?,
        tipologia = ?,
        profilo_immagine = ?
      WHERE 
        id = ?`;
    const params = [
      updatedUser.email,
      updatedUser.nome,
      updatedUser.cognome,
      updatedUser.dataDiNascita,
      updatedUser.nomeUtente,
      hashedPassword,
      updatedUser.tipoUtente,
      updatedUser.profiloImmagine,
      id
    ];

    db.run(sql, params, function (err) {
      if (err) {
        console.error('Errore aggiornamento utente:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.getFilmUtente = function (email) {
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

exports.getSerieUtente = function (email) {
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

exports.markAsWatched = function (utente, contenuto) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO profilo (utente, contenuto) VALUES (?, ?)';
    db.run(sql, [utente, contenuto], function (err) {
      if (err) {
        console.error('Errore salvataggio contenuto:', err.message);
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

exports.markAsNotWatched = function (utente, contenuto) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM profilo WHERE contenuto = ? AND utente = ?';
    db.run(sql, [contenuto, utente], (err) => {
      if (err) { reject(err) }
      else { resolve() };
    });
  });
};

exports.hasWatched = function (utente, contenuto) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM profilo WHERE utente = ? AND contenuto = ?';
    db.get(sql, [utente, contenuto], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  })
};

exports.addComment = function (utente, contenuto, commento) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO commenti (utente, contenuto, commento) VALUES (?, ?, ?)';
    db.run(sql, [utente, contenuto, commento], function (err) {
      if (err) {
        console.error('Errore aggiunta commento:', err.message);
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

exports.deleteComment = function (id_commento) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM commenti WHERE id_commento = ?';
    db.run(sql, [id_commento], (err) => {
      if (err) { reject(err) }
      else { resolve() };
    });
  });
};

exports.addRating = function (utente, contenuto, voto) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO rating (utente, contenuto, voto) VALUES (?, ?, ?)';
    db.run(sql, [utente, contenuto, voto], (err) => {
      if (err) {
        console.error('Errore aggiunta voto:', err.message);
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

exports.deleteRating = function (utente, contenuto) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM rating WHERE utente = ? AND contenuto = ?';
    db.run(sql, [utente, contenuto], (err) => {
      if (err) { reject(err) }
      else { resolve() };
    });
  });
}

exports.getRatingByUser = function (utente, contenuto) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id_rating, voto FROM rating WHERE utente = ? AND contenuto = ?';
    db.get(sql, [utente, contenuto], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const rating = {
          id_rating: row.id_rating,
          utente: utente,
          contenuto: contenuto,
          voto: row.voto
        };
        resolve(rating);
      }
    });
  });
};
