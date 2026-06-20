import { useEffect, useMemo, useRef, useState } from 'react';
import TransitMap from './components/TransitMap.jsx';
import RoutePanel from './components/RoutePanel.jsx';
import AnnouncementCard from './components/AnnouncementCard.jsx';
import { landmarks, routes } from './data/routes.js';
import {
  asPoint,
  distanceMeters,
  formatMeters,
  getPointAtDistance,
  sideOfTravel,
  totalPathDistance
} from './utils/geo.js';

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.96;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export default function App() {
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0].id);
  const [mode, setMode] = useState('demo');
  const [isRunning, setIsRunning] = useState(false);
  const [progressMeters, setProgressMeters] = useState(0);
  const [demoSpeed, setDemoSpeed] = useState(85);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [userPosition, setUserPosition] = useState(asPoint(routes[0].path[0]));
  const [announcedIds, setAnnouncedIds] = useState(new Set());
  const [announcement, setAnnouncement] = useState(null);
  const [gpsError, setGpsError] = useState('');
  const watchIdRef = useRef(null);

  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === selectedRouteId) ?? routes[0],
    [selectedRouteId]
  );

  const routeLandmarks = useMemo(
    () => landmarks.filter((landmark) => landmark.routeId === selectedRoute.id),
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

  function resetRide(nextRoute = selectedRoute) {
    setIsRunning(false);
    setProgressMeters(0);
    setUserPosition(asPoint(nextRoute.path[0]));
    setAnnouncedIds(new Set());
    setAnnouncement(null);
    setGpsError('');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function handleRouteChange(routeId) {
    const nextRoute = routes.find((route) => route.id === routeId) ?? routes[0];
    setSelectedRouteId(routeId);
    resetRide(nextRoute);
  }

  function startRide() {
    if (mode === 'gps' && !('geolocation' in navigator)) {
      setGpsError('GPS is not available in this browser. Use Demo ride instead.');
      return;
    }
    setIsRunning(true);
  }

  function pauseRide() {
    setIsRunning(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  useEffect(() => {
    if (mode !== 'demo' || !isRunning) return;

    const intervalId = window.setInterval(() => {
      setProgressMeters((current) => {
        const next = Math.min(current + demoSpeed, totalDistanceMeters);
        if (next >= totalDistanceMeters) {
          setIsRunning(false);
        }
        return next;
      });
    }, 850);

    return () => window.clearInterval(intervalId);
  }, [mode, isRunning, demoSpeed, totalDistanceMeters]);

  useEffect(() => {
    if (mode === 'demo') {
      setUserPosition(routeState.point);
    }
  }, [mode, routeState]);

  useEffect(() => {
    if (mode !== 'gps' || !isRunning) {
      if (watchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    setGpsError('');
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        setGpsError('Could not access your location. On a laptop, Demo ride is more reliable.');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000
      }
    );

    return () => {
      if (watchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [mode, isRunning]);

  useEffect(() => {
    if (!isRunning || !userPosition) return;

    const nextLandmark = routeLandmarks.find((landmark) => {
      if (announcedIds.has(landmark.id)) return false;
      const distance = distanceMeters(userPosition, { lat: landmark.lat, lng: landmark.lng });
      return distance <= landmark.triggerRadiusMeters;
    });

    if (!nextLandmark) return;

    const targetPoint = { lat: nextLandmark.lat, lng: nextLandmark.lng };
    const side = sideOfTravel(userPosition, routeState.nextPoint, targetPoint);
    const distance = distanceMeters(userPosition, targetPoint);
    const text = `Look to your ${side}. ${nextLandmark.message} About ${formatMeters(distance)} away.`;

    setAnnouncedIds((current) => new Set([...current, nextLandmark.id]));
    setAnnouncement({ landmark: nextLandmark, side, text });
    if (voiceEnabled) speak(text);
  }, [isRunning, userPosition, routeLandmarks, announcedIds, routeState.nextPoint, voiceEnabled]);

  return (
    <main className="app-shell">
      <div className="sidebar">
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
      </div>

      <section className="map-wrap">
        <TransitMap
          route={selectedRoute}
          routeLandmarks={routeLandmarks}
          userPosition={userPosition}
          announcedIds={announcedIds}
        />
      </section>
    </main>
  );
}
