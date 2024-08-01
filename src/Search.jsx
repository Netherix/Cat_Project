import { useState } from 'react';

const Search = ({ catData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // Initialize as a boolean

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const result = catData.find((cat) => {
      return searchTerm.toLowerCase() === cat.name.toLowerCase();
    });
    setSearchResult(result);
    setHasSearched(true);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for a breed"
        />
        <button type="submit">
          Submit
        </button>
      </form>
      {hasSearched && (
        searchResult ? (
          <img 
            src={`https://cdn2.thecatapi.com/images/${searchResult.reference_image_id}.jpg`}
            alt={searchResult.name}
            style={{ height:"300px", width: "300px" }}  
          />
        ) : (
          <h3>Not Found</h3>
        )
      )}
    </div>
  );
};

export default Search;
