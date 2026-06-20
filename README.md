Discord: https://discord.gg/XDM4JbV5s


# Scenic Transit Guide

A hackathon-friendly fixed-route transit tour guide. Pick a bus/train route, start a simulated ride, and the app announces scenic landmarks as you pass them.

## What is included

- React + Vite web app
- Leaflet map with OpenStreetMap tiles
- Two fixed sample Vancouver routes
- Landmark trigger zones
- Simulated ride mode for reliable demos
- Optional GPS mode
- Browser text-to-speech announcements
- No backend, no database, no API key required

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A modern browser such as Chrome, Edge, Safari, or Firefox

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

1. Select `Expo Line: Waterfront → Metrotown`.
2. Keep mode as `Demo ride`.
3. Keep `Speak announcements out loud` checked.
4. Click `Start`.
5. Watch the blue marker move and wait for landmark alerts.

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

## Notes

This is intentionally a prototype. For a real production version, you would eventually add better transit route data, more precise GPS behavior, and a source for verified landmark descriptions.
