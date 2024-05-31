-- Creazione tabella utente
CREATE TABLE utente (
    email TEXT PRIMARY KEY,
    Nome TEXT NOT NULL,
    Cognome TEXT NOT NULL,
    Data_nascita DATE NOT NULL,
    Nome_utente TEXT UNIQUE NOT NULL,
    Tipologia TEXT NOT NULL, -- Cambiato da BOOLEAN a TEXT
    Password TEXT NOT NULL,
    profiloImmagine TEXT -- Aggiunto per gestire l'immagine del profilo
);

-- Creazione tabella contenuto
CREATE TABLE contenuto (
    Titolo TEXT PRIMARY KEY,
    Tipologia TEXT NOT NULL, -- Cambiato da BOOLEAN a TEXT
    Genere TEXT,
    Registi TEXT,
    Attori TEXT,
    Data_Uscita DATE,
    Num_stagioni INTEGER,
    Num_episodi INTEGER,
    Durata INTEGER,
    Dove_vederlo TEXT,
    Trama TEXT,
    poster TEXT -- Aggiunto per gestire l'immagine del poster
);

-- Creazione tabella profilo
CREATE TABLE profilo (
    id_profilo INTEGER PRIMARY KEY AUTOINCREMENT,
    utente TEXT,
    contenuto TEXT,
    FOREIGN KEY(utente) REFERENCES utente(email),
    FOREIGN KEY(contenuto) REFERENCES contenuto(Titolo)
);

-- Creazione tabella rating
CREATE TABLE rating (
    id_rating INTEGER PRIMARY KEY AUTOINCREMENT,
    utente TEXT,
    contenuto TEXT,
    voto INTEGER CHECK(
        voto >= 1
        AND voto <= 5
    ),
    FOREIGN KEY(utente) REFERENCES utente(email),
    FOREIGN KEY(contenuto) REFERENCES contenuto(Titolo)
);

-- Creazione tabella commenti
CREATE TABLE commenti (
    id_commento INTEGER PRIMARY KEY AUTOINCREMENT,
    utente TEXT,
    contenuto TEXT,
    commento TEXT NOT NULL,
    FOREIGN KEY(utente) REFERENCES utente(email),
    FOREIGN KEY(contenuto) REFERENCES contenuto(Titolo)
);

INSERT INTO commenti(utente, contenuto, commento) 
VALUES ('Test', 'Interstellar', 'Uno dei migliori film mai fatti.');

DELETE FROM contenuto WHERE Titolo='Prova2';