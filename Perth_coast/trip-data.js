/* ============================================================
   DATI DEL VIAGGIO - modifica qui per cambiare il piano.

   Ogni giorno ha:
   id     -> chiave stabile per note salvate (non cambiarla dopo)
   route  -> luoghi fisici e spostamenti
   daily  -> notte, escursioni, cibo e note

   route = { start, stops:[...], end }
     start/end : { place, label, time, note, icon }
     stop      : { place, type, note, time, segmentFromPrevious }
       type: planned | optional | quick | fuel | lunch | viewpoint
       icon (facoltativo): sovrascrive l'icona del type
       map:false (facoltativo): non trasformare il nome in link Google Maps
         (di default ogni luogo e cliccabile e cerca "<nome>, Australia")
     segmentFromPrevious = il CONNETTORE che porta a quella tappa:
       { mode, distance, duration, notes:[...] }
       mode: drive (default) | ferry | walk | bike | fly | bus | tram |
             public transport
             -> cambia la trama della linea e l'icona della targhetta

   Il giorno che corrisponde a OGGI (data letta da "Giorno N - gio 12/11")
   si apre da solo e viene evidenziato. Anno preso dall'orologio del PC:
   per forzarlo aggiungi tripYear:2026 in TRIP_UI qui sotto.

   daily = { night, excursions, foodFuel, notes, titles }
     titles (facoltativo): sovrascrive i titoli dei 4 box,
       es. titles:{ excursions:"Da vedere", foodFuel:"Cibo e caffe" }
   ============================================================ */

// Testi globali dell'interfaccia.
const TRIP_UI = {
  tripYear:2026,
  routeToggleOpen:"Nascondi percorso:",
  routeToggleClosed:"Mostra percorso:",
  routeStopSingular:"tappa",
  routeStopPlural:"tappe",
  dailyTitles:{
    night:"Notte",
    excursions:"Escursioni previste",
    foodFuel:"Cibo e rifornimenti",
    notes:"Note libere / deviazioni"
  }
};

const TRIP = [
  {
    id:"intro",
    intro:true, day:"Info di base", title:"Prima di partire - checklist",
    chips:["leggimi","van","da comprare","sole e mosche"],
    boxes:[
      {h:"Il van in pratica", cls:"prac", items:[
        {t:"Mighty Duo - 9 giorni", s:"Ritiro dom 1/11 h 9:00, riconsegna lun 9/11 h 14:30. Sempre a 2 Redcliffe Road, Redcliffe WA 6014."},
        {t:"La filiale chiude alle 15:30", s:"Il contratto chiede di arrivare entro le 15:00: le 14:30 sono gia il limite, non c'e margine."},
        {t:"Gia a bordo: non ricomprarlo", s:"Cucina completa (pentole, posate, bollitore, tostapane), lenzuola, cuscini e asciugamani, stendino e mollette, secchio, tubo, paletta e scopetta, estintore. Pannello solare e 240V."},
        {t:"Il tavolo si sposta fuori", s:"Il tavolo da pranzo del van diventa tavolino da esterno: il tavolino da campeggio non serve."},
        {t:"Cauzione: $5.000 addebitati davvero", s:"Con 'The Low Road' i 5.000 vengono prelevati dalla carta, non bloccati. Visa o Mastercard intestata a chi firma, che deve essere presente al banco. Rimborso fino a 14 giorni lavorativi dopo la riconsegna."},
        {t:"Foto a tutto al ritiro", s:"Carrozzeria, interni, livello del carburante e contachilometri. Controlla che ogni graffio sia sul Vehicle Condition Report."}
      ]},
      {h:"Da fare prima di partire", cls:"must", items:[
        {t:"1. Patente internazionale (IDP)", s:"La patente e registrata come italiana e il contratto vuole patente in inglese o traduzione accreditata. Senza, il van non lo consegnano."},
        {t:"2. Poi il check-in online", s:"Si fa dopo aver ottenuto l'IDP."},
        {t:"3. Al check-in: assicurazione parabrezza e gomme", s:"$15 al giorno, ~$135 in totale. Con 'Low Road' gomme e parabrezza NON sono coperti; il pacchetto copre 1 parabrezza o 3 riparazioni di scheggiature e 2 gomme."},
        {t:"Parks WA Holiday Pass", s:"Copre Nambung (Pinnacles), Kalbarri e Francois Peron. Da comprare online o al primo parco."},
        {t:"Monkey Mia: biglietto a parte", s:"Il Conservation Park ha un ingresso suo, non e incluso nel pass."},
        {t:"Assicurazione viaggio: FATTA", s:"Il contratto declina ogni responsabilita sugli infortuni, quindi era il pezzo importante."},
        {t:"Carta con $5.000 disponibili", s:"Verifica il plafond prima di partire: l'addebito e immediato."}
      ]},
      {h:"Da comprare a Perth", cls:"extra", items:[
        {t:"Chimico per il WC", s:"Il van ha la toilette ma il prodotto non e incluso. Supercheap Auto, BCF o Kmart. Con l'idea di usarla il meno possibile ne basta poco."},
        {t:"Retina da testa antimosche", s:"A Kalbarri e ai Pinnacles le mosche del bush sono una tortura vera, non un dettaglio. Costa pochi dollari."},
        {t:"2 frontalini", s:"Nei caravan park i bagni sono lontani e non sempre illuminati."},
        {t:"Ciabatte da doccia", s:"Docce condivise tutti i giorni."},
        {t:"Tanica acqua da 10 L", s:"Scorta oltre al serbatoio del van, per le tratte lunghe e le gole."},
        {t:"Sacchi spazzatura e tappetino da porta", s:"La sabbia entra ovunque: il tappetino salva la pulizia alla riconsegna."},
        {t:"Nastro telato e qualche moschettone", s:"Riparazioni al volo e roba appesa dentro al van."},
        {t:"Opzionale: 2 sedie pieghevoli", s:"Kmart o BIG W, ~$10 in due. Tutti i campeggi del viaggio hanno camp kitchen e tavoli, quindi servono solo se volete il tramonto seduti fuori dal van a Coral Bay o Monkey Mia."},
        {t:"Consumabili, non portarli dall'Europa", s:"Solari, repellente, detersivi: tutto a Perth, costa uguale e non pesa in valigia."}
      ]},
      {h:"Cura personale", cls:"sleep", items:[
        {t:"Solare SPF 50+, in quantita seria", s:"L'UV in WA a novembre arriva a 12-13. Un tubo grande, non quello da borsetta."},
        {t:"Solare reef-safe separato", s:"Solo per lo snorkeling a Coral Bay e Rottnest: il reef non gradisce le creme normali."},
        {t:"Stick labbra con filtro", s:"Sole, vento e sale: le labbra sono la prima cosa che si spacca."},
        {t:"Repellente con picaridin o DEET", s:"Zanzare a Kalbarri e Shark Bay. Gli oli essenziali qui non bastano."},
        {t:"Doposole o aloe", s:"Per la sera, dopo le giornate in acqua."},
        {t:"Sali reidratanti", s:"Bustine elettrolitiche: con 35 C nelle gole l'acqua da sola non basta."},
        {t:"Antistaminico", s:"Punture, contatto con piante, reazioni varie."},
        {t:"Cerotti per vesciche", s:"Le gole di Kalbarri e Mount Oberon si fanno a piedi."},
        {t:"Salviette umidificate", s:"L'acqua nel van e razionata: servono piu di quanto pensi."},
        {t:"Shampoo secco", s:"Per i giorni senza doccia comoda."},
        {t:"Collirio", s:"La polvere rossa finisce negli occhi, soprattutto col vento."},
        {t:"Crema barriera anti-irritazione", s:"Costume bagnato addosso tutto il giorno + sale = irritazioni."},
        {t:"Kit medico base", s:"Cerotti, disinfettante, antidolorifico, qualcosa per lo stomaco."}
      ]},
      {h:"Abbigliamento tecnico", cls:"extra", items:[
        {t:"Rash vest a maniche lunghe o muta anti-medusa", s:"A Ningaloo la stagione Irukandji va da novembre ad aprile e voi siete a Coral Bay il 5/11. Sono rare li, ma il pezzo serve comunque contro l'UV in acqua. Si compra a Perth (City Beach, Rip Curl, BCF, Anaconda, Kmart) o da Decathlon prima di partire."},
        {t:"Scarpette da scoglio", s:"Bill's Bay e corallo: a piedi nudi ci si taglia."},
        {t:"Scarpe chiuse da hike", s:"Per le gole di Kalbarri. Non sandali: a novembre i serpenti sono attivi."},
        {t:"Cappello a falda larga + bandana", s:"La falda larga copre collo e orecchie, il cappellino da baseball no."},
        {t:"Camicia UPF a maniche lunghe", s:"Piu comoda della crema per stare fuori tutto il giorno."},
        {t:"Pile e antivento leggero", s:"All'alba nelle gole e sulla costa ventosa fa piu fresco di quanto ti aspetti."},
        {t:"2 costumi", s:"Uno asciuga mentre usi l'altro: con lo snorkeling quotidiano serve davvero."},
        {t:"Calze da trekking", s:"Quelle tecniche, non di cotone: meno vesciche."},
        {t:"Occhiali da sole polarizzati", s:"Sull'acqua e sull'asfalto bianco fanno la differenza anche alla guida."}
      ]},
      {h:"Spesa, benzina e lavatrici", cls:"prac", items:[
        {t:"Tre spese grosse, non dieci soste", s:"1/11 Perth (primi 3 giorni) · 2/11 Geraldton (fino a Carnarvon) · 4/11 Carnarvon (4 giorni: Coral Bay + Shark Bay)."},
        {t:"Dopo Carnarvon non c'e piu niente", s:"Denham ha un IGA piccolo, Coral Bay un minimarket carissimo, Monkey Mia niente. Jurien Bay ha un IGA per l'ultima sera."},
        {t:"Benzina: mai ripartire sotto meta serbatoio", s:"Perth, Geraldton, Carnarvon, Overlander Roadhouse, Northampton. Diesel, serbatoio 80 L."},
        {t:"Lavatrice 1: gio 5/11 a Coral Bay", s:"La mattina, giornata stanziale al Peoples Park. E il miglior punto di asciugatura di tutto il viaggio."},
        {t:"A mano: mar 3/11 a Kalbarri", s:"La sera, seconda notte al Tasman: intimo, calze, costumi, un paio di magliette."},
        {t:"A mano opzionale: sab 7/11 a Monkey Mia", s:"Ma NON stendere niente nel van andando a Francois Peron: pista sabbiosa e polvere rossa."}
      ]},
      {h:"Le regole per non pagare penali", cls:"must", items:[
        {t:"Carburante: allo stesso livello del ritiro", s:"Non pieno: uguale a com'era. Se manca, lo fanno pagare $5,00 al litro (il diesel in WA sta sui $2). Fotografa la lancetta al ritiro."},
        {t:"Serbatoi vuoti o $299 ciascuno", s:"WC e acque grigie devono tornare vuoti. Non avete il Drop & Go, quindi svuotate la sera prima a Jurien Bay e usate i bagni del campeggio l'ultimo giorno."},
        {t:"Le acque grigie si riempiono comunque", s:"Anche senza usare la toilette: lavandino e doccia finiscono li. Quello e il serbatoio da non dimenticare al dump point."},
        {t:"Sterrati: massimo 12 km", s:"Il 2WD ha il divieto su sterrati piu lunghi di 12 km e su TUTTE le spiagge. Francois Peron si fa col tour (giusto cosi); i Blowholes a nord di Carnarvon sono da verificare prima di imboccarli."},
        {t:"Hutt Lagoon si fa su asfalto", s:"Solo il parcheggio del lookout e sterrato. Colore migliore tra le 10:00 e le 14:00, che coincide col vostro passaggio."},
        {t:"Il van va reso pulito", s:"Fino a $299 se lo riportate in stato indecente. Niente fango, niente sabbia dentro."},
        {t:"250 km al giorno e il consiglio del noleggio", s:"Il 4/11 e l'8/11 ne fate ~700 ciascuno. Non e vietato, ma spiega perche quelle due giornate sono cosi dure."}
      ]}
    ]
  },

// Giorno 1 - Perth

  {
    id:"perth-city",
    day:"Giorno 1 - ven 30/10", title:"Perth, la citta",
    chips:["stanziale","a piedi","zero km in van"],
    route:{
      start:{place:"Malibu Apartments", label:"Partenza", time:"Mattina", note:"Colazione con calma: primo giorno vero dopo il volo."},
      stops:[
        {place:"Check-out Ibis Styles Hotel", type:"quick", note:"Hotel della conferenza: check-out da fare la mattina. Bagagli portati al Malibu la sera prima.", segmentFromPrevious:{mode:"bus", duration:"~30 min", notes:["Andata e ritorno solo per il check-out"]}},
        {place:"To-Do", map:false, type:"planned", note:"Vista su citta e Swan River, giardino botanico gratuito.", segmentFromPrevious:{mode:"walk", duration:"~25 min", notes:["Salita leggera","In alternativa bus gratuito CAT"]}},
        {place:"To-Do", map:false, type:"planned", note:"Lungofiume, ponte pedonale, pausa caffe.", segmentFromPrevious:{mode:"walk", duration:"~30 min", notes:["Discesa panoramica da Kings Park"]}},
        {place:"To-Do", map:false, type:"optional", note:"Vicoli, murales e la galleria in stile Tudor.", segmentFromPrevious:{mode:"walk", duration:"~10 min"}},
        {place:"Cena zona Northbridge", type:"optional", note:"", segmentFromPrevious:{mode:"walk", duration:"~10 min"}}
      ],
      end:{place:"Malibu Apartments", label:"Cena / notte", time:"Sera", note:"Quartiere dei ristoranti, poi a nanna presto.", segmentFromPrevious:{mode:"walk", duration:"~15 min", notes:["Attraversa Yagan Square"]}}
    },
    daily:{
      titles:{excursions:"Da vedere", foodFuel:"Cibo e caffe"},
      night:{title:"Hotel a Perth: Malibu Apartments", text:"Zona CBD / Elizabeth Quay: comoda a piedi per il ferry di domani.", meta:["hotel","2 notti: 30 e 31/10"]},
      excursions:[
        {t:"Kings Park & Botanic Garden", s:"Uno dei parchi urbani piu grandi al mondo, skyline compreso."},
        {t:"Elizabeth Quay", s:"Il salotto sul fiume: ponte, moli e street food."},
        {t:"Passeggiata sullo Swan River", s:"Foreshore verso Matagarup Bridge se avanza energia."},
        {t:"London Court", s:"Galleria in finto Tudor tra Hay St e St Georges Tce."},
        {t:"Swan Valley", s:"Degustazione di vini e cena."},
        {t:"Incontri con aborigeni", s:"Giorno o sera."}
      ],
      foodFuel:[
        {t:"Colazione specialty coffee", s:"Perth se la gioca con Melbourne piu di quanto ammettano.", meta:["food"]},
        {t:"Cena a Northbridge", s:"Asiatico, pub o fine dining: c'e tutto.", meta:["food"]}
      ],
      notes:[
        {t:"Ferry Rottnest PRENOTATO", s:"Domani: Elizabeth Quay 8:30 -> Rottnest 10:00, ritorno Rottnest 18:00 -> Fremantle 18:30."},
        {t:"Check-out Ibis", s:"Portare i bagagli al Malibu stasera, domattina solo il check-out."},
        {t:"Cose pratiche", s:"SIM australiana, contanti, spesa leggera per domani."}
      ]
    }
  },

// Giorno 2 - Rottnest Island

  {
    id:"rottnest",
    day:"Giorno 2 - sab 31/10", title:"Rottnest Island: quokka!",
    chips:["ferry + bici","quokka","snorkeling","tutto prenotato"],
    route:{
      start:{place:"Malibu Apartments", label:"Partenza", time:"~7:45", note:"Colazione veloce: al terminal per le 8:00, il ferry parte alle 8:30."},
      stops:[
        {place:"Perth Ferry Terminal (Elizabeth Quay)", type:"planned", time:"8:00", note:"Imbarco ferry SeaLink delle 8:30. Biglietti gia comprati.", segmentFromPrevious:{mode:"walk", duration:"~15 min", notes:["Check-in 30 min prima della partenza"]}},
        {place:"Rottnest Island: Ferry terminal", type:"planned", time:"10:00", note:"Ritiro bici prenotate: Pedal & Flipper, al settlement di Thomson Bay.", segmentFromPrevious:{mode:"ferry", duration:"~1:30 h", notes:["Biglietti SeaLink OK","Bici prenotate OK"]}},
        {place:"Rottnest Island: adventure", type:"planned", note:"Giro in bici sull'isola in cerca delle spiaggie piu'belle", segmentFromPrevious:{mode:"bike", duration:"~7 h", notes:["Tutto il giorno sull'isola"]}},
        {place:"Rottnest Ferry Terminal", type:"planned", time:"17:40", note:"Riconsegna bici e rientro al molo con anticipo.", segmentFromPrevious:{mode:"bike", notes:["Ferry di ritorno alle 18:00","Non perderlo: e l'ultimo utile"]}},
        {place:"Fremantle Ferry Terminal", type:"planned", time:"18:30", note:"Sbarco a Victoria Quay. Cena in zona Fremantle (i Markets a quest'ora sono chiusi).", segmentFromPrevious:{mode:"ferry", duration:"~30 min"}},
      ],
      end:{place:"Malibu Apartments", label:"Rientro / notte", time:"Sera", note:"Domani si ritira il van!", segmentFromPrevious:{mode:"public transport", duration:"~30 min", notes:["Fremantle Line: Fremantle Stn -> Perth Underground","Poi 10 min a piedi"]}}
    },
    daily:{
      titles:{excursions:"Da vedere sull'isola", foodFuel:"Cibo e acqua"},
      night:{title:"Stesso hotel a Perth", text:"Seconda e ultima notte al Malibu.", meta:["hotel"]},
      excursions:[
        {t:"Quokka intorno al settlement", s:"Selfie si, toccarli o dargli cibo no: multe salate."},
        {t:"The Basin + Pinky Beach", s:"Le due baie piu belle vicino al molo, con il Bathurst Lighthouse in mezzo."},
        {t:"Giro in bici", s:"L'isola e senza auto: bici o bus Island Explorer."},
        {t:"Laghi salati dell'interno", s:"Rosa e specchianti lungo la pedalata verso il faro."}
      ],
      foodFuel:[
        {t:"Porta acqua e snack", s:"Sull'isola solo il general store e la bakery, cari.", meta:["water","food"]},
        {t:"Pranzo pic-nic o bakery", s:"Al settlement di Thomson Bay."}
      ],
      notes:[
        {t:"Sole forte, poca ombra", s:"Crema, cappello e maglietta da sole anche in bici."},
        {t:"Maschera e boccaglio", s:"Portali da Perth se li avete gia: il noleggio in loco costa."},
        {t:"Rientro a Fremantle, non a Perth", s:"Il ferry della sera sbarca a Victoria Quay: da li treno o Uber fino al Malibu."}
      ]
    }
  },

// Giorno 3 - verso cervantes

  {
    id:"cervantes",
    day:"Giorno 3 - dom 1/11", title:"Viaggio verso Cervantes",
    chips:["Perth -> Cervantes","~3:20 h","Indian Ocean Dr"],
    route:{
      start:{place:"Malibu Apartments", label:"Partenza", time:"Mattina", note:"Sveglia presto, colazione veloce. Ritiro van 9:00, spesa grossa e pieno."},
      stops:[
        {place:"Ritiro Van", type:"planned", note:"Ritiro del campervan self-contained e acquisto provviste.", segmentFromPrevious:{mode:"bus", duration:"~1 h", notes:["Comprare cibo ed equipaggiamento"]}},
        {place: "Cervantes", type:"planned", note:"Arrivo in paese per il pranzo presso Lobster Shack.", segmentFromPrevious:{duration:"~2:30 h", mode:"drive",notes:["Check-in caravan park"]}},
        {place: "Lake Thetis", type:"optional", note:"Stromatoliti vicino Cervantes, a due passi.", segmentFromPrevious:{duration:"~13 min", notes:["a 2 minuti, stromatoliti"]}},
        {place: "Hangover Bay", type:"optional", note:"Se avanza tempo, scogliere e canguri.", segmentFromPrevious:{duration:"~15 min", notes:["a 6 minuti, kangaroo point"]}},
        {place:"Pinnacles Desert", type:"planned", note:"Arrivo al tramonto, luce migliore. Loop da vedere se farlo a piedi o in camper.", segmentFromPrevious:{duration:"~30 min", notes:["Arrivare alle 16:30"]}},
      ],
      end:{place:"RAC Cervantes - Holiday Park", label:"Notte", note:"", segmentFromPrevious:{duration:"15 min", notes:["Check-in caravan park"]}}
    },
    daily:{
      night:{title:"RAC Cervantes - Holiday Park", text:"RAC Cervantes Holiday Park, 35 Aragon St, Cervantes WA 6511, Australia"},
      excursions:[
        {t:"Pinnacles Desert", s:"Loop tra i pinnacoli calcarei: a piedi o in camper, con la luce del tardo pomeriggio."},
        {t:"Lake Thetis", s:"Stromatoliti a due passi da Cervantes."},
        {t:"Hangover Bay", s:"Scogliere e canguri, se avanza tempo."}
      ],
      foodFuel:[
        {t:"Spesa grossa a Perth", s:"Prima di uscire dalla citta.", meta:["food"]},
        {t:"Lobster Shack, Cervantes", s:"Pranzo a base di aragosta.", meta:["food"]},

      ],
      notes:[
        {t:"Possibile deviazione", s:"Hangover Bay / Kangaroo Point se avanza tempo."},
        {t:"Orario Pinnacles", s:"Meglio tardo pomeriggio per luce e meno caldo."}
      ]
    }
  },

// Giorno 4 - verso kalbarri

  {
    id:"kalbarri-transfer",
    day:"Giorno 4 - lun 2/11", title:"Viaggio verso Kalbarri",
    chips:["Cervantes -> Kalbarri","~5 h"],
    route:{
      start:{place:"RAC Cervantes - Holiday Park", label:"Partenza", time:"Mattina", note:"Sveglia presto, colazione veloce. Rifornimenti a Geraldton."},
      stops:[
        {place:"Geraldton", type:"lunch", note:"Pranzo e rifornimenti: ultima citta grande.", segmentFromPrevious:{duration:"~2:30 h", notes:["Benzina, spesa e acqua"]}},
        {place:"Hutt Lagoon", type:"planned", note:"Lago rosa a Port Gregory.", segmentFromPrevious:{duration:"~1:30 h", notes:["Meglio col sole alto"]}},
        {place:"Kalbarri Coastal Cliffs", type:"viewpoint", note:"Red Bluff, Pot Alley, Rainbow Valley, Island Rock e Natural Bridge.", segmentFromPrevious:{duration:"~40 min", notes:["Arrivo per il tramonto"]}}
      ],
      end:{place:"Tasman Holiday Park", label:"Notte", segmentFromPrevious:{duration:"~15 min", notes:["Breve trasferimento in paese"]}}
    },
    daily:{
      night:{title:"Tasman Holiday Park", text:"Tasman Holiday Parks - Kalbarri, 92 Grey St, Kalbarri WA 6536, Australia"},
      excursions:[
        {t:"Hutt Lagoon", s:"Lago rosa a Port Gregory: meglio col sole alto."},
        {t:"Kalbarri Coastal Cliffs", s:"Red Bluff, Pot Alley, Rainbow Valley, Island Rock e Natural Bridge, per il tramonto."},
        {t:"Geraldton", s:"Sosta pranzo e rifornimenti lungo il trasferimento."}
      ],
      foodFuel:[
        {t:"Rifornimenti a Geraldton", s:"Ultima citta grande: benzina, spesa e acqua qui.", meta:["fuel","water","food"]},
        {t:"Pranzo a Geraldton", s:"Sosta comoda lungo il trasferimento.", meta:["food"]}
      ],
      notes:[
        {t:"Hutt Lagoon da piu angolazioni", s:"Strada laterale sterrata leggera verso la fabbrica per il rosa migliore."},
        {t:"Servizi a Kalbarri", s:"I negozi sono piccoli e cari."},
      ]
    }
  },

// Giorno 5 - Kalbarri National Park

  {
    id:"kalbarri-np",
    day:"Giorno 5 - mar 3/11", title:"Kalbarri National Park",
    chips:["base a Kalbarri", "asfaltato"],
    route:{
      start:{place:"Tasman Holiday Park", label:"Partenza", time:"Alba", note:"Base della giornata."},
      stops:[
        {place:"Nature's Window", type:"planned", note:"Accesso a The Loop.", segmentFromPrevious:{duration:"~30 min", notes:["Strada asfaltata","Partire prima del caldo"]}},
        {place:"Z-Bend", type:"viewpoint", note:"Lookout sulle gole del Murchison.", segmentFromPrevious:{mode:"drive", distance:"", notes:["Spostamento interno al parco"]}},
        {place:"Kalbarri Skywalk", type:"planned", note:"Passerelle sospese sul canyon.", segmentFromPrevious:{mode:"drive", distance:"", notes:["Ultima tappa nelle gole"]}}
      ],
      end:{place:"Tasman Holiday Park", label:"Rientro / notte", time:"Pomeriggio", segmentFromPrevious:{duration:"~30min", notes:["Rientro alla base"]}}
    },
    daily:{
      night:{title:"Seconda notte a Kalbarri", text:"Stesso caravan park.", meta:["base camp"]},
      excursions:[
        {t:"Nature's Window + The Loop", s:"La foto-simbolo, da vedere all'alba."},
        {t:"Nuotata nel Murchison River", s:"Refrigerio dopo le gole."},
        {t: "Blue holes", s:"Vicino al camping"},
      ],
      foodFuel:[
        {t:"Acqua per le gole", s:"Porta 3-4 L a testa.", meta:["water"]},
        {t:"Attrezzatura", s:"Cappello e scarpe chiuse + maniche lunghe."}
      ],
      notes:[
        {t:"Caldo intenso", s:"Niente ombra: parti all'alba."},
        {t:"Scelta trail", s:"https://www.kalbarriescapes.com.au/blog/5-must-do-trails-kalbarri"},
        {t:"Entrare all'alba", s:"Meglio arrivare presto per non morire da heatstroke."}
      ]
    }
  },

// Giorno 6 - verso coral bay

  {
    id:"coral-bay-transfer",
    day:"Giorno 6 - mer 4/11", title:"Viaggio verso Coral Bay",
    chips:["Kalbarri -> Coral Bay", "~7 h - lunga"],
    route:{
      start:{place:"Tasman Holiday Park", label:"Partenza", time:"Presto", note:"La giornata di guida piu impegnativa."},
      stops:[
        {place:"Carnarvon", type:"fuel", note:"Pausa principale e ultimi grandi servizi.  Considera soste brevi prima di arrivare qui.", segmentFromPrevious:{duration:"~4 h 40", notes:["Pranzo","Benzina, spesa e acqua."]}}
      ],
      end:{place:"Peoples Park - Coral Bay", label:"Notte", time:"Con la luce", segmentFromPrevious:{duration:"~2 h 30", notes:["Stazioni piu diradate"]}}
    },
    daily:{
      night:{title:"Peoples Park - Coral Bay", text:"Peoples Park, LOT 13 Robinson St, Coral Bay WA 6701, Australia"},
      excursions:[
        {t:"Carnarvon", s:"Pausa principale: frutta tropicale e ultimi grandi servizi."},
        {t:"Blowholes", s:"Deviazione a nord di Carnarvon, solo se resta tempo."}
      ],
      foodFuel:[
        {t:"Pieno a Carnarvon", s:"Dopo, le stazioni si diradano.", meta:["fuel"]},
        {t:"Ultima spesa seria a Carnarvon", s:"Coral Bay e minuscola.", meta:["food", "water"]}
      ],
      notes:[
        {t:"Parti presto", s:"Serve margine per arrivare a Coral Bay con la luce."},
      ]
    }
  },

// Giorno 7 - Coral Bay

  {
    id:"coral-bay",
    day:"Giorno 7 - gio 5/11", title:"Coral Bay",
    chips:["stanziale","snorkeling","il premio"],
    route:{
      start:{place:"Peoples Park - Coral Bay", label:"Base", time:"Mattina"},
      stops:[
        {place:"Manta Ray Tour", type:"planned", note:"Shop 4, Peoples Shopping Village, Robinson Street, Coral Bay WA 6701 Australia", segmentFromPrevious:{mode:"walk", duration:"Pochi minuti"}},
        {place:"Bill's Bay", type:"planned", note:"Reef a pochi metri dalla spiaggia.", segmentFromPrevious:{mode:"walk", duration:"Pochi minuti"}},
      ],
      end:{place:"Peoples Park - Coral Bay", label:"Rientro / notte", time:"Tramonto", segmentFromPrevious:{mode:"walk", notes:["Possibile snorkeling al tramonto"]}}
    },
    daily:{
      night:{title:"Seconda notte a Coral Bay", text:"Stesso caravan park.", meta:["base camp"]},
      excursions:[
        {t:"Snorkeling in Bill's Bay", s:"Pesci, tartarughe e razze vicino alla spiaggia."},
        {t:"Zona squali di barriera", s:"Blacktip reef shark innocui in acqua bassa."},
        {t:"Tour mante in barca", s:"Shop 4, Peoples Shopping Village, Robinson Street, Coral Bay WA 6701 Australia"},
      ],
      foodFuel:[
        {t:"Attrezzatura snorkeling", s:"Noleggiala in paese se non ce l'hai."},
        {t:"Porta contanti", s:"Servizi e bancomat sono limitati.", meta:["cash"]}
      ],
      notes:[
        {t:"Sicurezza in acqua", s:"Nuota nelle zone segnalate e chiedi delle correnti in loco."}
      ]
    }
  },

// Giorno 8 - verso shark bay

  {
    id:"shark-bay",
    day:"Giorno 8 - ven 6/11", title:"Coral Bay -> Shark Bay",
    chips:["Coral Bay -> Denham", "~6 h - lunga"],
    route:{
      start:{place:"Peoples Park - Coral Bay", label:"Partenza", time:"Presto"},
      stops:[
        {place:"Shell Beach", type:"planned", note:"Spiaggia di conchiglie bianche.", segmentFromPrevious:{duration:"~5:30 h", notes:["Rifornimento presso Overlander Roadhouse prima di arrivare"]}},
        {place:"Eagle Bluff", type:"viewpoint", note:"Passerella panoramica sulla baia.", segmentFromPrevious:{duration:"~20 min", notes:["Possibili squali, razze e dugonghi"]}},
        {place:"Little Lagoon", type:"optional", note:"Piccola laguna per un breve bagno.", segmentFromPrevious:{duration:"~20 min", notes:["Breve deviazione vicino Denham"]}},
        {place: "Denham", type:"planned", note:"Arrivo in paese per la cena.", segmentFromPrevious:{duration:"~15 min", notes:["Check-in caravan park"]}}
      ],
      end:{place:"Tasman holiday park - Denham", label:"notte", time:"Sera", segmentFromPrevious:{}}
    },
    daily:{
      night:{title:"Tasman holiday park - Denham", text:"Da mettere indirizzo"},
      excursions:[
        {t:"Eagle Bluff", s:"Squali, razze, tartarughe e dugonghi dall'alto."},
        {t:"Hamelin Pool: boardwalk CHIUSO", s:"Distrutto dal ciclone Seroja, il nuovo e in costruzione (fine lavori ~2027). Si vedono solo da dietro la recinzione con la bassa marea: non vale la deviazione."},
        {t:"Shell Beach", s:"Miliardi di conchiglie al posto della sabbia: e sulla strada, questa si."},
      ],
      foodFuel:[
        {t:"Pieno di benzina", s:"A Overlander Roadhouse o Denham.", meta:["fuel"]}
      ],
      notes:[
        {t:"Ordine delle soste", s:"Shell Beach -> Eagle Bluff -> Little Lagoon -> Denham. (Hamelin Pool saltato: boardwalk chiuso.)"},
        {t:"Parti presto", s:"La tratta da Coral Bay dura circa 6 ore."}
      ]
    }
  },

// Giorno 9 - Francois Peron National Park + Geraldton

  {
    id:"monkey-mia",
    day:"Giorno 9 - sab 7/11", title:"Francois Peron National Park",
    chips:["escursioni"],
    route:{
      start:{place:"Tasman holiday park - Denham", label:"Partenza", time:"Presto per escursione al parco", note:"Sveglia presto, colazione veloce. Rifornimenti a Denham."},
      stops:[
        {place:"Pick-up 4x4 tour", type:"planned", note:"Shoreline by Sharkbay eco tours", segmentFromPrevious:{mode:"walk", notes:["Arrivare in anticipo per il pick-up"]}},
      ],
      end:{place:"RAC Monkey Mia Dolphin Resort", label:"Arrivo / notte", time:"Con la luce", segmentFromPrevious:{duration:"~20 min", notes:["Completare la tratta entro sera"]}}
    },
    daily:{
      night:{title:"RAC Monkey Mia Dolphin Resort", text:"Piazzola per la notte.", meta:["campervan"]},
      excursions:[
        {t:"Francois Peron National Park", s:"Escursione in 4x4 con pick-up dal resort."},
      ],
      foodFuel:[
        {t:"Rifornimenti a Denham", s:"Ultima citta grande: benzina, spesa e acqua qui.", meta:["fuel","water","food"]},
      ],
      notes:[
        {t:"Il parco interno si fa solo in 4x4", s:"Per questo il giro e con Shoreline by Sharkbay eco tours."},
        {t:"Dove lasciare il van", s:"Chiedi al tour o al resort dove parcheggiarlo durante l'escursione."}
      ]
    }
  },

// Giorno 10 - verso Jurien Bay

  {
    id:"jurien-bay",
    day:"Giorno 10 - dom 8/11", title:"Jurien Bay / Cervantes",
    chips:["Monkey Mia -> Jurien Bay","~7 h - lunga"],
    route:{
      start:{place:"RAC Monkey Mia Dolphin Resort", label:"Partenza", time:"Mattina"},
      stops:[
        {place:"Monkey Mia Conservation Park", type:"planned", note:"Prima sessione con i ranger circa 7:45.", segmentFromPrevious:{mode:"walk", notes:["Ingresso a pagamento"]}},
        {place:"Ampol Overlander Roadhouse", type:"fuel", note:"Possibile rifornimento.", segmentFromPrevious:{duration:"~1:40 h", notes:["RIfornimento carburante e snack"]}},
        {place:"Northampton", type:"quick", note:"Pausa caffe o pranzo.", segmentFromPrevious:{duration:"~2:15 h", notes:["Stop caffe o pranzo"]}},
        {place:"Leaning Trees", type:"optional", note:"Alberi piegati dal vento.", segmentFromPrevious:{duration:"~50 min", notes:["Deviazione per alberi piegati dal vento"]}},
        {place:"Lesueur NP", type:"optional", note:"Possibile coda di wildflowers.", segmentFromPrevious:{duration:"~2 h", notes:["Deviazione per fiorellini."]}},
        {place:"Jurien Bay", type:"planned", note:"Riposo dopo il lungo viaggio.", segmentFromPrevious:{duration:"~20 min", notes:["Se siamo vivi e' un miracolo"]}}
      ],
      end:{place:"Jurien Bay Tourist Park", label:"Notte", segmentFromPrevious:{notes:["Check-in ultima notte in van, (coca zero richiesta)"]}}
    },
    daily:{
      night:{title:"Jurien Bay Tourist Park", text:"Ultima notte in van!", meta:["campervan"]},
      excursions:[{t:"Lesueur NP", s:"Scenic drive ~ 18.5 km"}],
      foodFuel:[
        {t:"Svuota i serbatoi", s:"Grigi e neri a un dump point.", meta:["dump point"]},
        {t:"Controlla il carburante", s:"In vista della riconsegna.", meta:["fuel"]}
      ],
      notes:[
        {t:"Giornata di lungo viaggio", s:"Cerchiamo di non accoltellarci a vicenda."},
      ]
    }
  },

// Giorno 11 - ritorno a perth

  {
    id:"ritorno-perth",
    day:"Giorno 11 - lun 9/11", title:"Ritorno a Perth",
    chips:["-> Perth", "~3 h di guida", "giornata strettissima"],
    route:{
      start:{place:"Jurien Bay Tourist Park", label:"Partenza", time:"Mattina"},
      stops:[
        {place:"Escursione Sea Lions", type:"planned", note:"7:00 am - Jurien Bay Boat Harbour.", segmentFromPrevious:{mode:"drive", duration:"~4 min", notes:["Almeno 15 min prima della partenza"]}},
        {place:"Swan Valley", type:"optional", note:"Pranzo veloce. La degustazione vera falla stasera in taxi, DOPO aver riconsegnato il van: limite alcol 0,05 e consegna entro le 14:30.", segmentFromPrevious:{mode:"drive", duration:"~2:25 h", notes:["Arrivo ~12:00 se il tour finisce alle 9:30"]}},
        {place:"Deposito van", type:"planned", note:"Riconsegna a Perth.", segmentFromPrevious:{mode:"drive", duration:"~20 min", notes:["consegna max 14:30, carburante e pulizia"]}},
        {place:"Sunlit Minimal", type:"planned", note:"Check-in hotel a Perth.", segmentFromPrevious:{mode:"public transport", duration:"~20 min", notes:["Check-in hotel"]}},
      ],
      end:{place:"Sunlit Minimal", label:"Notte", time:"Pomeriggio", note:"Base prima del volo.", segmentFromPrevious:{notes:["Trasferimento dopo la riconsegna"]}}
    },
    daily:{
      night:{title:"Notte a Perth", text:"Hotel prima del volo per Adelaide del 10/11.", meta:["hotel"]},
      excursions:[
        {t:"Sea Lions excursion", s:"2 hours tour in barca da Jurien Bay Boat Harbour."},
        {t:"Riconsegna del van", s:"Controlla orario, carburante richiesto e pulizia."},
      ],
      foodFuel:[
        {t:"Pieno prima della riconsegna", s:"Solo se richiesto dal contratto.", meta:["fuel"]}
      ],
      notes:[
        {t:"La giornata e strettissima", s:"Tour 7:00-9:30 + 2:25 di guida + pieno e pulizia = si arriva alla riconsegna delle 14:30 col fiato corto. Swan Valley e la prima cosa da sacrificare."},
        {t:"Documenta il van", s:"Scatta foto alla riconsegna per evitare contestazioni."},
        {t:"Ultima cena west coast", s:"Festeggia: 2.700 km fatti. Meglio a Perth, in taxi, senza van da guidare."}
      ]
    }
  },

// Giorno 12 - volo per adelaide  

  {
    id:"volo-adelaide",
    day:"Giorno 12 - mar 10/11", title:"Volo per Adelaide",
    chips:["Perth -> Adelaide","12:00 -> 17:20","~2 h 50 di volo"],
    route:{
      start:{place:"Sunlit Minimal", label:"Partenza", time:"Mattina", note:"Colazione e check-out con calma: il volo e a mezzogiorno."},
      stops:[
        {place:"Perth Airport (PER)", type:"planned", time:"~10:00", icon:"plane", note:"Check-in, consegna bagagli e controlli: in aeroporto 2 h prima.", segmentFromPrevious:{duration:"~25 min", notes:["Taxi o rideshare"]}},
        {place:"Volo Perth -> Adelaide", type:"planned", time:"12:00 -> 17:20", icon:"plane", note:"~2 h 50 di volo. Orari in ora locale: Adelaide e avanti di 2 h 30.", segmentFromPrevious:{mode:"fly", distance:"~2.100 km", duration:"~2 h 50", notes:["Imbarco","Partenza 12:00"]}}
      ],
      end:{place:"Adelaide Airport (ADL)", label:"Arrivo", time:"17:20", note:"Da qui parte la leg 2: Great Ocean Road.", icon:"plane", segmentFromPrevious:{mode:"fly", notes:["Fuso: +2 h 30 rispetto a Perth"]}}
    },
    daily:{
      titles:{excursions:"Prima di partire", foodFuel:"Cibo"},
      night:{title:"BreakFree Adelaide", text:"da qui in poi vale il piano Great Ocean Road.", meta:["altro notebook"]},
      excursions:[
        {t:"Check-out e trasferimento", s:"Volo alle 12:00: in aeroporto per le 10:00."}
      ],
      foodFuel:[
        {t:"Colazione in citta", s:"L'ultima con il caffe di Perth."}
      ],
      notes:[
        {t:"Ritiro auto in aeroporto", s:"Usa shuttle per arrivare al pick-up point"},
        {t:"Questo notebook finisce qui", s:"La parte 2 vive nel piano Great Ocean Road."}
      ]
    }
  }
];
