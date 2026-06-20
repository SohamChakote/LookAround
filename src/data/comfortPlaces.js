import { distanceMeters } from '../utils/geo.js';

const demoComfortPlaces = [
  {
    id: 'demo-waterfront-washroom',
    name: 'Waterfront Station area washroom',
    category: 'Washroom',
    lat: 49.2862,
    lng: -123.1125,
    source: 'Demo fallback',
    openingHours: 'Demo data'
  },
  {
    id: 'demo-canada-place-comfort',
    name: 'Canada Place comfort stop',
    category: 'Washroom',
    lat: 49.2887,
    lng: -123.1110,
    source: 'Demo fallback',
    openingHours: 'Demo data'
  },
  {
    id: 'demo-science-world-comfort',
    name: 'Science World area comfort stop',
    category: 'Washroom',
    lat: 49.2733,
    lng: -123.1038,
    source: 'Demo fallback',
    openingHours: 'Demo data'
  },
  {
    id: 'demo-metrotown-comfort',
    name: 'Metrotown Station area comfort stop',
    category: 'Washroom',
    lat: 49.2260,
    lng: -123.0037,
    source: 'Demo fallback',
    openingHours: 'Demo data'
  },
  {
    id: 'demo-ubc-nest-comfort',
    name: 'UBC Nest area washroom',
    category: 'Washroom',
    lat: 49.2666,
    lng: -123.2490,
    source: 'Demo fallback',
    openingHours: 'Demo data'
  },
  {
    id: 'demo-ubc-rose-water',
    name: 'UBC Rose Garden area water stop',
    category: 'Water',
    lat: 49.2681,
    lng: -123.2561,
    source: 'Demo fallback',
    openingHours: 'Demo data'
  },
  {
    id: 'demo-broadway-city-hall-transit',
    name: 'Broadway-City Hall transit stop',
    category: 'Transit',
    lat: 49.2636,
    lng: -123.1140,
    source: 'Demo fallback',
    openingHours: 'Demo data'
  }
];

export function getDemoComfortPlaces(origin, radiusMeters) {
  return demoComfortPlaces
    .map((place) => ({
      ...place,
      distanceMeters: distanceMeters(origin, place),
      score: place.category === 'Washroom' ? 500 : 250
    }))
    .filter((place) => place.distanceMeters <= radiusMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, 12);
}
