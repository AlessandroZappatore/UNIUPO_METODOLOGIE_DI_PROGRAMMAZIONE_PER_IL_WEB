'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('WIW_db.db', (err) => {
  if (err) throw err;
});

module.exports = db;