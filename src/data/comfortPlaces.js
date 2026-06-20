import { distanceMeters } from '../utils/geo.js';

// ============================================================
// COMFORT PLACES — washrooms, cafes, water, transit stops
// Curated real locations across Vancouver, Burnaby, Richmond, Surrey
// These are fallback demo data when Overpass/OpenStreetMap is unavailable.
// ============================================================

const demoComfortPlaces = [

  // ── PUBLIC WASHROOMS ─────────────────────────────────────────

  {
    id: 'washroom-waterfront-station',
    name: 'Waterfront Station Public Washroom',
    category: 'Washroom',
    lat: 49.2857,
    lng: -123.1122,
    source: 'Demo fallback',
    openingHours: 'Daily 5:30am–1am',
    notes: 'Inside Waterfront Station transit hub. Accessible.'
  },
  {
    id: 'washroom-canada-place',
    name: 'Canada Place Washrooms',
    category: 'Washroom',
    lat: 49.2887,
    lng: -123.1111,
    source: 'Demo fallback',
    openingHours: 'Daily 7am–10pm',
    notes: 'Inside Canada Place convention centre. Accessible.'
  },
  {
    id: 'washroom-gastown-water-street',
    name: 'Gastown — Water St Washroom (CRAB Park)',
    category: 'Washroom',
    lat: 49.2826,
    lng: -123.0993,
    source: 'Demo fallback',
    openingHours: 'Daily 6am–10pm',
    notes: 'CRAB Park public washroom near the waterfront. City-operated.'
  },
  {
    id: 'washroom-robson-square',
    name: 'Robson Square Public Washroom',
    category: 'Washroom',
    lat: 49.2816,
    lng: -123.1225,
    source: 'Demo fallback',
    openingHours: 'Mon–Fri 8am–9pm, Sat–Sun 9am–9pm',
    notes: 'Below the Law Courts building. Accessible.'
  },
  {
    id: 'washroom-stanley-park-info',
    name: 'Stanley Park Info Booth Washrooms',
    category: 'Washroom',
    lat: 49.3007,
    lng: -123.1431,
    source: 'Demo fallback',
    openingHours: 'Daily 6am–10pm (summer), 8am–6pm (winter)',
    notes: 'Near Stanley Park entrance. Multiple washroom buildings throughout park.'
  },
  {
    id: 'washroom-english-bay-beach',
    name: 'English Bay Beach Washroom',
    category: 'Washroom',
    lat: 49.2880,
    lng: -123.1408,
    source: 'Demo fallback',
    openingHours: 'Daily 7am–9pm (year-round)',
    notes: 'Seasonal washroom facilities near the beach concession.'
  },
  {
    id: 'washroom-science-world',
    name: 'Science World Plaza Washroom',
    category: 'Washroom',
    lat: 49.2733,
    lng: -123.1040,
    source: 'Demo fallback',
    openingHours: 'Daily 9:30am–6pm (building hours)',
    notes: 'Inside Science World lobby. Accessible. Ticket not required for washroom access.'
  },
  {
    id: 'washroom-granville-island-market',
    name: 'Granville Island Market Washroom',
    category: 'Washroom',
    lat: 49.2713,
    lng: -123.1347,
    source: 'Demo fallback',
    openingHours: 'Daily 9am–7pm',
    notes: 'Inside the Public Market building. Multiple accessible stalls.'
  },
  {
    id: 'washroom-kits-beach',
    name: 'Kitsilano Beach Park Washroom',
    category: 'Washroom',
    lat: 49.2749,
    lng: -123.1546,
    source: 'Demo fallback',
    openingHours: 'Daily 7am–9pm (May–Sept), 8am–6pm (Oct–Apr)',
    notes: 'Near Kits Pool and concession. Seasonal extra facilities in summer.'
  },
  {
    id: 'washroom-jericho-beach',
    name: 'Jericho Beach Park Washroom',
    category: 'Washroom',
    lat: 49.2724,
    lng: -123.2030,
    source: 'Demo fallback',
    openingHours: 'Daily 7am–9pm (May–Sept)',
    notes: 'Near sailing centre. Seasonal.'
  },
  {
    id: 'washroom-commercial-drive-park',
    name: '(John) Grandview Park Washroom — Commercial Drive',
    category: 'Washroom',
    lat: 49.2690,
    lng: -123.0676,
    source: 'Demo fallback',
    openingHours: 'Daily 8am–dusk',
    notes: 'Public park washroom at Commercial Drive and William Street.'
  },
  {
    id: 'washroom-trout-lake-park',
    name: 'Trout Lake Park Washroom',
    category: 'Washroom',
    lat: 49.2539,
    lng: -123.0598,
    source: 'Demo fallback',
    openingHours: 'Daily 7am–9pm',
    notes: 'Near the Trout Lake dock and playground. Year-round facility.'
  },
  {
    id: 'washroom-metrotown-mall',
    name: 'Metropolis at Metrotown Washrooms',
    category: 'Washroom',
    lat: 49.2264,
    lng: -123.0029,
    source: 'Demo fallback',
    openingHours: 'Mon–Sat 10am–9pm, Sun 11am–7pm',
    notes: 'Multiple washroom locations throughout the mall. Accessible. Family room available.'
  },
  {
    id: 'washroom-new-westminster-quay',
    name: 'New Westminster Quay Washroom',
    category: 'Washroom',
    lat: 49.2034,
    lng: -122.9117,
    source: 'Demo fallback',
    openingHours: 'Daily 8am–9pm',
    notes: 'At the Fraser River waterfront market. Accessible.'
  },
  {
    id: 'washroom-surrey-central-mall',
    name: 'Central City Mall Washrooms — Surrey',
    category: 'Washroom',
    lat: 49.1880,
    lng: -122.8460,
    source: 'Demo fallback',
    openingHours: 'Mon–Sat 10am–9pm, Sun 11am–7pm',
    notes: 'Inside Central City Shopping Centre attached to Surrey Central SkyTrain.'
  },
  {
    id: 'washroom-richmond-brighouse',
    name: 'Richmond Centre Mall Washrooms',
    category: 'Washroom',
    lat: 49.1682,
    lng: -123.1371,
    source: 'Demo fallback',
    openingHours: 'Mon–Sat 10am–9pm, Sun 11am–7pm',
    notes: 'Inside Richmond Centre Mall. Accessible. Near Canada Line station.'
  },
  {
    id: 'washroom-steveston-wharf',
    name: 'Steveston Wharf Public Washroom',
    category: 'Washroom',
    lat: 49.1253,
    lng: -123.1830,
    source: 'Demo fallback',
    openingHours: 'Daily 8am–8pm (May–Oct), 9am–5pm (Nov–Apr)',
    notes: 'At the historic Steveston fishing wharf. Seasonal staff on site.'
  },
  {
    id: 'washroom-ubc-student-union',
    name: 'UBC Nest (Student Union) Washrooms',
    category: 'Washroom',
    lat: 49.2666,
    lng: -123.2490,
    source: 'Demo fallback',
    openingHours: 'Mon–Fri 7am–11pm, Sat–Sun 9am–9pm',
    notes: 'AMS Student Nest building. Fully accessible. Companion/gender-neutral washrooms available.'
  },
  {
    id: 'washroom-olympic-village-plaza',
    name: 'Olympic Village Plaza Washroom',
    category: 'Washroom',
    lat: 49.2727,
    lng: -123.1126,
    source: 'Demo fallback',
    openingHours: 'Daily 7am–10pm',
    notes: 'Near the plaza fountain at Olympic Village. Accessible.'
  },
  {
    id: 'washroom-yaletown-roundhouse',
    name: 'Roundhouse Community Centre Washroom',
    category: 'Washroom',
    lat: 49.2748,
    lng: -123.1209,
    source: 'Demo fallback',
    openingHours: 'Mon–Fri 8:30am–10pm, Sat 9am–9pm, Sun 9am–8pm',
    notes: 'Inside the Roundhouse community building. Accessible. Free access.'
  },

  // ── DRINKING WATER ───────────────────────────────────────────

  {
    id: 'water-stanley-park-fountain',
    name: 'Stanley Park Drinking Fountains',
    category: 'Water',
    lat: 49.3000,
    lng: -123.1432,
    source: 'Demo fallback',
    openingHours: 'Year-round (seasonal fountain may be off Nov–Mar)',
    notes: 'Multiple drinking fountains throughout Stanley Park seawall and interior paths.'
  },
  {
    id: 'water-english-bay',
    name: 'English Bay Beach Fountain',
    category: 'Water',
    lat: 49.2878,
    lng: -123.1412,
    source: 'Demo fallback',
    openingHours: 'Seasonal (May–Sept)',
    notes: 'Drinking fountain near the beach concession stand.'
  },
  {
    id: 'water-ubc-rose-garden',
    name: 'UBC Rose Garden Water Fountain',
    category: 'Water',
    lat: 49.2681,
    lng: -123.2561,
    source: 'Demo fallback',
    openingHours: 'Daily (weather permitting)',
    notes: 'Near the cliff-edge rose garden overlook at UBC.'
  },
  {
    id: 'water-trout-lake',
    name: 'Trout Lake Drinking Fountain',
    category: 'Water',
    lat: 49.2535,
    lng: -123.0601,
    source: 'Demo fallback',
    openingHours: 'May–October',
    notes: 'Near the swimming dock. Seasonal.'
  },

  // ── CAFES ────────────────────────────────────────────────────

  {
    id: 'cafe-revolver',
    name: 'Revolver Coffee — Gastown',
    category: 'Cafe',
    lat: 49.2828,
    lng: -123.1074,
    source: 'Demo fallback',
    openingHours: 'Mon–Fri 7:30am–6pm, Sat–Sun 9am–6pm',
    notes: 'Legendary specialty coffee shop in Gastown. One of Vancouver\'s top-rated cafes. 325 Cambie St.'
  },
  {
    id: 'cafe-49th-parallel-broadway',
    name: '49th Parallel Coffee — Broadway',
    category: 'Cafe',
    lat: 49.2632,
    lng: -123.1385,
    source: 'Demo fallback',
    openingHours: 'Daily 7am–8pm',
    notes: 'Popular Vancouver roaster with a flagship on Broadway & Cambie. Famous for Lucky\'s Doughnuts.'
  },
  {
    id: 'cafe-nelson-kits',
    name: 'Cafe Artigiano — Kitsilano',
    category: 'Cafe',
    lat: 49.2687,
    lng: -123.1576,
    source: 'Demo fallback',
    openingHours: 'Daily 7am–7pm',
    notes: 'Cozy cafe in the heart of Kits. Good window seating. 4th Avenue area.'
  },
  {
    id: 'cafe-waves-commercial',
    name: 'Prado Café — Commercial Drive',
    category: 'Cafe',
    lat: 49.2627,
    lng: -123.0695,
    source: 'Demo fallback',
    openingHours: 'Daily 7:30am–8pm',
    notes: 'One of the Drive\'s best cafes. Community feel, great espresso and pastries.'
  },
  {
    id: 'cafe-transcontinental-ubc',
    name: 'Koerner\'s Pub & Cafe — UBC',
    category: 'Cafe',
    lat: 49.2668,
    lng: -123.2508,
    source: 'Demo fallback',
    openingHours: 'Mon–Fri 8am–10pm, Sat 10am–10pm',
    notes: 'UBC Graduate Student Centre cafe. Good student vibe, affordable. Near the Main Mall.'
  },
  {
    id: 'cafe-steveston-roasting',
    name: 'Steveston Coffee Company',
    category: 'Cafe',
    lat: 49.1247,
    lng: -123.1827,
    source: 'Demo fallback',
    openingHours: 'Daily 7am–6pm',
    notes: 'Local roaster in historic Steveston Village. Great views of the fishing boats.'
  },
  {
    id: 'cafe-richmond-presotea',
    name: 'Presotea Bubble Tea — Richmond',
    category: 'Cafe',
    lat: 49.1690,
    lng: -123.1374,
    source: 'Demo fallback',
    openingHours: 'Daily 11am–9pm',
    notes: 'Popular Taiwanese bubble tea chain in Richmond Centre area.'
  },
  {
    id: 'cafe-surrey-timhortons',
    name: 'Tim Hortons — Surrey Central',
    category: 'Cafe',
    lat: 49.1852,
    lng: -122.8453,
    source: 'Demo fallback',
    openingHours: 'Daily 5am–11pm',
    notes: 'Canada\'s iconic coffee chain adjacent to Surrey Central SkyTrain.'
  },
  {
    id: 'cafe-new-west-heritage',
    name: 'Heritage Grill — New Westminster',
    category: 'Cafe',
    lat: 49.2042,
    lng: -122.9120,
    source: 'Demo fallback',
    openingHours: 'Mon–Fri 7am–9pm, Sat–Sun 8am–9pm',
    notes: 'Heritage-style diner near New Westminster waterfront. Good coffee and full breakfast.'
  },

  // ── TRANSIT STOPS ────────────────────────────────────────────

  {
    id: 'transit-broadway-city-hall',
    name: 'Broadway-City Hall Canada Line Station',
    category: 'Transit',
    lat: 49.2636,
    lng: -123.1140,
    source: 'Demo fallback',
    openingHours: 'Daily 5:07am–1:40am',
    notes: 'Canada Line station serving Broadway corridor. Connects to bus 99 B-Line.'
  },
  {
    id: 'transit-commercial-broadway',
    name: 'Commercial-Broadway Station (Expo + Millennium)',
    category: 'Transit',
    lat: 49.2629,
    lng: -123.0691,
    source: 'Demo fallback',
    openingHours: 'Daily 5am–1:30am',
    notes: 'Busiest SkyTrain interchange in the system. Also serves buses 9, 99 and many others.'
  },
  {
    id: 'transit-granville-island-ferry',
    name: 'Granville Island Ferry Dock',
    category: 'Transit',
    lat: 49.2714,
    lng: -123.1340,
    source: 'Demo fallback',
    openingHours: 'Daily 7am–10:30pm (every 15 min)',
    notes: 'False Creek Ferries connect Granville Island to Yaletown, Olympic Village, and Vanier Park. $5-6 per ride.'
  }
];

export function getDemoComfortPlaces(origin, radiusMeters) {
  return demoComfortPlaces
    .map((place) => ({
      ...place,
      distanceMeters: distanceMeters(origin, place),
      score:
        place.category === 'Washroom' ? 600 :
        place.category === 'Water' ? 420 :
        place.category === 'Cafe' ? 250 :
        place.category === 'Transit' ? 200 : 150
    }))
    .filter((place) => place.distanceMeters <= radiusMeters)
    .sort((a, b) => b.score - a.distanceMeters / 10 - (a.score - b.distanceMeters / 10))
    .slice(0, 20);
}
