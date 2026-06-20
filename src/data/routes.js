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

export const landmarks = [
  {
    id: 'canada-place',
    routeId: 'expo-waterfront-metrotown',
    name: 'Canada Place',
    lat: 49.2888,
    lng: -123.1111,
    triggerRadiusMeters: 450,
    message: 'Canada Place is nearby, with its sail-like roof along Vancouver’s waterfront.'
  },
  {
    id: 'rogers-arena',
    routeId: 'expo-waterfront-metrotown',
    name: 'Rogers Arena',
    lat: 49.2778,
    lng: -123.1088,
    triggerRadiusMeters: 400,
    message: 'Rogers Arena is coming up, one of the city’s major sports and concert venues.'
  },
  {
    id: 'science-world',
    routeId: 'expo-waterfront-metrotown',
    name: 'Science World',
    lat: 49.2734,
    lng: -123.1039,
    triggerRadiusMeters: 450,
    message: 'Science World is coming up, the round glass building beside False Creek.'
  },
  {
    id: 'trout-lake',
    routeId: 'expo-waterfront-metrotown',
    name: 'Trout Lake',
    lat: 49.2558,
    lng: -123.0618,
    triggerRadiusMeters: 1000,
    message: 'Trout Lake is in the nearby park area, a calm green space just off the route.'
  },
  {
    id: 'central-park',
    routeId: 'expo-waterfront-metrotown',
    name: 'Central Park',
    lat: 49.2285,
    lng: -123.0211,
    triggerRadiusMeters: 800,
    message: 'Central Park is coming up, one of Burnaby’s largest urban forest parks.'
  },
  {
    id: 'metrotown',
    routeId: 'expo-waterfront-metrotown',
    name: 'Metrotown',
    lat: 49.2264,
    lng: -123.0029,
    triggerRadiusMeters: 450,
    message: 'Metrotown is ahead, one of the busiest shopping and transit hubs in the region.'
  },
  {
    id: 'vancouver-city-hall',
    routeId: 'broadway-ubc',
    name: 'Vancouver City Hall',
    lat: 49.2609,
    lng: -123.1139,
    triggerRadiusMeters: 450,
    message: 'Vancouver City Hall is nearby, a recognizable civic building just off Broadway.'
  },
  {
    id: 'granville-island',
    routeId: 'broadway-ubc',
    name: 'Granville Island',
    lat: 49.2711,
    lng: -123.1340,
    triggerRadiusMeters: 1000,
    message: 'Granville Island is nearby toward False Creek, known for its public market and waterfront views.'
  },
  {
    id: 'kitsilano',
    routeId: 'broadway-ubc',
    name: 'Kitsilano Neighbourhood',
    lat: 49.2684,
    lng: -123.1683,
    triggerRadiusMeters: 900,
    message: 'You are passing through the Kitsilano area, one of Vancouver’s well-known west side neighbourhoods.'
  },
  {
    id: 'jericho-beach',
    routeId: 'broadway-ubc',
    name: 'Jericho Beach Area',
    lat: 49.2720,
    lng: -123.2038,
    triggerRadiusMeters: 1200,
    message: 'Jericho Beach is toward the water from here, with open views across English Bay.'
  },
  {
    id: 'ubc-rose-garden',
    routeId: 'broadway-ubc',
    name: 'UBC Rose Garden',
    lat: 49.2683,
    lng: -123.2564,
    triggerRadiusMeters: 1200,
    message: 'The UBC Rose Garden is nearby, with one of the best mountain and ocean views on campus.'
  }
];
