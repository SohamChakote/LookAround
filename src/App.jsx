import { useEffect, useMemo, useRef, useState } from 'react';
import TransitMap from './components/TransitMap.jsx';
import RoutePanel from './components/RoutePanel.jsx';
import AnnouncementCard from './components/AnnouncementCard.jsx';
import StationaryPanel from './components/StationaryPanel.jsx';
import ArticlesPanel from './components/ArticlesPanel.jsx';
import ModeSwitcher from './components/ModeSwitcher.jsx';
import { landmarks, routes } from './data/routes.js';
import { getDemoComfortPlaces } from './data/comfortPlaces.js';
import { fetchComfortPlaces } from './utils/comfort.js';
import {
  asPoint,
  distanceMeters,
  formatMeters,
  getPointAtDistance,
  sideOfTravel,
  totalPathDistance
} from './utils/geo.js';

const DEMO_STATIONARY_POSITION = { lat: 49.2827, lng: -123.1207 };

const TABS = [
  { id: 'travel',     label: 'Transit',  icon: '🚆' },
  { id: 'stationary', label: 'Nearby',   icon: '📍' },
  { id: 'articles',   label: 'Discover', icon: '📖' },
];

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.96;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

export default function App() {
  const [activeTab, setActiveTab]           = useState('travel');
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0].id);
  const [mode, setMode]                     = useState('demo');
  const [isRunning, setIsRunning]           = useState(false);
  const [progressMeters, setProgressMeters] = useState(0);
  const [demoSpeed, setDemoSpeed]           = useState(85);
  const [voiceEnabled, setVoiceEnabled]     = useState(true);
  const [userPosition, setUserPosition]     = useState(asPoint(routes[0].path[0]));
  const [announcedIds, setAnnouncedIds]     = useState(new Set());
  const [announcement, setAnnouncement]     = useState(null);
  const [gpsError, setGpsError]             = useState('');

  // Mobile map overlay toggle
  const [mobileShowMap, setMobileShowMap]   = useState(false);

  const [stationaryPosition, setStationaryPosition]         = useState(DEMO_STATIONARY_POSITION);
  const [stationaryRadiusMeters, setStationaryRadiusMeters] = useState(700);
  const [comfortPlaces, setComfortPlaces]                   = useState(() => getDemoComfortPlaces(DEMO_STATIONARY_POSITION, 700));
  const [selectedComfortPlaceId, setSelectedComfortPlaceId] = useState('');
  const [stationaryStatus, setStationaryStatus]             = useState('Tap "My Location" for a live scan, or use demo data.');
  const [isScanningComfort, setIsScanningComfort]           = useState(false);

  const watchIdRef = useRef(null);

  // ── Derived ──────────────────────────────────────────────────
  const selectedRoute = useMemo(
    () => routes.find(r => r.id === selectedRouteId) ?? routes[0],
    [selectedRouteId]
  );

  const routeLandmarks = useMemo(
    () => landmarks.filter(lm => lm.routeId === selectedRoute.id),
    [selectedRoute.id]
  );

  const totalDistanceMeters = useMemo(
    () => totalPathDistance(selectedRoute.path),
    [selectedRoute]
  );

  const routeState = useMemo(
    () => getPointAtDistance(selectedRoute.path, progressMeters),
    [selectedRoute, progressMeters]
  );

  const activeComfortPlaces = useMemo(
    () => comfortPlaces
      .map(p => ({ ...p, distanceMeters: distanceMeters(stationaryPosition, p) }))
      .sort((a, b) => a.distanceMeters - b.distanceMeters),
    [comfortPlaces, stationaryPosition]
  );

  const appMode = activeTab === 'travel' ? 'travel' : 'stationary';

  // ── Geolocation: auto-request once on mount ───────────────────
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        // Pre-populate stationary position with real location
        setStationaryPosition(loc);
      },
      () => { /* silent fail — demo data still works */ },
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 12000 }
    );
  }, []);

  // ── Actions ──────────────────────────────────────────────────
  function resetRide(nextRoute = selectedRoute) {
    setIsRunning(false);
    setProgressMeters(0);
    setUserPosition(asPoint(nextRoute.path[0]));
    setAnnouncedIds(new Set());
    setAnnouncement(null);
    setGpsError('');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setMobileShowMap(false);
    if (tab !== 'travel') {
      setIsRunning(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  }

  function handleRouteChange(routeId) {
    const next = routes.find(r => r.id === routeId) ?? routes[0];
    setSelectedRouteId(routeId);
    resetRide(next);
  }

  function startRide() {
    if (mode === 'gps' && !('geolocation' in navigator)) {
      setGpsError('GPS not available. Use Demo ride instead.');
      return;
    }
    setIsRunning(true);
  }

  function pauseRide() {
    setIsRunning(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  async function scanComfortPlaces(origin = stationaryPosition, radius = stationaryRadiusMeters) {
    setIsScanningComfort(true);
    setStationaryStatus(`Scanning OpenStreetMap within ${formatMeters(radius)}…`);
    try {
      const live = await fetchComfortPlaces(origin, radius);
      const fallback = getDemoComfortPlaces(origin, radius);
      const next = live.length > 0 ? live : fallback;
      setComfortPlaces(next);
      setSelectedComfortPlaceId(next[0]?.id ?? '');
      setStationaryStatus(live.length > 0
        ? `Found ${live.length} nearby places.`
        : 'No live results — showing curated data.');
    } catch (err) {
      const fallback = getDemoComfortPlaces(origin, radius);
      setComfortPlaces(fallback);
      setSelectedComfortPlaceId(fallback[0]?.id ?? '');
      setStationaryStatus(`Offline — showing demo data. ${err.message}`);
    } finally {
      setIsScanningComfort(false);
    }
  }

  function useDemoLocation() {
    setStationaryPosition(DEMO_STATIONARY_POSITION);
    scanComfortPlaces(DEMO_STATIONARY_POSITION, stationaryRadiusMeters);
  }

  function useMyLocationAndScan() {
    if (!('geolocation' in navigator)) {
      setStationaryStatus('Geolocation not available. Demo location still works.');
      return;
    }
    setStationaryStatus('Getting your location…');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setStationaryPosition(loc);
        scanComfortPlaces(loc, stationaryRadiusMeters);
      },
      err => setStationaryStatus(`Location failed: ${err.message}. Demo data still works.`),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 12000 }
    );
  }

  // ── Effects ──────────────────────────────────────────────────

  // Demo ride tick
  useEffect(() => {
    if (mode !== 'demo' || !isRunning || activeTab !== 'travel') return;
    const id = window.setInterval(() => {
      setProgressMeters(cur => {
        const next = Math.min(cur + demoSpeed, totalDistanceMeters);
        if (next >= totalDistanceMeters) setIsRunning(false);
        return next;
      });
    }, 850);
    return () => window.clearInterval(id);
  }, [activeTab, mode, isRunning, demoSpeed, totalDistanceMeters]);

  // Sync demo user position
  useEffect(() => {
    if (mode === 'demo') setUserPosition(routeState.point);
  }, [mode, routeState]);

  // GPS watch
  useEffect(() => {
    if (mode !== 'gps' || !isRunning || activeTab !== 'travel') {
      if (watchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }
    setGpsError('');
    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()  => setGpsError('Could not access location. Demo ride is more reliable.'),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );
    return () => {
      if (watchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [activeTab, mode, isRunning]);

  // Landmark announcements
  useEffect(() => {
    if (activeTab !== 'travel' || !isRunning || !userPosition) return;
    const next = routeLandmarks.find(lm => {
      if (announcedIds.has(lm.id)) return false;
      return distanceMeters(userPosition, { lat: lm.lat, lng: lm.lng }) <= lm.triggerRadiusMeters;
    });
    if (!next) return;
    const target = { lat: next.lat, lng: next.lng };
    const side = sideOfTravel(userPosition, routeState.nextPoint, target);
    const dist = distanceMeters(userPosition, target);
    const text = `Look to your ${side}. ${next.message} About ${formatMeters(dist)} away.`;
    setAnnouncedIds(cur => new Set([...cur, next.id]));
    setAnnouncement({ landmark: next, side, text });
    if (voiceEnabled) speak(text);
  }, [activeTab, isRunning, userPosition, routeLandmarks, announcedIds, routeState.nextPoint, voiceEnabled]);

  // Default comfort selection
  useEffect(() => {
    if (!selectedComfortPlaceId && activeComfortPlaces.length > 0) {
      setSelectedComfortPlaceId(activeComfortPlaces[0].id);
    }
  }, [selectedComfortPlaceId, activeComfortPlaces]);

  // ── Render ───────────────────────────────────────────────────
  const mapPosition = activeTab === 'travel' ? userPosition : stationaryPosition;

  return (
    <main className="app-shell">

      {/* ── Sidebar ── */}
      <div className="sidebar">
        <ModeSwitcher appMode={activeTab} onChange={handleTabChange} />

        {activeTab === 'travel' && (
          <>
            <RoutePanel
              routes={routes}
              selectedRouteId={selectedRouteId}
              onRouteChange={handleRouteChange}
              mode={mode}
              setMode={setMode}
              isRunning={isRunning}
              onStart={startRide}
              onPause={pauseRide}
              onReset={() => resetRide(selectedRoute)}
              progressMeters={progressMeters}
              totalDistanceMeters={totalDistanceMeters}
              demoSpeed={demoSpeed}
              setDemoSpeed={setDemoSpeed}
              voiceEnabled={voiceEnabled}
              setVoiceEnabled={setVoiceEnabled}
              gpsError={gpsError}
            />
            <AnnouncementCard
              announcement={announcement}
              upcomingLandmarks={routeLandmarks}
              announcedIds={announcedIds}
            />
          </>
        )}

        {activeTab === 'stationary' && (
          <StationaryPanel
            origin={stationaryPosition}
            radiusMeters={stationaryRadiusMeters}
            setRadiusMeters={setStationaryRadiusMeters}
            places={activeComfortPlaces}
            selectedPlaceId={selectedComfortPlaceId}
            onSelectPlace={setSelectedComfortPlaceId}
            onUseMyLocation={useMyLocationAndScan}
            onUseDemoLocation={useDemoLocation}
            onScan={() => scanComfortPlaces(stationaryPosition, stationaryRadiusMeters)}
            isScanning={isScanningComfort}
            status={stationaryStatus}
          />
        )}

        {activeTab === 'articles' && <ArticlesPanel />}
      </div>

      {/* ── Map (hidden for articles tab) ── */}
      {activeTab !== 'articles' && (
        <section className="map-wrap">
          <TransitMap
            appMode={appMode}
            route={selectedRoute}
            routeLandmarks={routeLandmarks}
            userPosition={mapPosition}
            announcedIds={announcedIds}
            comfortPlaces={activeComfortPlaces}
            stationaryRadiusMeters={stationaryRadiusMeters}
            selectedComfortPlaceId={selectedComfortPlaceId}
            onSelectComfortPlace={setSelectedComfortPlaceId}
          />
        </section>
      )}
    </main>
  );
}
