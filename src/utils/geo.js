const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

export function asPoint(position) {
  if (Array.isArray(position)) {
    return { lat: position[0], lng: position[1] };
  }
  return position;
}

export function distanceMeters(a, b) {
  const p1 = asPoint(a);
  const p2 = asPoint(b);
  const dLat = toRadians(p2.lat - p1.lat);
  const dLng = toRadians(p2.lng - p1.lng);
  const lat1 = toRadians(p1.lat);
  const lat2 = toRadians(p2.lat);

  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

export function bearingDegrees(a, b) {
  const p1 = asPoint(a);
  const p2 = asPoint(b);
  const lat1 = toRadians(p1.lat);
  const lat2 = toRadians(p2.lat);
  const dLng = toRadians(p2.lng - p1.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

export function normalizeAngle180(angle) {
  return ((angle + 540) % 360) - 180;
}

export function sideOfTravel(currentPoint, nextPoint, targetPoint) {
  if (!currentPoint || !nextPoint || !targetPoint) return 'side';

  const travelBearing = bearingDegrees(currentPoint, nextPoint);
  const targetBearing = bearingDegrees(currentPoint, targetPoint);
  const diff = normalizeAngle180(targetBearing - travelBearing);

  return diff >= 0 ? 'right' : 'left';
}

export function interpolatePoint(a, b, fraction) {
  const p1 = asPoint(a);
  const p2 = asPoint(b);
  const safeFraction = Math.max(0, Math.min(1, fraction));

  return {
    lat: p1.lat + (p2.lat - p1.lat) * safeFraction,
    lng: p1.lng + (p2.lng - p1.lng) * safeFraction
  };
}

export function totalPathDistance(path) {
  let total = 0;

  for (let i = 0; i < path.length - 1; i++) {
    total += distanceMeters(path[i], path[i + 1]);
  }

  return total;
}

export function getPointAtDistance(path, targetDistanceMeters) {
  if (!path.length) return null;
  if (path.length === 1 || targetDistanceMeters <= 0) {
    return {
      point: asPoint(path[0]),
      nextPoint: asPoint(path[1] ?? path[0]),
      segmentIndex: 0,
      done: false
    };
  }

  let travelled = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    const segmentLength = distanceMeters(start, end);

    if (travelled + segmentLength >= targetDistanceMeters) {
      const distanceIntoSegment = targetDistanceMeters - travelled;
      const fraction = distanceIntoSegment / segmentLength;
      return {
        point: interpolatePoint(start, end, fraction),
        nextPoint: asPoint(end),
        segmentIndex: i,
        done: false
      };
    }

    travelled += segmentLength;
  }

  return {
    point: asPoint(path[path.length - 1]),
    nextPoint: asPoint(path[path.length - 1]),
    segmentIndex: path.length - 2,
    done: true
  };
}

export function formatMeters(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
