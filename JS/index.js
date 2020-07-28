const apiKey = "b89fc45c2067cbd33560270639722eae";
const utl_playing = "https://api.themoviedb.org/3/movie/now_playing?api_key=";
const url_top = "https://api.themoviedb.org/3/movie/top_rated?api_key=";
const url_coming = "https://api.themoviedb.org/3/movie/upcoming?api_key=";
const MOVIES = 12;
const ITEM_1 = 1;
const ITEM_2 = 2;
const ITEM_3 = 3;

async function getMovie(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getPopularMovies(url_top) {
  const url = `${url_top}${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

async function getTopMoviesIds(n, url_top) {
  const popularMovies = await getPopularMovies(url_top);
  const ids = popularMovies.slice(0, n).map((movie) => movie.id);
  return ids;
}

function cutOverview(overview) {
  if (overview.length > 160) {
    overview = `${overview.substring(0,160)}...`
  }

  return overview
}

function renderMovies(movies, item) {
  const movieList = document.getElementById(`movies-${item}`);
  movieList.innerHTML = "";

  movies.forEach((movie) => {
    const listItem = document.createElement("li");
    listItem.className = `item-${item}`;
    listItem.style = `background-image: url('https://image.tmdb.org/t/p/w342${movie.poster_path}')`;
    listItem.innerHTML = `
            <span></span>
            <article>
              <h5>${movie.title}</h5>
              <p>
                ${cutOverview(movie.overview)}
              </p>
            </article>`
    movieList.appendChild(listItem)
  })
}

async function getTopMoviesInParallel(n, url) {
  const ids = await getTopMoviesIds(n, url);
  const moviePromises = ids.map((id) => getMovie(id));
  const movies = await Promise.all(moviePromises);
  return movies;
}

const movieNew = async function (n, url, item) {
  const movies = await getTopMoviesInParallel(n, url);
  renderMovies(movies, item);
};

const movieCarouselNew = movieNew(MOVIES, utl_playing, ITEM_1);
const movieCarouselTop = movieNew(MOVIES, url_top, ITEM_2);
const movieCarouselComing = movieNew(MOVIES, url_coming, ITEM_3);
