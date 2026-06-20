# Scenic Transit Guide

A hackathon-friendly location prototype with two modes:

1. **Travel Mode** — fixed bus/train routes with landmark alerts.
2. **Stationary Mode** — find nearby washrooms and comfort stops around your current location.

The app is intentionally simple: React + Vite + Leaflet, no backend, no database, and no paid map API key.

## What is included

- React + Vite web app
- Leaflet map with OpenStreetMap tiles
- Two fixed sample Vancouver routes
- Landmark trigger zones
- Simulated ride mode for reliable demos
- Optional GPS mode
- Browser text-to-speech announcements
- Stationary mode for nearby washrooms / comfort stops
- Live OpenStreetMap Overpass scan for toilets, water, food, transit, and parks
- Demo fallback comfort-stop data if live scan fails or returns nothing
- Google Maps directions links with no API key

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A modern browser such as Chrome, Edge, Safari, or Firefox
- Internet connection for map tiles and live nearby-place scanning

## Setup

```bash
cd scenic-transit-guide
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Recommended demo flow

### Travel Mode

1. Select **Travel Mode**.
2. Select `Expo Line: Waterfront → Metrotown`.
3. Keep ride mode as **Demo ride**.
4. Keep **Speak announcements out loud** checked.
5. Click **Start**.
6. Watch the marker move and wait for landmark alerts.

### Stationary Mode

1. Select **Stationary Mode**.
2. Click **Demo location** for a reliable Vancouver demo, or **Use my location + scan** for a live scan.
3. Choose a search radius.
4. Pick a nearby comfort stop from the list.
5. Click **Open walking directions**.

## Editing route data

Open:

```text
src/data/routes.js
```

Add or edit routes in the `routes` array. Each route has a `path` of latitude/longitude points.

Add or edit landmarks in the `landmarks` array. Each landmark has:

- `routeId`: which route it belongs to
- `lat` and `lng`: location of the landmark
- `triggerRadiusMeters`: how close the user must be before the announcement fires
- `message`: what the app says

## Editing stationary fallback data

Open:

```text
src/data/comfortPlaces.js
```

These are backup/demo results shown when the live Overpass scan fails or returns nothing. Keep them clearly marked as demo fallback data unless you verify the exact location.

## How live washroom scanning works

Open:

```text
src/utils/comfort.js
```

The app sends a small Overpass query around the current scan centre. It looks for OpenStreetMap tags like:

- `amenity=toilets`
- `amenity=drinking_water`
- `amenity=cafe`
- `public_transport=station`
- `railway=station`
- `leisure=park`

The results are normalized, sorted, shown on the map, and listed in the sidebar.

## Notes

This is intentionally a prototype. For production, you would eventually add verified POI data, accessibility details, hours validation, better GPS handling, and real routing inside the app. For the hackathon, the current version is good because it is easy to demo and does not rely on paid map APIs.
