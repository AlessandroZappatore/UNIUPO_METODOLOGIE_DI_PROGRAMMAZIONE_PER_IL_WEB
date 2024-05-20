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
-- CREATE TABLE profilo(
--     utente, 
--     contenuto,
--     PRIMARY KEY(utente, contenuto),
--     FOREIGN KEY(utente) REFERENCES utente(email),
--     FOREIGN KEY(contenuto) REFERENCES contenuto(id_contenuto));
-- CREATE TABLE rating(
--     utente, 
--     contenuto, 
--     Voto INTEGER CHECK(Voto>=0 AND Voto<=5),
--     PRIMARY KEY(utente, contenuto),
--     FOREIGN KEY(utente) REFERENCES utente(email),
--     FOREIGN KEY(contenuto) REFERENCES contenuto(id_contenuto));
-- CREATE TABLE commento(
--     utente, 
--     contenuto, 
--     Testo,
--     PRIMARY KEY(utente, contenuto),
--     FOREIGN KEY(utente) REFERENCES utente(email),
--     FOREIGN KEY(contenuto) REFERENCES contenuto(id_contenuto));  

-- INSERT INTO utente(email, Nome, Cognome, Data_nascita, Nome_utente, Tipologia, Password)
-- VALUES ('utente1@gmail.com', 'Utente', 'Uno', '10/3/2000', 'Utente 1', 0, 'password');

-- INSERT INTO contenuto(id_contenuto, Titolo, Tipologia, Genere, Registi, Attori, Data_Uscita, Durata, Dove_vederlo, Trama)
-- VALUES ('Film1','Interstellar', 0, 'Fantascienza', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway, Michael Caine, John Lithgow, Jessica Chastain, Casey Affleck, Mackenzie Foy, Wes Bentley, Matt Damon, Timothée Chalamet, William Devane, David Oyelowo, Bill Irwin',
--  '5/11/2014', 169, 'NOW TV', 'L''umanità è sull''orlo dell''estinzione e un gruppo di astronauti viaggia attraverso un wormhole alla ricerca di un altro pianeta abitabile.'); 

-- INSERT INTO profilo(utente, contenuto)
-- VALUES ('utente1@gmail.com', 'Film1');

-- INSERT INTO rating(utente, contenuto, voto)
-- VALUES ('utente1@gmail.com', 'Film1', 4);

INSERT INTO commento(utente, contenuto, testo)
VALUES ('utente2@gmail.com', 'Film1', 'Film molto bello');