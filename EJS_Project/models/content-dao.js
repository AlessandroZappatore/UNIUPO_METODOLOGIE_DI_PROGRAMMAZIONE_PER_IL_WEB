'use strict';

const db = require('../db.js');

exports.createContent = function (tipoContenuto, Titolo, poster, Genere, Registi, Attori, Data_uscita, Num_stagioni, Num_episodi, Durata, Dove_vederlo, Trama) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO contenuto (Tipologia, Titolo, poster, Genere, Registi, Attori, Data_Uscita, Num_stagioni, Num_episodi, Durata, Dove_vederlo, Trama) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.run(sql, [tipoContenuto, Titolo, poster, Genere, Registi, Attori, Data_uscita, Num_stagioni, Num_episodi, Durata, Dove_vederlo, Trama], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(Titolo); // Restituisce il Titolo del nuovo contenuto creato
        }
      });
    });
  };

  exports.getContentByTitolo = function (titolo) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM contenuto WHERE Titolo = ?';
      db.get(sql, [titolo], (err, row) => {
        if (err) reject(err);
        else if (row === undefined) resolve({ error: 'Content not found.' });
        else {
          const content = {
            titolo: row.Titolo,
            tipologia: row.Tipologia,
            genere: row.Genere,
            registi: row.Registi,
            attori: row.Attori,
            data_uscita: row.Data_Uscita,
            num_stagioni: row.Num_stagioni,
            num_episodi: row.Num_episodi,
            durata: row.Durata,
            dove_vederlo: row.Dove_vederlo,
            trama: row.Trama,
            poster: row.poster
          };
          resolve(content);
        }
      });
    });
  };

  exports.getAllComments = function (titolo) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT commenti.*, utente.profiloImmagine FROM commenti JOIN utente ON commenti.utente = utente.Nome_utente WHERE commenti.contenuto = ?';
        db.all(sql, [titolo], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const comments = rows.map((e) => ({
                    contenuto: e.contenuto,
                    username: e.utente,
                    commento: e.commento,
                    profiloImmagine: e.profiloImmagine // Aggiungiamo l'immagine del profilo
                }));
                resolve(comments);
            }
        });
    });
};

  