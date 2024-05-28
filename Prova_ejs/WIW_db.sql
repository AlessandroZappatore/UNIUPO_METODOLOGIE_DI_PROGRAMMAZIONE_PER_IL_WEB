-- Creazione tabella utente
CREATE TABLE utente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    Nome TEXT NOT NULL,
    Cognome TEXT NOT NULL,
    Data_nascita DATE NOT NULL,
    Nome_utente TEXT UNIQUE NOT NULL,
    Tipologia BOOLEAN NOT NULL,
    Password TEXT NOT NULL
);
-- Creazione tabella film
CREATE TABLE film (
    id_film INTEGER PRIMARY KEY AUTOINCREMENT,
    Titolo TEXT NOT NULL,
    Genere TEXT,
    Registi TEXT,
    Attori TEXT,
    Data_Uscita DATE,
    Durata INTEGER,
    Dove_vederlo TEXT,
    Trama TEXT
);
-- Creazione tabella serieTV
CREATE TABLE serieTV (
    id_serieTV INTEGER PRIMARY KEY AUTOINCREMENT,
    Titolo TEXT NOT NULL,
    Genere TEXT,
    Registi TEXT,
    Attori TEXT,
    Data_Uscita DATE,
    Num_stagioni INTEGER,
    Num_episodi INTEGER,
    Durata INTEGER,
    Dove_vederlo TEXT,
    Trama TEXT
);
-- Creazione tabella profilo
CREATE TABLE profilo (
    id_profilo INTEGER PRIMARY KEY AUTOINCREMENT,
    utente INTEGER,
    contenuto INTEGER,
    tipo_contenuto TEXT CHECK(tipo_contenuto IN('film', 'serieTV')),
    FOREIGN KEY(utente) REFERENCES utente(id)
);
-- Creazione tabella rating
CREATE TABLE rating (
    id_rating INTEGER PRIMARY KEY AUTOINCREMENT,
    utente INTEGER,
    contenuto INTEGER,
    tipo_contenuto TEXT CHECK(tipo_contenuto IN('film', 'serieTV')),
    voto INTEGER CHECK(
        voto >= 1
        AND voto <= 5
    ),
    FOREIGN KEY(utente) REFERENCES utente(id)
);
-- Creazione tabella commenti
CREATE TABLE commenti (
    id_commento INTEGER PRIMARY KEY AUTOINCREMENT,
    utente INTEGER,
    contenuto INTEGER,
    tipo_contenuto TEXT CHECK(tipo_contenuto IN('film', 'serieTV')),
    commento TEXT NOT NULL,
    FOREIGN KEY(utente) REFERENCES utente(id)
);

