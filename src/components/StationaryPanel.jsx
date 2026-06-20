import { useEffect, useMemo, useRef, useState } from 'react';

import { directionsUrl } from '../utils/comfort.js';
import { formatMeters } from '../utils/geo.js';

const EARTH_RADIUS_METERS = 6371000;
const HEADING_EPSILON_DEGREES = 1.5;

const CATEGORY_META = {
  transit: { label: 'Transit', color: '#38bdf8', symbol: '◇' },
  comfort: { label: 'Comfort', color: '#22c55e', symbol: '●' },
  food: { label: 'Food', color: '#f59e0b', symbol: '◉' },
  culture: { label: 'Culture', color: '#c084fc', symbol: '◆' },
  landmark: { label: 'Landmark', color: '#f43f5e', symbol: '★' },
  sport: { label: 'Sport', color: '#facc15', symbol: '⬢' },
  default: { label: 'Place', color: '#94a3b8', symbol: '•' }
};

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
  if (typeof event.webkitCompassHeading === 'number') {
    return {
      heading: normalizeDegrees(event.webkitCompassHeading),
      source: 'compass',
      accuracy: typeof event.webkitCompassAccuracy === 'number'
        ? event.webkitCompassAccuracy
        : null
    };
  }

  if (typeof event.alpha === 'number') {
    return {
      heading: normalizeDegrees(360 - event.alpha),
      source: event.absolute ? 'compass' : 'relative',
      accuracy: null
    };
  }

  return null;
}

function categoryKey(place) {
  const raw = String(place?.category ?? '').toLowerCase();

  if (raw.includes('transit') || raw.includes('station') || raw.includes('bus')) return 'transit';
  if (raw.includes('washroom') || raw.includes('water') || raw.includes('comfort') || raw.includes('toilet')) return 'comfort';
  if (raw.includes('food') || raw.includes('cafe') || raw.includes('restaurant')) return 'food';
  if (raw.includes('culture') || raw.includes('museum') || raw.includes('art') || raw.includes('historic')) return 'culture';
  if (raw.includes('landmark') || raw.includes('view') || raw.includes('attraction')) return 'landmark';
  if (raw.includes('sport') || raw.includes('stadium') || raw.includes('field')) return 'sport';

  return 'default';
}

function categoryMeta(place) {
  return CATEGORY_META[categoryKey(place)] ?? CATEGORY_META.default;
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
  const sensorSourceRef = useRef('manual');

  const heading = normalizeDegrees(rawHeading + offset);

  useEffect(() => {
    const previous = lastOriginRef.current;
    const movedMeters = distanceMetersLocal(previous, origin);

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
    // Source locking fixes compass/relative bouncing.
    // Once a true compass source is active, relative alpha events are ignored.
    // Relative can be used only when it is the only available source.
    const currentSensorSource = sensorSourceRef.current;

    if (currentSensorSource === 'compass' && nextSource !== 'compass') {
      return;
    }

    if (currentSensorSource === 'relative' && nextSource === 'compass') {
      sensorSourceRef.current = 'compass';
    } else if (currentSensorSource === 'manual' || currentSensorSource === 'course') {
      sensorSourceRef.current = nextSource;
    }

    const activeSensorSource = sensorSourceRef.current;

    if (nextSource !== activeSensorSource) {
      return;
    }

    const normalized = normalizeDegrees(nextHeading);
    const previous = lastRawHeadingRef.current;
    const deltaSigned = signedAngleDelta(previous, normalized);
    const delta = Math.abs(deltaSigned);

    if (delta < HEADING_EPSILON_DEGREES && activeSensorSource === source) return;

    // Very simple low-pass smoothing. First accepted reading snaps, then
    // subsequent readings from the same locked source move gradually.
    const shouldSnap = source === 'manual' || source === 'course' || activeSensorSource !== source;
    const smoothing = shouldSnap ? 1 : 0.18;
    const smoothed = normalizeDegrees(previous + deltaSigned * smoothing);

    lastRawHeadingRef.current = smoothed;
    setRawHeading(smoothed);
    setSource(activeSensorSource);

    if (activeSensorSource === 'compass') {
      setStatus(
        accuracy
          ? `Compass active. Source locked. Smoothed. Reported accuracy: ±${Math.round(accuracy)}°.`
          : 'Compass active. Source locked. Smoothed.'
      );
    } else {
      setStatus('Relative orientation active. Source locked. Smoothed. Point at a selected place and tap Calibrate if needed.');
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
      sensorSourceRef.current = 'manual';

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
    sensorSourceRef.current = 'manual';
    setSource('manual');
    setStatus('Manual heading override active.');
  }

  function setManualHeading(nextHeading) {
    const next = normalizeDegrees(nextHeading);
    setRawHeading(next);
    lastRawHeadingRef.current = next;
    sensorSourceRef.current = 'manual';
    setSource('manual');
    setStatus('Manual heading override active.');
  }

  function useMovementHeading() {
    sensorSourceRef.current = 'course';
    setSource('course');
    setStatus('Movement heading enabled. Move several metres with GPS on so heading can update.');
  }

  function calibrateToBearing(targetBearing) {
    if (!Number.isFinite(targetBearing)) return;

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

function ScopeLegend({ places }) {
  const keys = Array.from(new Set(places.slice(0, 18).map(categoryKey)));

  return (
    <div className="scope-legend" aria-label="Radar place categories">
      {keys.map((key) => {
        const meta = CATEGORY_META[key] ?? CATEGORY_META.default;

        return (
          <span className="scope-legend-item" key={key}>
            <span
              className="scope-legend-dot"
              style={{ '--place-color': meta.color }}
              aria-hidden="true"
            />
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

function CompassScope({
  origin,
  places,
  selectedPlaceId,
  onSelectPlace,
  heading,
  radiusMeters,
  fullscreen = false
}) {
  const visiblePlaces = places.slice(0, fullscreen ? 28 : 18);
  const selectedPlace = places.find((place) => place.id === selectedPlaceId) ?? places[0];

  return (
    <div className={`compass-scope ${fullscreen ? 'compass-scope-large' : ''}`} aria-label="Compass radar scope">
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
        const meta = categoryMeta(place);

        return (
          <button
            key={place.id}
            type="button"
            className={`scope-dot scope-dot-${categoryKey(place)} ${isSelected ? 'selected' : ''} ${isAligned ? 'aligned' : ''}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              '--place-color': meta.color,
              '--place-symbol': `"${meta.symbol}"`
            }}
            title={`${place.name} · ${meta.label} · ${Math.round(relativeBearing)}° relative`}
            onClick={() => onSelectPlace(place.id)}
            aria-label={`Select ${place.name}, ${meta.label}`}
          >
            <span />
          </button>
        );
      })}

      {selectedPlace && (
        <div className="scope-target-readout" aria-live="polite">
          <strong>{selectedPlace.name}</strong>
          <span>
            {categoryMeta(selectedPlace).label} · bearing {Math.round(bearingDegrees(origin, selectedPlace))}° ·{' '}
            {Math.round(signedAngleDelta(heading, bearingDegrees(origin, selectedPlace)))}° off
          </span>
        </div>
      )}
    </div>
  );
}

function FullscreenRadar({
  origin,
  places,
  selectedPlaceId,
  onSelectPlace,
  heading,
  radiusMeters,
  onClose
}) {
  const selectedPlace = places.find((place) => place.id === selectedPlaceId) ?? places[0];

  useEffect(() => {
    document.body.classList.add('radar-fullscreen-open');

    return () => {
      document.body.classList.remove('radar-fullscreen-open');
    };
  }, []);

  return (
    <div className="radar-fullscreen" role="dialog" aria-modal="true" aria-label="Fullscreen city radar">
      <div className="radar-fullscreen-topbar">
        <div>
          <p className="eyebrow">Fullscreen radar</p>
          <h2>City scope</h2>
        </div>
        <button type="button" onClick={onClose}>Exit</button>
      </div>

      <CompassScope
        origin={origin}
        places={places}
        selectedPlaceId={selectedPlaceId}
        onSelectPlace={onSelectPlace}
        heading={heading}
        radiusMeters={radiusMeters}
        fullscreen
      />

      <ScopeLegend places={places} />

      {selectedPlace && (
        <div className="radar-fullscreen-card">
          <div className="direction-pill" style={{ '--place-color': categoryMeta(selectedPlace).color }}>
            {categoryMeta(selectedPlace).label}
          </div>
          <h2>{selectedPlace.name}</h2>
          <p>
            {selectedPlace.category} · {formatMeters(selectedPlace.distanceMeters)} away · {selectedPlace.source}
          </p>
          <p>
            Bearing {Math.round(bearingDegrees(origin, selectedPlace))}° · point offset{' '}
            {Math.round(signedAngleDelta(heading, bearingDegrees(origin, selectedPlace)))}°
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
  const [isRadarFullscreen, setIsRadarFullscreen] = useState(false);
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

  useEffect(() => {
    const onFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

      if (!fullscreenElement) {
        setIsRadarFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      document.removeEventListener('MSFullscreenChange', onFullscreenChange);
    };
  }, []);

  function enterRadarFullscreen() {
    setIsRadarFullscreen(true);

    const target = document.documentElement;
    const requestFullscreen =
      target.requestFullscreen ||
      target.webkitRequestFullscreen ||
      target.msRequestFullscreen;

    if (requestFullscreen) {
      const result = requestFullscreen.call(target);

      if (result && typeof result.catch === 'function') {
        result.catch(() => {
          // Keep the dedicated overlay visible even when the browser refuses
          // true fullscreen. This commonly happens in embedded previews.
          setIsRadarFullscreen(true);
        });
      }
    }
  }

  function exitRadarFullscreen() {
    setIsRadarFullscreen(false);

    const fullscreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;

    const exitFullscreen =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;

    if (fullscreenElement && exitFullscreen) {
      const result = exitFullscreen.call(document);

      if (result && typeof result.catch === 'function') {
        result.catch(() => {});
      }
    }
  }

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

        <ScopeLegend places={places} />

        <button
          type="button"
          className="full-button radar-fullscreen-button"
          onClick={enterRadarFullscreen}
          disabled={places.length === 0}
        >
          Fullscreen radar
        </button>

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
          <div className="direction-pill" style={{ '--place-color': categoryMeta(selectedPlace).color }}>
            {categoryMeta(selectedPlace).label}
          </div>
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
          places.map((place) => {
            const meta = categoryMeta(place);

            return (
              <button
                type="button"
                className={`comfort-row ${place.id === selectedPlaceId ? 'active' : ''}`}
                key={place.id}
                onClick={() => onSelectPlace(place.id)}
              >
                <div>
                  <strong>
                    <span
                      className="place-type-chip-inline"
                      style={{ '--place-color': meta.color }}
                      aria-hidden="true"
                    />
                    {place.name}
                  </strong>
                  <p>
                    {place.category} · {formatMeters(place.distanceMeters)} away · {place.source}
                  </p>
                  {detailLine(place) && <small>{detailLine(place)}</small>}
                </div>
                <span style={{ '--place-color': meta.color }}>{meta.label}</span>
              </button>
            );
          })
        )}
      </div>

      {isRadarFullscreen && (
        <FullscreenRadar
          origin={origin}
          places={places}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={onSelectPlace}
          heading={heading}
          radiusMeters={radiusMeters}
          onClose={exitRadarFullscreen}
        />
      )}
    </section>
  );
}
