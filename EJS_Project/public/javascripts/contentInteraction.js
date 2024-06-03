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

function confirmDelete(contentId) {
    if (confirm("Sei sicuro di voler eliminare questo contenuto?")) {
        deleteContent(contentId);
    }
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

function confirmDeleteComment(commentId) {
    if (confirm("Sei sicuro di voler eliminare questo commento?")) {
        deleteComment(commentId);
    }
}

function deleteComment(id_commento) {
    fetch('/elimina-commento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_commento: id_commento }),
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

document.addEventListener('DOMContentLoaded', (event) => {
    const ratingContainer = document.querySelector('.rating');
    const username = ratingContainer.getAttribute('data-user-username');
    const contentTitle = ratingContainer.getAttribute('data-content-title');
    
    const ratingInputs = document.querySelectorAll('.rating-input');
    
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            const ratingValue = this.value;
            addRating(username, contentTitle, ratingValue);
        });
    });
});



function addRating(utente, contenuto, voto) {
    fetch('/add-rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ utente: utente, contenuto: contenuto, voto: voto }),
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


