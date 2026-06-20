export const routes = [
  {
    id: 'expo-waterfront-metrotown',
    name: 'Expo Line: Waterfront → Metrotown',
    type: 'SkyTrain',
    description: 'A fixed demo route through downtown Vancouver toward Burnaby.',
    path: [
      [49.2857, -123.1119], // Waterfront
      [49.2794, -123.1099], // Granville / downtown
      [49.2788, -123.1090], // Stadium-Chinatown
      [49.2732, -123.1004], // Main Street-Science World
      [49.2629, -123.0691], // Commercial-Broadway
      [49.2484, -123.0555], // Nanaimo
      [49.2442, -123.0458], // 29th Avenue
      [49.2384, -123.0318], // Joyce-Collingwood
      [49.2298, -123.0127], // Patterson
      [49.2258, -123.0039]  // Metrotown
    ]
  },
  {
    id: 'broadway-ubc',
    name: 'Broadway Bus: Commercial-Broadway → UBC',
    type: 'Bus',
    description: 'A fixed demo route travelling west across Broadway to UBC.',
    path: [
      [49.2629, -123.0691], // Commercial-Broadway
      [49.2632, -123.0890],
      [49.2635, -123.1140], // City Hall area
      [49.2636, -123.1386], // Broadway-City Hall / Cambie-ish
      [49.2634, -123.1580],
      [49.2633, -123.1850],
      [49.2632, -123.2230],
      [49.2606, -123.2460]  // UBC Bus Exchange-ish
    ]
  }
];
