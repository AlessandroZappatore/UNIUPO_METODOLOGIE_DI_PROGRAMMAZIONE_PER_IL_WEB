'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('WIW_db.db', (err) => {
  if (err) throw err;


  //Attivo le foreign keys per consentire l'aggiornamento e l'eliminazione in cascata
  db.run('PRAGMA foreign_keys = ON;', (err) => {
    if (err) {
      console.error('Error enabling foreign keys:', err.message);
    } else {
      console.log('Foreign keys enabled.');
    }
  });
});

module.exports = db;
