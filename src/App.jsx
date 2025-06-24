import { useEffect, useState } from 'react';
import './App.css';
import AdBanner from './AdBanner';

function App() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'https://car-rental-pi48.onrender.com/api/cars/';

  useEffect(() => {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch cars: ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data.results)) {
          setCars(data.results);
        } else if (Array.isArray(data)) {
          setCars(data);
        } else {
          setError('Unexpected response format');
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError(error.message);
      });
  }, []);

  return (
    <div className="App">
      <h1>Premium Crystal Car Rental</h1>
      <div style={{ margin: '20px auto', textAlign: 'center' }}>
        <AdBanner />
      </div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <h2>Available Cars</h2>
      {cars.length === 0 && !error ? (
        <p>Loading cars...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {cars.map(car => (
            <li key={car.id} style={{ margin: '10px 0', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              {car.image_url ? (
                <img
                  src={car.image_url}
                  alt={`${car.make} ${car.model}`}
                  style={{ maxWidth: '300px', borderRadius: '10px' }}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
                />
              ) : (
                <p>No image available</p>
              )}
              <h3>{car.make} {car.model} ({car.year})</h3>
              <p>Category: {car.category?.name || 'N/A'}</p>
              <p>{car.description || 'No description'}</p>
              <p><strong>${car.daily_rate}/day</strong></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;