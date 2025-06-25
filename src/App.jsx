import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import AdBanner from './AdBanner';
import CarDetail from './CarDetail';
import placeholderImage from './assets/Placeholder.svg';

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 text-center animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition shadow-custom">
        Return to Home
      </Link>
    </div>
  );
}

function App() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || '/api/cars/';

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
      <div className="min-h-screen bg-neutral">
        <header className="bg-primary text-white py-8 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              Premium Crystal Car Rental
            </h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="my-8">
                    <AdBanner shouldRender={cars.length > 0} />
                  </div>
                  {error && (
                    <p className="text-red-600 text-center text-lg font-semibold mb-6 animate-fade-in">
                      Error: {error}
                    </p>
                  )}
                  <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
                    Available Cars
                  </h2>
                  {isLoading ? (
                    <p className="text-center text-lg text-gray-600 animate-pulse">Loading cars...</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {cars.map(car => (
                        <div
                          key={car.id}
                          className="bg-white rounded-xl shadow-custom overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-custom-hover animate-fade-in"
                        >
                          <div className="relative">
                            <img
                              src={car.image_url || placeholderImage}
                              alt={`${car.make} ${car.model}`}
                              className="w-full h-56 object-cover"
                              onError={(e) => {
                                console.error(`Failed to load image for ${car.make} ${car.model}: ${car.image_url}`);
                                e.target.src = placeholderImage;
                              }}
                            />
                            <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                              AED {car.daily_rate}/day
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-primary mb-2">
                              {car.make} {car.model} ({car.year})
                            </h3>
                            <p className="text-gray-600 text-sm mb-1">
                              Category: {car.category?.name || 'N/A'}
                            </p>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {car.description || 'No description'}
                            </p>
                            <Link
                              to={`/cars/${car.slug}`}
                              className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition shadow-custom"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              }
            />
            <Route path="/cars/:slug" element={<CarDetail apiUrl={apiUrl} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;