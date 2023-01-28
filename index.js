const key = '2a297222'
const searchVal = 'black panther'
const searchForm = document.getElementById('search-form')
const filmsContainer = document.getElementById('welcome-page')
let inputEl = document.getElementById('search')

let films = []

searchForm.addEventListener('submit', event => {
    event.preventDefault()
    getMovies()
    inputEl.value = ""
})

function renderFilms() {
    let filmsHtml = ``
    films.map(film => {
        fetch(`https://www.omdbapi.com/?apikey=${key}&i=${film.imdbID}&plot=full`)
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                filmsHtml += `
                            <div class="film-wrapper">
                                <img class="film-img" src="${film.Poster}" alt="${film.imdbID}">
                                <div class="film-sub-wrapper">
                                    <div class="sub-wrapper-header">
                                        <h2 class="film-title">${data.Title}</h2>
                                        <p class="film-rating">⭐ ${data.imdbRating}</p>
                                    </div>
                                    <div class="sub-wrapper-sub-header">
                                        <p>${data.Runtime}</p>
                                        <p>${data.Genre}</p>
                                        <div class="sub-wrapper-select">
                                            <button class="add-btn">+</button>
                                            <p>Watchlist</p>
                                        </div>
                                    </div>
                                    <p class="sub-wrapper-body">${data.Plot}</p>
                                </div>
                            </div>
                        `
                filmsContainer.innerHTML = filmsHtml
                films.length = 0;
            })
    })
    // filmsContainer.innerHTML = filmsHtml
    // films.length = 0;
}

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


// {
//     Title: "Live Free or Die Hard", 
//     Year: "2007", imdbID: "tt0337978", 
//     Type: "movie", 
//     Poster: "https://m.media-amazon.com/images/M/MV5BNDQxMDE1OTg4NV5BMl5BanBnXkFtZTcwMTMzOTQzMw@@._V1_SX300.jpg"
// }

