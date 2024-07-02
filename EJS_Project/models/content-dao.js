'use strict';

const db = require('../db.js');

exports.createContent = function (tipoContenuto, Titolo, poster, Genere, Registi, Attori, Data_uscita, Num_stagioni, Num_episodi, Durata, Dove_vederlo, Trama) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO contenuto (tipologia, titolo, poster, genere, registi, attori, data_uscita, num_stagioni, num_episodi, durata, dove_vederlo, trama) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [tipoContenuto, Titolo, poster, Genere, Registi, Attori, Data_uscita, Num_stagioni, Num_episodi, Durata, Dove_vederlo, Trama], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(Titolo);
      }
    });
  });
};

exports.getContentById = function (id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM contenuto WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: 'Content not found.' });
      else {
        const content = {
          id: row.id,
          titolo: row.titolo,
          tipologia: row.tipologia,
          genere: row.genere,
          registi: row.registi,
          attori: row.attori,
          data_uscita: row.data_uscita,
          num_stagioni: row.num_stagioni,
          num_episodi: row.num_episodi,
          durata: row.durata,
          dove_vederlo: row.dove_vederlo,
          trama: row.trama,
          poster: row.poster
        };
        resolve(content);
      }
    });
  });
};

exports.getContentByTitolo = function (titolo) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM contenuto WHERE titolo = ?';
    db.get(sql, [titolo], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: 'Content not found.' });
      else {
        const content = {
          id: row.id,
          titolo: row.titolo,
          tipologia: row.tipologia,
          genere: row.genere,
          registi: row.registi,
          attori: row.attori,
          data_uscita: row.data_uscita,
          num_stagioni: row.num_stagioni,
          num_episodi: row.num_episodi,
          durata: row.durata,
          dove_vederlo: row.dove_vederlo,
          trama: row.trama,
          poster: row.poster
        };
        resolve(content);
      }
    });
  });
};

exports.getAllComments = function (titolo) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT commenti.*, utente.profilo_immagine FROM commenti JOIN utente ON commenti.utente = utente.nome_utente WHERE commenti.contenuto = ?';
    db.all(sql, [titolo], (err, rows) => {
      if (err) {
        console.error('Error fetching comments:', err);
        reject(err);
      } else {
        const comments = rows.map((e) => ({
          id_commento: e.id_commento,
          contenuto: e.contenuto,
          username: e.utente,
          commento: e.commento,
          profiloImmagine: e.profilo_immagine
        }));
        resolve(comments);
      }
    });
  });
};


exports.getUltimeUscite = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM contenuto ORDER BY data_uscita DESC LIMIT 3';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getTopContenuti = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT c.*, avg_rating.punteggio_medio FROM contenuto c JOIN (SELECT contenuto, AVG(voto) AS punteggio_medio FROM rating GROUP BY contenuto) AS avg_rating ON c.titolo = avg_rating.contenuto ORDER BY avg_rating.punteggio_medio DESC LIMIT 3';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};


exports.getAllMovies = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM contenuto WHERE tipologia = "film"';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getAllSeries = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM contenuto WHERE tipologia = "serieTV"'; 
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getAllContent = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM contenuto';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

exports.deleteContent = function(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM contenuto WHERE id = ?'; 
    db.run(sql, [id], (err) => { 
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};


exports.updateContent = function(id, updatedContent) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE contenuto 
      SET 
        titolo = ?,
        tipologia = ?,
        genere = ?,
        registi = ?,
        attori = ?,
        data_uscita = ?,
        num_stagioni = ?,
        num_episodi = ?,
        durata = ?,
        dove_vederlo = ?,
        trama = ?,
        poster = ?
      WHERE 
        id = ?`;
    const params = [
      updatedContent.Titolo,
      updatedContent.tipoContenuto,
      updatedContent.Genere,
      updatedContent.Registi,
      updatedContent.Attori,
      updatedContent.Data_uscita,
      updatedContent.Num_stagioni,
      updatedContent.Num_episodi,
      updatedContent.Durata,
      updatedContent.Dove_vederlo,
      updatedContent.Trama,
      updatedContent.poster,
      id
    ];

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error updating content:', err);
        reject(err);
      } else {
        console.log(`Content updated successfully with id ${id}`);
        resolve();
      }
    });
  });
};