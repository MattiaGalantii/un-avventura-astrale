/* ============================================================
   HUB - dati aggiuntivi che NON stanno nei due trip-data.js
   (coordinate, waypoint stradali, documenti, voli, config).
   I trip-data.js delle due leg restano la fonte per tappe e giorni:
   questo file li "arricchisce" senza toccarli.

   GEO: chiave = nome tappa come scritto in trip-data.js (case-insensitive,
   spazi/punteggiatura ignorati). Valore = [lat, lon] oppure
   {ll:[lat,lon], approx:true, label:"..."} se la posizione e' stimata.
   Se una tappa non e' qui, viene cercata per inizio di stringa;
   se non si trova, resta fuori dalla mappa (ma non dalla timeline).
   ============================================================ */

const HUB_CONFIG = {
  tripYear: 2026,
  title: "Australia, due coste",
  kicker: "Coral Coast + Great Ocean Road · 30 ott – 21 nov 2026",
  legs: [
    { key:"west", name:"Coral Coast", short:"West", region:"Western Australia",
      dir:"Perth_coast", planner:"../Perth_coast/piano_viaggio_west_coast.html",
      km:2700, vehicle:"Van Mighty Duo", color:"#c65a37", colorDeep:"#a23f22" },
    { key:"east", name:"Great Ocean Road", short:"East", region:"South Australia · Victoria",
      dir:"Adelaide_Melbourne", planner:"../Adelaide_Melbourne/piano_viaggio_great_ocean_road.html",
      km:1900, vehicle:"Auto East Coast", color:"#0f8f84", colorDeep:"#155f5a" }
  ],
  /* partenza da casa e inizio del road trip, per il countdown */
  departure: { date:"2026-10-22", label:"volo da Amsterdam" },
  roadTripStart: { date:"2026-10-30", label:"giorno 1 a Perth" },
  /* chiavi localStorage dei due planner: se aperti nello stesso browser,
     l'hub legge le spese registrate li' */
  plannerStorage: { west:"coralcoast_v1", east:"gor_v2" }
};

/* Voli (dai PDF in Documenti/). Numeri di volo e posti stanno nei dati cifrati (privato.json). */
const HUB_FLIGHTS = [
  { when:"gio 22 ott", from:"AMS", to:"HKG", code:"", dep:"12:20", arr:"06:10 (+1)", note:"Cathay Pacific" },
  { when:"ven 23 ott", from:"HKG", to:"PER", code:"", dep:"15:00", arr:"22:40", note:"Arrivo a Perth: conferenza fino al 30/10" },
  { when:"mer 28 ott", from:"AMS", to:"HKG", code:"", dep:"12:30", arr:"07:30 (+1)", note:"Cathay Pacific · secondo volo" },
  { when:"gio 29 ott", from:"HKG", to:"PER", code:"", dep:"15:20", arr:"22:55", note:"Arrivo a Perth" },
  { when:"mar 10 nov", from:"PER", to:"ADL", code:"", dep:"12:00", arr:"17:20", note:"Jetstar · ~2 h 50 · Adelaide e' avanti di 2 h 30" },
  { when:"sab 21 nov", from:"MEL", to:"SIN", code:"", dep:"00:35", arr:"05:15", note:"Singapore Airlines · scalo lungo a Changi (~18 h 40)" },
  { when:"sab 21 nov", from:"SIN", to:"AMS", code:"", dep:"23:55", arr:"06:45 (+1)", note:"Atterraggio ad Amsterdam dom 22 nov" }
];

/* Documenti in ../Documenti/ collegati al giorno giusto (id del giorno in trip-data.js) */
const HUB_DOCS = [
  { file:"Polizza_viaggio.pdf", label:"Assicurazione viaggio · polizza (in olandese)", leg:"all", day:null, kind:"assicurazione" },
  { file:"Emergency_Card.pdf", label:"Assicurazione · tessera SOS 24/7", leg:"all", day:null, kind:"assicurazione" },
  { file:"Cathay_AMS_Perth.pdf", label:"Volo Cathay AMS → HKG → PER (22 ott)", leg:"west", day:null, date:"22 ott", kind:"volo" },
  { file:"Cathay_AMS_Perth_28ott.pdf", label:"Volo Cathay AMS → HKG → PER (28 ott)", leg:"west", day:null, date:"28 ott", kind:"volo" },
  { file:"Booking confirmation Campervan.pdf", label:"Conferma prenotazione campervan", leg:"west", day:"cervantes", kind:"noleggio" },
  { file:"Mighty_Duo_rental_agreement_ENGLISH.pdf", label:"Mighty Duo · contratto di noleggio", leg:"west", day:"cervantes", kind:"noleggio" },
  { file:"Mighty_Duo_Summary-of-Rental-Conditions.pdf", label:"Mighty Duo · riepilogo condizioni", leg:"west", day:"cervantes", kind:"noleggio" },
  { file:"Manta_Ray_tour.pdf", label:"Tour mante · Coral Bay", leg:"west", day:"coral-bay", kind:"tour" },
  { file:"Peron_4WD_tour_confirmation.pdf", label:"Tour 4WD Francois Peron", leg:"west", day:"monkey-mia", kind:"tour" },
  { file:"Sea_lions_excursion.pdf", label:"Escursione leoni marini · Jurien Bay", leg:"west", day:"ritorno-perth", kind:"tour" },
  { file:"Jetstar_Perth_Adelaide.pdf", label:"Volo Jetstar Perth → Adelaide", leg:"west", day:"volo-adelaide", kind:"volo" },
  { file:"car_confirmation- VroomVroomVroom.com.au.pdf", label:"Conferma auto · East Coast", leg:"east", day:"adelaide-arrivo", kind:"noleggio" },
  { file:"Park_Victoria_receipt.pdf", label:"Tidal River · ricevuta Parks Victoria", leg:"east", day:"wilsons-prom-transfer", kind:"alloggio" },
  { file:"PArks_Victoria_Terms-and-Conditions.pdf", label:"Parks Victoria · termini e condizioni", leg:"east", day:"wilsons-prom-transfer", kind:"alloggio" },
  { file:"Penguin_Parade.pdf", label:"Penguin Parade · Ultimate Adventure Tour (18/11, 19:30)", leg:"east", day:"phillip-island", kind:"tour" },
  { file:"Singapore_airlines_MEL_AMS.pdf", label:"Volo Singapore Airlines MEL → SIN → AMS", leg:"east", day:"melbourne-volo", kind:"volo" }
];

/* ------------------------------------------------------------
   COORDINATE DELLE TAPPE  [lat, lon]
   ------------------------------------------------------------ */
const HUB_GEO = {
  /* ---- Perth e dintorni ---- */
  "Malibu Apartments": {ll:[-31.9552, 115.8592], approx:true},
  "Check-out Ibis Styles Hotel": {ll:[-31.9587, 115.8716], approx:true},
  "Kings Park & Botanic Garden": [-31.9612, 115.8402],
  "Elizabeth Quay": [-31.9578, 115.8565],
  "London Court": [-31.9546, 115.8598],
  "Cena zona Northbridge": [-31.9478, 115.8592],
  "Perth Ferry Terminal (Elizabeth Quay)": [-31.9587, 115.8572],
  "Rottnest Island: Ferry terminal": [-31.9952, 115.5432],
  "Rottnest Island: adventure": {ll:[-32.0040, 115.5150], label:"Rottnest · giro in bici"},
  "Rottnest Ferry Terminal": [-31.9952, 115.5432],
  "Fremantle Ferry Terminal": [-32.0553, 115.7432],
  "Ritiro Van": {ll:[-31.9452, 115.9418], label:"Mighty · 2 Redcliffe Rd"},
  "Deposito van": {ll:[-31.9452, 115.9418], label:"Mighty · riconsegna van"},
  "Swan Valley": [-31.8420, 115.9980],
  "Sunlit Minimal": {ll:[-31.9520, 115.8620], approx:true},
  "Perth Airport (PER)": [-31.9403, 115.9669],
  "Volo Perth -> Adelaide": {ll:[-33.30, 127.00], label:"In volo", fly:true},
  "Adelaide Airport (ADL)": [-34.9450, 138.5310],

  /* ---- Cervantes / Pinnacles ---- */
  "Cervantes": [-30.5000, 115.0660],
  "Lake Thetis": [-30.5060, 115.0770],
  "Hangover Bay": [-30.5590, 115.0730],
  "Pinnacles Desert": [-30.6020, 115.1560],
  "RAC Cervantes - Holiday Park": [-30.5030, 115.0670],

  /* ---- Geraldton / Kalbarri ---- */
  "Geraldton": [-28.7774, 114.6146],
  "Hutt Lagoon": [-28.1500, 114.2550],
  "Kalbarri Coastal Cliffs": {ll:[-27.7950, 114.1250], label:"Kalbarri · scogliere (Red Bluff → Natural Bridge)"},
  "Tasman Holiday Park": {ll:[-27.7100, 114.1640], label:"Tasman Holiday Parks · Kalbarri"},
  "Nature's Window": [-27.5667, 114.4483],
  "Z-Bend": [-27.6430, 114.4500],
  "Kalbarri Skywalk": [-27.5560, 114.4360],

  /* ---- Carnarvon / Coral Bay ---- */
  "Carnarvon": [-24.8830, 113.6600],
  "Peoples Park - Coral Bay": [-23.1440, 113.7720],
  "Manta Ray Tour": [-23.1430, 113.7700],
  "Bill's Bay": [-23.1400, 113.7680],

  /* ---- Shark Bay ---- */
  "Shell Beach": [-26.2240, 114.1160],
  "Eagle Bluff": [-26.0700, 113.6350],
  "Little Lagoon": [-25.9000, 113.5600],
  "Denham": [-25.9280, 113.5330],
  "Tasman holiday park - Denham": [-25.9260, 113.5380],
  "Pick-up 4x4 tour": {ll:[-25.9270, 113.5350], label:"Shoreline eco tours · pick-up"},
  "RAC Monkey Mia Dolphin Resort": [-25.7940, 113.7180],
  "Monkey Mia Conservation Park": [-25.7930, 113.7160],
  "Ampol Overlander Roadhouse": [-26.4020, 114.4640],
  "Northampton": [-28.3500, 114.6330],
  "Leaning Trees": [-28.9330, 114.7500],
  "Lesueur NP": [-30.1800, 115.1950],
  "Jurien Bay": [-30.3060, 115.0410],
  "Jurien Bay Tourist Park": [-30.3090, 115.0400],
  "Escursione Sea Lions": {ll:[-30.2960, 115.0350], label:"Jurien Bay Boat Harbour"},

  /* ---- Adelaide ---- */
  "Adelaide Airport": [-34.9450, 138.5310],
  "Ritiro auto": {ll:[-34.9330, 138.5470], label:"East Coast Car Rentals · Brooklyn Park"},
  "Check-in hotel: BreakFree Adelaide": [-34.9232, 138.5925],
  "BreakFree Adelaide": [-34.9232, 138.5925],
  "Giro nel CBD di Adelaide": [-34.9285, 138.6007],
  "Riverbank & Adelaide Oval": [-34.9156, 138.5961],
  "Hahndorf": [-35.0300, 138.8080],
  "Naracoorte": {ll:[-37.0380, 140.8000], label:"Naracoorte Caves"},
  "Coonawarra": [-37.2900, 140.8400],

  /* ---- Grampians ---- */
  "Grampians View Cottages And Units": {ll:[-37.1180, 142.5230], approx:true},
  "Grampians View Cottages and Units": {ll:[-37.1180, 142.5230], approx:true},
  "Wonderland car park": [-37.1510, 142.5070],
  "Zumsteins Picnic Area": [-37.0600, 142.3800],
  "Silverband Falls": [-37.1800, 142.5000],
  "Reeds Lookout & The Balconies": [-37.1330, 142.4400],
  "Boroka Lookout": [-37.0960, 142.4750],
  "Halls Gap": [-37.1381, 142.5195],
  "Halls Gap fuel station": {ll:[-37.1400, 142.5180], label:"Ampol Halls Gap"},

  /* ---- Great Ocean Road / Otway ---- */
  "Tower Hill": [-38.3200, 142.3600],
  "Great Ocean Road": {ll:[-38.6650, 143.1040], label:"12 Apostoli · Great Ocean Road"},
  "Anglesea - casa Lamb": {ll:[-38.4070, 144.1850], approx:true, label:"Anglesea · casa della mamma di Alex"},
  "Mattina chill ad Anglesea": [-38.4100, 144.1900],
  "Lake Elizabeth": [-38.5490, 143.7300],
  "Triplet Falls": [-38.6720, 143.4870],
  "Hopetoun Falls e Redwood Otways": [-38.6580, 143.5700],
  "Kennett River": [-38.6670, 143.8570],

  /* ---- Mornington ---- */
  "Queenscliff": [-38.2680, 144.6620],
  "Sorrento": [-38.3390, 144.7420],
  "Peninsula Hot Springs": [-38.4270, 144.8590],
  "Cena a Sorrento": [-38.3400, 144.7400],
  "Peninsula Beach Motel": {ll:[-38.3600, 144.8700], approx:true, label:"Peninsula Beach Motel · Capel Sound"},

  /* ---- Wilsons Prom ---- */
  "Foster o Meeniyan": {ll:[-38.6520, 146.2000], label:"Foster"},
  "Tidal River - Parks Victoria - check-in": [-39.0300, 146.3210],
  "Tidal River - Parks Victoria": [-39.0300, 146.3210],
  "Tidal River": [-39.0300, 146.3210],
  "Squeaky Beach": [-39.0140, 146.3040],
  "Whisky Bay / Picnic Bay": [-39.0040, 146.2950],
  "Mount Oberon": [-39.0500, 146.3400],
  "Tidal River & Norman Beach": [-39.0350, 146.3130],
  "Hike a scelta": {ll:[-39.0450, 146.3500], label:"Mt Oberon / Lilly Pilly / Sealers Cove"},
  "Nuoto/relax a Tidal River": [-39.0320, 146.3180],
  "Big Drift (dune)": [-38.9200, 146.2650],
  "Squeaky Beach / Whisky Bay": [-39.0090, 146.3000],

  /* ---- Phillip Island ---- */
  "Foster / Leongatha / Meeniyan etc..": {ll:[-38.4750, 145.9470], label:"Leongatha"},
  "San Remo": [-38.5200, 145.3700],
  "Pyramid rock": [-38.5100, 145.2100],
  "The Nobbies & Seal Rocks": [-38.5130, 145.1240],
  "Check in The Point Villa": {ll:[-38.4530, 145.2380], approx:true, label:"The Point Villa · Phillip Island"},
  "The Point Villa": {ll:[-38.4530, 145.2380], approx:true},
  "Penguin Parade": [-38.5090, 145.1500],

  /* ---- Melbourne ---- */
  "Healesville Sanctuary": [-37.6820, 145.5300],
  "Riconsegna auto": {ll:[-37.6980, 144.8680], label:"East Coast · 2 Tarmac Dr, Tullamarine"},
  "Check-in hotel": {ll:[-37.8155, 144.9630], label:"Causeway 353"},
  "Causeway 353 hotel": [-37.8155, 144.9630],
  "St. Kilda": [-37.8635, 144.9720],
  "Laneways & rooftop bar": {ll:[-37.8167, 144.9690], label:"Hosier Lane"},
  "Giro al CBD": [-37.8150, 144.9660],
  "Queen Victoria Market": [-37.8076, 144.9568],
  "Fitzroy e Collingwood": [-37.7990, 144.9780],
  "Royal Botanic Gardens / Shrine of Remembrance": [-37.8305, 144.9735],
  "Skydeck?": {ll:[-37.8215, 144.9645], label:"Eureka Skydeck"},
  "Ritiro bagagli in hotel": [-37.8155, 144.9630],
  "Melbourne Airport": [-37.6690, 144.8410]
};

/* ------------------------------------------------------------
   WAYPOINT STRADALI: punti intermedi per far seguire alla linea
   la strada vera invece del filo dritto. Chiave = id giorno,
   valore = { "indice tappa di arrivo": [[lat,lon],...] }.
   L'indice conta la sequenza start(0), stops(1..n), end(n+1).
   ------------------------------------------------------------ */
const HUB_VIA = {
  "cervantes": { 2: [[-31.5000, 115.5900], [-31.0200, 115.3300], [-30.7500, 115.2000]] },
  "kalbarri-transfer": { 1: [[-30.2000, 115.0300], [-29.2500, 114.9300]], 2: [[-28.3500, 114.6330], [-28.1900, 114.2500]], 3: [[-27.8200, 114.1500]] },
  "kalbarri-np": { 1: [[-27.7000, 114.3500]], 4: [[-27.6500, 114.3500]] },
  "coral-bay-transfer": { 1: [[-27.9500, 114.6300], [-26.8200, 114.6200], [-26.4020, 114.4640], [-25.7300, 114.2800]], 2: [[-23.8300, 114.0200]] },
  "shark-bay": { 1: [[-23.8300, 114.0200], [-24.8830, 113.6600], [-25.7300, 114.2800], [-26.4020, 114.4640], [-26.4200, 114.2000]], 2: [[-26.1000, 113.8800]] },
  "monkey-mia": { 2: [[-25.8600, 113.6000]] },
  "jurien-bay": { 2: [[-25.8600, 113.6000], [-26.1000, 113.8800], [-26.4200, 114.2000]], 3: [[-26.8200, 114.6200], [-27.9500, 114.6300]], 4: [[-28.7774, 114.6146]], 5: [[-29.2500, 114.9300], [-30.0500, 115.0500]] },
  "ritorno-perth": { 2: [[-30.5000, 115.0660], [-31.0200, 115.3300], [-31.5000, 115.5900], [-31.7800, 115.9300]] },
  "adelaide-horsham": { 2: [[-35.1200, 139.2700], [-35.2500, 139.4500], [-36.1000, 140.3500]], 4: [[-37.3750, 140.8400], [-37.5800, 141.4000], [-37.7400, 142.0200], [-37.6500, 142.3400]] },
  "grampians": { 2: [[-37.1381, 142.5195], [-37.0400, 142.4600]] },
  "gor-anglesea": { 1: [[-37.6500, 142.3400], [-37.8700, 142.2900], [-38.3800, 142.4800]], 2: [[-38.3800, 142.4800], [-38.5500, 142.8500], [-38.6200, 142.9900]], 3: [[-38.7560, 143.6720], [-38.7100, 143.8300], [-38.5400, 143.9780], [-38.4620, 144.1030]] },
  "otway": { 2: [[-38.4000, 143.8800], [-38.5200, 143.7100]], 4: [[-38.6600, 143.5600]], 5: [[-38.7560, 143.6720]], 6: [[-38.5400, 143.9780], [-38.4620, 144.1030]] },
  "mornington": { 1: [[-38.3300, 144.3200], [-38.2700, 144.5200]] },
  "wilsons-prom-transfer": { 1: [[-38.1000, 145.2800], [-38.2000, 145.4900], [-38.4750, 145.9470], [-38.5830, 145.9860]], 2: [[-38.8100, 146.2000]] },
  "phillip-island": { 1: [[-38.8100, 146.2000], [-38.6520, 146.2000], [-38.5830, 145.9860]], 2: [[-38.4300, 145.8200], [-38.6100, 145.5900]] },
  "melbourne-arrivo": { 1: [[-38.1000, 145.2800], [-37.8200, 145.3500]], 2: [[-37.7000, 145.2000], [-37.6900, 144.9700]] }
};

/* Etichette del poster (insets): nome breve, posizione, ancoraggio del testo */
const HUB_POSTER_LABELS = {
  west: [
    {ll:[-31.9535,115.8605], text:"Perth", anchor:"start", dx:24, dy:5},
    {ll:[-31.9952,115.5432], text:"Rottnest", anchor:"end", dx:-14, dy:18},
    {ll:[-30.6020,115.1560], text:"Pinnacles", anchor:"start", dx:20, dy:8},
    {ll:[-30.3060,115.0410], text:"Jurien Bay", anchor:"end", dx:-20, dy:0},
    {ll:[-28.7774,114.6146], text:"Geraldton", anchor:"start", dx:12, dy:4},
    {ll:[-27.7100,114.1640], text:"Kalbarri", anchor:"end", dx:-22, dy:4},
    {ll:[-27.5667,114.4483], text:"Kalbarri NP", anchor:"start", dx:12, dy:-4},
    {ll:[-25.9280,113.5330], text:"Denham · Shark Bay", anchor:"middle", dx:-4, dy:34},
    {ll:[-25.7940,113.7180], text:"Monkey Mia", anchor:"start", dx:20, dy:-4},
    {ll:[-24.8830,113.6600], text:"Carnarvon", anchor:"start", dx:12, dy:4},
    {ll:[-23.1440,113.7720], text:"Coral Bay", anchor:"start", dx:24, dy:5}
  ],
  east: [
    {ll:[-34.9285,138.6007], text:"Adelaide", anchor:"start", dx:20, dy:-4},
    {ll:[-35.0300,138.8080], text:"Hahndorf", anchor:"start", dx:12, dy:14},
    {ll:[-37.0380,140.8000], text:"Naracoorte", anchor:"end", dx:-12, dy:-2},
    {ll:[-37.2900,140.8400], text:"Coonawarra", anchor:"end", dx:-12, dy:14},
    {ll:[-37.1381,142.5195], text:"Grampians", anchor:"start", dx:22, dy:-2},
    {ll:[-38.3200,142.3600], text:"Tower Hill", anchor:"end", dx:-12, dy:4},
    {ll:[-38.6650,143.1040], text:"12 Apostoli", anchor:"end", dx:-6, dy:20},
    {ll:[-38.6720,143.4870], text:"Otway", anchor:"start", dx:6, dy:22},
    {ll:[-38.4070,144.1850], text:"Anglesea", anchor:"end", dx:-18, dy:-12},
    {ll:[-38.3600,144.8700], text:"Sorrento · Hot Springs", anchor:"middle", dx:0, dy:34},
    {ll:[-37.8155,144.9630], text:"Melbourne", anchor:"start", dx:26, dy:-2},
    {ll:[-38.4530,145.2380], text:"Phillip Island", anchor:"start", dx:22, dy:6},
    {ll:[-39.0300,146.3210], text:"Wilsons Prom", anchor:"end", dx:-20, dy:4}
  ]
};
