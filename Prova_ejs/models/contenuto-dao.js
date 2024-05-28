'use strict';

const db = require('../db.js');

exports.getAllFilms = function () {
    return new Promise((resolve, reject) => {
        const querySql = 'SELECT * FROM film';
        db.all(querySql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const films = rows.map((e) => ({ 
                id_film: e.id_film, 
                titolo: e.titolo, 
                genere: e.genere, 
                registi: e.registi, 
                attori: e.attori, 
                data_uscita: e.data_uscita, 
                durata: e.durata, 
                dove_vederlo: e.dove_vederlo, 
                trama: e.trama }));
            resolve(films);
        });
    });
};

exports.getAllSerieTV = function () {
    return new Promise((resolve, reject) => {
        const querySql = 'SELECT * FROM serieTV';
        db.all(querySql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const series = rows.map((e) => ({ 
                id_serie: e.id_serie, 
                titolo: e.titolo, 
                genere: e.genere, 
                registi: e.registi, 
                attori: e.attori, 
                data_uscita: e.data_uscita, 
                numero_stagioni: e.numero_stagioni, 
                numero_episodi: e.numero_episodi, 
                durata: e.durata, dove_vederlo: 
                e.dove_vederlo, 
                trama: e.trama }));
            resolve(series);
        });
    });
};
