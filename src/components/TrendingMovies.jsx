const TrendingMovies = ({ trendingMovies }) => {
  if (!trendingMovies || trendingMovies.length === 0) return null;

  return (
    <section className="trending">
      <h2>Trending Movies</h2>
      <ul>
        {trendingMovies.map((movie, index) => (
          <li key={movie.$id}>
            <p>{index + 1}</p>
            <img src={movie.poster_url} alt={movie.title} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrendingMovies;