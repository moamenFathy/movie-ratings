import assets from "../assets/assets";
import Search from "./Search";

const Header = ({headerMovies, searchTerm, setSearchTerm}) => {
  return (
    <header>
      <div className="header_wrapper hidden sm:hidden md:block lg:block">
        <img src={headerMovies[0]?.poster_path ? `https://image.tmdb.org/t/p/w500/${headerMovies[0].poster_path}` : assets.noPoster} alt="Hero Banner" />
        <img src={headerMovies[1]?.poster_path ? `https://image.tmdb.org/t/p/w500/${headerMovies[1].poster_path}` : assets.noPoster} alt="Hero Banner" />
        <img src={headerMovies[2]?.poster_path ? `https://image.tmdb.org/t/p/w500/${headerMovies[2].poster_path}` : assets.noPoster} alt="Hero Banner" />
      </div>
      <h1>
        Find <span className="text-gradient">Movies</span>You'll Enjoy
        Without the Hassle
      </h1>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </header>
  )
}

export default Header