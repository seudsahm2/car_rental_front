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

  useEffect(() => {
    fetch(`${apiUrl}${slug}/`)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch car: ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        setCar(data);
      })
      .catch(error => {
        console.error('Fetch car error:', error);
        setError(error.message);
      });

    fetch(`${apiUrl.replace('/cars/', '/locations/')}`)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch locations: ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        setLocations(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Fetch locations error:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [apiUrl, slug]);

  if (isLoading) return <p>Loading car details...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!car) return <p>No car data available</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{car.make} {car.model} ({car.year})</h1>
      <AdBanner shouldRender={true} />
      <div style={{ margin: '20px 0' }}>
        {car.images && car.images.length > 0 ? (
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {car.images.map(image => (
              <img
                key={image.id}
                src={image.image_url}
                alt={`${car.make} ${car.model}`}
                style={{ maxWidth: '300px', marginRight: '10px', borderRadius: '10px' }}
                onError={(e) => { e.target.src = placeholderImage; }}
              />
            ))}
          </div>
        ) : (
          <img
            src={car.image_url || placeholderImage}
            alt={`${car.make} ${car.model}`}
            style={{ maxWidth: '300px', borderRadius: '10px' }}
          />
        )}
      </div>
      <p><strong>Category:</strong> {car.category?.name || 'N/A'}</p>
      <p><strong>Daily Rate:</strong> AED {car.daily_rate}</p>
      <p><strong>Monthly Rate:</strong> AED {car.monthly_rate || 'N/A'}</p>
      <p><strong>Description:</strong> {car.description || 'No description'}</p>
      <h3>Specifications</h3>
      <ul>
        <li>Luggage Capacity: {car.luggage_capacity} bags</li>
        <li>Doors: {car.doors}</li>
        <li>Passengers: {car.passengers}</li>
        <li>Seats: {car.seats}</li>
        <li>Security Deposit: AED {car.security_deposit}</li>
        <li>Mileage Limit: {car.mileage_limit} km/day</li>
        <li>Additional KM Rate: {car.additional_km_rate}</li>
      </ul>
      <h3>Booking Form</h3>
      <div>
        <label>Pick-up Location:</label>
        <select>
          {locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Drop-off Location:</label>
        <select>
          {locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Pick-up Date:</label>
        <input type="date" />
      </div>
      <div>
        <label>Drop-off Date:</label>
        <input type="date" />
      </div>
      <button type="button">Book Now</button>
      <h3>Related Cars</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {car.related_cars.map(related => (
          <li key={related.id} style={{ margin: '10px 0' }}>
            <Link to={`/cars/${related.slug}`}>
              <img
                src={related.image_url || placeholderImage}
                alt={`${related.make} ${related.model}`}
                style={{ maxWidth: '100px', borderRadius: '5px' }}
              />
              <p>{related.make} {related.model} (AED {related.daily_rate}/day)</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CarDetail;