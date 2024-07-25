import {useState} from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState('false');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = catData.find((cat) => {
      cat.name.toLowerCase() === searchTerm.toLowerCase()
    });
    setSearchResult(result)
    setHasSearched(true);
  }

  return (
    <div>
      <form onSubmit={() => handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Searching for a breed?"       
        />
        <button type="submit">Submit</button>
      </form> 
    </div>
  )
}

export default Search;