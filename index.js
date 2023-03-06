const key = '2a297222'
const searchForm = document.getElementById('search-form')
const filmsContainer = document.getElementById('welcome-page')
let inputEl = document.getElementById('search')
let searchResults = []

if (searchForm) {
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
		}).catch(err => {
			console.log(err)
			// if data is empty the following message is displayed to the user
			filmsContainer.innerHTML = `<p class="welcome-page-body">Unable to find what you’re looking for. <br>Please try another search.</p>`
		})
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
				// empty the films array to render new search
				searchResults.length = 0
			})
	})
}

function renderWatchList() {
	// renders default text if the localStorage is empty
	let watchlistHtml = Object.keys(localStorage).length === 0 ?
		`
			<p class="watchlist-body">Your watchlist is looking a little empty...</p>
			<div class="watchlist-empty">
				<a href="index.html" >
					<img src="images/add.icon.png"
						class="add-icon-img"
						alt="rounded icon with a plus sign that re-routes the user to the home page">
				</a>
				<p>Lets add some movies! </p>
			</div>` :
		``;
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
			// Remove the film from the page when the first HTML element with the class 'film-wrapper' is found
			event.target.closest('.film-wrapper').remove()
		})
	})
}

// generates HTML elements
function generateHTML(pageInput, btnAsideText, btnSymbol) {
	const { Poster, imdbID, Title, imdbRating, Runtime, Genre, Plot } = pageInput
	let buttonDivEl = btnSymbol === '+' ?
		`<div class="sub-wrapper-select">
                        <button aria-label="add film to watchlist" type="submit" class="add-btn" data-add=${imdbID}>${btnSymbol}</button>
                        <p>${btnAsideText}</p>
                    </div>` :
		`<div class="sub-wrapper-select">
                        <button aria-label="remove film from watchlist" type="submit" class="remove-btn" data-remove=${imdbID}>${btnSymbol}</button>
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


