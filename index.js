// http://www.omdbapi.com/?i=tt3896198&apikey=2a297222

const key = '2a297222'
const searchVal = 'black panther'
const searchForm = document.getElementById('search-form')
const filmsContainer = document.getElementById('welcome-page')
let inputEl = document.getElementById('search')

let films = []

function getMovies() {
	fetch(`https://www.omdbapi.com/?s=${inputEl.value}&apikey=${key}`)
		// https://www.omdbapi.com/?t=${inputEl.value}&apikey=${key}&plot=full
		.then(res => res.json())
		.then(data => {
			// console.log(data)
			data.Search.forEach(item => {
				films.push(item)
				// console.log(films)
			})
			renderFilms()
		}).catch(err => console.log(err))
}

if (searchForm) {
	searchForm.addEventListener('submit', event => {
		event.preventDefault()
		getMovies()
		inputEl.value = ""
	})
}

function renderFilms() {
	let filmsHtml = ``
	films.map(film => {
		fetch(`https://www.omdbapi.com/?apikey=${key}&i=${film.imdbID}`)
			.then(res => res.json())
			.then(detailedFilm => {
				filmsHtml += `
                            <div class="film-wrapper">
                                <img class="film-img" src="${film.Poster}" alt="${film.imdbID}">
                                <div class="film-sub-wrapper">
                                    <div class="sub-wrapper-header">
                                        <h2 class="film-title">${detailedFilm.Title}</h2>
                                        <p class="film-rating">⭐ ${detailedFilm.imdbRating}</p>
                                    </div>
                                    <div class="sub-wrapper-sub-header">
                                        <p>${detailedFilm.Runtime}</p>
                                        <p>${detailedFilm.Genre}</p>
                                        <div class="sub-wrapper-select">
                                            <button 
                                                class="add-btn" 
                                                id="add-btn"
                                                data-add=${film.imdbID}>+</button>
                                            <p>Watchlist</p>
                                        </div>
                                    </div>
                                    <p class="sub-wrapper-body">${detailedFilm.Plot}</p>
                                </div>
                            </div>
                        `
				filmsContainer.innerHTML = filmsHtml
				// empty the films array to render new search
				films.length = 0;


				// Adding films to the watchlist
				let addButtons = document.querySelectorAll('.add-btn')
				addButtons.forEach(addBtn => {
					addBtn.addEventListener('click', event => {
						const addedFilmID = event.target.dataset.add;
						// Save added film to the local storage 
						localStorage.setItem(addedFilmID, JSON.stringify(detailedFilm))
						// console.log(`Button with id ${addedFilmID} was clicked`)
					})
				})
				// empty the films array to render new search
				films.length = 0;
			})

	})

}


function renderWatchList() {
	// watch list html
	let watchlistHtml = ``;

	// parse the data stored in the local storage
	Object.keys(localStorage).forEach(function (key) {
		const film = JSON.parse(localStorage.getItem(key));
		watchlistHtml += `
            <div class="film-wrapper">
                <img class="film-img" src="${film.Poster}" alt="${film.imdbID}">
                <div class="film-sub-wrapper">
                <div class="sub-wrapper-header">
                    <h2 class="film-title">${film.Title}</h2>
                    <p class="film-rating">⭐ ${film.imdbRating}</p>
                </div>
                <div class="sub-wrapper-sub-header">
                                    <p>${film.Runtime}</p>
                                    <p>${film.Genre}</p>
                </div>
                <p class="sub-wrapper-body">${film.Plot}</p>
                </div>
            </div>
            `
	})
	if (document.querySelector(".watchlist-container")) {
		document.querySelector(".watchlist-container").innerHTML += watchlistHtml
	}
}


// call renderWatchlist in DOMContentLoaded event in both index.html & watchlist.html
window.onload = () => {
	renderWatchList()
}

// localStorage.clear()

