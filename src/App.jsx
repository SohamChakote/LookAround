import { useEffect, useMemo, useRef, useState } from "react";
import TransitMap from "./components/TransitMap.jsx";
import RoutePanel from "./components/RoutePanel.jsx";
import AnnouncementCard from "./components/AnnouncementCard.jsx";
import ModeSwitcher from "./components/ModeSwitcher.jsx";
import StationaryPanel from "./components/StationaryPanel.jsx";
import ArticlesPanel from "./components/ArticlesPanel.jsx";
import { routes } from "./data/routes.js";
import { scenicLandmarks } from "./data/scenicLandmarks.js";
import { getDemoComfortPlaces } from "./data/comfortPlaces.js";
import { fetchComfortPlaces } from "./utils/comfort.js";
import {
  asPoint,
  distanceMeters,
  formatMeters,
  getClosestDistanceAlongPath,
  getPointAtDistance,
  sideOfTravel,
  totalPathDistance,
} from "./utils/geo.js";

const DEMO_STATIONARY_POSITION = { lat: 49.2827, lng: -123.1207 };

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.96;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export default function App() {
  const [appMode, setAppMode] = useState("travel");
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0].id);
  const [mode, setMode] = useState("demo");
  const [isRunning, setIsRunning] = useState(false);
  const [progressMeters, setProgressMeters] = useState(0);
  const [demoSpeed, setDemoSpeed] = useState(85);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [userPosition, setUserPosition] = useState(asPoint(routes[0].path[0]));
  const [announcedIds, setAnnouncedIds] = useState(new Set());
  const [announcement, setAnnouncement] = useState(null);
  const [gpsError, setGpsError] = useState("");

  const [stationaryPosition, setStationaryPosition] = useState(
    DEMO_STATIONARY_POSITION
  );
  const [stationaryRadiusMeters, setStationaryRadiusMeters] = useState(700);
  const [comfortPlaces, setComfortPlaces] = useState(() =>
    getDemoComfortPlaces(DEMO_STATIONARY_POSITION, 700)
  );
  const [selectedComfortPlaceId, setSelectedComfortPlaceId] = useState("");
  const [stationaryStatus, setStationaryStatus] = useState(
    "Demo data is loaded. Use your location for a live OpenStreetMap scan."
  );
  const [isScanningComfort, setIsScanningComfort] = useState(false);

  const watchIdRef = useRef(null);

  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === selectedRouteId) ?? routes[0],
    [selectedRouteId]
  );

  const routeLandmarks = useMemo(
    () =>
      scenicLandmarks.filter(
        (landmark) => landmark.routeId === selectedRoute.id
      ),
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
    () =>
      comfortPlaces
        .map((place) => ({
          ...place,
          distanceMeters: distanceMeters(stationaryPosition, place),
        }))
        .sort((a, b) => a.distanceMeters - b.distanceMeters),
    [comfortPlaces, stationaryPosition]
  );

  function resetRide(nextRoute = selectedRoute) {
    setIsRunning(false);
    setProgressMeters(0);
    setUserPosition(asPoint(nextRoute.path[0]));
    setAnnouncedIds(new Set());
    setAnnouncement(null);
    setGpsError("");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function handleAppModeChange(nextMode) {
    setAppMode(nextMode);
    if (nextMode === "stationary") {
      setIsRunning(false);
      setStationaryPosition(userPosition ?? DEMO_STATIONARY_POSITION);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }
  }

  function handleRouteChange(routeId) {
    const nextRoute = routes.find((route) => route.id === routeId) ?? routes[0];
    setSelectedRouteId(routeId);
    resetRide(nextRoute);
  }

  function handleRouteJump(targetPoint) {
    const nextProgressMeters = getClosestDistanceAlongPath(
      selectedRoute.path,
      targetPoint
    );
    const nextRouteState = getPointAtDistance(
      selectedRoute.path,
      nextProgressMeters
    );

    setAppMode("travel");
    setMode("demo");
    setProgressMeters(nextProgressMeters);
    setUserPosition(nextRouteState.point);
    setAnnouncement(null);
    setGpsError("");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function startRide() {
    if (mode === "gps" && !("geolocation" in navigator)) {
      setGpsError(
        "GPS is not available in this browser. Use Demo ride instead."
      );
      return;
    }
    setIsRunning(true);
  }

  function pauseRide() {
    setIsRunning(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  async function scanComfortPlaces(
    origin = stationaryPosition,
    radius = stationaryRadiusMeters
  ) {
    setIsScanningComfort(true);
    setStationaryStatus(
      `Scanning OpenStreetMap within ${formatMeters(radius)}…`
    );

    try {
      const livePlaces = await fetchComfortPlaces(origin, radius);
      const fallbackPlaces = getDemoComfortPlaces(origin, radius);
      const nextPlaces = livePlaces.length > 0 ? livePlaces : fallbackPlaces;

      setComfortPlaces(nextPlaces);
      setSelectedComfortPlaceId(nextPlaces[0]?.id ?? "");
      setStationaryStatus(
        livePlaces.length > 0
          ? `Live scan complete: found ${livePlaces.length} nearby places.`
          : "Live scan returned no places here, so demo fallback data is shown."
      );
    } catch (error) {
      const fallbackPlaces = getDemoComfortPlaces(origin, radius);
      setComfortPlaces(fallbackPlaces);
      setSelectedComfortPlaceId(fallbackPlaces[0]?.id ?? "");
      setStationaryStatus(
        `Live scan failed, so demo fallback data is shown. ${error.message}`
      );
    } finally {
      setIsScanningComfort(false);
    }
  }

  function useDemoLocation() {
    setStationaryPosition(DEMO_STATIONARY_POSITION);
    scanComfortPlaces(DEMO_STATIONARY_POSITION, stationaryRadiusMeters);
  }

  function useMyLocationAndScan() {
    if (!("geolocation" in navigator)) {
      setStationaryStatus(
        "Geolocation is not available in this browser. Demo location still works."
      );
      return;
    }

    setStationaryStatus("Requesting location permission…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setStationaryPosition(nextPosition);
        scanComfortPlaces(nextPosition, stationaryRadiusMeters);
      },
      (error) => {
        setStationaryStatus(
          `Location failed: ${error.message}. Demo location still works.`
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      }
    );
  }

  useEffect(() => {
    if (mode !== "demo" || !isRunning || appMode !== "travel") return;

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
  }, [appMode, mode, isRunning, demoSpeed, totalDistanceMeters]);

  useEffect(() => {
    if (mode === "demo") {
      setUserPosition(routeState.point);
    }
  }, [mode, routeState]);

  useEffect(() => {
    if (mode !== "gps" || !isRunning || appMode !== "travel") {
      if (watchIdRef.current !== null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    setGpsError("");
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setGpsError(
          "Could not access your location. On a laptop, Demo ride is more reliable."
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [appMode, mode, isRunning]);

  useEffect(() => {
    if (appMode !== "travel" || !isRunning || !userPosition) return;

    const nextLandmark = routeLandmarks.find((landmark) => {
      if (announcedIds.has(landmark.id)) return false;
      const distance = distanceMeters(userPosition, {
        lat: landmark.lat,
        lng: landmark.lng,
      });
      return distance <= landmark.triggerRadiusMeters;
    });

    if (!nextLandmark) return;

    const targetPoint = { lat: nextLandmark.lat, lng: nextLandmark.lng };
    const side = sideOfTravel(userPosition, routeState.nextPoint, targetPoint);
    const distance = distanceMeters(userPosition, targetPoint);
    const text = `Look to your ${side}. ${
      nextLandmark.message
    } About ${formatMeters(distance)} away.`;

    setAnnouncedIds((current) => new Set([...current, nextLandmark.id]));
    setAnnouncement({ landmark: nextLandmark, side, text });
    if (voiceEnabled) speak(text);
  }, [
    appMode,
    isRunning,
    userPosition,
    routeLandmarks,
    announcedIds,
    routeState.nextPoint,
    voiceEnabled,
  ]);

  useEffect(() => {
    if (!selectedComfortPlaceId && activeComfortPlaces.length > 0) {
      setSelectedComfortPlaceId(activeComfortPlaces[0].id);
    }
  }, [selectedComfortPlaceId, activeComfortPlaces]);

  return (
    <main className="app-shell">
      <div className="sidebar">
        <ModeSwitcher appMode={appMode} onChange={handleAppModeChange} />

        {appMode === "travel" && (
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

        {appMode === "stationary" && (
          <StationaryPanel
            origin={stationaryPosition}
            radiusMeters={stationaryRadiusMeters}
            setRadiusMeters={setStationaryRadiusMeters}
            places={activeComfortPlaces}
            selectedPlaceId={selectedComfortPlaceId}
            onSelectPlace={setSelectedComfortPlaceId}
            onUseMyLocation={useMyLocationAndScan}
            onUseDemoLocation={useDemoLocation}
            onScan={() =>
              scanComfortPlaces(stationaryPosition, stationaryRadiusMeters)
            }
            isScanning={isScanningComfort}
            status={stationaryStatus}
          />
        )}

        {appMode === "articles" && <ArticlesPanel />}
      </div>

      {appMode !== "articles" && (
        <section className="map-wrap">
          <TransitMap
            appMode={appMode}
            route={selectedRoute}
            routeLandmarks={routeLandmarks}
            userPosition={
              appMode === "travel" ? userPosition : stationaryPosition
            }
            announcedIds={announcedIds}
            comfortPlaces={activeComfortPlaces}
            stationaryRadiusMeters={stationaryRadiusMeters}
            selectedComfortPlaceId={selectedComfortPlaceId}
            onSelectComfortPlace={setSelectedComfortPlaceId}
            onRouteJump={handleRouteJump}
          />
        </section>
      )}
    </main>
  );
}
