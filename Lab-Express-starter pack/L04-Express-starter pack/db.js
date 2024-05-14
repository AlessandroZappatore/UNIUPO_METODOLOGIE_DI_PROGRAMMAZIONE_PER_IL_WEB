"use strinct";

const sqlite = require('sqlite3').verbose();
const DBSOURCE = './tasks.db';

const db =  new sqlite.Database(this.DBSOURCE, (err) => {
    if (err) {
        // cannot open database
        
        console.err(err.message);
        throw err;
    }
    else{
    
        console.log('Database opened correctly');
    }
});

module.exports = db;