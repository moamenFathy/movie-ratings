import React, { useEffect, useState } from "react";
import assets from "./assets/assets";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

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
    } catch (err) {
      console.log(err);
      setErrorMessage("Error fetching movies, Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  return (
    <main>
      <div className="pattern" />
      <img src={assets.background} className="absolute w-full" alt="" />
      <div className="wrapper">
        <header>
          <img src={assets.hero} alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span>You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
        </header>
      </div>
    </main>
  );
};

export default App;
