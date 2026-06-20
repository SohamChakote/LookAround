import { distanceMeters } from './geo.js';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];

function buildComfortQuery({ lat, lng }, radiusMeters) {
  return `[out:json][timeout:18];
(
  node(around:${radiusMeters},${lat},${lng})[amenity~"toilets|drinking_water|cafe|restaurant|fast_food"];
  way(around:${radiusMeters},${lat},${lng})[amenity~"toilets|drinking_water|cafe|restaurant|fast_food"];
  relation(around:${radiusMeters},${lat},${lng})[amenity~"toilets|drinking_water|cafe|restaurant|fast_food"];
  node(around:${radiusMeters},${lat},${lng})[public_transport~"station|platform"];
  node(around:${radiusMeters},${lat},${lng})[railway~"station|subway_entrance|halt"];
  node(around:${radiusMeters},${lat},${lng})[leisure~"park|garden"];
  way(around:${radiusMeters},${lat},${lng})[leisure~"park|garden"];
);
out center tags;`;
}

async function runOverpassQuery(query) {
  let lastError;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8'
        }
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('No Overpass endpoint responded.');
}

function getElementPosition(element) {
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function categoryFromTags(tags) {
  if (tags.amenity === 'toilets') return 'Washroom';
  if (tags.amenity === 'drinking_water') return 'Water';
  if (['cafe', 'restaurant', 'fast_food'].includes(tags.amenity)) return 'Food';
  if (tags.public_transport || tags.railway) return 'Transit';
  if (tags.leisure === 'park' || tags.leisure === 'garden') return 'Park';
  return 'Comfort';
}

function fallbackName(tags, category) {
  if (category === 'Washroom') return 'Public washroom';
  if (category === 'Water') return 'Drinking water';
  if (category === 'Food') return 'Food stop';
  if (category === 'Transit') return 'Transit stop';
  if (category === 'Park') return 'Park / green space';
  return tags.amenity ?? tags.leisure ?? tags.railway ?? 'Nearby place';
}

function priorityForCategory(category) {
  if (category === 'Washroom') return 600;
  if (category === 'Water') return 420;
  if (category === 'Transit') return 240;
  if (category === 'Food') return 180;
  if (category === 'Park') return 120;
  return 80;
}

function normalizePlace(element, origin) {
  const position = getElementPosition(element);
  if (!position) return null;

  const tags = element.tags ?? {};
  const category = categoryFromTags(tags);
  const distance = distanceMeters(origin, position);
  const name = tags.name || tags['name:en'] || fallbackName(tags, category);
  const id = `osm-${element.type}-${element.id}`;

  return {
    id,
    source: 'OpenStreetMap',
    name,
    category,
    lat: position.lat,
    lng: position.lng,
    distanceMeters: distance,
    access: tags.access,
    fee: tags.fee,
    wheelchair: tags.wheelchair,
    openingHours: tags.opening_hours,
    score: priorityForCategory(category) - distance / 8
  };
}

function dedupePlaces(places) {
  const seen = new Set();
  const result = [];

  for (const place of places) {
    const key = `${place.name.toLowerCase()}|${place.lat.toFixed(5)}|${place.lng.toFixed(5)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(place);
  }

  return result;
}

export async function fetchComfortPlaces(origin, radiusMeters) {
  const query = buildComfortQuery(origin, radiusMeters);
  const data = await runOverpassQuery(query);
  const places = (data.elements ?? [])
    .map((element) => normalizePlace(element, origin))
    .filter(Boolean);

  return dedupePlaces(places)
    .sort((a, b) => b.score - a.score)
    .slice(0, 40);
}

export function directionsUrl(origin, place) {
  const destination = `${place.lat},${place.lng}`;
  const originPart = origin ? `&origin=${origin.lat},${origin.lng}` : '';
  return `https://www.google.com/maps/dir/?api=1${originPart}&destination=${destination}&travelmode=walking`;
}
