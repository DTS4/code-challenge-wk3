// Your code here

// First Challenge
const init = () => {
    fetchFilmData(); 
}

const fetchFilmData = () => {
    fetch('http://localhost:3000/films') 
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((films) => {
            populateFilmList(films); // Populate the film list
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
};

const populateFilmList = (films) => {
    const filmList = document.getElementById('films');
    filmList.innerHTML = '';  
    films.forEach(film => {
        const li = document.createElement('li');
        li.className = 'film item';
        li.textContent = film.title;  
        li.dataset.id = film.id;  
        li.addEventListener('click', () => displayFilmDetails(film));  
        filmList.appendChild(li);
    });
};

const displayFilmDetails = (film) => {
    const title = document.querySelector("#title");
    title.textContent = film.title;

    const poster = document.querySelector("#poster");
    poster.src = film.poster;
    poster.alt = `${film.title} poster`;

    const runtime = document.querySelector("#runtime");
    runtime.textContent = `${film.runtime} minutes`;

    const showtime = document.querySelector("#showtime");
    showtime.textContent = film.showtime;

    const availableTickets = document.querySelector("#ticket-num");
    availableTickets.textContent = `${film.capacity - film.tickets_sold} remaining tickets`;

    const description = document.querySelector("#film-info");
    description.textContent = film.description;
};

document.addEventListener("DOMContentLoaded", init);


// Separate buy ticket code 

const buyTicket = (film) => {
    const ticketsSold = film.tickets_sold;
    const capacity = film.capacity;
    const availableTickets = capacity - ticketsSold;

    if (availableTickets <= 0) {
        alert("Sorry, this showing is sold out!");
        return; // Exit the function if no tickets are available
    }

    const newTicketsSold = ticketsSold + 1; 
    fetch(`http://localhost:3000/films/${film.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tickets_sold: newTicketsSold })
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((updatedFilm) => {
        displayFilmDetails(updatedFilm);  
        postTicketPurchase(updatedFilm.id, 1); // Assume buying 1 ticket
        displaySuccessMessage();  
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
        displayErrorMessage(); 
    });
};

const postTicketPurchase = (filmId, numberOfTickets) => {
    fetch('http://localhost:3000/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            film_id: filmId,
            number_of_tickets: numberOfTickets
        })
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((ticket) => {
        console.log('Ticket purchased:', ticket);
    })
    .catch((error) => {
        console.error('There has been a problem with your ticket purchase operation:', error);
    });
};
const displaySuccessMessage = () => {
    alert("Ticket purchased successfully!");
};
const displayErrorMessage = () => {
    alert("There was an error processing your purchase. Please try again.");
};


