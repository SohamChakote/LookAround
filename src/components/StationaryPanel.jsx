import { directionsUrl } from '../utils/comfort.js';
import { formatMeters } from '../utils/geo.js';

function detailLine(place) {
  const parts = [];
  if (place.access) parts.push(`access: ${place.access}`);
  if (place.fee) parts.push(`fee: ${place.fee}`);
  if (place.wheelchair) parts.push(`wheelchair: ${place.wheelchair}`);
  if (place.openingHours) parts.push(place.openingHours);
  return parts.join(' · ');
}

export default function StationaryPanel({
  origin,
  radiusMeters,
  setRadiusMeters,
  places,
  selectedPlaceId,
  onSelectPlace,
  onUseMyLocation,
  onUseDemoLocation,
  onScan,
  isScanning,
  status
}) {
  const selectedPlace = places.find((place) => place.id === selectedPlaceId) ?? places[0];

  return (
    <section className="panel stationary-panel">
      <div className="panel-heading">
        <p className="eyebrow">Stationary helper</p>
        <h1>Nearby Comfort Stops</h1>
        <p className="subtitle">
          Find nearby public washrooms, water stops, transit stops, and quick comfort places around your current location.
        </p>
      </div>

      <div className="stationary-actions">
        <button className="primary" onClick={onUseMyLocation} disabled={isScanning}>
          Use my location + scan
        </button>
        <button onClick={onUseDemoLocation} disabled={isScanning}>
          Demo location
        </button>
      </div>

      <label className="field">
        <span>Search radius</span>
        <select value={radiusMeters} onChange={(event) => setRadiusMeters(Number(event.target.value))}>
          <option value={450}>450 m</option>
          <option value={700}>700 m</option>
          <option value={1000}>1 km</option>
          <option value={1500}>1.5 km</option>
        </select>
      </label>

      <button className="full-button" onClick={onScan} disabled={isScanning}>
        {isScanning ? 'Scanning…' : 'Scan nearby again'}
      </button>

      <div className="location-readout">
        <strong>Current scan centre</strong>
        <span>{origin.lat.toFixed(5)}, {origin.lng.toFixed(5)}</span>
      </div>

      {status && <p className="info-text">{status}</p>}

      {selectedPlace && (
        <div className="selected-place-card">
          <div className="direction-pill">Selected</div>
          <h2>{selectedPlace.name}</h2>
          <p>
            {selectedPlace.category} · {formatMeters(selectedPlace.distanceMeters)} away · {selectedPlace.source}
          </p>
          <a
            className="directions-link"
            href={directionsUrl(origin, selectedPlace)}
            target="_blank"
            rel="noreferrer"
          >
            Open walking directions
          </a>
        </div>
      )}

      <div className="comfort-list">
        <h3>Nearby results</h3>
        {places.length === 0 ? (
          <p className="muted-copy">No places loaded yet. Try the demo location or run a live scan.</p>
        ) : (
          places.map((place) => (
            <button
              className={`comfort-row ${place.id === selectedPlaceId ? 'active' : ''}`}
              key={place.id}
              onClick={() => onSelectPlace(place.id)}
            >
              <div>
                <strong>{place.name}</strong>
                <p>
                  {place.category} · {formatMeters(place.distanceMeters)} away · {place.source}
                </p>
                {detailLine(place) && <small>{detailLine(place)}</small>}
              </div>
              <span>{place.category}</span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
