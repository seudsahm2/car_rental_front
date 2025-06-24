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
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5061735490844182"
          crossorigin="anonymous"></script>

      <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-5061735490844182"
          data-ad-slot="9765584423"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
      </script>

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