/* ============================================================
   CRONOPROGRAMMA - modifica qui gli orari.

   Ogni giorno:
     date  : "AAAA-MM-GG"
     title : titolo breve del giorno
     leg   : "home" | "perth" | "west" | "east"   (colore della testata)
     tz    : fuso orario mostrato sotto la data
     night : dove si dorme (facoltativo)
     allday: riga "tutto il giorno" (facoltativo)
     ev    : elenco attivita', ognuna
             [inizio, fine, categoria, titolo, flag, nota]
               - orari in ora LOCALE ("7:30", "24:00" = mezzanotte)
               - categoria: una chiave di CAL_CATS qui sotto
               - flag: ""  = orario stimato (dalle durate dei planner)
                       "f" = orario FISSO / prenotato
                       "o" = facoltativo
   ============================================================ */

const CAL_CATS = {
  guida:     { label:"Guida",              color:"#c65a37" },
  volo:      { label:"Volo",               color:"#4b3f8f" },
  trasporti: { label:"Ferry, bus, treno",  color:"#d39b3e" },
  natura:    { label:"Natura & hike",      color:"#3d8b4f" },
  mare:      { label:"Mare & snorkeling",  color:"#2a7fbf" },
  tour:      { label:"Tour prenotati",     color:"#d2568a" },
  citta:     { label:"Citta' & visite",    color:"#1f7d77" },
  cibo:      { label:"Cibo & vino",        color:"#8c5a3c" },
  logistica: { label:"Logistica & spesa",  color:"#66707a" },
  relax:     { label:"Relax / libero",     color:"#c9ad7f" }
};

const CAL_LEGS = {
  home:  { label:"Viaggio",          color:"#5b4a9e" },
  perth: { label:"Perth",            color:"#9a7836" },
  west:  { label:"Coral Coast",      color:"#c65a37" },
  east:  { label:"Great Ocean Road", color:"#0f8f84" }
};

const CAL_DAYS = [

  /* ---------------- andata e Perth ---------------- */
  { date:"2026-10-22", title:"Partenza da Amsterdam", leg:"home", tz:"ora di Amsterdam",
    ev:[
      ["9:45","12:20","logistica","Schiphol: check-in e controlli","f","Volo Cathay Pacific alle 12:20."],
      ["12:20","24:00","volo","Volo AMS → Hong Kong","f","Cathay Pacific. Atterraggio 06:10 ora di Hong Kong (+6 h)."]
    ]},
  { date:"2026-10-23", title:"Hong Kong → Perth", leg:"home", tz:"UTC+8 (HKG = Perth)", night:"Perth · hotel della conferenza",
    ev:[
      ["0:00","6:10","volo","Volo AMS → Hong Kong","f","Arrivo 06:10."],
      ["6:10","15:00","relax","Scalo a Hong Kong","f","~9 h di scalo."],
      ["15:00","22:40","volo","Volo Hong Kong → Perth","f","Cathay Pacific, arrivo 22:40."],
      ["22:40","23:40","trasporti","Aeroporto → hotel","",""]
    ]},
  { date:"2026-10-24", title:"Perth", leg:"perth", tz:"AWST · UTC+8", allday:"Conferenza a Perth", night:"Perth · hotel della conferenza", ev:[] },
  { date:"2026-10-25", title:"Perth", leg:"perth", tz:"AWST · UTC+8", allday:"Conferenza a Perth", night:"Perth · hotel della conferenza", ev:[] },
  { date:"2026-10-26", title:"Perth", leg:"perth", tz:"AWST · UTC+8", allday:"Conferenza a Perth", night:"Perth · hotel della conferenza", ev:[] },
  { date:"2026-10-27", title:"Perth", leg:"perth", tz:"AWST · UTC+8", allday:"Conferenza a Perth", night:"Perth · hotel della conferenza", ev:[] },
  { date:"2026-10-28", title:"Perth + 2° volo", leg:"perth", tz:"AWST · volo in ora di AMS", allday:"Conferenza a Perth", night:"Perth · hotel della conferenza",
    ev:[
      ["9:45","12:30","logistica","Schiphol: check-in (2° volo)","f","Secondo volo Cathay Pacific."],
      ["12:30","24:00","volo","2° volo AMS → Hong Kong","f","Atterraggio 07:30 ora di Hong Kong."]
    ]},
  { date:"2026-10-29", title:"Perth + arrivo 2° volo", leg:"perth", tz:"AWST · UTC+8", allday:"Conferenza a Perth", night:"Perth",
    ev:[
      ["0:00","7:30","volo","2° volo AMS → Hong Kong","f",""],
      ["7:30","15:20","relax","Scalo a Hong Kong","f",""],
      ["15:20","22:55","volo","2° volo Hong Kong → Perth","f","Arrivo 22:55."],
      ["22:55","23:50","trasporti","Aeroporto → hotel","",""]
    ]},

  /* ---------------- Coral Coast ---------------- */
  { date:"2026-10-30", title:"Perth, la citta'", leg:"west", tz:"AWST · UTC+8", night:"Malibu Apartments",
    ev:[
      ["8:00","9:00","cibo","Colazione specialty coffee","",""],
      ["9:00","10:00","logistica","Check-out Ibis Styles","","Bus ~30 min andata e ritorno. Bagagli gia' al Malibu."],
      ["10:15","12:30","citta","Kings Park & Botanic Garden","","Vista su citta' e Swan River. A piedi ~25 min o bus CAT gratuito."],
      ["12:30","13:30","cibo","Pranzo","",""],
      ["13:30","15:30","citta","Elizabeth Quay + Swan River","","Lungofiume, ponte pedonale, pausa caffe'."],
      ["15:30","16:30","citta","London Court","o","Galleria in finto Tudor."],
      ["16:30","18:00","logistica","SIM, contanti, spesa leggera","","Per domani a Rottnest."],
      ["19:00","21:00","cibo","Cena a Northbridge","o","Asiatico, pub o fine dining."]
    ]},
  { date:"2026-10-31", title:"Rottnest Island: quokka!", leg:"west", tz:"AWST · UTC+8", night:"Malibu Apartments",
    ev:[
      ["7:45","8:30","logistica","Al terminal di Elizabeth Quay","f","Check-in 30 min prima, a piedi ~15 min."],
      ["8:30","10:00","trasporti","Ferry SeaLink → Rottnest","f","Biglietti gia' comprati."],
      ["10:00","10:30","logistica","Ritiro bici Pedal & Flipper","f","Thomson Bay."],
      ["10:30","12:30","mare","Bici: quokka, The Basin, Pinky Beach","","Snorkeling nelle baie vicino al molo."],
      ["12:30","13:30","cibo","Pranzo a Thomson Bay","","Pic-nic o bakery."],
      ["13:30","17:15","natura","Bici: laghi salati e faro","","Giro dell'isola, spiagge piu' belle."],
      ["17:15","18:00","logistica","Riconsegna bici, al molo","f","Il ferry delle 18:00 e' l'ultimo utile."],
      ["18:00","18:30","trasporti","Ferry → Fremantle","f","Sbarco a Victoria Quay."],
      ["18:30","20:30","cibo","Cena a Fremantle","",""],
      ["20:30","21:15","trasporti","Treno Fremantle Line → Perth","","Poi 10 min a piedi."]
    ]},
  { date:"2026-11-01", title:"Ritiro van → Cervantes", leg:"west", tz:"AWST · UTC+8", night:"RAC Cervantes Holiday Park",
    ev:[
      ["7:00","7:45","cibo","Colazione + check-out","",""],
      ["7:45","8:45","trasporti","Bus → Redcliffe","",""],
      ["9:00","10:00","logistica","Ritiro van Mighty Duo","f","2 Redcliffe Rd. Foto a tutto, IDP, cauzione $5.000."],
      ["10:00","11:00","logistica","Spesa grossa + pieno","","Chimico WC, retina antimosche, frontalini, tanica."],
      ["11:00","13:30","guida","Perth → Cervantes","","~2:30 h, Indian Ocean Drive."],
      ["13:30","14:30","cibo","Pranzo al Lobster Shack","",""],
      ["14:30","15:00","logistica","Check-in RAC Cervantes","",""],
      ["15:00","15:45","natura","Lake Thetis (stromatoliti)","o",""],
      ["15:45","16:15","natura","Hangover Bay","o","Scogliere e canguri."],
      ["16:30","19:15","natura","Pinnacles Desert al tramonto","","Loop a piedi o in van. Tramonto ~18:50."],
      ["19:30","21:00","cibo","Cena al van","",""]
    ]},
  { date:"2026-11-02", title:"Verso Kalbarri", leg:"west", tz:"AWST · UTC+8", night:"Tasman Holiday Park · Kalbarri",
    ev:[
      ["6:30","7:00","cibo","Colazione veloce","",""],
      ["7:00","9:30","guida","Cervantes → Geraldton","","~2:30 h."],
      ["9:30","10:30","logistica","Spesa, benzina, acqua","","Ultima citta' grande."],
      ["10:30","12:00","guida","Geraldton → Hutt Lagoon","","~1:30 h."],
      ["12:00","12:45","natura","Hutt Lagoon (lago rosa)","","Colore migliore tra le 10 e le 14."],
      ["12:45","13:30","cibo","Pranzo pic-nic a Port Gregory","",""],
      ["13:30","14:15","guida","→ Kalbarri","",""],
      ["14:15","14:45","logistica","Check-in Tasman","",""],
      ["14:45","16:30","relax","Blue Holes / riposo","o","Vicino al camping."],
      ["16:30","19:00","natura","Coastal Cliffs al tramonto","","Red Bluff, Pot Alley, Rainbow Valley, Island Rock, Natural Bridge."],
      ["19:15","20:30","cibo","Cena","",""]
    ]},
  { date:"2026-11-03", title:"Kalbarri National Park", leg:"west", tz:"AWST · UTC+8", night:"Tasman Holiday Park · Kalbarri",
    ev:[
      ["5:00","5:30","cibo","Colazione all'alba","","Niente ombra nelle gole: si parte presto."],
      ["5:30","6:00","guida","→ Nature's Window","",""],
      ["6:00","8:30","natura","Nature's Window + The Loop","","3-4 L d'acqua a testa, scarpe chiuse."],
      ["8:30","8:45","guida","→ Z-Bend","",""],
      ["8:45","9:45","natura","Z-Bend lookout","",""],
      ["9:45","10:00","guida","→ Skywalk","",""],
      ["10:00","11:00","natura","Kalbarri Skywalk","",""],
      ["11:00","11:30","guida","Rientro a Kalbarri","",""],
      ["11:30","12:30","cibo","Pranzo","",""],
      ["12:30","15:30","relax","Riposo nelle ore calde","",""],
      ["15:30","17:30","mare","Nuotata nel Murchison River","o","O Blue Holes."],
      ["18:00","19:00","logistica","Bucato a mano","","Intimo, calze, costumi."],
      ["19:00","20:30","cibo","Cena","",""]
    ]},
  { date:"2026-11-04", title:"Verso Coral Bay (la lunga)", leg:"west", tz:"AWST · UTC+8", night:"Peoples Park · Coral Bay",
    ev:[
      ["6:00","10:40","guida","Kalbarri → Carnarvon","","~4:40 h, con soste brevi."],
      ["10:40","11:30","cibo","Pranzo a Carnarvon","",""],
      ["11:30","12:30","logistica","Spesa per 4 giorni + pieno","","Dopo Carnarvon non c'e' piu' niente."],
      ["12:30","15:00","guida","Carnarvon → Coral Bay","","~2:30 h, stazioni diradate."],
      ["15:00","15:30","logistica","Check-in Peoples Park","",""],
      ["15:30","18:30","mare","Primo bagno a Bill's Bay","o",""],
      ["19:00","20:30","cibo","Cena","",""]
    ]},
  { date:"2026-11-05", title:"Coral Bay", leg:"west", tz:"AWST · UTC+8", night:"Peoples Park · Coral Bay",
    ev:[
      ["6:45","7:35","logistica","Avvia la lavatrice","","Si stende al rientro: miglior asciugatura del viaggio."],
      ["7:45","12:30","tour","Tour mante · Marine Eco Safari","f","Check-in 15 min prima (7:45), partenza 8:00. Fine stimata."],
      ["12:30","13:30","cibo","Pranzo","",""],
      ["13:30","14:00","logistica","Stendere il bucato","",""],
      ["14:00","17:30","mare","Snorkeling a Bill's Bay","","Tartarughe, razze, squali di barriera."],
      ["17:30","19:00","relax","Tramonto in spiaggia","o","Possibile snorkeling al tramonto."],
      ["19:00","20:30","cibo","Cena","",""]
    ]},
  { date:"2026-11-06", title:"Coral Bay → Shark Bay", leg:"west", tz:"AWST · UTC+8", night:"Tasman Holiday Park · Denham",
    ev:[
      ["6:00","10:30","guida","Coral Bay → Overlander","","~4:30 h."],
      ["10:30","11:00","logistica","Benzina + snack Overlander","",""],
      ["11:00","11:50","guida","→ Shell Beach","",""],
      ["11:50","12:45","natura","Shell Beach","","Conchiglie al posto della sabbia."],
      ["12:45","13:30","cibo","Pranzo pic-nic","",""],
      ["13:30","13:50","guida","→ Eagle Bluff","",""],
      ["13:50","14:45","natura","Eagle Bluff","","Squali, razze, dugonghi dall'alto."],
      ["14:45","15:05","guida","→ Little Lagoon","",""],
      ["15:05","16:30","mare","Little Lagoon","o","Breve bagno."],
      ["16:30","17:15","logistica","Check-in Tasman Denham","",""],
      ["17:15","18:45","relax","Lungomare di Denham","o",""],
      ["19:00","20:30","cibo","Cena","",""]
    ]},
  { date:"2026-11-07", title:"Francois Peron NP", leg:"west", tz:"AWST · UTC+8", night:"RAC Monkey Mia Dolphin Resort",
    ev:[
      ["7:00","7:45","cibo","Colazione","",""],
      ["7:45","8:30","logistica","Rifornimenti a Denham","","Benzina, spesa, acqua."],
      ["8:45","16:45","tour","Tour 4WD Francois Peron","f","Pick-up 8:45 allo Shoreline shop di Denham. Pranzo incluso. Rientro 16:30-17:00."],
      ["17:00","17:30","guida","Denham → Monkey Mia","","~20 min."],
      ["17:30","18:00","logistica","Check-in RAC Monkey Mia","",""],
      ["18:00","19:00","relax","Tramonto sulla spiaggia","o","Bucato a mano facoltativo (non stendere nel van domani)."],
      ["19:00","20:30","cibo","Cena","",""]
    ]},
  { date:"2026-11-08", title:"Monkey Mia → Jurien Bay", leg:"west", tz:"AWST · UTC+8", night:"Jurien Bay Tourist Park",
    ev:[
      ["7:30","9:00","natura","Delfini di Monkey Mia","","Prima sessione coi ranger ~7:45. Ingresso a parte."],
      ["9:00","10:40","guida","→ Overlander Roadhouse","","~1:40 h."],
      ["10:40","11:00","logistica","Benzina + snack","",""],
      ["11:00","13:15","guida","→ Northampton","","~2:15 h."],
      ["13:15","14:00","cibo","Pranzo a Northampton","",""],
      ["14:00","14:50","guida","→ Leaning Trees","",""],
      ["14:50","15:10","natura","Leaning Trees","o","Alberi piegati dal vento."],
      ["15:10","17:10","guida","→ Lesueur NP","","~2 h."],
      ["17:10","18:00","natura","Lesueur NP scenic drive","o","~18,5 km, wildflowers."],
      ["18:00","18:20","guida","→ Jurien Bay","",""],
      ["18:20","19:00","logistica","Check-in + svuota i serbatoi","","Grigi e neri al dump point: domani niente tempo."],
      ["19:00","20:30","cibo","Ultima cena in van","",""]
    ]},
  { date:"2026-11-09", title:"Leoni marini → Perth", leg:"west", tz:"AWST · UTC+8", night:"Sunlit Minimal · Perth",
    ev:[
      ["6:30","7:00","logistica","Al porto: muta","f","Jurien Bay Boat Harbour, 15 min prima."],
      ["7:00","9:30","tour","Sea Lions excursion","f","Partenza 7:00, fine ~9:30."],
      ["9:30","12:00","guida","Jurien Bay → Swan Valley","","~2:25 h."],
      ["12:00","12:45","cibo","Pranzo veloce Swan Valley","o","Niente degustazione: limite 0,05."],
      ["12:45","13:45","logistica","Pieno + pulizia van","","Carburante allo stesso livello del ritiro."],
      ["13:45","14:05","guida","→ Redcliffe","",""],
      ["14:05","14:30","logistica","Riconsegna van","f","Entro le 14:30. Foto a tutto."],
      ["14:30","15:00","trasporti","→ Sunlit Minimal","",""],
      ["15:00","15:30","logistica","Check-in hotel","",""],
      ["15:30","18:30","relax","Riposo","",""],
      ["19:00","21:30","cibo","Ultima cena west coast","","In taxi: 2.700 km fatti!"]
    ]},
  { date:"2026-11-10", title:"Volo per Adelaide", leg:"west", tz:"AWST → ACDT (+2:30)", night:"BreakFree Adelaide",
    ev:[
      ["8:00","9:00","cibo","Colazione in citta'","","L'ultima col caffe' di Perth."],
      ["9:00","9:35","logistica","Check-out + taxi","",""],
      ["9:35","10:00","trasporti","→ Perth Airport","",""],
      ["10:00","12:00","logistica","Aeroporto PER","f","2 h prima."],
      ["12:00","17:20","volo","Volo Jetstar Perth → Adelaide","f","~2 h 50 di volo: 12:00 ora di Perth, 17:20 ora di Adelaide."],
      ["17:20","18:00","trasporti","Shuttle → filiale East Coast","","SMS 24 h prima o pickmeup.eccr.com.au."],
      ["18:00","18:45","logistica","Ritiro auto East Coast","f","Passaporto, IDP, aggiungere Rebecca come guidatrice."],
      ["18:45","19:15","logistica","Check-in BreakFree","",""],
      ["19:15","21:15","cibo","Cena + giro nel CBD","",""],
      ["21:15","22:00","citta","Riverbank & Adelaide Oval","o",""]
    ]},

  /* ---------------- Great Ocean Road ---------------- */
  { date:"2026-11-11", title:"Hills, grotte e vino", leg:"east", tz:"ACDT → AEDT (+0:30)", night:"Grampians View Cottages",
    ev:[
      ["6:45","7:30","logistica","Benzina + spesa","","Fai tutto prima di lasciare Adelaide."],
      ["7:30","8:00","guida","→ Hahndorf","",""],
      ["8:00","9:00","cibo","Colazione a Hahndorf","","Borgo tedesco."],
      ["9:00","12:15","guida","Hahndorf → Naracoorte","","~3:15 h."],
      ["12:15","13:00","cibo","Pranzo","",""],
      ["13:00","14:30","tour","Tour Naracoorte Caves","","Tour DA SCEGLIERE: durate diverse."],
      ["14:30","15:00","guida","→ Coonawarra","",""],
      ["15:00","16:30","cibo","Degustazione a Coonawarra","o","Verificare prenotazione. Chi guida non beve."],
      ["16:30","19:30","guida","Coonawarra → Grampians","","~2:30 h + 30 min di fuso entrando in Victoria."],
      ["19:30","20:00","logistica","Check-in Grampians View","",""],
      ["20:00","21:00","cibo","Cena","",""]
    ]},
  { date:"2026-11-12", title:"Grampians National Park", leg:"east", tz:"AEDT · UTC+11", night:"Grampians View Cottages",
    ev:[
      ["5:45","6:00","guida","→ Wonderland car park","",""],
      ["6:00","9:00","natura","Grand Canyon + Pinnacles","","~3 h, all'alba."],
      ["9:00","9:15","guida","Rientro","",""],
      ["9:15","10:30","logistica","Colazione + lavatrice","","Coin laundry del Grampians View."],
      ["10:30","11:00","guida","→ Zumsteins","",""],
      ["11:00","13:30","natura","Fish Falls (MacKenzie)","","~2:30 h."],
      ["13:30","14:15","cibo","Pranzo pic-nic","",""],
      ["14:15","14:45","guida","→ Silverband Falls","o",""],
      ["14:45","15:45","natura","Silverband Falls","o","La prima da tagliare."],
      ["16:00","17:30","relax","Riposo + bucato","",""],
      ["17:30","18:30","cibo","Cena presto","",""],
      ["18:40","19:00","guida","→ Reeds Lookout","",""],
      ["19:00","20:30","natura","Reeds Lookout & The Balconies","","Tramonto ~20:15."],
      ["20:30","21:00","natura","Canguri a Halls Gap","o","Nei prati del paese."]
    ]},
  { date:"2026-11-13", title:"Great Ocean Road", leg:"east", tz:"AEDT · UTC+11", night:"Anglesea · casa Lamb",
    ev:[
      ["5:45","6:15","logistica","Pieno all'Ampol di Halls Gap","","La GOR ha distributori radi e cari."],
      ["6:15","8:15","guida","→ Tower Hill","","~2 h."],
      ["8:15","9:30","natura","Tower Hill","","Emu, koala e canguri liberi."],
      ["9:30","10:00","guida","→ Bay of Islands","",""],
      ["10:00","11:45","natura","Bay of Islands, Grotto, London Bridge","",""],
      ["11:45","12:45","cibo","Pranzo a Port Campbell","","+ bagno riparato."],
      ["12:45","14:30","natura","Loch Ard Gorge, 12 Apostoli, Gibson Steps","",""],
      ["14:30","16:00","guida","→ Apollo Bay","",""],
      ["16:00","16:45","mare","Apollo Bay","o",""],
      ["16:45","18:30","guida","→ Lorne via Cape Patton","","Tutta curve."],
      ["18:30","19:30","cibo","Cena a Lorne","",""],
      ["19:30","20:15","guida","→ Anglesea (Aireys Inlet)","","Imbrunire: canguri sulla strada!"]
    ]},
  { date:"2026-11-14", title:"Otway orientali", leg:"east", tz:"AEDT · UTC+11", night:"Anglesea · casa Lamb",
    ev:[
      ["8:00","11:00","relax","Mattina chill ad Anglesea","","Mare, canguri. Chiedere i sacchi a pelo!"],
      ["11:00","12:10","guida","→ Lake Elizabeth","",""],
      ["12:10","13:10","natura","Lake Elizabeth loop","o",""],
      ["13:10","13:40","cibo","Pranzo pic-nic","",""],
      ["13:40","14:40","guida","→ Triplet Falls","",""],
      ["14:40","15:40","natura","Triplet Falls","","Ancient forest. Occhio alle sanguisughe."],
      ["15:40","16:10","guida","→ Hopetoun Falls","",""],
      ["16:10","17:15","natura","Hopetoun Falls + Redwoods","",""],
      ["17:15","18:25","guida","→ Kennett River","",""],
      ["18:25","19:30","natura","Koala selvatici a Kennett River","","+ king parrots."],
      ["19:30","20:45","cibo","Cena sulla via","",""],
      ["21:00","21:45","natura","Glow-worms","o","Dopo il buio."],
      ["21:45","23:00","guida","Rientro ad Anglesea","","Massima attenzione."]
    ]},
  { date:"2026-11-15", title:"Traghetto + Hot Springs", leg:"east", tz:"AEDT · UTC+11", night:"Peninsula Beach Motel · Capel Sound",
    ev:[
      ["8:00","9:00","cibo","Colazione e saluti","",""],
      ["9:00","10:00","guida","Anglesea → Queenscliff","","Spesa a Torquay se serve."],
      ["10:00","10:30","citta","Queenscliff","",""],
      ["10:30","11:00","logistica","Al molo","","30 min prima. Orario slot: verificare."],
      ["11:00","11:40","trasporti","Traghetto → Sorrento","f","Slot auto prenotato (orario stimato)."],
      ["11:40","13:30","cibo","Pranzo a Sorrento","",""],
      ["13:30","13:50","guida","→ Peninsula Hot Springs","",""],
      ["14:00","18:30","relax","Peninsula Hot Springs","","DA PRENOTARE. Aperta fino alle 23."],
      ["18:30","18:50","guida","→ Sorrento","o",""],
      ["19:00","20:30","cibo","Cena a Sorrento","o",""],
      ["20:30","20:45","guida","→ motel","",""]
    ]},
  { date:"2026-11-16", title:"Verso Wilsons Prom", leg:"east", tz:"AEDT · UTC+11", night:"Tidal River · hut",
    ev:[
      ["8:30","9:00","logistica","Check-out","",""],
      ["9:00","11:00","guida","→ Foster","","~2 h."],
      ["11:00","12:00","logistica","Spesa per 3 giorni + benzina","","Ultima prima del parco."],
      ["12:00","12:45","cibo","Pranzo a Foster","",""],
      ["12:45","13:45","guida","→ Tidal River","",""],
      ["14:00","14:30","logistica","Check-in hut","f","Dalle 14:00. Niente lenzuola: sacchi a pelo."],
      ["14:30","16:30","mare","Squeaky Beach + Whisky Bay","o",""],
      ["16:30","17:30","relax","Norman Beach","o",""],
      ["17:30","18:30","cibo","Cena presto in hut","",""],
      ["18:30","20:45","natura","Mount Oberon al tramonto","","~1:30 h a/r da Telegraph Saddle."]
    ]},
  { date:"2026-11-17", title:"Wilsons Prom, giornata piena", leg:"east", tz:"AEDT · UTC+11", night:"Tidal River · hut",
    ev:[
      ["6:00","7:00","natura","Alba coi wombat","","Nel campground."],
      ["7:00","8:00","cibo","Colazione","",""],
      ["8:00","13:00","natura","Hike: Lilly Pilly o Sealers Cove","","Acqua e snack: niente chioschi."],
      ["10:00","10:15","logistica","Si apre lo slot pinguini St Kilda","f","Qui senza campo: farlo fare a qualcuno o cercare segnale."],
      ["13:00","14:00","cibo","Pranzo","",""],
      ["14:00","16:00","mare","Nuoto/relax a Tidal River","o",""],
      ["16:30","18:30","natura","Big Drift (dune)","o",""],
      ["18:45","19:45","cibo","Cena","",""],
      ["19:45","20:45","mare","Squeaky Beach al tramonto","","Luce calda sul granito."]
    ]},
  { date:"2026-11-18", title:"Phillip Island + pinguini", leg:"east", tz:"AEDT · UTC+11", night:"The Point Villa",
    ev:[
      ["8:00","8:30","logistica","Check-out hut","",""],
      ["8:30","9:45","guida","→ Meeniyan / Leongatha","",""],
      ["9:45","10:15","cibo","Caffe'","",""],
      ["10:15","11:45","guida","→ San Remo","",""],
      ["11:45","12:30","natura","Feeding pellicani","f","San Remo, alle 12:00."],
      ["12:30","13:30","cibo","Pranzo a San Remo","",""],
      ["13:30","14:00","guida","→ Pyramid Rock","",""],
      ["14:00","14:45","natura","Pyramid Rock","",""],
      ["14:45","15:05","guida","→ The Nobbies","",""],
      ["15:05","16:30","natura","Nobbies & Seal Rocks","","Otarie."],
      ["16:30","16:50","guida","→ The Point Villa","",""],
      ["16:50","17:30","logistica","Check-in The Point Villa","f","Entro le 17:30."],
      ["17:30","18:30","cibo","Cena presto","",""],
      ["18:30","19:00","guida","→ Penguin Parade","",""],
      ["19:00","19:30","logistica","Ingresso con il QR","",""],
      ["19:30","21:30","tour","Penguin Parade · Ultimate Adventure","f","Inizio 19:30. Giacca! Niente foto."]
    ]},
  { date:"2026-11-19", title:"→ Melbourne", leg:"east", tz:"AEDT · UTC+11", night:"Causeway 353 · Melbourne",
    ev:[
      ["8:30","9:30","cibo","Colazione + check-out","",""],
      ["9:30","11:00","guida","→ Healesville","o",""],
      ["11:00","13:30","natura","Healesville Sanctuary","o","Solo se mancano animali."],
      ["13:30","14:30","cibo","Pranzo","",""],
      ["14:30","15:45","guida","→ Melbourne CBD","",""],
      ["15:45","16:15","logistica","Check-in + lascia bagagli","","Causeway 353."],
      ["16:15","17:15","guida","→ Tullamarine","",""],
      ["17:15","17:45","logistica","Pieno di BENZINA","","Pieno-pieno."],
      ["17:45","18:15","logistica","Riconsegna auto","f","Ore 18:00, 2 Tarmac Dr."],
      ["18:15","19:15","trasporti","SkyBus → citta'","",""],
      ["19:15","19:45","trasporti","Tram → St Kilda","",""],
      ["19:45","20:45","cibo","Cena a St Kilda","",""],
      ["20:45","21:45","natura","Pinguini al molo di St Kilda","o","Slot da prenotare (si apre il 17/11)."],
      ["21:45","22:15","trasporti","Tram → hotel","",""]
    ]},
  { date:"2026-11-20", title:"Melbourne + volo notturno", leg:"east", tz:"AEDT · UTC+11", night:"In volo",
    ev:[
      ["9:00","10:00","cibo","Colazione","",""],
      ["10:00","10:30","logistica","Check-out + deposito bagagli","f",""],
      ["10:30","12:00","citta","Giro nel CBD","","Block Arcade, Centre Pl., Degraves St."],
      ["12:00","13:30","citta","Queen Victoria Market","","Ultimi souvenir + pranzo."],
      ["13:30","15:30","citta","Fitzroy e Collingwood","o","Street art e caffe'."],
      ["15:30","17:30","natura","Botanic Gardens / Shrine","o",""],
      ["17:30","18:30","citta","Eureka Skydeck","o",""],
      ["18:30","20:00","cibo","Ultima cena australiana","",""],
      ["20:00","20:30","logistica","Ritiro bagagli in hotel","f",""],
      ["20:30","21:15","trasporti","SkyBus → aeroporto","",""],
      ["21:15","24:00","logistica","Aeroporto MEL","f","Volo internazionale: 3 h prima."]
    ]},

  /* ---------------- ritorno ---------------- */
  { date:"2026-11-21", title:"Singapore → casa", leg:"home", tz:"ora di Melbourne / Singapore", night:"In volo",
    ev:[
      ["0:00","0:35","logistica","Imbarco","f",""],
      ["0:35","5:15","volo","Volo MEL → Singapore","f","Singapore Airlines. Arrivo 5:15 ora di Singapore."],
      ["5:15","23:55","relax","Scalo lungo a Changi","f","~18 h 40."],
      ["23:55","24:00","volo","Volo Singapore → AMS","f",""]
    ]},
  { date:"2026-11-22", title:"Bentornati", leg:"home", tz:"ora di Amsterdam",
    ev:[
      ["0:00","6:45","volo","Volo Singapore → AMS","f","Atterraggio 6:45."],
      ["6:45","7:45","trasporti","Schiphol → casa","",""]
    ]}
];
