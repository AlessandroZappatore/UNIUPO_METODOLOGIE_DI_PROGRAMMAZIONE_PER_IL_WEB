"use strict";

function markAsWatched(contenuto, email) {
    fetch('/mark-as-watched', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, contenuto: contenuto }),
    })
    .then(response => response.text())
    .then(data => {
        alert(data)
    })
    .catch(error => {
        console.error('Errore:', error);
    });
}

function deleteContent(id) {
    fetch('/elimina-contenuto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    })
    .then(response => response.json())  
    .then(data => {
        alert(data.message);
        window.location.href = '/home'; // Reindirizza alla home
    })
    .catch(error => {
        console.error('Errore:', error);
    });
}


function inviaCommento(contenuto, utente, commento) {
    fetch('/add-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ utente: utente, contenuto: contenuto, commento: commento }),
    })
    .then(response => response.json())  
    .then(data => {
        alert(data.message);
        window.location.reload();
         
    })
    .catch(error => {
        console.error('Errore:', error);
    });
}


  