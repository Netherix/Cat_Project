import {useState, useEffect} from 'react';

const Home = () => {
  const [catData, getCatData] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      try {const response = await fetch('https://api.thecatapi.com/v1/breeds');
        if (!response.ok) {
          throw new Error('Error: could not get response')
        }
        const data = await response.json();
        getCatData(data);
      } catch (error) {
          console.error('Error: ', error)
      }
    }
    fetchData();
  });

  const handleClick = (cat) => {
    if (selectedCat && selectedCat.id === cat.id) {
      setSelectedCat(null);
    } else {
      setSelectedCat(cat);
    }
  };

  const handleFavorites = (cat) => {
    const fetchData = async() => {
      try { 
        const response = await fetch (`https://api.thecatapi.com/v1/images/${cat.reference_image_id}`);
        if (!response.ok) {
          throw new Error ('Response failed');
        }
        const data = await response.json();
        console.log(data)
        setFavorites((prevFavorites) => [...prevFavorites, data]);
      } catch (error) {
          console.error('Error: ', error);
      }
    }
    if (favorites.some(favorite => favorite.id === cat.reference_image_id)) {
      alert('This cat is already in your favorites!');
      return;
    }
    fetchData();
  }

  const handleRemoveFavorites = (image) => {
    const updatedFavorites = favorites.filter((favImage) => favImage.id !== image.id);
    setFavorites(updatedFavorites);
  }

  return (
    <div>
      <h3>Favorites</h3>
      {favorites.map((image) => (
        <div>
          <img
            key={image.id}
            src={image.url}
            alt={image.name}
            style={{ height:"300px", width: "300px" }}         
          />
          <button onClick={() => handleRemoveFavorites(image)}>
            Remove Favorites
          </button>
        </div>
      ))}
      {catData.map((cat) => (
        <div>
          <button onClick={() => handleClick(cat)}>
            {cat.name}
          </button>
          {selectedCat && selectedCat.id === cat.id && (
            <img
              key={cat.id}
              src={`https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg`}
              alt={cat.name}
              style={{ height:'300px', width:'300px' }}   
            />
          )}
          <button onClick={() => handleFavorites(cat)}>
            Favorite
          </button>
        </div>
      ))}
    </div>
  )
}

export default Home;

