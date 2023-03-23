# Movie Watchlist

[Movie Watchlist live demo](https://nsm722.github.io/Movie-Watchlist/ "visit site")

<img width="70%" alt="Movie_Watchlist_bg" src="https://user-images.githubusercontent.com/83452606/215103002-f01c7659-a550-4547-881c-eb0c9f9022be.png">

The site has two pages:

- Search Page
- Watchlist Page

## Search Page

This page interacts with the [The Open Movie Database API]("https://www.omdbapi.com/" "Read Docs") and displays all the search results

From this page a user can search for and select which movie to add to the watchlist

## Watchlist Page

Contains all the movies the user added to the watchlist

This pages loads and displays data stored from the windows local storage

## Misc

Used [axe DevTools](https://deque.com/axe/devtools/ "Read docs") to run accessibilty tests

**This line of code ensures that when the window loads, the renderWatchlist function will be invoked in both index.html & watchlist.html without throwing an error**

```javascript
window.onload = () => {
  renderWatchList();
};
```

**The following conditional statement prevents a null error when switching from the Search/Home page to the Watchlist page**

```javascript
if (searchForm) {
  // checking that the input element has a value or not
  inputEl.addEventListener("input", () => {
    inputEl.value
      ? document.getElementById("search-btn").removeAttribute("disabled")
      : document.getElementById("search-btn").setAttribute("disabled", true);
  });

  // add submit event and fetch list of movies
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    getMovies(inputEl.value);
    inputEl.value = "";
  });
}
```

[How to create a search icon inside input box with HTML and CSS](https://nikitahl.com/search-icon-inside-input "Read More")

[How to center an absolute positioned element vertically and horizontally with CSS](https://www.freecodecamp.org/news/how-to-center-an-absolute-positioned-element/ "Read More")

### Caveats

According to the initial Figma design and size of the background image, the maximum width of the container should be 700px

With the above design
the pages are no longer responsive for screens below **37.625em**
