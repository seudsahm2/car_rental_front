import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdBanner from './AdBanner';
import placeholderImage from './assets/Placeholder.svg';

function CarDetail({ apiUrl }) {
  const { slug } = useParams();
  const [car, setCar] = useState(null);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      const url = `${apiUrl}${slug}/`;
      console.log(`Fetching car with slug: ${slug}`);
      console.log(`API URL: ${url}`);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch car: ${response.statusText} (Status: ${response.status})\nFull Response:\n${text}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, got ${contentType}\nFull Response:\n${text}`);
        }
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error('Fetch car error:', error.message);
        setError(error.message);
      }
    };

    const fetchLocations = async () => {
      const url = `${apiUrl.replace('/cars/', '/locations/')}`;
      console.log(`Fetching locations from: ${url}`);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch locations: ${response.statusText} (Status: ${response.status})\nFull Response:\n${text}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, got ${contentType}\nFull Response:\n${text}`);
        }
        const data = await response.json();
        setLocations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Fetch locations error:', error);
        setError(error.message);
      }
    };

    Promise.all([fetchCar(), fetchLocations()]).finally(() => setIsLoading(false));
  }, [apiUrl, slug]);

  const nextImage = () => {
    if (car && car.images && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car && car.images && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  if (isLoading) return <p className="text-center text-lg text-gray-600 animate-pulse">Loading car details...</p>;
  if (error) return <p className="text-red-600 text-center text-lg font-semibold animate-fade-in">Error: {error}</p>;
  if (!car) return <p className="text-center text-lg text-gray-600 animate-fade-in">No car data available for slug: {slug}</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/" className="inline-block text-primary hover:text-primary/80 text-lg font-semibold mb-6 transition">
        ← Back to Cars
      </Link>
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 animate-fade-in">
        {car.make} {car.model} ({car.year})
      </h1>
      <div className="my-8">
        <AdBanner shouldRender={true} />
      </div>
      {/* Image Carousel */}
      <div className="mb-12">
        {car.images && car.images.length > 0 ? (
          <div className="relative">
            <img
              src={car.images[currentImageIndex].image_url || placeholderImage}
              alt={`${car.make} ${car.model}`}
              className="w-full h-72 md:h-[32rem] object-cover rounded-xl shadow-custom transition-opacity duration-300"
              onError={(e) => { e.target.src = placeholderImage; }}
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary/80 text-white p-3 rounded-full hover:bg-primary transition shadow"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary/80 text-white p-3 rounded-full hover:bg-primary transition shadow"
            >
              →
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {car.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full transition ${index === currentImageIndex ? 'bg-secondary scale-125' : 'bg-gray-400'}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          <img
            src={car.image_url || placeholderImage}
            alt={`${car.make} ${car.model}`}
            className="w-full h-72 md:h-[32rem] object-cover rounded-xl shadow-custom"
          />
        )}
      </div>
      {/* Car Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-primary mb-4">Details</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Category:</strong> {car.category?.name || 'N/A'}</p>
            <p><strong>Daily Rate:</strong> AED {car.daily_rate}</p>
            <p><strong>Monthly Rate:</strong> AED {car.monthly_rate || 'N/A'}</p>
            <p><strong>Description:</strong> {car.description || 'No description'}</p>
          </div>
          <h2 className="text-2xl font-bold text-primary mt-6 mb-4">Specifications</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Luggage Capacity: {car.luggage_capacity} bags</li>
            <li>Doors: {car.doors}</li>
            <li>Passengers: {car.passengers}</li>
            <li>Seats: {car.seats}</li>
            <li>Security Deposit: AED {car.security_deposit}</li>
            <li>Mileage Limit: {car.mileage_limit} km/day</li>
            <li>Additional KM Rate: {car.additional_km_rate}</li>
          </ul>
        </div>
        {/* Booking Form */}
        <div className="bg-white p-8 rounded-xl shadow-custom animate-fade-in">
          <h2 className="text-2xl font-bold text-primary mb-6">Book Now</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Pick-up Location</label>
              <select
                className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-accent focus:border-accent transition"
              >
                {locations.length > 0 ? (
                  locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))
                ) : (
                  <option value="">No locations available</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Drop-off Location</label>
              <select
                className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-accent focus:border-accent transition"
              >
                {locations.length > 0 ? (
                  locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))
                ) : (
                  <option value="">No locations available</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Pick-up Date</label>
              <input
                type="date"
                className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-accent focus:border-accent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Drop-off Date</label>
              <input
                type="date"
                className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-accent focus:border-accent transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition shadow-custom font-semibold"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
      {/* Related Cars */}
      <h2 className="text-2xl font-bold text-primary mb-6">Related Cars</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {car.related_cars && car.related_cars.length > 0 ? (
          car.related_cars.map(related => (
            <div
              key={related.id}
              className="bg-white rounded-xl shadow-custom overflow-hidden animate-fade-in"
            >
              <img
                src={related.image_url || placeholderImage}
                alt={`${related.make} ${related.model}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-6">
                <p className="text-lg font-semibold text-primary">
                  {related.make} {related.model}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  AED {related.daily_rate}/day
                </p>
                <Link
                  to={`/cars/${related.slug}`}
                  className="inline-block text-primary hover:text-primary/80 font-semibold transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No related cars available</p>
        )}
      </div>
    </div>
  );
}

export default CarDetail;