const key = '2a297222'
const searchForm = document.getElementById('search-form')
const filmsContainer = document.getElementById('welcome-page')
let inputEl = document.getElementById('search')
let films = []

if (searchForm) {
	searchForm.addEventListener('submit', event => {
		event.preventDefault()
		getMovies()
		inputEl.value = ""
	})
}

function getMovies() {
	fetch(`https://www.omdbapi.com/?s=${inputEl.value}&apikey=${key}`)
		.then(res => res.json())
		.then(data => {
			// console.log(data)
			data.Search.forEach(searchItem => {
				films.push(searchItem)
			})
			// console.log(films)
			renderFilms(films)
		}).catch(err => console.log(err))
}

function renderFilms(arr) {
	let filmsHtml = ``
	// console.log(films)
	arr.forEach(film => {
		fetch(`https://www.omdbapi.com/?apikey=${key}&i=${film.imdbID}`)
			.then(res => res.json())
			.then(detailedFilm => {
				// console.log(detailedFilm)
				filmsHtml += generateHTML(detailedFilm, 'Watchlist', '+')
				filmsContainer.innerHTML = filmsHtml
				// Adding films to the watchlist
				let addButtons = document.querySelectorAll('.add-btn')
				addButtons.forEach(addBtn => {
					addBtn.addEventListener('click', event => {
						let addedFilmID = event.target.dataset.add;
						// Save added film to the local storage 
						localStorage.setItem(addedFilmID, JSON.stringify(detailedFilm))
						// console.log(`Button with id ${addedFilmID} was clicked` )
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
	Object.keys(localStorage).forEach(function (savedKey) {
		// console.log(Object.keys(localStorage))
		let savedFilm = JSON.parse(localStorage.getItem(savedKey));
		watchlistHtml += generateHTML(savedFilm, 'Remove', '-')
	})
	if (document.querySelector(".watchlist-container")) {
		document.querySelector(".watchlist-container").innerHTML = watchlistHtml
	}
}

// generates HTML elements
function generateHTML(pageInput, btnAsideText, btnSymbol) {
	const { Poster, imdbID, Title, imdbRating, Runtime, Genre, Plot } = pageInput
	return `
					<div class="film-wrapper">
						<img class="film-img" src="${Poster}" alt="${imdbID}">
						<div class="film-sub-wrapper">
							<div class="sub-wrapper-header">
								<h2 class="film-title">${Title}</h2>
								<p class="film-rating">⭐ ${imdbRating}</p>
								<div class="sub-wrapper-select">
									<button class="add-btn" id="add-btn" data-add=${imdbID}>${btnSymbol}</button>
									<p>${btnAsideText}</p>
								</div>
							</div>
							<div class="sub-wrapper-sub-header">
								<p>${Runtime}</p>
								<p>${Genre}</p>
							</div>
							<p class="sub-wrapper-body">${Plot}</p>
						</div>
					</div>
				`
}

// call renderWatchlist when the Window loads in both index.html & watchlist.html
window.onload = () => {
	renderWatchList()
}
// localStorage.clear()


