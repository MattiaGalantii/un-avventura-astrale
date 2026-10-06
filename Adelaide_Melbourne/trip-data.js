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
     segmentFromPrevious = il CONNETTORE che porta a quella tappa:
       { mode, distance, duration, notes:[...] }
       mode: drive (default) | ferry | walk | bike | fly | bus | tram |
             public transport
             -> cambia la trama della linea e l'icona della targhetta

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
    intro:true, day:"Info di base", title:"Seconda parte - da Adelaide a Melbourne",
    chips:["leggimi","auto","Tidal River","meteo variabile"],
    boxes:[
      {h:"L'auto in pratica", cls:"prac", items:[
        {t:"Toyota Corolla o simile", s:"East Coast Car Rentals via VroomVroomVroom. Automatica, 5 posti, km illimitati. BENZINA, non diesel come il van: attenzione al distributore."},
        {t:"Ritiro 10/11 h 18:00 - NON in aeroporto", s:"376 Sir Donald Bradman Drive, Brooklyn Park. Shuttle gratuito: arriva un SMS 24 h prima col link, oppure pickmeup.eccr.com.au (si attiva solo il giorno stesso)."},
        {t:"La filiale il martedi chiude alle 20:30", s:"Atterri alle 17:20: c'e margine vero, niente panico se i bagagli tardano."},
        {t:"Riconsegna 19/11 h 18:00 a Tullamarine", s:"2 Tarmac Dr, anche questa fuori dall'aeroporto. Da li SkyBus in citta (~30-45 min) per arrivare al Causeway 353."},
        {t:"Va aggiunto il secondo guidatore", s:"Sulla prenotazione c'e un solo guidatore. Aggiunta al ritiro: $11 al giorno con tetto a $50. Non dichiarata = non assicurata."},
        {t:"Cauzione $1.000 pre-autorizzata", s:"Bloccata, non addebitata: molto piu gentile dei 5.000 del van. Carta dell'intestatario, che deve essere presente al banco."},
        {t:"Farsi dire la franchigia prima di firmare", s:"Sulla conferma la voce Excess e tagliata a '$5'. Chiedila al banco e valuta se ridurla."},
      ]},
      {h:"Da fare prima di partire", cls:"must", items:[
        {t:"Patente internazionale: la stessa del van", s:"Anche East Coast chiede patente in inglese o traduzione accreditata. Un IDP copre entrambi i noleggi."},
        {t:"Passaporto al ritiro", s:"Lo chiedono esplicitamente, oltre alla carta di credito."},
        {t:"DA PRENOTARE - Peninsula Hot Springs", s:"peninsulahotsprings.com, sessione del 15/11. Aperta fino alle 23:00."},
        {t:"DA PRENOTARE - Pinguini a St Kilda (19/11)", s:"Lo slot si apre martedi 17/11 alle 10:00, quando sei a Tidal River senza campo. Vedi il giorno 10."},
        {t:"DA SCEGLIERE - tour alle Naracoorte Caves", s:"Ce ne sono diversi e durano diversamente: scegli quale prima dell'11/11, la giornata e gia piena."},
        {t:"DA VERIFICARE - cantina a Coonawarra", s:"Molte chiedono prenotazione per la degustazione."},
        {t:"Controlla le chiusure sentieri", s:"Su Parks Victoria, pochi giorni prima: i Grampians chiudono trail per incendi e frane con una certa regolarita."},
        {t:"Grampians e Wilsons Prom: ingresso gratuito", s:"Nessun pass da comprare, si paga solo il campeggio."}
      ]},
      {h:"Tidal River: leggi prima", cls:"sleep", items:[
        {t:"Le hut NON danno lenzuola ne coperte", s:"Hanno forno, piastre, frigo bar e stoviglie, ma il letto e nudo. Due notti, e a novembre li di notte si scende sui 10 C."},
        {t:"Chiedi i sacchi a pelo ad Anglesea", s:"Il 13 e 14/11 dormi a casa della mamma di Alex, due giorni prima: farseli prestare e meglio che comprarli. Piano B: Kmart a Torquay o Warrnambool lungo la strada."},
        {t:"Niente campo telefonico", s:"Scarica mappe, prenotazioni e biglietti offline PRIMA di entrare nel parco."},
        {t:"Il negozio e minuscolo e caro", s:"La spesa vera si fa a Foster o Meeniyan il 16/11: dentro il parco si sta tre giorni."},
        {t:"Telegraph Saddle puo essere chiuso", s:"Il parcheggio da cui parte Mount Oberon chiude nei periodi di punta, sostituito da uno shuttle. Meta novembre non dovrebbe esserlo: verifica su Parks Victoria."},
        {t:"Asciugamani e ciabatte da doccia", s:"Docce comuni e niente biancheria fornita."}
      ]},
      {h:"Cura personale", cls:"extra", items:[
        {t:"Bendaggio compressivo per morso di serpente", s:"Costa pochi euro. Al Wilsons Prom i tiger snake sono comuni sui sentieri in primavera, e ai Grampians pure. Spero non serva, ma lo porterei di sicuro."},
        {t:"Zecche al Prom", s:"Servono pinzette a punta fine: si tolgono diversamente dagli altri insetti, tirando dritto senza schiacciare."},
        {t:"Sanguisughe nelle Otway", s:"Sul serio: Triplet Falls e Hopetoun Falls dopo la pioggia. Calzini alti e un controllo alle caviglie a fine camminata."},
        {t:"Cerotti per vesciche, doppia scorta", s:"Qui si cammina molto piu che in WA: Pinnacles, Fish Falls, Mount Oberon."},
        {t:"Repellente", s:"Zanzare e mosche anche qui, soprattutto al tramonto vicino all'acqua."},
        {t:"Solare comunque", s:"L'UV in Victoria a novembre e 10-11: non e la WA ma ci si brucia lo stesso."},
        {t:"Qualcosa per il mal d'auto", s:"La GOR tra Apollo Bay e Lorne e tutta curve, e il traghetto per Sorrento dura 40 min."},
        {t:"Kit medico base", s:"Lo stesso della leg 1, ricontrolla che non sia finito."}
      ]},
      {h:"Abbigliamento: il contrario della WA", cls:"sleep", items:[
        {t:"Giacca impermeabile vera", s:"Non l'antivento. Otway e Wilsons Prom sono foresta pluviale e costa esposta: qui piove davvero."},
        {t:"Strato caldo", s:"Per le notti a Tidal River (10 C) e per l'alba ai Grampians. In Victoria a meta novembre puo fare 12 C con pioggia o 30 C, anche nello stesso giorno."},
        {t:"Pantaloni lunghi da hike", s:"Non shorts sui sentieri del Prom e dei Grampians: erba alta e serpenti."},
        {t:"Scarponcini con grip", s:"I Pinnacles ai Grampians sono roccia liscia, Mount Oberon e una salita costante su ghiaia."},
        {t:"Costume", s:"Hot Springs, Squeaky Beach, Norman Beach."},
        {t:"Asciugamano per le Hot Springs", s:"Verifica se lo noleggiano, altrimenti portatelo dall'auto."},
        {t:"Qualcosa di piu carino per le sere", s:"Melbourne e St Kilda: e la capsule sera che hai gia in valigia."}
      ]},
      {h:"Spesa, benzina e lavatrici", cls:"prac", items:[
        {t:"Adelaide 10-11/11: prima spesa", s:"La sera dell'arrivo o la mattina presto, prima di partire alle 7:30."},
        {t:"Horsham o Stawell, NON Halls Gap", s:"Halls Gap ha un IGA piccolo e caro. Horsham e 35 min a nord e ha i supermercati veri: conviene deviare o fermarsi arrivando."},
        {t:"Warrnambool o Port Campbell il 13/11", s:"Sosta comoda a meta della giornata lunga sulla GOR."},
        {t:"Torquay il 14-15/11", s:"Ultimo supermercato grande prima della penisola."},
        {t:"Foster o Meeniyan il 16/11: spesa per 3 giorni", s:"Ultima prima del Prom. Dentro il parco non si compra niente."},
        {t:"Cowes o San Remo il 18/11", s:"Supermercato a Phillip Island."},
        {t:"Benzina, non diesel", s:"Il tratto critico e il 13/11: parti col pieno dall'Ampol di Halls Gap, la GOR ha distributori radi e cari."},
        {t:"Lavatrice 2: gio 12/11 ai Grampians", s:"Coin laundry del Grampians View, la MATTINA: li e fresco e umido e serve tempo per asciugare."},
        {t:"Anglesea 13-14/11 = rete di sicurezza", s:"Non un terzo lavaggio: serve per l'asciugatura di riserva e i pezzi ingombranti saltati al coin laundry."}
      ]},
      {h:"Guida, fauna e ultimo giorno", cls:"must", items:[
        {t:"Canguri all'imbrunire, wombat di notte", s:"Su tutta la GOR e intorno a Halls Gap i canguri attraversano al tramonto; al Prom i wombat girano sulle strade interne di notte. Il 13/11 arriverete col buio: e la sera piu a rischio del viaggio."},
        {t:"Limite alcol 0,05", s:"Vale per Coonawarra l'11/11 e per le sere a Melbourne. Decidete chi guida prima della degustazione, non dopo."},
        {t:"Autovelox: la Victoria e la piu severa d'Australia", s:"Le multe arrivano al noleggio, che le gira a voi con una commissione sopra."},
        {t:"Si guida a sinistra", s:"Dopo 9 giorni di van dovreste essere rodati, ma le rotonde restano il punto debole."},
        {t:"Cosa e nuovo rispetto alla WA", s:"Wombat al Prom, pinguini a Phillip Island, otarie ai Nobbies. Se di canguri e koala siete gia sazi, saltate Cleland e Healesville senza rimpianti."},
        {t:"Rimborso GST al banco TRS, 20/11", s:"Se comprate la GoPro a Perth sono ~$100 indietro: serve scontrino originale, oltre $300 dallo stesso negozio, acquisto entro 60 giorni e la merce con voi al banco."},
        {t:"Deposito bagagli per tutto il 20/11", s:"Check-out la mattina, volo a mezzanotte e mezza: chiedi il luggage storage all'hotel."},
        {t:"Myki, SkyBus e Free Tram Zone", s:"Myki per i tram fuori dal centro, SkyBus da e per Tullamarine, tram gratis dentro la Free Tram Zone."}
      ]}
    ]
  },

// Giorno 1 - arrivo ad Adelaide

  {
    id:"adelaide-arrivo",
    day:"Giorno 1 - mar 10/11", title:"Arrivo ad Adelaide",
    chips:["volo da Perth", "sera in citta"],
    route:{
      start:{place:"Adelaide Airport", label:"Arrivo", time:"17:20", icon:"plane", note:"Volo da Perth. Welcome to CBD!"},
      stops:[
        {place:"Ritiro auto", type:"planned", note:"18:00 pm: usa SMS o prenota shuttle prima", segmentFromPrevious:{mode:"walk", notes:["Free shuttle service from airport to branch"]}},
        {place:"Check-in hotel: BreakFree Adelaide", type:"planned", note:"Look around", segmentFromPrevious:{mode:"auto", duration:"9 min", notes:["Verso l'albergo"]}},
        {place:"Giro nel CBD di Adelaide", type:"planned", note:"Locali per cena e atmosfera serale.", segmentFromPrevious:{mode:"walk"}},
        {place:"Riverbank & Adelaide Oval", type:"optional", note:"Lungofiume illuminato, due passi.", segmentFromPrevious:{mode:"walk"}}
      ],
      end:{place:"BreakFree Adelaide", label:"Notte", time:"Sera", note:"Welterusten", segmentFromPrevious:{mode:"walk"}}
    },
    daily:{
      night:{title:"BreakFree Adelaide CBD", text:"", meta:["appartamento"]},
      excursions:[
        
      ],
      foodFuel:[
      ],
      notes:[
        {t:"Ritiro auto", s:"Speriamo funzioni"}
      ]
    }
  },

// Giorno 2 - Adelaide Hills e trasferimento a Horsham

  {
    id:"adelaide-horsham",
    day:"Giorno 2 - mer 11/11", title:"Citta, vini delle Hills, via verso est",
    chips:["Adelaide -> Grampians","~6+ h con soste"],
    route:{
      start:{place:"BreakFree Adelaide", label:"Partenza", time:"Mattina", note:"Partenza ore 7:30 am."},
      stops:[
        {place:"Hahndorf", type:"quick", note:"Quick visit and breakfast", segmentFromPrevious:{mode:"auto", duration:"30 min"}},
        {place:"Naracoorte", type:"planned", note:"Cave con fossili, UNESCO.", segmentFromPrevious: {mode: "auto", duration:"3:15 h"}},
        {place:"Coonawarra", type: "planned", note:"Red wine region.", segmentFromPrevious: {mode: "auto", duration: "30 min"}}
      ],
      end:{place:"Grampians View Cottages And Units", label:"Notte", note:"Prima delle due notti ai Grampians.", segmentFromPrevious:{duration:"~2:30 h", notes:["Tratta lunga, ricorda di non guidare di notte!"]}}
    },
    daily:{
      night:{title:"Grampians View Cottages And Units", text:"6 ore di viaggio da Adelaide"},
      excursions:[
        {t:"Naracoorte caves tour", s:"check which one"},
        {t:"Visita alle Wineyard di Coonawarra", s:"Prenotare?"}
      ],
      foodFuel:[
        {t:"Benzina e spesa prima di lasciare Adelaide", s:"Fai tutto nella zona della citta.", meta:["fuel","food"]},
        {t:"Colazione ad Hahndorf", s:"Borgo tedesco storico, ristoranti e negozi.", meta:["food"]}
      ],
      notes:[
        {t:"Limite alcol 0,05", s:"Decidi chi guida dopo la degustazione."},
        {t:"Giornata sovraccarica", s:"~7 h di guida + tour nelle grotte + degustazione, partendo alle 7:30: si arriva col buio. Se siete in ritardo a Naracoorte, salta Coonawarra."},
      ]
    }
  },

// Giorno 3 - Grampians

  {
    id:"grampians",
    day:"Giorno 3 - gio 12/11", title:"Grampians National Park",
    chips:["hiking and trekking"],
    route:{
      start:{place:"Grampians View Cottages and Units", label:"Partenza", time:"Alba", note:"Parti per le 6:00 am per la hike all'alba."},
      stops:[
        {place:"Wonderland car park", type:"planned", time:"All'alba", note:"Trekking: Grand Canyon e Pinnacles, ~3 h", segmentFromPrevious:{duration:"~10 min", mode:"auto"}},
        {place:"Zumsteins Picnic Area", type:"planned", note:"Parcheggio. Da li, verso Fish Falls (~2:30 h trekking)", segmentFromPrevious:{duration: "~30 min", mode:"auto"}},
        {place:"Silverband Falls", type:"optional", note:"Se rimane energia, ~1 h di trekking", segmentFromPrevious:{duration:"~30 min", mode:"drive"}},
        {place:"Reeds Lookout & The Balconies", type:"viewpoint", note:"Vista sulla valle al tramonto. Breve trail per The Balconies (~1 h in totale)", segmentFromPrevious:{duration:"~20 min", mode:"drive"}},
        {place:"Boroka Lookout", type:"optional", note:"Vista sulla valle"},
        {place:"Halls Gap", type:"optional", note:"Canguri al tramonto nei prati del paese, anche emu."}
      ],
      end:{place:"Grampians View Cottages And Units", label:"Notte", note:"Seconda notte."}
    },
    daily:{
      night:{title:"Grampians View Cottages And Units", text:"seconda notte"},
      excursions:[
        {t:"vedi piano sopra"}
      ],
      foodFuel:[
        {t:"Acqua, cappello, scarpe chiuse", s:"Caldo e poca ombra sui sentieri.", meta:["water"]}
      ],
      notes:[
        {t:"Ingresso parco gratuito", s:"Controlla le chiusure sentieri su Parks Victoria."},
        {t:"Sono 7 h 30 di cammino in totale", s:"Pinnacles 3 h + Fish Falls 2:30 + Silverband 1 h + Balconies 1 h, piu gli spostamenti. Silverband e la prima da tagliare."}
      ]
    }
  },

// Giorno 4 - Grampians -> Anglesea via Great Ocean Road

  {
    id:"gor-anglesea",
    day:"Giorno 4 - ven 13/11", title:"Great Ocean Road",
    chips:["Grampians -> Anglesea","~450 km","~+7 h - la piu lunga"],
    route:{
      start:{place:"Halls Gap fuel station", label:"Partenza", time:"All'alba", note:"Giornata lunghissima (~450 km): pianifica le soste benzina."},
      stops:[
        {place:"Tower Hill", type:"planned", note:"Cratere vulcanico con emu, koala e canguri liberi. Possibile giro in macchine 2WD", segmentFromPrevious:{duration:"~2 h", mode:"auto"}},
        {place:"Great Ocean Road", type:"viewpoint", note:"Bay of Islands-Martyrs, The Grotto, London Bridge, Loch Ard Gorge, 12 Apostles, Gibson steps, Apollo Bay, Cape Patton, Lorne, Aireys Inlet", segmentFromPrevious:{duration:"~4 h", mode:"auto"}},
      ],
      end:{place:"Anglesea - casa Lamb", label:"Notte (1ª)", note:"Nessuna prenotazione."}
    },
    daily:{
      night:{title:"Anglesea - casa della mamma di Alex", text:"Prima delle due notti gratis. Nessuna prenotazione.", meta:["gratis"]},
      excursions:[
      ],
      foodFuel:[
        {t:"Pianifica le soste benzina: Halls Gap Ampol", s:"Giornata lunghissima: non arrivare in riserva.", meta:["fuel"]},
        {t:"Pranzo a Warrnambool o Port Campbell", s:"Sosta comoda a meta strada.", meta:["food"]}
      ],
      notes:[
        {t:"Port Campbell Bay e Apollo Bay", s:"Safe bagno riparato da scogliere"},
        {t:"La GOR e lenta e tortuosa", s:"Non avere fretta sul tratto costiero: le 4 h sono senza fermarsi, e tu hai 10 punti in lista."},
        {t:"L'ultimo tratto sara al buio", s:"Tra Lorne e Anglesea, all'imbrunire, i canguri attraversano. Rallenta e non usare gli abbaglianti contro le altre auto."}
      ]
    }
  },

// Giorno 5 - Otway orientali

  {
    id:"otway",
    day:"Giorno 5 - sab 14/11", title:"Otway orientali (giornata che doveva essere morbida ma invece sara' devastante mannaggia)",
    chips:["base Anglesea","~150 km","relax"],
    route:{
      start:{place:"Anglesea - casa Lamb", label:"Base", time:"Mattina", note:"Giornata leggera apposta dopo la tappa lunga di ieri."},
      stops:[
        {place:"Mattina chill ad Anglesea", type:"planned", note:"Amare, canguri e relax."},
        {place:"Lake Elizabeth", type:"optional", note:"Partenza ~11-11:30, possibile loop a piedi nella foresta",  segmentFromPrevious:{duration:"~1:10 h", mode:"drive"}},
        {place:"Triplet Falls", type:"planned", note:"Trekking nella ancient forest ~1 h", segmentFromPrevious:{duration:"~1 h", mode:"drive"}},
        {place: "Hopetoun Falls e Redwood Otways", type:"planned", note:"Cascata nella foresta e sequoie assurde giganti", segmentFromPrevious:{duration:"~30 min", mode:"drive"}},
        {place:"Kennett River", type:"planned", note:"Koala selvatici sugli eucalipti + king parrots + glow-worms", segmentFromPrevious:{duration:"~1:10 h", notes:["Strada nella foresta o nella costa, cena sulla via"]}},
      ],
      end:{place:"Anglesea - casa Lamb", label:"Rientro / notte (2ª)", note:"Giornata senza spostare i bagagli (forse mortale)." ,segmentFromPrevious:{duration:"~1:15 h", mode:"drive", notes:["Massima attenzione!"]}}
    },
    daily:{
      night:{title:"Anglesea - casa Lamb", text:"Seconda notte gratis. Nessuna prenotazione.", meta:["gratis"]},
      excursions:[
      ],
      foodFuel:[],
      notes:[
        {t:"Non morire", s:"Per favore"},
      ]
    }
  },

// Giorno 6 - traghetto e Peninsula Hot Springs

  {
    id:"mornington",
    day:"Giorno 6 - dom 15/11", title:"Traghetto + Peninsula Hot Springs",
    chips:["Anglesea -> Mornington","~70 km + traghetto","terme"],
    route:{
      start:{place:"Anglesea - casa Lamb", label:"Partenza", time:"Mattina", note:"Trasferimento verso la Mornington Peninsula"},
      stops:[
        {place:"Queenscliff", type:"quick", note:"Cittadina vittoriana prima del traghetto.", segmentFromPrevious:{duration:"~1 h", notes:["Da Anglesea a Queenscliff"]}},
        {place:"Sorrento", type:"planned", note:"Sbarco sulla Mornington Peninsula.", segmentFromPrevious:{mode:"ferry", duration:"~40 min", notes:["Slot auto PRENOTATO","Corse ogni ora, dalle 7 alle 18"]}},
        {place:"Peninsula Hot Springs", type:"planned", note:"Pomeriggio/sera in vasca termale. Sessione DA PRENOTARE.", segmentFromPrevious:{mode:"drive", duration:"~20 min"}},
        {place:"Cena a Sorrento", type:"optional", note:"Ristoranti sul mare, se non cenate alle terme.", segmentFromPrevious:{mode:"drive", duration:"~20 min"}}
      ],
      end:{place:"Peninsula Beach Motel", label:"Notte", note:"a Capel Sound", segmentFromPrevious:{duration:"~15 min", mode:"drive"}}
    },
    daily:{
      night:{title:"Peninsula Beach Motel", text:"Motel a Capel Sound."},
      excursions:[
        {t:"Peninsula Hot Springs", s:"Pomeriggio/sera in vasca termale. Prenota la sessione."},
      ],
      foodFuel:[
        {t:"Cena a Sorrento", s:"Ristoranti sul mare.", meta:["food"]}
      ],
      notes:[
        {t:"Peninsula Hot Springs: ANCORA DA PRENOTARE", s:"Aperta fino alle 23:00. E l'unica cosa rimasta da prenotare di questa leg, a parte St Kilda.", meta:["prenotare!"]},
        {t:"Traghetto prenotato", s:"Slot auto Queenscliff-Sorrento gia pagato (66,68 EUR): presentati 30 min prima al molo."}
      ]
    }
  },

// Giorno 7 - verso Wilsons Promontory

  {
    id:"wilsons-prom-transfer",
    day:"Giorno 7 - lun 16/11", title:"Verso Wilsons Promontory",
    chips:["Mornington -> Tidal River","~250 km","~3,5 h"],
    route:{
      start:{place:"Peninsula Beach Motel", label:"Partenza", time:"Mattina", note:"Trasferimento a sud-est, fino al cuore del parco."},
      stops:[
        {place:"Foster o Meeniyan", type:"fuel", note:"Ultima spesa/benzina prima di entrare nel parco.", segmentFromPrevious:{notes:["Dentro al parco niente negozi grandi"], mode:"drive", duration:"~2 h"}},
        {place:"Tidal River - Parks Victoria - check-in", type:"planned", note:"Check-in all'hut dalle 2:00 pm. Prenotazione OK (276,80 AUD per 2 notti).", segmentFromPrevious:{mode:"drive", duration:"~1 h"}},
        {place:"Squeaky Beach", type:"optional", note:"Sabbia bianca che 'squittisce' sotto i piedi, granito rosa."},
        {place:"Whisky Bay / Picnic Bay", type:"optional", note:"Calette di granito."},
        {place:"Mount Oberon", type:"planned", note:"Salita ~1h30 a/r, vista a 360° sul promontorio."},
        {place:"Tidal River & Norman Beach", type:"optional", note:"Spiaggia ampia vicino al campground."}
      ],
      end:{place:"Tidal River - Parks Victoria", label:"Notte (1ª)", note:"Hut for 4 people."}
    },
    daily:{
      night:{title:"Tidal River - Parks Victoria (1ª notte)", text:"Hut for 4 people."},
      excursions:[
      ],
      foodFuel:[
        {t:"Ultima spesa/benzina a Foster o Meeniyan", s:"Prima di entrare nel parco.", meta:["fuel","food"]},
        {t:"Dentro al parco niente negozi grandi", s:"Porta il necessario."}
      ],
      notes:[
        {t:"Segnale telefonico scarso al Prom", s:"Scarica mappe e prenotazioni offline PRIMA di entrare nel parco."},
        {t:"Ricordati dei pinguini di St Kilda", s:"Lo slot si apre domani (mar 17/11) alle 10:00 e qui non hai campo: vedi il giorno 10."}
      ]
    }
  },

// Giorno 8 - Wilsons Prom giornata piena

  {
    id:"wilsons-prom",
    day:"Giorno 8 - mar 17/11", title:"Wilsons Prom - giornata piena",
    chips:["base Tidal River","~30-50 km","wombat & hike"],
    route:{
      start:{place:"Tidal River", label:"Base", time:"Alba", note:"Wombat, canguri ed emu girano nel campground all'alba e al tramonto."},
      stops:[
        {place:"Hike a scelta", type:"planned", note:"Mt Oberon, Lilly Pilly Gully o, per i piu allenati, Sealers Cove.", segmentFromPrevious:{mode:"walk", notes:["Acqua e snack: niente chioschi sui sentieri"]}},
        {place:"Nuoto/relax a Tidal River", type:"optional", note:"Acqua color te per la vegetazione."},
        {place:"Big Drift (dune)", type:"optional", note:"Dune di sabbia bianca, surreale al tramonto."},
        {place:"Squeaky Beach / Whisky Bay", type:"viewpoint", note:"Luce calda sul granito al tramonto."}
      ],
      end:{place:"Tidal River - Parks Victoria", label:"Notte (2ª)", note:"Attento ai wombat di notte sulle strade interne."}
    },
    daily:{
      night:{title:"Tidal River - Parks Victoria (2ª notte)", text:"Stessa base, nessuno spostamento bagagli.", meta:["parks victoria"]},
      excursions:[
        {t:"Alba coi wombat a Tidal River", s:"Wombat, canguri ed emu girano nel campground all'alba e al tramonto."},
      ],
      foodFuel:[
        {t:"Acqua e snack nelle hike", s:"Niente chioschi sui sentieri.", meta:["water","food"]}
      ],
      notes:[
        {t:"Giornata senza guida lunga", s:"Goditi il parco."},
        {t:"Attento ai wombat di notte", s:"Sulle strade interne del parco."}
      ]
    }
  },

// Giorno 9 - Phillip Island

  {
    id:"phillip-island",
    day:"Giorno 9 - mer 18/11", title:"Phillip Island & parata dei pinguini",
    chips:["Tidal River -> Phillip Island","~230 km","~3 h"],
    route:{
      start:{place:"Tidal River", label:"Partenza", time:"Mattina", note:"Via Foster/Leongatha e il ponte di San Remo."},
      stops:[
        {place:"Foster / Leongatha / Meeniyan etc..", type:"quick", note:"Sosta lungo il trasferimento.", segmentFromPrevious:{mode:"drive", duration:"~1-2 h"}},
        {place:"San Remo", type:"planned", note:"Ingresso a Phillip Island. Pranzo e pellicani (feeding!).", segmentFromPrevious:{mode:"drive", duration:"~2 h"}},
        {place:"Pyramid rock", type:"viewpoint", note:"Lookout con una little walk", segmentFromPrevious:{mode:"drive", duration:"~20 min"}},
        {place:"The Nobbies & Seal Rocks", type:"viewpoint", note:"Passerelle a picco sul mare, colonia di otarie.", segmentFromPrevious:{mode:"drive", duration:"~20 min"}},
        {place: "Check in The Point Villa", type:"planned", note:"Entro le 17:30!", segmentFromPrevious:{mode:"drive", duration:"~20 min"}},
        {place:"Penguin Parade", type:"planned", note:"I pinguini sbarcano ~19:30.", segmentFromPrevious:{notes:["Arriva in anticipo per il posto ~ 19:00"]}}
      ],
      end:{place:"The Point Villa", label:"Notte", note:"Check-in dalle 16:00, entro le 17:30 per pinguini!."}
    },
    daily:{
      night:{title:"The Point Villa", text:"Check-in dalle le 16:00."},
      excursions:[
        {t:"Penguin Parade (sera)", s:"Escursione notturna inizia alle 19:30"},
        {t:"Koala Conservation Reserve", s:"Passerelle tra gli eucalipti coi koala."},
        {t:"Feeding pellicani al San Remo Fishers Hop (12:00)", s:"Pellicani!"},

      ],
      foodFuel:[{t: "Rifornimento e soste nei paesi lungo la strada", s: "Foster, Leongatha, Meeniyan, San Remo.", meta:["fuel","food"]}],
      notes:[
        {t:"Porta una giacca (forse poncho usa e getta per cacca di gabbiano)", s:"La sera in tribuna fa fresco e vento."},
        {t:"Niente foto ai pinguini", s:"Flash vietato."}
      ]
    }
  },

// Giorno 10 - verso Melbourne

  {
    id:"melbourne-arrivo",
    day:"Giorno 10 - gio 19/11", title:"Phillip Island -> Melbourne",
    chips:["Phillip Island -> Melbourne","~140 km","~2 h"],
    route:{
      start:{place:"The Point Villa", label:"Partenza", time:"Mattina", note:"Almost done.."},
      stops:[
        {place:"Healesville Sanctuary", type:"optional", note:"Solo se non abbiamo visto degli animali.", segmentFromPrevious:{mode:"drive", duration:"~1:30 h"}},
        {place:"Riconsegna auto", type:"planned", note:"Valuta di riconsegnarla ora se non ti serve in citta (parcheggi cari).", segmentFromPrevious:{duration:"~1 h",notes:["previsto alle 18:00"]}},
        {place:"Check-in hotel", type:"planned", note:"Arrivo e sistemazione in hotel (valuta se farlo prima di riconsegnare auto)", segmentFromPrevious:{mode:"drive", duration:"~25 min"}},
        {place:"St. Kilda", type:"optional", note:"Spiaggia urbana; pinguini al molo al tramonto (gratis).", segmentFromPrevious:{mode:"tram", duration:"~30 min"}},
        {place:"Laneways & rooftop bar", type:"optional", note:"Hosier Lane, Centre Place", segmentFromPrevious:{mode:"tram", notes:["Free Tram Zone in centro"]}}
      ],
      end:{place:"Causeway 353 hotel", label:"Check-in / notte", time:"Pomeriggio", note:"CBD zone."}
    },
    daily:{
      night:{title:"Causeway 353 hotel", text:"CBD"},
      excursions:[
        {t:"Arrivo a Melbourne nel pomeriggio", s:"Check-in e primo giro in citta."},
        {t:"St Kilda", s:"Spiaggia urbana; pinguini al molo al tramonto (gratis)."},
        {t:"Laneways & rooftop bar", s:"Hosier Lane, Centre Place, caffe."},
      ],
      foodFuel:[],
      notes:[
        {t:"Riconsegna auto?", s:"Valuta di riconsegnarla e gestire il check-in in hotel accordingly"},
        {t:"Deposito bagagli aeroporto?", s:"Valuta di mollare i bagagli in aeroporto se possibile per il giorno dopo."},
        {t:"Free Tram Zone", s:"I tram nel centro sono gratis.",},
        {t:"PROBLEMA: slot pinguini St Kilda", s:"Si apre martedi 17/11 alle 10:00, quando sei a Tidal River senza campo. Soluzioni: prenotare da Melbourne prima di partire, farlo fare a qualcuno da casa, o salire su Mt Oberon a cercare segnale. https://bookings.penguins.org.au/BookingCat/Availability/?ParentCategory=STKD"},
        {t:"More info", s:"Consulta https://www.visitmelbourne.com/regions/melbourne/see-and-do"}

      ]
    }
  },

// Giorno 11 - Melbourne e volo serale

  {
    id:"melbourne-volo",
    day:"Giorno 11 - ven 20/11", title:"Melbourne & volo notturno",
    chips:["Melbourne","volo 00:30","-> Singapore 5:20","ultimo giorno"],
    route:{
      start:{place:"Causeway 353 hotel", label:"Check-out", time:"~10:00", note:"Check-out la mattina ma il volo e a mezzanotte e mezza: lascia i bagagli in deposito all'hotel per tutta la giornata."},
      stops:[
        {place:"Giro al CBD", type:"optional", note:"Passeggiata nel centro di Melbourne.", segmentFromPrevious:{mode:"walk"}},
        {place:"Queen Victoria Market", type:"planned", note:"Ultimi souvenir", segmentFromPrevious:{mode:"walk"}, duration:"20 min"},
        {place:"Fitzroy e Collingwood", type:"optional", note:"Quartieri creativi, street art, caffe.", segmentFromPrevious:{mode:"walk"}},
        {place:"Royal Botanic Gardens / Shrine of Remembrance", type:"optional", note:"Verde e skyline.", segmentFromPrevious:{mode:"tram", duration:"45 min"}},
        {place:"Skydeck?", type:"optional", note:"Panorama dall'alto prima di partire.", segmentFromPrevious:{mode:"tram"}},
        {place:"Ritiro bagagli in hotel", type:"planned", time:"~20:00", note:"Cena in citta prima di recuperare le valigie.", segmentFromPrevious:{mode:"tram", duration:"~20 min"}},
      ],
      end:{place:"Melbourne Airport", label:"Volo 00:30 -> Singapore", time:"21:30 in aeroporto", icon:"plane", note:"Decollo 00:30 del 21/11, atterraggio a Singapore alle 5:20 (~7 h 50 di volo, fuso -3 h). Volo internazionale: 3 h prima al banco.", segmentFromPrevious:{mode:"bus", distance:"~25 km", duration:"~45 min", notes:["SkyBus da Southern Cross o taxi","Margine per il traffico del venerdi sera"]}}
    },
    daily:{
      titles:{excursions:"Prima di partire"},
      night:{title:"Si dorme in volo", text:"Decollo 00:30 (notte tra il 20 e il 21), Singapore alle 5:20.", meta:["volo","niente hotel"]},
      excursions:[
        {t:"Giro in CBD", s:"Block Arcade, Centre Pl., Degraves Street, Flinders Street, etc."},
        {t:"Shrine of Remembrance / Botanic Gardens", s:"Verde e skyline."},
        {t:"Eureka Skydeck", s:"Panorama dall'alto prima di partire."}
      ],
      foodFuel:[
        {t:"Ultimi souvenir al Queen Victoria Market", s:"Prima del trasferimento in aeroporto.", meta:["food"]}
      ],
      notes:[
        {t:"Deposito bagagli tutto il giorno", s:"Check-out la mattina, volo a mezzanotte e mezza: chiedi il luggage storage all'hotel (di solito gratis) invece di trascinarti le valigie."},
        {t:"In aeroporto per le 21:30", s:"Tullamarine, volo internazionale: 3 h prima. Il venerdi sera il traffico verso l'aeroporto e peggiore."},
        {t:"Scalo a Singapore", s:"Atterraggio alle 5:20 del mattino: controlla quanto dura lo scalo e se serve fare di nuovo i controlli."},
        {t:"Ultimo giorno lunghissimo", s:"Sveglia a Melbourne, notte in aereo: non incastrare troppe cose nel pomeriggio."}
      ]
    }
  }
];
