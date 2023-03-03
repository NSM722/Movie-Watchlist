const key = '2a297222'
const searchForm = document.getElementById('search-form')
const filmsContainer = document.getElementById('welcome-page')
let inputEl = document.getElementById('search')
let searchResults = []

// conditional statement prevents null error when switching to the watchlist.html page
if (searchForm) {
	// checking that the input element has a value or not
	inputEl.addEventListener('input', () => {
		inputEl.value ?
			document.getElementById('search-btn').removeAttribute('disabled') :
			document.getElementById('search-btn').setAttribute('disabled', true)
	})

	// add submit event and fetch list of movies
	searchForm.addEventListener('submit', event => {
		event.preventDefault()
		getMovies(inputEl.value)
		inputEl.value = ""
	})
}

function getMovies(searchTerm) {
	fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${key}`)
		.then(res => res.json())
		.then(data => {
			data.Search.forEach(searchItem => {
				searchResults.push(searchItem)
			})
			renderFilms(searchResults)
		}).catch(err => console.log(err))
}

function renderFilms(arr) {
	let filmsHtml = ``
	let detailedFilms = []
	arr.forEach(film => {
		fetch(`https://www.omdbapi.com/?apikey=${key}&i=${film.imdbID}`)
			.then(res => res.json())
			.then(detailedFilm => {
				detailedFilms.push(detailedFilm)
				filmsHtml += generateHTML(detailedFilm, 'Watchlist', '+')
				filmsContainer.innerHTML = filmsHtml
				// Adding films to the watchlist
				let addButtons = document.querySelectorAll('.add-btn')
				addButtons.forEach(addBtn => {
					addBtn.addEventListener('click', event => {
						let addedFilmID = event.target.dataset.add;
						let addedFilm = detailedFilms.find(film => film.imdbID === addedFilmID)
						localStorage.setItem(addedFilmID, JSON.stringify(addedFilm))
					})
				})
				searchResults.length = 0
			})
	})
}

function renderWatchList() {
	let watchlistHtml = ``;
	// parse the data stored in the local storage
	Object.keys(localStorage).forEach(function (savedKey) {
		let savedFilm = JSON.parse(localStorage.getItem(savedKey));
		watchlistHtml += generateHTML(savedFilm, 'Remove', '-')
	})
	if (document.querySelector(".watchlist-container")) {
		document.querySelector(".watchlist-container").innerHTML = watchlistHtml
	}
	// removing films from the watchlist
	let removeButtons = document.querySelectorAll('.remove-btn')
	removeButtons.forEach(removeBtn => {
		removeBtn.addEventListener('click', event => {
			let removeFilmID = event.target.dataset.remove;
			localStorage.removeItem(removeFilmID)
			// Remove the film HTML element from the page
			event.target.closest('.film-wrapper').remove()
		})
	})
}

// generates HTML elements
function generateHTML(pageInput, btnAsideText, btnSymbol) {
	const { Poster, imdbID, Title, imdbRating, Runtime, Genre, Plot } = pageInput
	let buttonDivEl = btnSymbol === '+' ?
		`<div class="sub-wrapper-select">
                        <button class="add-btn" data-add=${imdbID}>${btnSymbol}</button>
                        <p>${btnAsideText}</p>
                    </div>` :
		`<div class="sub-wrapper-select">
                        <button class="remove-btn" data-remove=${imdbID}>${btnSymbol}</button>
                        <p>${btnAsideText}</p>
                    </div>`
	return `
					<div class="film-wrapper">
						<img class="film-img" src="${Poster}" alt="${imdbID}">
						<div class="film-sub-wrapper">
							<div class="sub-wrapper-header">
								<h2 class="film-title">${Title}</h2>
								<p class="film-rating">⭐ ${imdbRating}</p>
								${buttonDivEl}
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


