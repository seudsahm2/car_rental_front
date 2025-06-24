import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch cars from backend
    fetch('https://car-rental-pi48.onrender.com/api/cars/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        return response.json();
      })
      .then(data => setCars(data))
      .catch(error => setError(error.message));

    // Initialize AdSense
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense initialization error:', e);
    }
  }, []);

  return (
    <div className="App">
      {/* AdSense Header Banner */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1234567890123456"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>

      {/* Page Content */}
      <h1>Premium Crystal Car Rental</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <h2>Available Cars</h2>
      {cars.length === 0 && !error ? (
        <p>Loading cars...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {cars.map(car => (
            <li key={car.id} style={{ margin: '10px 0' }}>
              {car.make} {car.model} ({car.year}) - ${car.daily_rate}/day
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;