import { useEffect } from "react";
import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { directionsUrl } from "../utils/comfort.js";
import { formatMeters } from "../utils/geo.js";

const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: '<div class="user-location-dot"></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const selectedPlaceIcon = L.divIcon({
  className: "selected-comfort-marker",
  html: '<div class="selected-comfort-dot">★</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

L.Marker.prototype.options.icon = defaultIcon;

function MapViewController({
  appMode,
  routePath,
  userPosition,
  comfortPlaces,
}) {
  const map = useMap();

  useEffect(() => {
    if (appMode === "travel" && routePath?.length) {
      const bounds = L.latLngBounds(routePath);
      map.fitBounds(bounds, { padding: [35, 35] });
      return;
    }

    if (appMode === "stationary" && userPosition) {
      const points = [[userPosition.lat, userPosition.lng]];
      comfortPlaces
        .slice(0, 12)
        .forEach((place) => points.push([place.lat, place.lng]));

      if (points.length > 1) {
        map.fitBounds(L.latLngBounds(points), {
          padding: [45, 45],
          maxZoom: 16,
        });
      } else {
        map.setView([userPosition.lat, userPosition.lng], 15);
      }
    }
  }, [appMode, routePath, userPosition, comfortPlaces, map]);

  return null;
}

function TravelMapClickHandler({ appMode, onRouteJump }) {
  useMapEvents({
    click: (event) => {
      if (appMode !== "travel") return;

      onRouteJump?.({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

export default function TransitMap({
  appMode,
  route,
  routeLandmarks,
  userPosition,
  announcedIds,
  comfortPlaces = [],
  stationaryRadiusMeters = 700,
  selectedComfortPlaceId,
  onSelectComfortPlace,
  onRouteJump,
}) {
  const center = userPosition
    ? [userPosition.lat, userPosition.lng]
    : route.path[0];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapViewController
        appMode={appMode}
        routePath={route.path}
        userPosition={userPosition}
        comfortPlaces={comfortPlaces}
      />

      <TravelMapClickHandler appMode={appMode} onRouteJump={onRouteJump} />

      {appMode === "travel" && (
        <>
          <Polyline
            positions={route.path}
            weight={8}
            opacity={0.75}
            eventHandlers={{
              click: (event) => {
                onRouteJump?.({
                  lat: event.latlng.lat,
                  lng: event.latlng.lng,
                });
              },
            }}
          />

          {routeLandmarks.map((landmark) => {
            const wasAnnounced = announcedIds.has(landmark.id);
            return (
              <Marker key={landmark.id} position={[landmark.lat, landmark.lng]}>
                <Popup>
                  <strong>{landmark.name}</strong>
                  <br />
                  {landmark.message}
                  <br />
                  <span>
                    {wasAnnounced ? "Already announced" : "Waiting to announce"}
                  </span>
                </Popup>
              </Marker>
            );
          })}

          {routeLandmarks.map((landmark) => (
            <Circle
              key={`${landmark.id}-radius`}
              center={[landmark.lat, landmark.lng]}
              radius={landmark.triggerRadiusMeters}
              pathOptions={{ opacity: 0.2, fillOpacity: 0.04 }}
            />
          ))}
        </>
      )}

      {appMode === "stationary" && userPosition && (
        <>
          <Circle
            center={[userPosition.lat, userPosition.lng]}
            radius={stationaryRadiusMeters}
            pathOptions={{ opacity: 0.26, fillOpacity: 0.06 }}
          />

          {comfortPlaces.map((place) => {
            const selected = place.id === selectedComfortPlaceId;
            return (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={selected ? selectedPlaceIcon : defaultIcon}
                eventHandlers={{
                  click: () => onSelectComfortPlace?.(place.id),
                }}
              >
                <Popup>
                  <strong>{place.name}</strong>
                  <br />
                  {place.category} · {formatMeters(place.distanceMeters)} away
                  <br />
                  <span>{place.source}</span>
                  <br />
                  <a
                    href={directionsUrl(userPosition, place)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open walking directions
                  </a>
                </Popup>
              </Marker>
            );
          })}
        </>
      )}

      {userPosition && (
        <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
          <Popup>
            {appMode === "travel" ? "Ride position" : "Scan centre"}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
