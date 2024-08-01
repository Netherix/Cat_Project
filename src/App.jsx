import { useState, useEffect } from 'react';
import Search from './Search.jsx';

const Home = () => {
  const [catData, getCatData] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState('default');

  const CATS_PER_PAGE = 10;
  const CAT_LENGTH = catData.length;
  const MAX_PAGES = Math.ceil(CAT_LENGTH / CATS_PER_PAGE);
  const lastCatIndex = CATS_PER_PAGE * currentPage;
  const firstCatIndex = lastCatIndex - CATS_PER_PAGE;
  const pageNumbers = Array.from({ length: MAX_PAGES }, (v, i) => i + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.thecatapi.com/v1/breeds');
        if (!response.ok) {
          throw new Error('Error: could not get response');
        }
        const data = await response.json();
        getCatData(data);
      } catch (error) {
        console.error('Error: ', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory]);

  const handleSelect = (e) => {
    setCurrentCategory(e.target.value);
  }

  const sortedCatData = [...catData].sort((a,b) => {
    if (currentCategory === 'default') return 0;
    return b[currentCategory] - a[currentCategory];
  })

  const currentCatArray = sortedCatData.slice(firstCatIndex, lastCatIndex);

  const handleClick = (cat) => {
    if (selectedCat && selectedCat.id === cat.id) {
      setSelectedCat(null);
    } else {
      setSelectedCat(cat);
    }
  };

  const handleFavorites = (cat) => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.thecatapi.com/v1/images/${cat.reference_image_id}`);
        if (!response.ok) {
          throw new Error('Response failed');
        }
        const data = await response.json();
        console.log(data);
        setFavorites((prevFavorites) => [...prevFavorites, data]);
      } catch (error) {
        console.error('Error: ', error);
      }
    };
    if (favorites.some(favorite => favorite.id === cat.reference_image_id)) {
      alert('This cat is already in your favorites!');
      return;
    }
    fetchData();
  };

  const handleRemoveFavorites = (image) => {
    const updatedFavorites = favorites.filter((favImage) => favImage.id !== image.id);
    setFavorites(updatedFavorites);
  };

  const handlePreviousPage = () => {
      setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
      setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <div>
        <label htmlFor="select">Select For: </label>
          <select id="select" onChange={handleSelect} value={currentCategory}>
            <option value="default">Default</option>
            <option value="intelligence">Intelligence</option>
            <option value="child_friendly">Child Friendly</option>
            <option value="dog_friendly">Dog Friendly</option>
            <option value="shedding_level">Shedding Level</option>
            <option value="affection_level">Affection Level</option>
            <option value="health_issues">Health Issues</option>
          </select>
      </div>

      <Search catData={catData} />
      <h3>Favorites</h3>
      {favorites.map((image) => (
        <div key={image.id}>
          <img
            src={image.url}
            alt={image.name}
            style={{ height: "300px", width: "300px" }}
          />
          <button onClick={() => handleRemoveFavorites(image)}>
            Remove Favorites
          </button>
        </div>
      ))}
      {currentCatArray.map((cat) => (
        <div key={cat.id}>
          <button onClick={() => handleClick(cat)}>
            {cat.name}
          </button>
          {selectedCat && selectedCat.id === cat.id && (
            <img
              src={`https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg`}
              alt={cat.name}
              style={{ height: '300px', width: '300px' }}
            />
          )}
          <button onClick={() => handleFavorites(cat)}>
            Favorite
          </button>
        </div>
      ))}
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          &lt; Previous
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === MAX_PAGES}>
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default Home;
