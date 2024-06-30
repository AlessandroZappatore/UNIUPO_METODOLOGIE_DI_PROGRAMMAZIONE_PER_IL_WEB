CREATE TABLE utente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    data_nascita DATE NOT NULL,
    nome_utente TEXT UNIQUE NOT NULL,
    tipologia TEXT NOT NULL,
    password TEXT NOT NULL,
    immagine_profilo TEXT 
);

CREATE TABLE contenuto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titolo TEXT UNIQUE NOT NULL,
    tipologia TEXT NOT NULL, 
    genere TEXT,
    data_uscita DATE,
    num_stagioni INTEGER,
    num_episodi INTEGER,
    durata INTEGER,
    dove_vederlo TEXT,
    trama TEXT,
    poster TEXT NOT NULL,
    nome_creatore TEXT
);

CREATE TABLE attore (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_attore TEXT UNIQUE NOT NULL
);

CREATE TABLE regista (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_regista TEXT UNIQUE NOT NULL
);

CREATE TABLE cast (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contenuto_id INTEGER,
    attore_id INTEGER,
    FOREIGN KEY (contenuto_id) REFERENCES contenuto(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (attore_id) REFERENCES attore(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE regia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contenuto_id INTEGER,
    regista_id INTEGER,
    FOREIGN KEY (contenuto_id) REFERENCES contenuto(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (regista_id) REFERENCES regista(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE profilo (
    id_profilo INTEGER PRIMARY KEY AUTOINCREMENT,
    utente_id INTEGER,
    contenuto_id INTEGER,
    UNIQUE(utente_id, contenuto_id),
    FOREIGN KEY(utente_id) REFERENCES utente(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(contenuto_id) REFERENCES contenuto(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE rating (
    id_rating INTEGER PRIMARY KEY AUTOINCREMENT,
    utente_id INTEGER,
    contenuto_id INTEGER,
    voto INTEGER CHECK(
        voto >= 1
        AND voto <= 5
    ),
    UNIQUE(utente_id, contenuto_id),
    FOREIGN KEY(utente_id) REFERENCES utente(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(contenuto_id) REFERENCES contenuto(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE commenti (
    id_commento INTEGER PRIMARY KEY AUTOINCREMENT,
    utente_id INTEGER,
    contenuto_id INTEGER,
    commento TEXT NOT NULL,
    FOREIGN KEY(utente_id) REFERENCES utente(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(contenuto_id) REFERENCES contenuto(id) ON DELETE CASCADE ON UPDATE CASCADE
);
