import { useEffect, useState } from "react";
import assets from "./assets/assets";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";
import Header from "./components/Header.jsx";
import TrendingMovies from "./components/TrendingMovies.jsx";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [headerMovies, setHeaderMovies] = useState([]); // Store initial 3 movies for header

  useDebounce(() => setDebounceSearchTerm(searchTerm), 600, [searchTerm]);

  const API_BASE_URL = "https://api.themoviedb.org/3";

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const res = await fetch(endpoint, API_OPTIONS);

      if (!res.ok) throw new Error("Failed to fetch movies");

      const data = await res.json();
      if (data.Response === "false") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      // Save first 3 movies for header only on initial load (no search query)
      if (!query && headerMovies.length === 0 && data.results.length >= 3) {
        setHeaderMovies(data.results.slice(0, 3));
      }

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Error fetching movies, Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <img src={assets.background} className="absolute w-full" alt="" />
      <div className="wrapper">
        <Header headerMovies={headerMovies} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <TrendingMovies trendingMovies={trendingMovies} />

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
