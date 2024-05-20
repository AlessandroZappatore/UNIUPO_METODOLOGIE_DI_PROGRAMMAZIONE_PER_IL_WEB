-- CREATE TABLE utente(
--     email PRIMARY KEY, 
--     Nome NOT NULL, 
--     Cognome NOT NULL, 
--     Data_nascita TEXT NOT NULL, 
--     Nome_utente UNIQUE NOT NULL, 
--     Tipologia BOOLEAN NOT NULL, 
--     Foto_profilo BLOB, 
--     Password NOT NULL);
-- CREATE TABLE contenuto(
--     id_contenuto PRIMARY KEY,
--     Titolo NOT NULL, 
--     Tipologia BOOLEAN NOT NULL, 
--     Genere, 
--     Registi, 
--     Attori, 
--     Data_Uscita, 
--     Num_stagioni, 
--     Num_episodi, 
--     Durata, 
--     Dove_vederlo, 
--     Trama, 
--     Poster BLOB);
CREATE TABLE profilo(
    utente, 
    contenuto,
    PRIMARY KEY(utente, contenuto),
    FOREIGN KEY(utente) REFERENCES utente(email),
    FOREIGN KEY(contenuto) REFERENCES contenuto(id_contenuto));
CREATE TABLE rating(
    utente, 
    contenuto, 
    Voto INTEGER CHECK(Voto>=0 AND Voto<=5),
    PRIMARY KEY(utente, contenuto),
    FOREIGN KEY(utente) REFERENCES utente(email),
    FOREIGN KEY(contenuto) REFERENCES contenuto(id_contenuto));
CREATE TABLE commento(
    utente, 
    contenuto, 
    Testo,
    PRIMARY KEY(utente, contenuto),
    FOREIGN KEY(utente) REFERENCES utente(email),
    FOREIGN KEY(contenuto) REFERENCES contenuto(id_contenuto));  