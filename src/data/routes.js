// ============================================================
// ROUTES — SkyTrain lines, bus routes across Metro Vancouver
// ============================================================

export const routes = [
  // ── EXPO LINE ──────────────────────────────────────────────
  {
    id: 'expo-waterfront-king-george',
    name: 'Expo Line: Waterfront → King George (Surrey)',
    type: 'SkyTrain',
    color: '#0056A2',
    description: 'The original SkyTrain line, opened in 1986 for Expo 86. Runs from downtown Vancouver through Burnaby and New Westminster down to King George in Surrey.',
    path: [
      [49.2857, -123.1119], // Waterfront
      [49.2794, -123.1099], // Granville
      [49.2788, -123.1070], // Stadium-Chinatown
      [49.2732, -123.1004], // Main Street-Science World
      [49.2629, -123.0691], // Commercial-Broadway (Expo/Millennium junction)
      [49.2539, -123.0658], // Nanaimo
      [49.2442, -123.0458], // 29th Avenue
      [49.2384, -123.0318], // Joyce-Collingwood
      [49.2298, -123.0127], // Patterson
      [49.2258, -123.0039], // Metrotown
      [49.2205, -122.9875], // Royal Oak
      [49.2139, -122.9682], // Edmonds
      [49.2090, -122.9506], // 22nd Street (New Westminster)
      [49.2034, -122.9117], // New Westminster
      [49.1987, -122.9043], // Columbia
      [49.1953, -122.8966], // Scott Road (Surrey)
      [49.1896, -122.8490], // Gateway
      [49.1852, -122.8449], // Surrey Central
      [49.1826, -122.8451]  // King George
    ]
  },

  // ── CANADA LINE ────────────────────────────────────────────
  {
    id: 'canada-line-waterfront-richmond',
    name: 'Canada Line: Waterfront → YVR/Richmond',
    type: 'SkyTrain',
    color: '#00A94F',
    description: 'Opened in 2009 for the Winter Olympics. Links downtown Vancouver to Richmond and Vancouver International Airport (YVR).',
    path: [
      [49.2857, -123.1119], // Waterfront
      [49.2757, -123.1163], // Vancouver City Centre
      [49.2643, -123.1154], // Yaletown-Roundhouse
      [49.2637, -123.1140], // Olympic Village
      [49.2510, -123.1179], // Broadway-City Hall
      [49.2423, -123.1118], // King Edward
      [49.2338, -123.1106], // Oakridge-41st Ave
      [49.2258, -123.1150], // Langara-49th Ave
      [49.2131, -123.1186], // Marine Drive
      [49.1936, -123.1361], // Bridgeport (Richmond junction)
      [49.1863, -123.1373], // Aberdeen
      [49.1811, -123.1372], // Lansdowne
      [49.1682, -123.1371], // Richmond-Brighouse
      // Airport spur
      [49.1936, -123.1361], // Bridgeport (branch point)
      [49.1968, -123.1777], // Templeton
      [49.1942, -123.1793], // Sea Island Centre
      [49.1944, -123.1791], // Bridgeport (YVR direction)
      [49.1960, -123.1795]  // YVR-Airport
    ]
  },

  // ── MILLENNIUM LINE ────────────────────────────────────────
  {
    id: 'millennium-vcc-clark-lafarge',
    name: 'Millennium Line: VCC-Clark → Lafarge Lake-Douglas',
    type: 'SkyTrain',
    color: '#FFCC00',
    description: 'Opened in 2002, the Millennium Line serves the northeast suburbs. Branches from the Expo Line at Commercial-Broadway and heads through Burnaby to Coquitlam.',
    path: [
      [49.2632, -123.0704], // VCC-Clark (western terminus)
      [49.2629, -123.0691], // Commercial-Broadway
      [49.2617, -123.0517], // Renfrew
      [49.2602, -123.0258], // Rupert
      [49.2598, -123.0082], // Gilmore
      [49.2576, -122.9971], // Brentwood Town Centre
      [49.2564, -122.9786], // Holdom
      [49.2559, -122.9641], // Sperling-Burnaby Lake
      [49.2519, -122.9510], // Lake City Way
      [49.2484, -122.9327], // Production Way-University
      [49.2412, -122.9266], // Lougheed Town Centre
      [49.2367, -122.9170], // Burquitlam
      [49.2324, -122.9068], // Moody Centre
      [49.2892, -122.8636], // Inlet Centre
      [49.2839, -122.8395], // Coquitlam Central
      [49.2814, -122.8276], // Lincoln
      [49.2771, -122.8087], // Lafarge Lake-Douglas
    ]
  },

  // ── BROADWAY BUS 99 B-LINE ──────────────────────────────────
  {
    id: 'broadway-commercial-ubc',
    name: 'Bus 99 B-Line: Commercial-Broadway → UBC',
    type: 'Bus',
    color: '#E8432F',
    description: 'Vancouver\'s busiest bus route, running all the way along Broadway from Commercial-Broadway SkyTrain station west to UBC.',
    path: [
      [49.2629, -123.0691], // Commercial-Broadway
      [49.2632, -123.0890], // Kingsway area
      [49.2635, -123.1140], // Main St Broadway
      [49.2636, -123.1386], // Cambie & Broadway (City Hall)
      [49.2634, -123.1580], // Granville & Broadway
      [49.2633, -123.1850], // Arbutus area
      [49.2632, -123.2080], // Macdonald area
      [49.2629, -123.2230], // Alma area
      [49.2620, -123.2460], // NW Marine Drive junction
      [49.2606, -123.2530]  // UBC Bus Exchange
    ]
  },

  // ── CANADA LINE BUS 410 RICHMOND → LADNER ──────────────────
  {
    id: 'richmond-city-centre-loop',
    name: 'Richmond: Brighouse → Steveston Village',
    type: 'Bus',
    color: '#009B77',
    description: 'A scenic route from Richmond-Brighouse Canada Line station through Richmond City Centre down to historic Steveston Village on the Fraser River.',
    path: [
      [49.1682, -123.1371], // Richmond-Brighouse Canada Line
      [49.1700, -123.1370], // Minoru Blvd area
      [49.1640, -123.1399], // Richmond City Hall
      [49.1580, -123.1420], // Richmond Centre Mall
      [49.1440, -123.1500], // No 3 Road south
      [49.1280, -123.1560], // Ironwood area
      [49.1100, -123.1680], // Steveston Hwy
      [49.1225, -123.1800], // Garry St / Steveston
      [49.1250, -123.1820]  // Steveston Village / Wharf
    ]
  }
];

// ============================================================
// LANDMARKS — rich descriptions with history, images, facts
// ============================================================

export const landmarks = [

  // ════════════════════════════════════════════
  // EXPO LINE: Waterfront → King George
  // ════════════════════════════════════════════

  {
    id: 'waterfront-station',
    routeId: 'expo-waterfront-king-george',
    name: 'Waterfront Station',
    lat: 49.2857,
    lng: -123.1119,
    triggerRadiusMeters: 350,
    category: 'transit',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Waterfront_Station_Vancouver.jpg/640px-Waterfront_Station_Vancouver.jpg',
    message: 'Welcome to Waterfront Station — the heart of Vancouver\'s transit network and one of its most beautiful heritage buildings.',
    description: 'Built in 1914 as the western terminus of the Canadian Pacific Railway, Waterfront Station is a neoclassical landmark on Burrard Inlet. Its grand arched windows and terra cotta facade have survived over a century. Today it connects SkyTrain, SeaBus to North Vancouver, and the West Coast Express. Stand outside and you\'ll see the North Shore mountains framed perfectly across the water.',
    funFact: 'The CPR building was almost demolished in the 1970s but Vancouverites rallied to save it — a pivotal moment in the city\'s heritage preservation movement.'
  },
  {
    id: 'canada-place',
    routeId: 'expo-waterfront-king-george',
    name: 'Canada Place',
    lat: 49.2888,
    lng: -123.1111,
    triggerRadiusMeters: 400,
    category: 'landmark',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Canada_Place_Vancouver.jpg/640px-Canada_Place_Vancouver.jpg',
    message: 'Canada Place is just ahead — the sail-shaped convention centre jutting into Burrard Inlet.',
    description: 'Canada Place was built for Expo 86 as the Canadian Pavilion and now serves as the Vancouver Convention Centre, a cruise ship terminal, and home to FlyOver Canada. Its iconic white fibreglass "sails" are modelled after ship sails and are a symbol of Vancouver worldwide. Over 800,000 cruise passengers pass through each year, making it one of the busiest cruise ports in North America.',
    funFact: 'The Canada Place Teflon roof sails are each the size of a tennis court and visible from planes approaching YVR airport.'
  },
  {
    id: 'gastown',
    routeId: 'expo-waterfront-king-george',
    name: 'Gastown Historic District',
    lat: 49.2837,
    lng: -123.1062,
    triggerRadiusMeters: 380,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Gastown_Steam_Clock_2012.jpg/480px-Gastown_Steam_Clock_2012.jpg',
    message: 'Gastown is just to your right — Vancouver\'s oldest neighbourhood, full of cobblestone streets and heritage buildings.',
    description: 'Gastown is where Vancouver began. Named after "Gassy Jack" Deighton, a saloon keeper who opened the first bar here in 1867, the area became the original townsite of "Granville" — later renamed Vancouver in 1886. The famous steam clock on Water Street was installed in 1977 and still whistles steam on the quarter hour. The neighbourhood was saved from demolition in the 1970s and is now a National Historic Site.',
    funFact: 'The Gastown steam clock runs on a steam system that still heats several downtown buildings through underground pipes — leftover infrastructure from the early 1900s.'
  },
  {
    id: 'rogers-arena',
    routeId: 'expo-waterfront-king-george',
    name: 'Rogers Arena',
    lat: 49.2778,
    lng: -123.1088,
    triggerRadiusMeters: 380,
    category: 'sport',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Rogers_Arena_Vancouver.jpg/640px-Rogers_Arena_Vancouver.jpg',
    message: 'Rogers Arena is coming up on your right — home of the Vancouver Canucks.',
    description: 'Opened in 1995 as General Motors Place, Rogers Arena holds 18,910 hockey fans and hosted ice hockey events during the 2010 Winter Olympics. The Canucks have played here since the building opened. The arena is also one of North America\'s busiest concert venues — artists from Michael Jackson to Taylor Swift have performed here. The 2011 Stanley Cup Finals riot happened on the streets right outside.',
    funFact: 'During the 2010 Olympics, the arena hosted Canada vs USA gold medal hockey game — Canada won 3-2 in overtime in what many call the most-watched hockey game in Canadian history.'
  },
  {
    id: 'bc-place',
    routeId: 'expo-waterfront-king-george',
    name: 'BC Place Stadium',
    lat: 49.2769,
    lng: -123.1118,
    triggerRadiusMeters: 420,
    category: 'sport',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/BC_Place_Stadium_-_Vancouver.jpg/640px-BC_Place_Stadium_-_Vancouver.jpg',
    message: 'BC Place is on your left — one of the world\'s largest air-supported domed stadiums.',
    description: 'BC Place opened in 1983 and was the first domed stadium in Canada. Its retractable roof replaced the original air-supported roof in 2011 — the largest of its kind in the world at the time. It hosted the Opening and Closing Ceremonies of the 2010 Winter Olympics and FIFA World Cup matches in 2026. Home to the BC Lions CFL team and Vancouver Whitecaps FC, it seats up to 54,500 for football.',
    funFact: 'When BC Place\'s original air-supported roof deflated in 2007 due to heavy snow, it took months to repair. The new cable-supported retractable roof weighs 2.6 million kg.'
  },
  {
    id: 'science-world',
    routeId: 'expo-waterfront-king-george',
    name: 'Science World',
    lat: 49.2734,
    lng: -123.1039,
    triggerRadiusMeters: 380,
    category: 'attraction',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Science_World_Vancouver.jpg/640px-Science_World_Vancouver.jpg',
    message: 'Science World is coming up — the iconic geodesic dome beside False Creek.',
    description: 'The TELUS World of Science geodesic dome was designed by Bruno Freschi for Expo 86 as the "Expo Centre." The building\'s 47-metre diameter sphere was constructed from 766 triangular panels. It sits at the east end of False Creek, which was once a mudflat, then an industrial area, and transformed into a residential and recreational waterfront for Expo 86. It remains Vancouver\'s most recognized building after the sails of Canada Place.',
    funFact: 'The dome\'s surface is covered in 766 spherical triangles, each about 3 metres across. At night, 387 computer-controlled LED lights illuminate the sphere — it\'s visible from planes 30 km away.'
  },
  {
    id: 'false-creek',
    routeId: 'expo-waterfront-king-george',
    name: 'False Creek & Olympic Village',
    lat: 49.2710,
    lng: -123.1060,
    triggerRadiusMeters: 500,
    category: 'scenic',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/False_Creek_Vancouver_2018.jpg/640px-False_Creek_Vancouver_2018.jpg',
    message: 'False Creek is to your south — the waterway that runs through the heart of Vancouver.',
    description: 'False Creek was originally a tidal inlet stretching far east into Burnaby. Named by early surveyor Captain G.H. Richards who thought it was a river but found it "false," it was once heavily industrial with sawmills, railway yards, and factories. The south shore was transformed for Expo 86; the north shore (Olympic Village) was rebuilt as the Athletes\' Village for the 2010 Winter Olympics and converted to market housing afterward.',
    funFact: 'False Creek was originally three times its current size. The CPR filled in much of the eastern arm in the early 1900s to build rail yards — that land is now the Main Street-Science World SkyTrain area.'
  },
  {
    id: 'main-street-heritage',
    routeId: 'expo-waterfront-king-george',
    name: 'Mount Pleasant Neighbourhood',
    lat: 49.2660,
    lng: -123.1000,
    triggerRadiusMeters: 500,
    category: 'neighbourhood',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Main_Street_Vancouver.jpg/640px-Main_Street_Vancouver.jpg',
    message: 'You\'re passing through Mount Pleasant — one of Vancouver\'s most vibrant creative neighbourhoods.',
    description: 'Mount Pleasant is one of Vancouver\'s oldest residential neighbourhoods, developed around 1891 when it was a separate municipality. Today it\'s a hub for artists, breweries, and indie businesses. The area around Main Street and Kingsway is lined with indie coffee shops, vintage stores, and craft breweries — Vancouver\'s "Brewery District" is here. The neighbourhood fought off several waves of gentrification while maintaining its character.',
    funFact: 'Mount Pleasant has more craft breweries per square kilometre than almost anywhere in Canada. You can walk between several in about 10 minutes — locals call it the "Yeast Van" brewing scene.'
  },
  {
    id: 'commercial-drive',
    routeId: 'expo-waterfront-king-george',
    name: 'Commercial Drive — "The Drive"',
    lat: 49.2629,
    lng: -123.0691,
    triggerRadiusMeters: 400,
    category: 'neighbourhood',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Commercial_Drive_Vancouver.jpg/640px-Commercial_Drive_Vancouver.jpg',
    message: 'You\'re at Commercial Drive — the cultural heart of East Vancouver.',
    description: 'Commercial Drive, known locally as "The Drive," is one of Vancouver\'s most eclectic streets. Italian immigrants settled here in the early 1900s, and the neighbourhood still has authentic Italian cafes and delis alongside Ethiopian restaurants, hipster coffee shops, and political bookstores. During the 2010 World Cup, thousands poured onto the street to watch Italy\'s matches. It\'s considered the bohemian soul of East Van.',
    funFact: 'Commercial Drive has been called the "cappuccino strip" of Vancouver since the 1970s when Italian immigrants introduced espresso culture here — decades before the Starbucks era made it mainstream.'
  },
  {
    id: 'trout-lake',
    routeId: 'expo-waterfront-king-george',
    name: 'Trout Lake (John Hendry Park)',
    lat: 49.2530,
    lng: -123.0590,
    triggerRadiusMeters: 700,
    category: 'park',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Trout_Lake_Vancouver.jpg/640px-Trout_Lake_Vancouver.jpg',
    message: 'Trout Lake Park is nearby to your south — a beloved East Van green space with a real swimming lake.',
    description: 'Trout Lake is one of the only natural lakes within Vancouver city limits. John Hendry Park surrounds it with playing fields, community gardens, and the Trout Lake Farmers Market, which runs every Saturday from spring to fall. In summer, locals swim from the dock and splash around on paddleboards. The lake is stocked with rainbow trout and was historically used by First Nations peoples for millennia.',
    funFact: 'Trout Lake Farmers Market, which started in 1995, is the longest-running farmers market in Vancouver and helped inspire the local food movement that now includes dozens of markets across Metro Vancouver.'
  },
  {
    id: 'metrotown',
    routeId: 'expo-waterfront-king-george',
    name: 'Metrotown — Burnaby',
    lat: 49.2264,
    lng: -123.0029,
    triggerRadiusMeters: 400,
    category: 'transit',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Metrotown_Station.jpg/640px-Metrotown_Station.jpg',
    message: 'Metrotown is ahead — one of Metro Vancouver\'s largest transit and shopping hubs.',
    description: 'Metrotown station sits at the centre of Burnaby\'s urban core. The adjacent Metropolis at Metrotown mall is the second-largest shopping centre in BC and one of the busiest in Canada. Burnaby is officially separate from Vancouver but is part of the continuous urban fabric of the region. Burnaby Mountain, SFU campus, and Deer Lake Park are all accessible from Burnaby\'s transit network. The area has seen massive high-rise development since 2010.',
    funFact: 'Burnaby was home to the headquarters of Electronic Arts (EA) Canada, one of the world\'s largest video game studios. Many of the world\'s most-sold sports games were developed just north of here.'
  },
  {
    id: 'new-westminster-heritage',
    routeId: 'expo-waterfront-king-george',
    name: 'New Westminster — Royal City',
    lat: 49.2034,
    lng: -122.9117,
    triggerRadiusMeters: 500,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/New_Westminster_Downtown.jpg/640px-New_Westminster_Downtown.jpg',
    message: 'New Westminster is ahead — once the capital of British Columbia and one of the oldest cities in Western Canada.',
    description: 'New Westminster was founded in 1858 by Colonel Richard Moody of the Royal Engineers and served as the capital of the Colony of British Columbia until Confederation in 1871. Known as the "Royal City," it was personally named by Queen Victoria. The historic downtown along the Fraser River waterfront has heritage buildings dating to the 1890s. The Hyack Festival held every May is one of BC\'s longest-running civic celebrations.',
    funFact: 'New Westminster was once more important than Vancouver. When the CPR chose Burrard Inlet over the Fraser River for its western terminus in the 1880s, Vancouver grew and New Westminster was eclipsed — but it retains the title of first capital.'
  },
  {
    id: 'surrey-central',
    routeId: 'expo-waterfront-king-george',
    name: 'Surrey Central & City Centre',
    lat: 49.1852,
    lng: -122.8449,
    triggerRadiusMeters: 450,
    category: 'transit',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Surrey_Central_SkyTrain_Station.jpg/640px-Surrey_Central_SkyTrain_Station.jpg',
    message: 'Surrey Central is ahead — the heart of BC\'s second-largest city.',
    description: 'Surrey is BC\'s second most populous city and one of Canada\'s fastest-growing. Surrey Central station anchors the city\'s downtown core, surrounded by SFU Surrey campus, city hall, Central City Shopping Centre, and a rapidly growing cluster of high-rise towers. Surrey has a large South Asian population — Payal Studio and Vaisakhi celebrations here are among the largest in North America outside India.',
    funFact: 'Surrey\'s Vaisakhi parade draws over 300,000 people each April — it\'s one of the largest Vaisakhi celebrations outside of Punjab, India, reflecting Surrey\'s vibrant Punjabi community.'
  },

  // ════════════════════════════════════════════
  // CANADA LINE: Waterfront → Richmond/YVR
  // ════════════════════════════════════════════

  {
    id: 'yaletown-roundhouse',
    routeId: 'canada-line-waterfront-richmond',
    name: 'Yaletown & Roundhouse',
    lat: 49.2643,
    lng: -123.1154,
    triggerRadiusMeters: 380,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Yaletown_Vancouver.jpg/640px-Yaletown_Vancouver.jpg',
    message: 'Yaletown is just above you — Vancouver\'s trendiest heritage district.',
    description: 'Yaletown was originally the eastern end of the CPR rail yards, where workers from Yale, BC relocated in the 1880s — hence the name. The massive brick warehouses built in the early 1900s survived as a derelict warehouse district until the 1990s, when artists moved in. Today the loading docks are restaurant patios, the warehouses are condos, and it\'s one of Vancouver\'s most desirable neighbourhoods. The Roundhouse Community Centre is a restored railway engine house.',
    funFact: 'Yaletown\'s brick buildings were saved largely because they were too well-built to demolish cheaply. The thick brick walls made them expensive to tear down, so they sat empty until cultural shifts made adaptive reuse fashionable in the 1990s.'
  },
  {
    id: 'olympic-village',
    routeId: 'canada-line-waterfront-richmond',
    name: 'Olympic Village (2010 Winter Olympics)',
    lat: 49.2657,
    lng: -123.1150,
    triggerRadiusMeters: 420,
    category: 'landmark',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Olympic_Village_Vancouver.jpg/640px-Olympic_Village_Vancouver.jpg',
    message: 'Olympic Village is to your east — built to house 2,800 athletes for the 2010 Winter Olympics.',
    description: 'The 2010 Winter Olympics Athletes\' Village on the south shore of False Creek was purpose-built to house competitors from 82 nations. After the games, it was controversially sold as market housing, making it one of Vancouver\'s most expensive addresses. The area now has waterfront restaurants, a plaza, a seawall, and the Craft Beer Market. The development transformed a former industrial brownfield into a vibrant waterfront community.',
    funFact: 'The Olympic Village was built to LEED Platinum standards and featured a neighbourhood energy utility that recovers heat from sewage — it still heats the buildings today using the waste heat of 12,000 neighbourhood residents.'
  },
  {
    id: 'broadway-city-hall',
    routeId: 'canada-line-waterfront-richmond',
    name: 'Vancouver City Hall',
    lat: 49.2609,
    lng: -123.1139,
    triggerRadiusMeters: 400,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Vancouver_City_Hall.jpg/640px-Vancouver_City_Hall.jpg',
    message: 'Vancouver City Hall is up the hill to your west — one of the finest Art Deco buildings in Canada.',
    description: 'Completed in 1936 during the Great Depression, Vancouver City Hall was built as an employment relief project and is a masterpiece of Art Deco architecture. Its stepped tower, geometric ornamentation, and bronze doors make it one of the most recognized civic buildings in Canada. The building sits on the boundary between the city\'s west and east sides. Across the street is Nat Bailey Stadium, home of the Vancouver Canadians minor league baseball team since 1951.',
    funFact: 'City Hall was deliberately positioned at the geographic centre of Vancouver in 1936. Mayor Gerry McGeer wanted a "city beautiful" project to show that Vancouver was prospering despite the Depression — it was built in just 14 months.'
  },
  {
    id: 'oakridge-mall',
    routeId: 'canada-line-waterfront-richmond',
    name: 'Oakridge Centre',
    lat: 49.2338,
    lng: -123.1106,
    triggerRadiusMeters: 380,
    category: 'landmark',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Oakridge_Centre_Vancouver.jpg/640px-Oakridge_Centre_Vancouver.jpg',
    message: 'Oakridge Centre is above you — a major mall undergoing a massive redevelopment.',
    description: 'Oakridge Centre, originally opened in 1959, was one of Canada\'s first enclosed shopping malls. It closed for a massive $3 billion redevelopment in 2021 that will create one of Canada\'s most ambitious mixed-use urban projects — 11 high-rise towers, 3,000 homes, a new park, and an expanded mall all on a single city block. The project is a model for transit-oriented development in Canada.',
    funFact: 'The Oakridge redevelopment, when complete, will add 3,000 homes on top of an existing mall — replacing an under-used parking structure with a vertical village. It\'s one of the most complex urban infill projects ever attempted in Metro Vancouver.'
  },
  {
    id: 'marine-drive-fraser-river',
    routeId: 'canada-line-waterfront-richmond',
    name: 'Marine Drive & Fraser River',
    lat: 49.2131,
    lng: -123.1186,
    triggerRadiusMeters: 450,
    category: 'scenic',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Fraser_River_Vancouver.jpg/640px-Fraser_River_Vancouver.jpg',
    message: 'You\'re crossing into South Vancouver — the Fraser River is just ahead.',
    description: 'Marine Drive marks the southern boundary of Vancouver proper before entering Richmond. The area around Marpole and Marine Drive is one of the oldest continuously inhabited places in the region — Coast Salish peoples lived along the Fraser River bank here for thousands of years. The Musqueam Indian Band reserve is just to the west. Archaeological sites have found artifacts over 5,000 years old along this stretch of river.',
    funFact: 'The Fraser River carries more salmon than any other river in BC. Up to 40 million sockeye salmon migrate upstream each autumn — a run visible from the riverbanks. Indigenous peoples have fished this exact stretch for over 8,000 years.'
  },
  {
    id: 'richmond-bridgeport',
    routeId: 'canada-line-waterfront-richmond',
    name: 'Bridgeport Station & Richmond',
    lat: 49.1936,
    lng: -123.1361,
    triggerRadiusMeters: 400,
    category: 'transit',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bridgeport_Station_Canada_Line.jpg/640px-Bridgeport_Station_Canada_Line.jpg',
    message: 'You\'ve entered Richmond — the city built on the Fraser River delta, below sea level.',
    description: 'Richmond is built almost entirely on Lulu Island and Sea Island, both formed by Fraser River sediment. Much of the city sits below sea level, protected by a system of dikes. It has one of the highest concentrations of residents of Chinese descent of any city outside Asia, with vibrant multicultural food scenes along No. 3 Road. Richmond\'s Golden Village is internationally famous for its authentic Chinese and pan-Asian restaurants — food critics fly in just to eat here.',
    funFact: 'Richmond is one of the few cities in the world where the majority of residents are of Chinese heritage (around 55%). The Golden Village on Alexandra Road has restaurants serving regional Chinese cuisines from Cantonese to Shanghainese — a culinary destination for food lovers worldwide.'
  },
  {
    id: 'yvr-airport',
    routeId: 'canada-line-waterfront-richmond',
    name: 'Vancouver International Airport (YVR)',
    lat: 49.1960,
    lng: -123.1795,
    triggerRadiusMeters: 500,
    category: 'landmark',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/YVR_Airport_Interior.jpg/640px-YVR_Airport_Interior.jpg',
    message: 'You\'ve arrived at YVR — consistently rated one of the world\'s best airports.',
    description: 'Vancouver International Airport has been rated the best airport in North America by Skytrax for multiple consecutive years. The stunning international terminal, designed by Stantec and completed in 1996, features a massive First Nations installation — "The Spirit of Haida Gwaii: The Jade Canoe" by Bill Reid greets international arrivals. The airport processed over 26 million passengers annually pre-COVID. The Sea Island location means runways extend almost to the water.',
    funFact: 'The Bill Reid sculpture "The Spirit of Haida Gwaii: The Jade Canoe" in YVR\'s international arrivals hall is one of the most photographed artworks in Canada. The original bronze version is on the Canadian $20 bill; the airport has the jade-coloured cast version — a perfect welcome to British Columbia.'
  },

  // ════════════════════════════════════════════
  // BROADWAY BUS: Commercial → UBC
  // ════════════════════════════════════════════

  {
    id: 'granville-island',
    routeId: 'broadway-commercial-ubc',
    name: 'Granville Island Public Market',
    lat: 49.2711,
    lng: -123.1340,
    triggerRadiusMeters: 600,
    category: 'attraction',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Granville_Island_Public_Market.jpg/640px-Granville_Island_Public_Market.jpg',
    message: 'Granville Island Market is just north of here — take the bus or walk down to it from Broadway.',
    description: 'Granville Island was an industrial sandbar with cement plants and factories until the 1970s, when the federal government transformed it into one of the most successful urban redevelopment projects in North America. The Public Market opened in 1979 and draws over 10 million visitors a year. It has 50+ vendors selling fresh produce, charcuterie, cheese, seafood, and baked goods under one roof. Emily Carr University of Art + Design is also on the island.',
    funFact: 'The Granville Island Public Market was rated the 3rd best food market in the world by National Geographic. The False Creek Ferries that connect it to downtown run on compressed natural gas and have carried millions of passengers since 1977.'
  },
  {
    id: 'kitsilano',
    routeId: 'broadway-commercial-ubc',
    name: 'Kitsilano — "Kits"',
    lat: 49.2684,
    lng: -123.1683,
    triggerRadiusMeters: 600,
    category: 'neighbourhood',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Kitsilano_Beach_Vancouver.jpg/640px-Kitsilano_Beach_Vancouver.jpg',
    message: 'You\'re in Kitsilano — Vancouver\'s famously active and beachy west-side neighbourhood.',
    description: 'Kitsilano is named after Chief Khahtsahlano of the Squamish Nation, whose village once sat at the mouth of Burrard Inlet nearby. In the 1960s and 1970s, Kits became Vancouver\'s hippie and counterculture hub, with communes and head shops on 4th Avenue. Today it\'s known for yoga studios, organic cafes, and Kits Pool — the longest public outdoor saltwater pool in Canada at 137 metres. Kits Beach park is a summer institution.',
    funFact: 'Kitsilano Pool, which opened in 1931, is 137 metres long and holds 2.7 million litres of heated seawater — it\'s the longest outdoor saltwater pool in Canada. On a clear day you can see the Lions Gate Bridge and North Shore mountains while swimming.'
  },
  {
    id: 'vanier-park',
    routeId: 'broadway-commercial-ubc',
    name: 'Vanier Park & Museum Row',
    lat: 49.2756,
    lng: -123.1445,
    triggerRadiusMeters: 700,
    category: 'attraction',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vanier_Park_Vancouver.jpg/640px-Vanier_Park_Vancouver.jpg',
    message: 'Vanier Park is north of here — it has the Vancouver Museum, H.R. MacMillan Space Centre, and Planetarium.',
    description: 'Vanier Park sits on the edge of English Bay at the mouth of False Creek and was the site of the Squamish Nation\'s Snauq village for centuries. The circular Vancouver Museum building (now the Museum of Vancouver) was designed by Gerald Hamilton in 1967 and resembles a Coast Salish woven basket or crab trap. The H.R. MacMillan Space Centre next door has a 65-seat digital planetarium. The annual Bard on the Beach Shakespeare festival runs here every summer under white tents.',
    funFact: 'Bard on the Beach, the Shakespeare festival at Vanier Park, has been running since 1990 and draws over 100,000 people each summer. The two tented stages offer stunning views of the North Shore mountains as a backdrop to the Elizabethan drama.'
  },
  {
    id: 'jericho-beach',
    routeId: 'broadway-commercial-ubc',
    name: 'Jericho Beach',
    lat: 49.2720,
    lng: -123.2038,
    triggerRadiusMeters: 800,
    category: 'scenic',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Jericho_Beach_Vancouver.jpg/640px-Jericho_Beach_Vancouver.jpg',
    message: 'Jericho Beach is north of here — Vancouver\'s beloved spot for kite surfing, hiking, and mountain views.',
    description: 'Jericho Beach is part of a string of beaches along English Bay\'s north shore. The beach park includes Jericho Sailing Centre, the Hastings Mill Store Museum (Vancouver\'s oldest building, moved here in 1930), and extensive walking trails through a second-growth forest. On clear days you can see Vancouver Island, the Gulf Islands, and on the best days Mount Baker (3,286m) in Washington State gleaming white on the horizon.',
    funFact: 'The Jericho Beach area was once a Canadian Forces base (HMCS Discovery and Jericho Beach Air Station). During WWII, flying boats patrolled the Pacific coast from the base. It was converted to a public park in 1973.'
  },
  {
    id: 'ubc-museum-of-anthropology',
    routeId: 'broadway-commercial-ubc',
    name: 'UBC Museum of Anthropology',
    lat: 49.2699,
    lng: -123.2590,
    triggerRadiusMeters: 600,
    category: 'attraction',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/UBC_Museum_of_Anthropology.jpg/640px-UBC_Museum_of_Anthropology.jpg',
    message: 'The UBC Museum of Anthropology is just ahead — one of the world\'s great collections of Northwest Coast First Nations art.',
    description: 'The Museum of Anthropology at UBC, designed by Arthur Erickson and opened in 1976, houses one of the world\'s finest collections of Northwest Coast Indigenous art. The Great Hall, with its soaring glass walls, displays massive totem poles and carved house posts against views of the ocean and mountains. Bill Reid\'s "The Raven and the First Men" (1980) — a 4.5-tonne yellow cedar carving — is the centrepiece. The museum sits on the traditional territory of the xʷməθkʷəy̓əm (Musqueam) people, who are active partners in its work.',
    funFact: 'Arthur Erickson designed the MOA to evoke the post-and-beam structure of traditional Coast Salish buildings. The concrete beams are designed to let light in similar to how old-growth cedar columns would filter dappled light in a ceremonial house.'
  },
  {
    id: 'ubc-rose-garden',
    routeId: 'broadway-commercial-ubc',
    name: 'UBC Rose Garden & Cliff View',
    lat: 49.2683,
    lng: -123.2564,
    triggerRadiusMeters: 500,
    category: 'scenic',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/UBC_Rose_Garden.jpg/640px-UBC_Rose_Garden.jpg',
    message: 'UBC Rose Garden is at the edge of campus — one of Vancouver\'s best viewpoints over the ocean.',
    description: 'The UBC Rose Garden sits at the northwest tip of the UBC endowment lands, perched above cliffs that drop to the Strait of Georgia. On a clear day the view encompasses the Gulf Islands, the mountains of Vancouver Island, and, on exceptional days, the distant snows of Washington and Oregon. The formal rose garden was established in 1959 and is at its best in June and July. Behind you is the entire academic campus of UBC, one of Canada\'s top universities founded in 1908.',
    funFact: 'UBC\'s endowment lands — the forested area surrounding the campus — are technically Crown land managed by UBC. They include Pacific Spirit Regional Park, a 763-hectare forest with 73 km of trails right inside Metro Vancouver.'
  },

  // ════════════════════════════════════════════
  // RICHMOND: Brighouse → Steveston
  // ════════════════════════════════════════════

  {
    id: 'richmond-night-market',
    routeId: 'richmond-city-centre-loop',
    name: 'Richmond Night Market',
    lat: 49.1900,
    lng: -123.1370,
    triggerRadiusMeters: 500,
    category: 'attraction',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Richmond_Night_Market.jpg/640px-Richmond_Night_Market.jpg',
    message: 'The Richmond Night Market is nearby — North America\'s largest night market, running summers near Bridgeport.',
    description: 'Running every summer since 2000, the Richmond Night Market is North America\'s largest outdoor night market, inspired by the famous night markets of Hong Kong and Taiwan. Over 100 vendors sell street foods from across Asia — bubble tea, stinky tofu, takoyaki, dumplings, tteokbokki — alongside carnival games, live entertainment, and hundreds of merchandise stalls. It draws over 1 million visitors annually and runs Thursday through Sunday evenings from May to October.',
    funFact: 'The Richmond Night Market started as a small community event in 2000 with just a handful of vendors. By 2019 it had grown to over 500 vendor stalls and 1,000+ food items, making it one of the most-visited tourist attractions in all of BC.'
  },
  {
    id: 'richmond-golden-village',
    routeId: 'richmond-city-centre-loop',
    name: 'Golden Village — Richmond Food District',
    lat: 49.1700,
    lng: -123.1370,
    triggerRadiusMeters: 500,
    category: 'neighbourhood',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Alexandra_Road_Richmond.jpg/640px-Alexandra_Road_Richmond.jpg',
    message: 'You\'re entering Golden Village — Richmond\'s famous pan-Asian food corridor along Alexandra Road.',
    description: 'The stretch of Alexandra Road known as Golden Village is internationally recognized as one of the best places to eat Chinese food outside of Asia. Dim sum restaurants, Hong Kong-style cafes, hot pot restaurants, and bakeries line the streets. The area has been transformed over 30 years by waves of immigration from Hong Kong, Taiwan, and mainland China. Critics from the New York Times and Guardian have written about it as a singular culinary destination.',
    funFact: 'Richmond has more restaurants per capita than San Francisco. The Golden Village alone has over 800 restaurants — from modest noodle shops to multi-floor banquet halls that seat 1,000+ guests for wedding banquets and Lunar New Year feasts.'
  },
  {
    id: 'steveston-village',
    routeId: 'richmond-city-centre-loop',
    name: 'Steveston Village & Historic Canneries',
    lat: 49.1250,
    lng: -123.1820,
    triggerRadiusMeters: 500,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Steveston_Fishing_Village.jpg/640px-Steveston_Fishing_Village.jpg',
    message: 'Steveston Village is at the mouth of the Fraser River — a fishing heritage site and one of BC\'s most charming villages.',
    description: 'Steveston was once the largest fishing village in Canada, with over 40 canneries lining the banks of the Fraser River. At its peak in the late 1800s, thousands of Japanese, Chinese, and Indigenous fishermen worked the salmon runs. The Gulf of Georgia Cannery National Historic Site preserves this history. Today Steveston\'s wooden dock, fresh fish market, and heritage buildings attract thousands of visitors, and it\'s the filming location for "Storybrooke" in the TV series Once Upon a Time.',
    funFact: 'Steveston\'s Gulf of Georgia Cannery processed millions of cans of Fraser River salmon annually in its heyday — at peak season in 1901, canneries here packed enough salmon to circle the Earth twice in cans stacked end to end. Today it\'s a Parks Canada museum.'
  }
];
