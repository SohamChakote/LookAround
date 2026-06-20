import { useEffect, useMemo, useRef, useState } from 'react';

import { directionsUrl } from '../utils/comfort.js';
import { formatMeters } from '../utils/geo.js';

const EARTH_RADIUS_METERS = 6371000;
const HEADING_EPSILON_DEGREES = 1.5;

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function signedAngleDelta(fromDegrees, toDegrees) {
  const delta = normalizeDegrees(toDegrees - fromDegrees + 180) - 180;
  return delta === -180 ? 180 : delta;
}

function distanceMetersLocal(a, b) {
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

function bearingDegrees(from, to) {
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return normalizeDegrees(Math.atan2(y, x) * 180 / Math.PI);
}

function extractDeviceHeading(event) {
  // iOS Safari exposes the closest thing to a real compass heading here.
  if (typeof event.webkitCompassHeading === 'number') {
    return {
      heading: normalizeDegrees(event.webkitCompassHeading),
      source: 'compass',
      accuracy: typeof event.webkitCompassAccuracy === 'number'
        ? event.webkitCompassAccuracy
        : null
    };
  }

  // Standard API path. On Android Chrome, alpha is often relative, not true north.
  if (typeof event.alpha === 'number') {
    return {
      heading: normalizeDegrees(360 - event.alpha),
      source: event.absolute ? 'compass' : 'relative',
      accuracy: null
    };
  }

  return null;
}

function detailLine(place) {
  const parts = [];

  if (place.access) parts.push(`access: ${place.access}`);
  if (place.fee) parts.push(`fee: ${place.fee}`);
  if (place.wheelchair) parts.push(`wheelchair: ${place.wheelchair}`);
  if (place.openingHours) parts.push(place.openingHours);

  return parts.join(' · ');
}

function useHeading(origin) {
  const [rawHeading, setRawHeading] = useState(0);
  const [offset, setOffset] = useState(0);
  const [source, setSource] = useState('manual');
  const [status, setStatus] = useState('Heading is manual. Start compass, use movement heading, or calibrate.');
  const lastOriginRef = useRef(origin);
  const lastRawHeadingRef = useRef(0);
  const cleanupOrientationRef = useRef(null);
  const frameRef = useRef(null);

  const heading = normalizeDegrees(rawHeading + offset);

  useEffect(() => {
    const previous = lastOriginRef.current;
    const movedMeters = distanceMetersLocal(previous, origin);

    // GPS course fallback. Conservative threshold avoids jitter-driven spinning.
    if (movedMeters >= 8 && source !== 'compass' && source !== 'relative') {
      const nextHeading = bearingDegrees(previous, origin);
      setRawHeading(nextHeading);
      lastRawHeadingRef.current = nextHeading;
      setOffset(0);
      setSource('course');
      setStatus('Using movement heading from GPS/course. Keep walking for better direction.');
    }

    lastOriginRef.current = origin;
  }, [origin, source]);

  useEffect(() => {
    return () => {
      if (cleanupOrientationRef.current) cleanupOrientationRef.current();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function commitHeading(nextHeading, nextSource, accuracy) {
    const normalized = normalizeDegrees(nextHeading);
    const delta = Math.abs(signedAngleDelta(lastRawHeadingRef.current, normalized));

    // Avoid re-render storms from noisy sensor events on mobile.
    if (delta < HEADING_EPSILON_DEGREES && nextSource === source) return;

    lastRawHeadingRef.current = normalized;
    setRawHeading(normalized);
    setSource(nextSource);

    if (nextSource === 'compass') {
      setStatus(
        accuracy
          ? `Compass active. Reported accuracy: ±${Math.round(accuracy)}°.`
          : 'Compass active.'
      );
    } else {
      setStatus('Relative orientation active. On Android this may not be true north — point at a selected place and tap Calibrate.');
    }
  }

  async function startCompass() {
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') {
      setStatus('Device orientation is not available in this browser.');
      setSource('manual');
      return;
    }

    try {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        let permission = 'denied';

        try {
          permission = await DeviceOrientationEvent.requestPermission(true);
        } catch {
          permission = await DeviceOrientationEvent.requestPermission();
        }

        if (permission !== 'granted') {
          setStatus('Compass permission was not granted. Manual heading still works.');
          setSource('manual');
          return;
        }
      }

      if (cleanupOrientationRef.current) cleanupOrientationRef.current();

      const onOrientation = (event) => {
        const result = extractDeviceHeading(event);
        if (!result) return;

        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(() => {
          commitHeading(result.heading, result.source, result.accuracy);
        });
      };

      window.addEventListener('deviceorientationabsolute', onOrientation, true);
      window.addEventListener('deviceorientation', onOrientation, true);

      cleanupOrientationRef.current = () => {
        window.removeEventListener('deviceorientationabsolute', onOrientation, true);
        window.removeEventListener('deviceorientation', onOrientation, true);
      };

      setStatus('Listening for orientation events. Rotate the phone in a figure-eight if the value is frozen.');
    } catch (error) {
      setStatus(`Compass failed: ${error.message}`);
      setSource('manual');
    }
  }

  function rotateManual(deltaDegrees) {
    const next = normalizeDegrees(rawHeading + deltaDegrees);
    setRawHeading(next);
    lastRawHeadingRef.current = next;
    setSource('manual');
    setStatus('Manual heading override active.');
  }

  function setManualHeading(nextHeading) {
    const next = normalizeDegrees(nextHeading);
    setRawHeading(next);
    lastRawHeadingRef.current = next;
    setSource('manual');
    setStatus('Manual heading override active.');
  }

  function useMovementHeading() {
    setSource('course');
    setStatus('Movement heading enabled. Move several metres with GPS on so heading can update.');
  }

  function calibrateToBearing(targetBearing) {
    if (!Number.isFinite(targetBearing)) return;

    // User points the top of the phone at the selected target.
    setOffset(normalizeDegrees(targetBearing - rawHeading));
    setStatus('Calibrated: current phone direction now points at the selected place.');
  }

  return {
    heading,
    rawHeading,
    source,
    status,
    startCompass,
    rotateManual,
    setManualHeading,
    useMovementHeading,
    calibrateToBearing
  };
}

function CompassScope({ origin, places, selectedPlaceId, onSelectPlace, heading, radiusMeters }) {
  const visiblePlaces = places.slice(0, 18);
  const selectedPlace = places.find((place) => place.id === selectedPlaceId) ?? places[0];

  return (
    <div className="compass-scope" aria-label="Compass radar scope">
      <div className="scope-grid" />
      <div className="scope-forward">▲</div>
      <div className="scope-heading">{Math.round(heading)}°</div>

      {visiblePlaces.map((place) => {
        const placeBearing = bearingDegrees(origin, place);
        const relativeBearing = signedAngleDelta(heading, placeBearing);
        const clampedDistance = Math.min(distanceMetersLocal(origin, place), radiusMeters);
        const distanceRatio = Math.max(0.12, clampedDistance / radiusMeters);
        const angleRadians = relativeBearing * Math.PI / 180;

        const x = 50 + Math.sin(angleRadians) * distanceRatio * 43;
        const y = 50 - Math.cos(angleRadians) * distanceRatio * 43;
        const isSelected = selectedPlace?.id === place.id;
        const isAligned = isSelected && Math.abs(relativeBearing) <= 10;

        return (
          <button
            key={place.id}
            type="button"
            className={`scope-dot ${isSelected ? 'selected' : ''} ${isAligned ? 'aligned' : ''}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            title={`${place.name} · ${Math.round(relativeBearing)}° relative`}
            onClick={() => onSelectPlace(place.id)}
            aria-label={`Select ${place.name}`}
          >
            <span />
          </button>
        );
      })}

      {selectedPlace && (
        <div className="scope-target-readout" aria-live="polite">
          <strong>{selectedPlace.name}</strong>
          <span>
            bearing {Math.round(bearingDegrees(origin, selectedPlace))}° ·{' '}
            {Math.round(signedAngleDelta(heading, bearingDegrees(origin, selectedPlace)))}° off
          </span>
        </div>
      )}
    </div>
  );
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

  const {
    heading,
    rawHeading,
    source,
    status: headingStatus,
    startCompass,
    rotateManual,
    setManualHeading,
    useMovementHeading,
    calibrateToBearing
  } = useHeading(origin);

  const selectedBearing = useMemo(() => {
    if (!selectedPlace) return null;
    return bearingDegrees(origin, selectedPlace);
  }, [origin, selectedPlace]);

  return (
    <section className="panel stationary-panel">
      <div className="panel-heading">
        <p className="eyebrow">Stationary helper</p>
        <h1>Nearby City Radar</h1>
        <p className="subtitle">
          Find nearby public washrooms, water stops, transit stops, cafés, parks, landmarks, and culture around your current location.
        </p>
      </div>

      <div className="mobile-primary-actions">
        <button type="button" className="primary" onClick={onUseMyLocation} disabled={isScanning}>
          Use my location + scan
        </button>
        <button type="button" onClick={onUseDemoLocation} disabled={isScanning}>
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

      <button type="button" className="full-button primary" onClick={onScan} disabled={isScanning}>
        {isScanning ? 'Scanning…' : 'Scan nearby again'}
      </button>

      <div className="location-readout">
        <strong>Current scan centre</strong>
        <span>{origin.lat.toFixed(5)}, {origin.lng.toFixed(5)}</span>
      </div>

      {status && <p className="info-text" aria-live="polite">{status}</p>}

      <div className="compass-panel">
        <div className="compass-header">
          <div>
            <p className="eyebrow">City scope</p>
            <h2>Point your phone toward a signal</h2>
          </div>
          <div className="direction-pill">{source} · {Math.round(heading)}°</div>
        </div>

        <CompassScope
          origin={origin}
          places={places}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={onSelectPlace}
          heading={heading}
          radiusMeters={radiusMeters}
        />

        <div className="compass-actions">
          <button type="button" onClick={startCompass}>Start compass</button>
          <button type="button" onClick={useMovementHeading}>Use movement heading</button>
          <button
            type="button"
            onClick={() => calibrateToBearing(selectedBearing)}
            disabled={!selectedPlace}
          >
            Calibrate to selected
          </button>
        </div>

        <div className="manual-heading-row">
          <button type="button" onClick={() => rotateManual(-15)}>← 15°</button>
          <input
            type="range"
            min="0"
            max="359"
            value={Math.round(rawHeading)}
            onChange={(event) => setManualHeading(Number(event.target.value))}
            aria-label="Manual heading"
          />
          <button type="button" onClick={() => rotateManual(15)}>15° →</button>
        </div>

        <p className="info-text" aria-live="polite">
          {headingStatus}
        </p>
      </div>

      {selectedPlace && (
        <div className="selected-place-card">
          <div className="direction-pill">Selected</div>
          <h2>{selectedPlace.name}</h2>
          <p>
            {selectedPlace.category} · {formatMeters(selectedPlace.distanceMeters)} away · {selectedPlace.source}
          </p>
          {Number.isFinite(selectedBearing) && (
            <p>
              Bearing {Math.round(selectedBearing)}° · point offset{' '}
              {Math.round(signedAngleDelta(heading, selectedBearing))}°
            </p>
          )}
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
              type="button"
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
