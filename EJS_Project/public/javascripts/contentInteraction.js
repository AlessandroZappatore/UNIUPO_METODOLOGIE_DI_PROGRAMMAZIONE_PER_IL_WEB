"use strict";

function showModal(modalId, bodyText, confirmCallback = null) {
    const modalElement = document.getElementById(modalId);
    const modalBody = document.getElementById(`${modalId}Body`);
    modalBody.textContent = bodyText;

    const modal = new bootstrap.Modal(modalElement);

    const confirmButton = document.getElementById(`${modalId}ConfirmButton`);
    if (confirmButton) {
        if (confirmCallback) {
            confirmButton.onclick = confirmCallback;
            confirmButton.style.display = 'block';
        } else {
            confirmButton.onclick = null; 
            confirmButton.style.display = 'none';
        }
    }

    modal.show();
}

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
        window.location.reload();
    })
    .catch(error => {
        console.error('Errore:', error);
    });
}

function confirmUnWatch(contentId, userEmail) {
    showModal('confirmModal', "Sei sicuro di voler segnare questo contenuto come NON visto?", () => {
        unMarkWatched(userEmail, contentId);
        deleteRating(contentId, userEmail);
    });
}


function unMarkWatched(userEmail, contentId) {
    fetch('/mark-as-not-watched', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, contenuto: contentId }),
    })
    .then(response => response.json())
    .then(data => {
        window.location.reload();
    })
    .catch(error => {
        console.error('Errore:', error);
    });
}

function confirmDelete(contentId) {
    showModal('confirmModal', "Sei sicuro di voler eliminare questo contenuto?", () => deleteContent(contentId));
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
        window.location.href = '/home';
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
        window.location.reload();
    })
    .catch(error => {
        console.error('Errore:', error);
    });
}

function confirmDeleteComment(commentId) {
    showModal('confirmModal', "Sei sicuro di voler eliminare questo commento?", () => deleteComment(commentId));
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
        window.location.reload();
        
    })
    .catch(error => {
        console.error('Errore:', error);
    });
}

function confirmDeleteProfile(profileId) {
    showModal('confirmModal', "Sei sicuro di voler eliminare questo profilo?", () => deleteProfile(profileId));
}

function deleteProfile(id_profilo) {
    fetch('/elimina-profilo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id_profilo }),
    })
    .then(response => response.json())
    .then(data => {
        fetch('/sessions/current', { method: 'DELETE' });
        window.location.href = '/home';
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
            console.log(username);
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
        .then(data => {
                window.location.href = '/visualizza_contenuto/' + contenuto;
        })
        .catch(error => {
            showModal('errorModal', 'Errore durante l\'aggiunta del voto');
        });
}

function confirmDeleteRating(contentId, userEmail) {
    showModal('confirmModal', "Sei sicuro di voler rimuovere il voto?", () => deleteRating(contentId, userEmail));
}


function deleteRating(contentId, userEmail) {
    fetch('/delete-rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contenuto: contentId, email: userEmail }),
    })
    .then(response => response.json())
    .then(data => {
        window.location.reload();
    })
    .catch(error => {
        console.error('Errore:', error);
    });
}


function redirectToModifica(contenutoId) {
    var urlModifica = "/modifica_contenuto/" + contenutoId;
    window.location.href = urlModifica;
}

function redirectToModificaProfilo(userId) {
    var urlModifica = "/modifica-profilo/" + userId;
    window.location.href = urlModifica;
}

function simulateSendEmail() {
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
}

document.addEventListener('DOMContentLoaded', function () {
    const searchBy = document.getElementById('searchBy');
    const searchInput = document.getElementById('searchInput');
    const genreSelect = document.getElementById('genreSelect');

    searchBy.addEventListener('change', function () {
      if (searchBy.value === 'genere') {
        searchInput.classList.add('d-none');
        searchInput.removeAttribute('name');
        genreSelect.classList.remove('d-none');
        genreSelect.setAttribute('name', 'query');
      } else {
        searchInput.classList.remove('d-none');
        searchInput.setAttribute('name', 'query');
        genreSelect.classList.add('d-none');
        genreSelect.removeAttribute('name');
      }
    });
  });