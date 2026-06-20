import { useEffect } from 'react';
import L from 'leaflet';
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-location-dot"></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

L.Marker.prototype.options.icon = defaultIcon;

function FitRouteBounds({ routePath }) {
  const map = useMap();

  useEffect(() => {
    if (!routePath?.length) return;
    const bounds = L.latLngBounds(routePath);
    map.fitBounds(bounds, { padding: [35, 35] });
  }, [map, routePath]);

  return null;
}

export default function TransitMap({ route, routeLandmarks, userPosition, announcedIds }) {
  const center = route.path[0];

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitRouteBounds routePath={route.path} />

      <Polyline positions={route.path} weight={6} opacity={0.75} />

      {routeLandmarks.map((landmark) => {
        const wasAnnounced = announcedIds.has(landmark.id);
        return (
          <Marker key={landmark.id} position={[landmark.lat, landmark.lng]}>
            <Popup>
              <strong>{landmark.name}</strong>
              <br />
              {landmark.message}
              <br />
              <span>{wasAnnounced ? 'Already announced' : 'Waiting to announce'}</span>
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

      {userPosition && (
        <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
