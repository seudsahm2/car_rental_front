import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import AdBanner from './AdBanner';
import CarDetail from './CarDetail';
import placeholderImage from './assets/Placeholder.svg';

function NotFound() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Return to Home</Link>
    </div>
  );
}

function App() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || '/api/cars/'; // Use proxy in production

  useEffect(() => {
    console.log(`Fetching cars from: ${apiUrl}`);
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Failed to fetch cars: ${response.statusText} (Status: ${response.status})\nFull Response:\n${text}`);
          });
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return response.text().then(text => {
            throw new Error(`Expected JSON, got ${contentType}\nFull Response:\n${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        let carData = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : [];
        setCars(carData);
        setIsLoading(false);
        console.log('API Response:', JSON.stringify(data, null, 2));
        console.log('Car Image URLs:', carData.map(car => ({
          id: car.id,
          make: car.make,
          model: car.model,
          slug: car.slug,
          image_url: car.image_url
        })));
        if (!carData.length) {
          setError('No cars found in response');
        }
      })
      .catch(error => {
        console.error('Fetch error:', error.message);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <h1>Premium Crystal Car Rental</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div style={{ margin: '20px auto', textAlign: 'center' }}>
                  <AdBanner shouldRender={cars.length > 0} />
                </div>
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <h2>Available Cars</h2>
                {isLoading ? (
                  <p>Loading cars...</p>
                ) : (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {cars.map(car => (
                      <li key={car.id} style={{ margin: '10px 0', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        <Link to={`/cars/${car.slug}`}>
                          {car.image_url ? (
                            <img
                              src={car.image_url}
                              alt={`${car.make} ${car.model}`}
                              style={{ maxWidth: '300px', borderRadius: '10px' }}
                              onError={(e) => {
                                console.error(`Failed to load image for ${car.make} ${car.model}: ${car.image_url}`);
                                e.target.src = placeholderImage;
                              }}
                            />
                          ) : (
                            <img
                              src={placeholderImage}
                              alt="No image available"
                              style={{ maxWidth: '300px', borderRadius: '10px' }}
                            />
                          )}
                          <h3>{car.make} {car.model} ({car.year})</h3>
                          <p>Category: {car.category?.name || 'N/A'}</p>
                          <p>{car.description || 'No description'}</p>
                          <p><strong>AED {car.daily_rate}/day</strong></p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            }
          />
          <Route path="/cars/:slug" element={<CarDetail apiUrl={apiUrl} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;