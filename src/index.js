document.addEventListener("DOMContentLoaded", () => {
    const filmsList = document.getElementById("films");
    const posterImg = document.getElementById("poster");
    const movieTitle = document.getElementById("title");
    const movieRuntime = document.getElementById("runtime");
    const movieShowtime = document.getElementById("showtime");
    const ticketNum = document.getElementById("ticket-num");
    const filmInfo = document.getElementById("film-info");
    const buyTicketBtn = document.getElementById("buy-ticket");

    let selectedMovieId = 1; // Starts with the first movie
    // Fetching and displaying the first movie details
    function loadFirstMovie() {
        fetch("http://localhost:3000/films/1")
            .then((response) => response.json())
            .then((movie) => displayMovieDetails(movie))
            .catch((error) => console.error("Error fetching movie:", error));
    }
    // Fetching and populating the films list
    function loadFilmsList() {
        fetch("http://localhost:3000/films")
            .then((response) => response.json())
            .then((movies) => {
                filmsList.innerHTML = ""; // Clears existing items
                movies.forEach((movie) => {
                    const movieItem = document.createElement("li");
                    movieItem.textContent = movie.title;
                    movieItem.classList.add("film", "item");

                    // If the movie is sold out it should mark it
                    if (movie.tickets_sold >= movie.capacity) {
                        movieItem.classList.add("sold-out");
                        movieItem.textContent += " (Sold Out)";
                    }
                    movieItem.addEventListener("click", () => {
                        displayMovieDetails(movie);
                    });
                    const deleteBtn = document.createElement("button");
                    deleteBtn.className = 'delete-button'
                    deleteBtn.textContent = "Delete";
                    deleteBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        deleteMovie(movie.id, movieItem);
                    });

                    movieItem.appendChild(deleteBtn);
                    filmsList.appendChild(movieItem);
                });
            })
            .catch((error) => console.error("Error fetching films list:", error));
    }

    // This is to display the selected movie details
    function displayMovieDetails(movie) {
        selectedMovieId = movie.id;
        posterImg.src = movie.poster;
        movieTitle.textContent = movie.title;
        movieRuntime.textContent = `${movie.runtime} minutes`;
        movieShowtime.textContent = movie.showtime;
        filmInfo.textContent = movie.description;
        const availableTickets = movie.capacity - movie.tickets_sold;
        ticketNum.textContent = `${availableTickets} remaining tickets`;

        // Then update the buy ticket button
        buyTicketBtn.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
        buyTicketBtn.disabled = availableTickets <= 0;

        buyTicketBtn.onclick = () => {
            if (availableTickets > 0) {
                buyTicket(movie);
            }
        };
    }

    // Buy a ticket for the current movie
    function buyTicket(movie) {
        const newTicketsSold = movie.tickets_sold + 1;

        fetch(`http://localhost:3000/films/${movie.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tickets_sold: newTicketsSold,
            }),
        })
            .then((response) => response.json())
            .then((updatedMovie) => {
                displayMovieDetails(updatedMovie); // Refreshes movie details with updated ticket count
                loadFilmsList();
            })
            .catch((error) => console.error("Error updating tickets:", error));
    }

    // Delete a movie
    function deleteMovie(movieId, movieItem) {
        fetch(`http://localhost:3000/films/${movieId}`, {
            method: "DELETE",
        })
            .then(() => {
                movieItem.remove();
            })
            .catch((error) => console.error("Error deleting movie:", error));
    }
    loadFirstMovie();
    loadFilmsList();
});
