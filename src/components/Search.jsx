import React from "react";
import assets from "../assets/assets";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="text-white text-3xl">
      <img src={assets.search} alt="" />
      <input
        type="text"
        placeholder="Search through thousands of movies"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default Search;
