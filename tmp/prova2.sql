CREATE TABLE utente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    data_nascita DATE NOT NULL,
    nome_utente TEXT UNIQUE NOT NULL,
    tipologia TEXT NOT NULL,
    password TEXT NOT NULL,
    profilo_immagine TEXT 
);

-- Creazione tabella contenuto
CREATE TABLE contenuto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titolo TEXT UNIQUE NOT NULL,
    tipologia TEXT NOT NULL, 
    genere TEXT,
    registi TEXT,
    attori TEXT,
    data_uscita DATE,
    num_stagioni INTEGER,
    num_episodi INTEGER,
    durata INTEGER,
    dove_vederlo TEXT,
    trama TEXT,
    poster TEXT 
);

-- Creazione tabella profilo
CREATE TABLE profilo (
    id_profilo INTEGER PRIMARY KEY AUTOINCREMENT,
    utente INTEGER,
    contenuto INTEGER,
    UNIQUE(utente, contenuto),
    FOREIGN KEY(utente) REFERENCES utente(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(contenuto) REFERENCES contenuto(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creazione tabella rating
CREATE TABLE rating (
    id_rating INTEGER PRIMARY KEY AUTOINCREMENT,
    utente INTEGER,
    contenuto INTEGER,
    voto INTEGER CHECK(
        voto >= 1
        AND voto <= 5
    ),
    UNIQUE(utente, contenuto),
    FOREIGN KEY(utente) REFERENCES utente(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(contenuto) REFERENCES contenuto(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE commenti (
    id_commento INTEGER PRIMARY KEY AUTOINCREMENT,
    utente INTEGER,
    contenuto INTEGER,
    commento TEXT NOT NULL,
    FOREIGN KEY(utente) REFERENCES utente(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(contenuto) REFERENCES contenuto(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO utente (email, nome, cognome, data_nascita, nome_utente, tipologia, password, profilo_immagine)
VALUES ('prova@prova.it', 'prova', 'prova', '1999-01-01', 'prova', 'prova', 'prova', 'prova');

INSERT INTO contenuto (titolo, tipologia, genere, registi, attori, data_uscita, num_stagioni, num_episodi, durata, dove_vederlo, trama, poster)
VALUES ('prova', 'prova', 'prova', 'prova', 'prova', '1999-01-01', 1, 1, 1, 'prova', 'prova', 'prova');

INSERT INTO commenti (utente, contenuto, commento)
VALUES (1, 1, 'prova');

DELETE FROM utente WHERE id = 1;