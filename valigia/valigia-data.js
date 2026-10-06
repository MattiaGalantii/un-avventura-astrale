/* ============================================================
   VALIGIA - DATI
   Questo file contiene SOLO i dati. Il render sta in valigia-app.js,
   il guscio e tutto il CSS stanno in valigia.html.

   PUOI MODIFICARLO A MANO oppure con lo script valigia.py.
   Il contenuto fra i marcatori e' JSON valido (chiavi fra virgolette):
   se rompi le virgole o le parentesi la pagina resta bianca, quindi
   se editi a mano ricontrolla sempre aprendo il file nel browser.

   NON TOCCARE i marcatori  >>> NOME  e  <<< NOME :
   valigia.py li usa per trovare i due blocchi.

   ------------------------------------------------------------
   STRUTTURA DI UNA SEZIONE
     {
       "id":        chiave breve e stabile, es. "casa"
       "tone":      colore dell'icona: casa | ibrido | li | check | note
       "icon":      home | split | cart | check | bulb
       "kind":      "notes" per le sezioni di sole note; assente per le liste
       "n":         soprattitolo, es. "Sezione 1"
       "title":     titolo della sezione
       "sub":       riga di descrizione sotto il titolo
       "groups":    elenco di gruppi
     }

   STRUTTURA DI UN GRUPPO
     {
       "h":     titolo del gruppo
       "hint":  (facoltativo) paragrafo introduttivo in corsivo
       "items": elenco di voci spuntabili        <- sezioni normali
       "notes": elenco di note                   <- sezioni con kind "notes"
     }

   STRUTTURA DI UNA VOCE
     {
       "id":   CHIAVE DELLA SPUNTA SALVATA - NON CAMBIARLA MAI su una
               voce esistente, o perdi la spunta. Per una voce nuova
               inventane una che non esista gia'.
       "name": nome della voce
       "qty":  quantita', es. "x4" oppure "opz." oppure "-"
       "note": (facoltativo) spiegazione sotto il nome
       "tags": (facoltativo) etichette fra: leg1, leg2, sera, foto, key
     }

   STRUTTURA DI UNA NOTA
     { "h": titolo della card, "p": testo }
   ------------------------------------------------------------ */

/* >>> VALIGIA_UI */
const VALIGIA_UI = {
  "kicker": "Australia · 30 ott – 20 nov",
  "title": "Valigia",
  "subtitle": "Base Camp M + zaino · viaggiare leggeri con 2 lavatrici",
  "storeKey": "valigia_australia_v1",
  "saveHint": "Le spunte si salvano da sole in questo browser.",
  "stats": [
    {
      "v": "23",
      "l": "giorni"
    },
    {
      "v": "2 + 2",
      "l": "lavatrici / a mano"
    },
    {
      "v": "8 · 7 · 8",
      "l": "blocchi"
    },
    {
      "v": "~12 kg",
      "l": "obiettivo duffel"
    },
    {
      "v": "7 kg",
      "l": "max zaino in volo"
    },
    {
      "v": "10→38°C",
      "l": "escursione termica"
    }
  ],
  "washTitle": "Piano lavaggi",
  "washBadge": "8 · 7 · 8",
  "washIntro": "Due lavatrici vere più due risciacqui a mano. Coral Bay e Grampians spezzano i 23 giorni in blocchi da 8, 7 e 8 giorni: è la divisione migliore possibile, ed è quella che rende sufficienti 8 cambi di biancheria invece di 12.",
  "wash": [
    {
      "kind": "hand",
      "h": "A mano · mar 3/11 — Kalbarri",
      "p": "Giorno 5, seconda notte al Tasman. Rientrate dal parco nel pomeriggio: biancheria, calze, costumi e 1–2 magliette nel lavandino. A 35 °C e con vento asciuga prima del buio, e alleggerisce il primo blocco."
    },
    {
      "kind": "",
      "h": "Lavatrice 1 · gio 5/11 — Coral Bay",
      "p": "Giorno 7, giornata stanziale, seconda notte allo stesso park. Lavaggio generale di tutto lo sporco dei primi 8 giorni. Stendi entro mezzogiorno: alle 15 è asciutto. È il miglior punto di asciugatura del viaggio."
    },
    {
      "kind": "hand",
      "h": "A mano · sab 7/11 — Monkey Mia",
      "p": "Opzionale, solo se serve. NON stendere nel van mentre vai a Francois Peron: la pista è sabbia e polvere rossa e ritrovi tutto sporco. Sciacqua la sera al RAC e stendi lì."
    },
    {
      "kind": "",
      "h": "Lavatrice 2 · gio 12/11 — Grampians",
      "p": "Giorno 15, coin laundry al Grampians View, seconda notte. Falla la MATTINA della giornata di hiking: lì è fresco e umido, non puoi contare sul sole, e ti serve tutto il giorno più la sera per asciugare."
    },
    {
      "kind": "safety",
      "h": "Rete di sicurezza · 13–14/11 — Anglesea",
      "p": "Non è un terzo lavaggio: arrivate il giorno dopo i Grampians. Serve per finire di asciugare quello che il cottage non ha asciugato, lavare i pezzi ingombranti saltati al coin laundry (pantalone tecnico, pile, asciugamani) e fare un carico gratis prima dell'ultimo blocco."
    },
    {
      "kind": "tbd",
      "h": "Se il coin laundry salta",
      "p": "Se ai Grampians è occupato o rotto, Anglesea diventa la lavatrice 2 e i blocchi passano a 8 / 9 / 6. Regge lo stesso, ma è il motivo per cui NON scendere sotto le 8 mutande."
    }
  ],
  "tagLabels": {
    "leg1": "leg 1 · caldo WA",
    "leg2": "leg 2 · fresco VIC",
    "sera": "sera",
    "foto": "foto",
    "key": "critico"
  },
  "legendOrder": [
    "leg1",
    "leg2",
    "sera",
    "foto",
    "key"
  ],
  "footer": "Coral Coast → Great Ocean Road · lista valigia · le spunte restano salvate in questo browser"
};
/* <<< VALIGIA_UI */

/* >>> VALIGIA */
const VALIGIA = [
  {
    "id": "casa",
    "tone": "casa",
    "icon": "home",
    "n": "Sezione 1",
    "title": "Da casa",
    "sub": "Roba che non ha senso ricomprare o che lì non trovi uguale. È il grosso del peso: qui si decide se viaggi leggera o no.",
    "groups": [
      {
        "h": "Sopra — magliette e strati",
        "hint": "Almeno 2 magliette in merino leggero: non prendono odore e sono ciò che rende possibili solo 2 lavaggi.",
        "items": [
          {
            "id": "c-tshirt",
            "name": "Magliette leggere",
            "qty": "×4",
            "note": "2 in merino leggero + 2 sintetiche ad asciugatura rapida. Colori scuri o fantasia: la polvere rossa della WA non viene più via dal chiaro."
          },
          {
            "id": "c-camicia",
            "name": "Camicia leggera manica lunga UPF",
            "qty": "×1",
            "note": "Sole verticale a Kalbarri, mosche, sera nel deserto. Protegge meglio della crema e non si riapplica.",
            "tags": [
              "leg1"
            ]
          },
          {
            "id": "c-termica",
            "name": "Maglia termica leggera manica lunga",
            "qty": "×1",
            "note": "Alba coi wombat a Tidal River, parata dei pinguini, mattine ai Grampians.",
            "tags": [
              "leg2"
            ]
          },
          {
            "id": "c-pile",
            "name": "Pile o felpa media",
            "qty": "×1",
            "tags": [
              "leg2"
            ]
          },
          {
            "id": "c-guscio",
            "name": "Giacca guscio antivento/impermeabile",
            "qty": "×1",
            "note": "Non negoziabile: GOR, Wilsons Prom e Phillip Island sono ventosi e umidi.",
            "tags": [
              "leg2",
              "key"
            ]
          },
          {
            "id": "c-piumino",
            "name": "Piumino leggero comprimibile",
            "qty": "×1",
            "note": "Opzionale ma è quello che ti salva la sera del 18/11 seduta ferma alla parata dei pinguini, 10–13 °C con vento.",
            "tags": [
              "leg2"
            ]
          },
          {
            "id": "c-mutande",
            "name": "Mutande",
            "qty": "×8",
            "note": "Otto è il numero che regge i blocchi da 8 giorni tra un lavaggio e l'altro."
          },
          {
            "id": "c-calze",
            "name": "Calze",
            "qty": "×5",
            "note": "2 paia da trekking + 3 leggere. In WA sei quasi sempre in sandali."
          },
          {
            "id": "c-pigiama",
            "name": "Pigiama minimo",
            "qty": "×1",
            "note": "Una maglietta vecchia + shorts."
          }
        ]
      },
      {
        "h": "Pantaloni e gambe — 3 lunghi + 2 corti",
        "hint": "L'equilibrio è spostato sul lungo, ma per il sole e gli insetti più che per altro: sulla Coral Coast l'UV arriva a 12–13 e un tessuto protegge dove la crema si consuma. Il pantalone tecnico convertibile vale doppio: è il lungo E il corto da hike.",
        "items": [
          {
            "id": "c-pantatrek",
            "name": "Pantalone tecnico lungo da trekking · LUNGO",
            "qty": "×1",
            "note": "Il cavallo di battaglia: Kalbarri all'alba, Francois Peron, Grampians, Prom. Prendilo convertibile o con le gambe arrotolabili. Kaki o sabbia, NON nero (scalda) e non bianco. Asciuga in 2 ore.",
            "tags": [
              "leg1",
              "leg2",
              "key"
            ]
          },
          {
            "id": "c-pantamorbido",
            "name": "Pantalone morbido scuro a gamba ampia · LUNGO",
            "qty": "×1",
            "note": "Viscosa o twill leggero. Doppio uso: lo indossi in aereo e ci vai a cena. Copre molto e non pesa nulla, quindi è quasi gratis. È anche il pantalone della capsule sera: non sono due pezzi.",
            "tags": [
              "sera"
            ]
          },
          {
            "id": "c-legging",
            "name": "Leggings lunghi tecnici · LUNGO",
            "qty": "×1",
            "note": "Non di cotone. Sotto il vestito a Melbourne, pigiama, hike freddo al Prom, e strato di riserva quando vuoi coprirti di più senza cambiarti.",
            "tags": [
              "leg2"
            ]
          },
          {
            "id": "c-shortshike",
            "name": "Shorts tecnici da hike · CORTO",
            "qty": "×1",
            "note": "A metà coscia, tasche con zip. Per le giornate roventi a Coral Bay e Denham, dove non cammini nel bush."
          },
          {
            "id": "c-shortscasual",
            "name": "Shorts casual oppure gonna midi leggera · CORTO",
            "qty": "×1",
            "note": "Camping, spiaggia, Rottnest. La gonna midi copre di più a parità di peso e freschezza, se è la direzione che preferisci."
          },
          {
            "id": "c-travelpants",
            "name": "Pantalone leggerissimo tipo palazzo / travel pants · LUNGO",
            "qty": "opz.",
            "note": "150–200 g, te lo infili sopra il costume e asciuga in un'ora. È quello che ti fa uscire dal caravan park verso il pub già coperta senza cambiarti."
          },
          {
            "id": "c-sottogonna",
            "name": "Pantaloncini corti da mettere sotto vestiti e gonne",
            "qty": "×1",
            "note": "60 g, anti-sfregamento. Con 30 °C e le gambe sudate fanno una differenza sproporzionata al peso."
          }
        ]
      },
      {
        "h": "Acqua e sole",
        "items": [
          {
            "id": "c-costumi",
            "name": "Costumi",
            "qty": "×2",
            "note": "Uno addosso, uno che asciuga. Rotazione obbligatoria tra Coral Bay, Rottnest e le terme.",
            "tags": [
              "leg1"
            ]
          },
          {
            "id": "c-lycra",
            "name": "Lycra UPF manica lunga (rash guard)",
            "qty": "×1",
            "note": "A Bill's Bay e a The Basin sostituisce mezza bottiglia di crema e non si scioglie in acqua.",
            "tags": [
              "leg1",
              "key"
            ]
          },
          {
            "id": "c-cappello",
            "name": "Cappello a tesa larga",
            "qty": "×1",
            "note": "Non un berretto: servono le orecchie e il collo coperti."
          },
          {
            "id": "c-occhiali",
            "name": "Occhiali da sole polarizzati",
            "qty": "×1",
            "note": "Fondamentali per guidare verso ovest al tramonto e per vedere il fondale mentre fai snorkeling.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "c-pareo",
            "name": "Pareo / foulard grande",
            "qty": "×1",
            "note": "Coprispalle a cena, telo in spiaggia, coperta in aereo, strato in più ai pinguini. 120 g per quattro lavori."
          }
        ]
      },
      {
        "h": "Capsule sera",
        "hint": "Le serate 'da vestirsi' sono raggruppate agli estremi (Perth 29/10–1/11, Adelaide 10–11/11, Sorrento 15/11, Melbourne 19–20/11): questa capsule può restare compressa in fondo al duffel per tutta la settimana in van. Niente lino puro — esce accartocciato e non c'è ferro da stiro in un caravan park. Il pantalone morbido della sera è già nel gruppo Pantaloni: non ne serve un altro.",
        "items": [
          {
            "id": "s-vestito1",
            "name": "Vestito midi leggero, fantasia scura",
            "qty": "×1",
            "note": "Viscosa o Tencel. Perth, Adelaide, Sorrento; a Melbourne diventa invernale con legging sotto e giacca sopra.",
            "tags": [
              "sera"
            ]
          },
          {
            "id": "s-vestito2",
            "name": "Vestito o gonna in jersey nero",
            "qty": "×1",
            "note": "Il pezzo 'città fresca': si porta sopra la maglia termica senza sembrare un ripiego.",
            "tags": [
              "sera",
              "leg2"
            ]
          },
          {
            "id": "s-top",
            "name": "Top carino (viscosa o seta lavabile)",
            "qty": "×1",
            "note": "Si abbina sia al pantalone che alla gonna: un pezzo, tre combinazioni in più.",
            "tags": [
              "sera"
            ]
          },
          {
            "id": "s-cardigan",
            "name": "Cardigan o blazer leggero non stropicciabile",
            "qty": "×1",
            "note": "In alternativa un merino sottile nero. Alza il livello di tutto e a Melbourne serve comunque.",
            "tags": [
              "sera"
            ]
          },
          {
            "id": "s-gioielli",
            "name": "Accessori: 2 paia orecchini, 1 collana, 1 cintura",
            "qty": "—",
            "note": "250 g in tutto e cambiano completamente l'aspetto degli stessi tre pezzi. È il vero trucco della capsule.",
            "tags": [
              "sera"
            ]
          },
          {
            "id": "s-makeup",
            "name": "Rossetto / trucco minimo",
            "qty": "—",
            "tags": [
              "sera"
            ]
          }
        ]
      },
      {
        "h": "Scarpe — massimo 3 paia",
        "hint": "Le più pesanti si indossano in aereo, non si mettono in valigia.",
        "items": [
          {
            "id": "sc-trail",
            "name": "Trail runner o scarpe basse da hike",
            "qty": "×1",
            "note": "The Loop e Nature's Window, Pinnacles dei Grampians, Mt Oberon, Squeaky Beach. NON scarponi alti: pesanti e caldissimi a 35 °C.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "sc-sandali",
            "name": "Sandali con cinturino o scarpe da acqua",
            "qty": "×1",
            "note": "Rocce di Bill's Bay, Blowholes, docce dei caravan park. Tipo Teva."
          },
          {
            "id": "sc-citta",
            "name": "Sneakers pulite o sandali eleganti flat",
            "qty": "×1",
            "note": "Sostituiscono le infradito, non si sommano. A Melbourne le sneakers bianche vanno bene ovunque, rooftop bar compresi.",
            "tags": [
              "sera"
            ]
          },
          {
            "id": "sc-ballerine",
            "name": "Ballerine pieghevoli",
            "qty": "opz.",
            "note": "200 g se vuoi un'opzione più elegante senza un quarto paio vero.",
            "tags": [
              "sera"
            ]
          }
        ]
      },
      {
        "h": "Fotografia",
        "hint": "I nemici veri sono tre: polvere rossa finissima (Francois Peron, strade non asfaltate), salsedine, e sabbia sollevata dal vento. Più la condensa quando esci dal van climatizzato a 35 °C.",
        "items": [
          {
            "id": "f-camera",
            "name": "Macchina fotografica + batterie di scorta",
            "qty": "×3 batt.",
            "note": "Il caldo a 35 °C accorcia la durata più di quanto ti aspetti.",
            "tags": [
              "foto"
            ]
          },
          {
            "id": "f-zoom",
            "name": "Un solo obiettivo tuttofare",
            "qty": "×1",
            "note": "24–105 / 18–135 o simile. Lasciare gli altri a casa risolve il problema sabbia alla radice: non cambi mai obiettivo all'aperto.",
            "tags": [
              "foto",
              "key"
            ]
          },
          {
            "id": "f-filtro",
            "name": "Filtro UV/protettivo sulla frontale",
            "qty": "×1",
            "note": "Strato sacrificale: pulisci quello, non la lente. Costa poco e ti salva l'obiettivo.",
            "tags": [
              "foto",
              "key"
            ]
          },
          {
            "id": "f-cpl",
            "name": "Filtro polarizzatore (CPL)",
            "qty": "×1",
            "note": "Il pezzo che cambia le foto di questo viaggio: satura il rosa di Hutt Lagoon e toglie il riflesso dall'acqua turchese di Coral Bay e Turquoise Bay.",
            "tags": [
              "foto",
              "leg1"
            ]
          },
          {
            "id": "f-nd",
            "name": "Filtro ND",
            "qty": "opz.",
            "note": "Per le cascate delle Otways e dei Grampians e per l'acqua setosa ai Twelve Apostles.",
            "tags": [
              "foto",
              "leg2"
            ]
          },
          {
            "id": "f-blower",
            "name": "Pompetta soffiatore + panno microfibra + lens pen",
            "qty": "—",
            "note": "Mai soffiare con la bocca, mai strofinare sabbia asciutta con un panno: righi la lente. Prima soffi, poi pulisci.",
            "tags": [
              "foto",
              "key"
            ]
          },
          {
            "id": "f-drybag",
            "name": "Dry bag o sacchetto stagno per il corpo macchina",
            "qty": "×1",
            "note": "Ferry di Rottnest, barca delle mante, Blowholes con gli spruzzi.",
            "tags": [
              "foto"
            ]
          },
          {
            "id": "f-raincover",
            "name": "Copri-pioggia (anche una cuffia da doccia + elastico)",
            "qty": "×1",
            "note": "GOR e Wilsons Prom sono bagnati e ventosi. Una soluzione da 2 € funziona benissimo.",
            "tags": [
              "foto",
              "leg2"
            ]
          },
          {
            "id": "f-silica",
            "name": "Bustine di silica gel nella borsa",
            "qty": "—",
            "note": "Contro l'umidità. Ma la vera regola anti-condensa è: lascia la macchina acclimatarsi 10–15 min dentro la borsa chiusa prima di aprirla all'aperto.",
            "tags": [
              "foto"
            ]
          },
          {
            "id": "f-treppiede",
            "name": "Treppiede da viaggio leggero",
            "qty": "×1",
            "note": "Coral Bay e Kalbarri hanno cieli bui spettacolari, e c'è l'osservatorio a Melbourne. Vale il chilo.",
            "tags": [
              "foto"
            ]
          },
          {
            "id": "f-sd",
            "name": "Schede SD di scorta + lettore",
            "qty": "×2+",
            "note": "Meglio due schede piccole che una grande: se una muore non perdi tutto.",
            "tags": [
              "foto",
              "key"
            ]
          },
          {
            "id": "f-backup",
            "name": "SSD portatile per il backup serale",
            "qty": "×1",
            "note": "Al Prom il segnale è scarso e il cloud non carica. Scarica le schede la sera, al caravan park.",
            "tags": [
              "foto"
            ]
          }
        ]
      },
      {
        "h": "Tech",
        "items": [
          {
            "id": "t-powerbank",
            "name": "Powerbank",
            "qty": "×1–2",
            "note": "In cabina, MAI in stiva sul volo Perth–Adelaide."
          },
          {
            "id": "t-adattatori",
            "name": "Adattatori AU (tipo I)",
            "qty": "×2",
            "note": "La rete è 240 V come in Europa: serve solo l'adattatore, non il trasformatore."
          },
          {
            "id": "t-ciabatta",
            "name": "Ciabatta / multipresa",
            "qty": "×1",
            "note": "Nelle hut e nei caravan park la presa è una sola e siete in due con macchina, GoPro, telefoni.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "t-cavi",
            "name": "Cavi di ricarica + caricatore USB-C multiporta",
            "qty": "—"
          },
          {
            "id": "t-caricauto",
            "name": "Caricatore 12V da accendisigari (doppia USB-C)",
            "qty": "×1",
            "note": "Il van e la Corolla hanno una sola porta USB e siete in due: nelle giornate da 700 km è lì che ricarichi telefoni e GoPro. In movimento e ai free camp il 240 V non c'è.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "t-frontale",
            "name": "Torcia frontale",
            "qty": "×2",
            "note": "Campeggi non illuminati, alba coi wombat, ritorno dalla parata dei pinguini al buio.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "t-auricolari",
            "name": "Auricolari",
            "qty": "—",
            "note": "Per il volo e per le lunghe tratte di guida."
          }
        ]
      },
      {
        "h": "Documenti e salute",
        "items": [
          {
            "id": "d-passaporto",
            "name": "Passaporto + visto ETA confermato",
            "qty": "—",
            "tags": [
              "key"
            ]
          },
          {
            "id": "d-patente",
            "name": "Patente + IDP o traduzione ufficiale in inglese",
            "qty": "—",
            "note": "Senza, il noleggio può rifiutare la consegna del van. Vedi la sezione controlli.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "d-assicurazione",
            "name": "Polizza viaggio + numeri di emergenza",
            "qty": "—"
          },
          {
            "id": "d-prenotazioni",
            "name": "Prenotazioni salvate offline (PDF sul telefono)",
            "qty": "—",
            "note": "Al Prom il segnale è scarso."
          },
          {
            "id": "d-carte",
            "name": "Due carte diverse, conservate separate",
            "qty": "—"
          },
          {
            "id": "d-farmaci",
            "name": "Farmaci personali nelle scatole originali",
            "qty": "—"
          },
          {
            "id": "d-kit",
            "name": "Kit primo soccorso minimo",
            "qty": "—",
            "note": "Cerotti da vesciche, antistaminico, dopo-puntura, antidolorifico, cerotti normali."
          },
          {
            "id": "d-occhiali",
            "name": "Occhiali/lenti di ricambio",
            "qty": "—"
          }
        ]
      }
    ]
  },
  {
    "id": "ibrido",
    "tone": "ibrido",
    "icon": "split",
    "n": "Sezione 2",
    "title": "Da casa o comprabili lì",
    "sub": "Se li hai già, portali: pesano poco e costano cari lì. Se non li hai, non comprarli in Europa — si trovano a Perth il 30/10 senza problemi.",
    "groups": [
      {
        "h": "Attrezzatura acqua",
        "items": [
          {
            "id": "i-maschera",
            "name": "Maschera e boccaglio",
            "qty": "×2",
            "note": "PORTALI se li avete: il noleggio è ~$20–30 AUD al giorno a testa e a Coral Bay si fa snorkeling da riva tutti i giorni. In 3–4 giorni avete pagato il set. ~350 g l'uno.",
            "tags": [
              "leg1",
              "key"
            ]
          },
          {
            "id": "i-pinne",
            "name": "Pinne",
            "qty": "NO",
            "note": "Ingombro sproporzionato: a Bill's Bay si entra da riva su fondale basso. Se proprio, pinne corte da viaggio."
          },
          {
            "id": "i-muta",
            "name": "Muta",
            "qty": "NO",
            "note": "A novembre l'acqua è 24–25 °C. La lycra UPF basta. Il tour mante fornisce tutto a bordo."
          },
          {
            "id": "i-scarpettedaacqua",
            "name": "Calzari / scarpe da scoglio",
            "qty": "opz.",
            "note": "Utili ai Blowholes e su alcune entrate rocciose."
          }
        ]
      },
      {
        "h": "Notte e campeggio",
        "items": [
          {
            "id": "i-sacco",
            "name": "Sacco a pelo leggero",
            "qty": "×2",
            "note": "Serve solo per le 2 notti alle hut di Tidal River, dove Parks Victoria NON fornisce biancheria e la notte scende a 8–11 °C. Vedi l'alternativa economica nella sezione 3.",
            "tags": [
              "leg2",
              "key"
            ]
          },
          {
            "id": "i-lenzuolo",
            "name": "Sacco lenzuolo in seta/cotone",
            "qty": "×2",
            "note": "150 g, utile in ogni caso, ma da solo non basta al Prom a novembre."
          },
          {
            "id": "i-asciugamani",
            "name": "Asciugamani microfibra",
            "qty": "×2 gr + 2 pic",
            "note": "I caravan park non danno asciugamani. Grande per la doccia, piccolo per il mare.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "i-borraccia",
            "name": "Borraccia 1,5–2 L a testa",
            "qty": "×2",
            "note": "Nelle gole di Kalbarri non c'è ombra né acqua. Più una tanica pieghevole per il van.",
            "tags": [
              "leg1",
              "key"
            ]
          },
          {
            "id": "i-retemosche",
            "name": "Rete anti-mosche da cappello",
            "qty": "×2",
            "note": "Kalbarri interno, Francois Peron e i Grampians a novembre sono seri. Costa ~$5 lì, quindi compratela a Perth se non l'avete.",
            "tags": [
              "leg1"
            ]
          }
        ]
      },
      {
        "h": "Organizzazione del bagaglio",
        "hint": "Il Base Camp M (70 L) non ha struttura interna: senza cubi, per 8 giorni il tuo armadio è un mucchio.",
        "items": [
          {
            "id": "i-cubi",
            "name": "Cubi da imballaggio",
            "qty": "×3",
            "note": "Usali come cassetti: pulito / usato / bagnato-sporco. È l'unica cosa che evita il caos nel van.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "i-sacche",
            "name": "Sacche di stoffa",
            "qty": "×3",
            "note": "Bucato sporco, costumi bagnati, scarpe."
          },
          {
            "id": "i-drybag",
            "name": "Dry bag piccolo",
            "qty": "×1",
            "note": "Ferry di Rottnest e barca delle mante."
          },
          {
            "id": "i-lucchetto",
            "name": "Lucchetto TSA",
            "qty": "×1"
          },
          {
            "id": "i-borsetta",
            "name": "Marsupio o tracolla piccola",
            "qty": "×1",
            "note": "Per Perth, Adelaide e Melbourne: non giri in città con lo zaino da 25 L."
          }
        ]
      }
    ]
  },
  {
    "id": "li",
    "tone": "li",
    "icon": "cart",
    "n": "Sezione 3",
    "title": "Da comprare lì / noleggiare",
    "sub": "Peso e liquidi che non ha senso portare dall'Europa. Prima spesa grossa: Perth, ven 30/10 o sab 31/10 — Coles o Woolworths in CBD, Chemist Warehouse per la farmacia, JB Hi-Fi o Harvey Norman per l'elettronica.",
    "groups": [
      {
        "h": "Consumabili — Perth, primi giorni",
        "items": [
          {
            "id": "l-crema",
            "name": "Crema solare 50+",
            "qty": "×2 grandi",
            "note": "Quella australiana è ottima ed economica, e non hai il problema dei liquidi in aereo. Prendine più di quanta pensi.",
            "tags": [
              "leg1",
              "key"
            ]
          },
          {
            "id": "l-repellente",
            "name": "Repellente insetti (tipo Bushman)",
            "qty": "×1",
            "note": "Mosche in WA, zanzare la sera al Prom.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "l-aloe",
            "name": "Aloe / dopo-sole",
            "qty": "×1"
          },
          {
            "id": "l-detersivo",
            "name": "Detersivo bucato in foglietti o mini-formato",
            "qty": "×1",
            "note": "Per i due lavaggi e per il lavaggio a mano nel lavandino.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "l-igiene",
            "name": "Shampoo, bagnoschiuma, dentifricio formato normale",
            "qty": "—",
            "note": "Da casa solo mini-formati per i primi due giorni."
          },
          {
            "id": "l-salviette",
            "name": "Salviette umidificate + gel mani",
            "qty": "—",
            "note": "Nel van sono oro."
          },
          {
            "id": "l-monete",
            "name": "Monete da $1 e $2",
            "qty": "—",
            "note": "Lavanderie a gettoni e, in alcuni park, anche le docce.",
            "tags": [
              "key"
            ]
          }
        ]
      },
      {
        "h": "GoPro — se la prendete",
        "hint": "Comprandola a Perth il 30/10 potete chiedere il rimborso della GST (10%) al banco TRS dell'aeroporto di Melbourne il 20/11: la spesa rientra nei 60 giorni e serve la fattura intestata a chi la richiede, sopra i $300 da un unico negozio, con la macchina nel bagaglio a mano. Sono ~$50 AUD indietro. Il contro è che non hai tempo di imparare a usarla prima di Rottnest.",
        "items": [
          {
            "id": "g-corpo",
            "name": "GoPro Hero 13 Black",
            "qty": "×1",
            "note": "È il modello giusto per voi: impermeabile fino a 10 m SENZA custodia, quindi snorkeling a Coral Bay e Rottnest direttamente. La Mission 1 Pro costa quasi il doppio e non vi serve; la Hero base non ha la stabilizzazione buona.",
            "tags": [
              "foto",
              "key"
            ]
          },
          {
            "id": "g-batterie",
            "name": "Batterie Enduro di scorta",
            "qty": "×2",
            "note": "A 35 °C la batteria cala in fretta e la GoPro si scalda. Due di scorta è il minimo per una giornata di snorkeling.",
            "tags": [
              "foto",
              "key"
            ]
          },
          {
            "id": "g-sd",
            "name": "microSD V30, 128–256 GB",
            "qty": "×2",
            "note": "Sotto la V30 la registrazione in alta risoluzione si interrompe.",
            "tags": [
              "foto"
            ]
          },
          {
            "id": "g-floaty",
            "name": "Impugnatura galleggiante colorata",
            "qty": "×1",
            "note": "NON opzionale: a Bill's Bay, con la corrente e il fondo bianco, una GoPro che ti scivola di mano è persa in tre secondi.",
            "tags": [
              "foto",
              "key"
            ]
          },
          {
            "id": "g-antifog",
            "name": "Inserti anti-appannamento",
            "qty": "×1 conf.",
            "note": "Passare da 35 °C d'aria a 25 °C d'acqua appanna lo sportellino dall'interno. Costano pochissimo e senza ti ritrovi metà video lattiginosi.",
            "tags": [
              "foto",
              "leg1"
            ]
          },
          {
            "id": "g-mount",
            "name": "Supporto a ventosa per il parabrezza",
            "qty": "opz.",
            "note": "Timelapse sulla Indian Ocean Drive e sulla Great Ocean Road. Carino ma non essenziale.",
            "tags": [
              "foto"
            ]
          },
          {
            "id": "g-chest",
            "name": "Chest mount o cinghia da testa",
            "qty": "opz.",
            "note": "Buono per guida e hike; per lo snorkeling l'impugnatura galleggiante resta meglio.",
            "tags": [
              "foto"
            ]
          }
        ]
      },
      {
        "h": "Notte, cibo, varie",
        "items": [
          {
            "id": "l-sacchiapelo",
            "name": "2 sacchi a pelo economici da Kmart o BIG W",
            "qty": "opz.",
            "note": "ALTERNATIVA CONSIGLIATA al portarli da casa: ~$25–40 l'uno ad Adelaide o a Melbourne, li usi le 2 notti al Prom e li lasci o li doni prima del volo. Costo di un noleggio, zero peso dall'Europa.",
            "tags": [
              "leg2"
            ]
          },
          {
            "id": "l-spesa",
            "name": "Spesa grossa a Perth + rifornimenti a Geraldton e Carnarvon",
            "qty": "—",
            "note": "Già nel piano: i paesini a nord hanno poco e caro."
          },
          {
            "id": "l-ghiaccio",
            "name": "Ghiaccio e frigo box",
            "qty": "—",
            "note": "Se il van non ha il frigo a compressore."
          },
          {
            "id": "l-cappellofly",
            "name": "Rete anti-mosche, se non portata",
            "qty": "—",
            "note": "~$5 in qualunque servo o negozio da campeggio."
          },
          {
            "id": "l-souvenir",
            "name": "Spazio libero per i souvenir",
            "qty": "~20%",
            "note": "Queen Victoria Market il 20/11. Non riempire il duffel alla partenza.",
            "tags": [
              "leg2"
            ]
          }
        ]
      },
      {
        "h": "Noleggi già previsti",
        "items": [
          {
            "id": "n-bici",
            "name": "Bici a Rottnest",
            "qty": "—",
            "note": "Prenotabile insieme al biglietto del ferry, già nel piano."
          },
          {
            "id": "n-mante",
            "name": "Tour mante a Coral Bay",
            "qty": "—",
            "note": "Attrezzatura inclusa a bordo: le vostre maschere servono solo per la riva."
          },
          {
            "id": "n-kitletto",
            "name": "Kit letto del van",
            "qty": "—",
            "note": "Di solito inclusi nei self-contained: da confermare al noleggio (vedi controlli)."
          },
          {
            "id": "n-auto",
            "name": "Auto one-way Adelaide → Melbourne",
            "qty": "—",
            "note": "Già nel piano."
          }
        ]
      }
    ]
  },
  {
    "id": "check",
    "tone": "check",
    "icon": "check",
    "n": "Sezione 4",
    "title": "Da ricordarsi di controllare",
    "sub": "Non sono oggetti: sono le cose che, se scopri all'ultimo, ti rovinano un pezzo di viaggio. In ordine di quanto fa male sbagliarle.",
    "groups": [
      {
        "h": "Prima di partire — critiche",
        "items": [
          {
            "id": "k-idp",
            "name": "IDP o traduzione ufficiale della patente",
            "qty": "—",
            "note": "In WA e in Victoria con patente italiana serve una traduzione ufficiale in inglese o l'International Driving Permit. Senza, il noleggio può rifiutare la consegna del van il 1/11. Da fare in Italia/NL con settimane di anticipo.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "k-eta",
            "name": "Visto ETA approvato e collegato al passaporto giusto",
            "qty": "—",
            "tags": [
              "key"
            ]
          },
          {
            "id": "k-bagaglio",
            "name": "Franchigia bagaglio del volo Perth → Adelaide (10/11)",
            "qty": "—",
            "note": "Verifica la tariffa: il bagaglio a mano da 7 kg in Australia lo pesano davvero. Coltellino e multitool in stiva, powerbank in cabina.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "k-kitletto",
            "name": "Il noleggio van include i kit letto?",
            "qty": "—",
            "note": "Se sì, il sacco a pelo serve solo per le 2 notti al Prom — e allora conviene comprarne uno economico lì invece di portarlo.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "k-assicurazione",
            "name": "Copertura assicurativa del van e franchigia",
            "qty": "—",
            "note": "Le strade non asfaltate (Francois Peron) sono spesso escluse dalla polizza base: leggi bene prima di infilartici."
          },
          {
            "id": "k-parks",
            "name": "Parks WA Pass — conviene?",
            "qty": "—",
            "note": "Copre Nambung, Kalbarri, Francois Peron, Monkey Mia. Con questo itinerario quasi certamente sì."
          }
        ]
      },
      {
        "h": "Prenotazioni da confermare",
        "items": [
          {
            "id": "k-ferry",
            "name": "Ferry Rottnest + bici (31/10)",
            "qty": "—",
            "note": "Prima corsa del mattino da Barrack Street Jetty."
          },
          {
            "id": "k-coralbay",
            "name": "Coral Bay, Peoples Park (4–6/11)",
            "qty": "—",
            "note": "Piccolo, i posti van si esauriscono anche in bassa stagione."
          },
          {
            "id": "k-lavanderia",
            "name": "Lavanderia a Coral Bay (Peoples Park)",
            "qty": "—",
            "note": "Da confermare al check-in del 4/11: è il perno del primo blocco. Se manca, ripiega su Denham la sera del 6/11 o su Monkey Mia il 7/11.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "k-lavanderiagr",
            "name": "Coin laundry al Grampians View + monete",
            "qty": "—",
            "note": "Confermalo all'arrivo l'11/11 e procurati le monete prima: è la lavatrice 2. Se salta, si scala su Anglesea il 13-14/11.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "k-tidal",
            "name": "Hut Tidal River: biancheria NON inclusa",
            "qty": "—",
            "note": "Confermato da Parks Victoria: cucina, forno, frigo e stoviglie ci sono, il letto è nudo. Chiedi anche se c'è la lavanderia nel campground.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "k-pinguini",
            "name": "Penguin Parade (18/11)",
            "qty": "—",
            "note": "Prenotazione online, e ricorda: niente foto ai pinguini."
          },
          {
            "id": "k-terme",
            "name": "Peninsula Hot Springs (15/11)",
            "qty": "—",
            "note": "Slot orario da prenotare."
          },
          {
            "id": "k-traghetto",
            "name": "Traghetto Queenscliff → Sorrento (15/11)",
            "qty": "—",
            "note": "Con l'auto, prenota in anticipo la domenica."
          }
        ]
      },
      {
        "h": "Soldi e telefono",
        "items": [
          {
            "id": "k-carta",
            "name": "Carta senza commissioni sul cambio + avvisa la banca",
            "qty": "—"
          },
          {
            "id": "k-esim",
            "name": "eSIM australiana o roaming",
            "qty": "—",
            "note": "Telstra ha la copertura migliore sulla costa nord della WA. Vodafone sparisce fuori dai centri."
          },
          {
            "id": "k-offline",
            "name": "Mappe offline scaricate",
            "qty": "—",
            "note": "Google Maps offline per WA e Victoria, più WikiCamps che funziona offline.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "k-app",
            "name": "App installate: WikiCamps o CamperMate",
            "qty": "—"
          }
        ]
      },
      {
        "h": "Durante il viaggio — da non dimenticare",
        "items": [
          {
            "id": "k-quarantena",
            "name": "Svuotare il frigo del van il 9/11",
            "qty": "—",
            "note": "Frutta e verdura fresche non si possono portare da WA a SA (mosca della frutta). Meglio farlo la sera prima che scoprirlo al gate.",
            "tags": [
              "key"
            ]
          },
          {
            "id": "k-vanfoto",
            "name": "Fotografare il van alla consegna e alla riconsegna",
            "qty": "—",
            "note": "Già nel piano, ma è il tipo di cosa che si dimentica di fare."
          },
          {
            "id": "k-pieno",
            "name": "Pieno prima della riconsegna del van (9/11)",
            "qty": "—"
          },
          {
            "id": "k-risciacquo",
            "name": "Sciacquare GoPro e maschera in acqua dolce ogni sera",
            "qty": "—",
            "note": "Il sale distrugge le guarnizioni dello sportellino e il microfono della GoPro in pochi giorni.",
            "tags": [
              "foto"
            ]
          },
          {
            "id": "k-backup",
            "name": "Scaricare le schede foto ogni sera",
            "qty": "—",
            "note": "Al Prom il segnale è scarso e il cloud non carica: serve il backup locale.",
            "tags": [
              "foto"
            ]
          },
          {
            "id": "k-trs",
            "name": "TRS in aeroporto a Melbourne (20/11)",
            "qty": "—",
            "note": "Se comprate la GoPro in Australia: fattura sopra i $300, entro 60 giorni, oggetto nel bagaglio a mano, banco TRS prima dell'imbarco.",
            "tags": [
              "foto"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "note",
    "tone": "note",
    "icon": "bulb",
    "kind": "notes",
    "n": "Sezione 5",
    "title": "Note e suggerimenti",
    "sub": "Il ragionamento dietro le quantità, più le cose che si imparano solo sbagliandole.",
    "groups": [
      {
        "h": "La logica dei numeri",
        "notes": [
          {
            "h": "Perché 8 e non 12",
            "p": "Le due lavatrici scelte spezzano i 23 giorni in tre blocchi: 29/10–5/11 (8 giorni), 6/11–12/11 (7), 13/11–20/11 (8). Otto cambi di biancheria coprono ogni blocco, e il risciacquo a mano a Kalbarri il 3/11 dà margine sul primo. Se facessi un solo lavaggio il blocco più lungo diventerebbe di 12 giorni e servirebbero 4 mutande e 2 magliette in più: sono ~400 g, quindi il lavaggio in meno non è un risparmio di peso, è un risparmio di tempo."
          },
          {
            "h": "Perché Grampians e non Anglesea",
            "p": "Sono a un giorno di distanza, quindi uno dei due è il lavaggio e l'altro è altro. Con i Grampians (12/11) i blocchi vengono 8/7/8, con Anglesea (14/11) vengono 8/9/6 e il blocco da 9 sfora gli 8 cambi. Quindi la lavatrice è ai Grampians e Anglesea, che è gratis e con 2 notti, diventa la rete di sicurezza: asciugatura di riserva, pezzi ingombranti e un carico in più a costo zero."
          },
          {
            "h": "Il merino fa metà del lavoro",
            "p": "Una maglietta in merino leggero regge 3–4 giorni senza odore, una in cotone uno solo. Sono le 2 magliette in merino a rendere possibile il piano con 2 lavaggi: sostituirle con cotone significa tornare a 6 magliette e un lavaggio in più."
          },
          {
            "h": "Il pezzo che vale doppio",
            "p": "Ogni volta che un capo fa due lavori, ne togli uno dalla valigia. In questa lista i doppi sono: pantalone convertibile (lungo + corto da hike), pantalone morbido (aereo + sera), leggings (pigiama + strato + sotto-vestito), pareo (coprispalle + telo + coperta + strato ai pinguini), lycra UPF (snorkeling + maglia a maniche lunghe di riserva)."
          }
        ]
      },
      {
        "h": "Coprirsi: le ragioni vere",
        "notes": [
          {
            "h": "È una questione di sole, non di codici sociali",
            "p": "Sulla Coral Coast a novembre l'indice UV arriva a 12–13: la pelle scoperta si scotta in un quarto d'ora, e la crema suda via, si consuma e si dimentica. Un tessuto no. A questo si aggiungono le mosche a Kalbarri e Francois Peron, le zanzare la sera al Prom, lo spinifex sui sentieri e il fatto che a novembre in WA i serpenti sono attivi: pantaloni lunghi e scarpe chiuse nel bush sono lo standard locale, non una precauzione da ansiosi."
          },
          {
            "h": "L'Australia è rilassata sul vestire",
            "p": "Non ci sono codici impliciti da rispettare: shorts e canotte sono normali ovunque, anche a cena in centro a Melbourne. In nessuna tappa di questo itinerario serve coprirsi per rispetto o per non attirare sguardi, e non ti sentirai fuori posto in nessuna delle due direzioni."
          },
          {
            "h": "I due contesti in cui uno strato in più è comodo",
            "p": "I roadhouse e i pub dei paesini remoti della WA, dove a volte sei l'unica turista in un locale di soli habitué, e le notti in centro a Northbridge (Perth) o St Kilda (Melbourne), dove a tarda ora la movida è vivace e ogni tanto molesta. Avere addosso qualcosa di neutro lì è semplicemente più comodo — e i pezzi che te lo permettono (pantalone morbido, travel pants, cardigan, pareo) li porti già per altri motivi."
          },
          {
            "h": "Una cosa detta chiaramente",
            "p": "Vestirsi in modo più coperto non è una protezione affidabile contro le situazioni spiacevoli: non funziona così. Quello che riduce davvero i rischi riguarda il contesto — non rientrare a piedi da sola a tarda notte, tenere il van chiuso quando dormi in un'area isolata, condividere la posizione tra voi due, non lasciare l'ultimo tratto di guida al buio sulle tratte lunghe. Organizza il guardaroba come ti fa sentire a tuo agio, che è una ragione più che sufficiente, ma senza affidargli un compito che non può svolgere."
          }
        ]
      },
      {
        "h": "Tessuti e colori",
        "notes": [
          {
            "h": "Le tre regole",
            "p": "Niente lino puro: nel duffel senza struttura esce accartocciato e in un caravan park non c'è il ferro. Niente cotone pesante: ci mette un giorno ad asciugare e in WA non ne hai il tempo tra un bagno e l'altro. Niente bianco o beige chiaro nei capi che finiscono per terra o in van: la polvere rossa della Coral Coast si attacca e non viene più via."
          },
          {
            "h": "L'eccezione al colore scuro",
            "p": "Il pantalone tecnico da trekking va invece chiaro, kaki o sabbia: sotto il sole di Kalbarri il nero diventa un forno. Lì lo sporco non è un problema perché lo lavi e asciuga in due ore."
          },
          {
            "h": "Il trucco della doccia",
            "p": "Viscosa, Tencel e jersey escono lisci se li appendi in bagno mentre fai la doccia calda. È il sostituto del ferro da stiro per la capsule sera."
          }
        ]
      },
      {
        "h": "Il lavaggio a mano, fatto bene",
        "notes": [
          {
            "h": "Il metodo dei 5 minuti",
            "p": "Lavandino, acqua tiepida, un foglietto di detersivo. Lascia in ammollo 5 minuti, strizza senza torcere. Poi il passaggio che fa la differenza: stendi il capo su un asciugamano asciutto, arrotola l'asciugamano col capo dentro e calpestalo. Toglie la maggior parte dell'acqua e dimezza il tempo di asciugatura."
          },
          {
            "h": "Cosa lavare a mano e cosa no",
            "p": "Costumi e magliette sì, ogni 2–3 giorni. Mutande e calze sì, se sei in anticipo sul blocco. Pantaloni e felpe no: aspetta la lavatrice, a mano non si strizzano abbastanza e restano umidi per giorni."
          },
          {
            "h": "Dove si asciuga",
            "p": "In WA ovunque, anche appeso al van, in 2–3 ore. In Victoria molto più lentamente e con l'umidità: ai Grampians, al Prom e ad Anglesea metti in conto una notte intera, quindi lava la mattina e non la sera."
          },
          {
            "h": "Il merino fuori dall'asciugatrice",
            "p": "Al coin laundry dei Grampians la tentazione è infilare tutto nell'asciugatrice. Le due magliette in merino no: l'asciugatrice le infeltrisce e le accorcia, e sono i capi da cui dipende tutto il piano. Lavaggio normale, poi stese."
          },
          {
            "h": "Cosa NON lavare al coin laundry",
            "p": "I pezzi ingombranti e lenti — pantalone tecnico, pile, asciugamani grandi — occupano mezzo cestello e ai Grampians rischiano di restare umidi. Saltali lì e falli ad Anglesea il giorno dopo, dove c'è una lavatrice di casa, due notti e nessuna coda."
          }
        ]
      },
      {
        "h": "Caricare il duffel",
        "notes": [
          {
            "h": "I cubi sono cassetti, non contenitori",
            "p": "Il Base Camp M non ha struttura interna: senza cubi, per otto giorni il tuo armadio è un mucchio che rovisti col frontalino. Tre cubi con una funzione fissa — pulito / usato ma riutilizzabile / sporco e bagnato — e non li mescoli mai."
          },
          {
            "h": "L'ordine di carico",
            "p": "In fondo la capsule sera compressa, che dal 1 all'8 novembre non tocchi. Sopra il blocco 'settimana in van'. In cima quello che serve ogni giorno: costume, lycra, crema, cappello, asciugamano. Lo zaino piccolo resta sempre pronto come daypack e diventa il bagaglio a mano del volo del 10/11."
          },
          {
            "h": "Lascia il 20% vuoto",
            "p": "Il Queen Victoria Market è il 20/11, l'ultimo giorno. Se parti col duffel pieno, torni con una borsa in più comprata di fretta all'aeroporto."
          },
          {
            "h": "Le scarpe più pesanti si indossano",
            "p": "Le trail runner non entrano mai in valigia: si portano ai piedi in aereo e nei trasferimenti. Le altre due paia si infilano lungo i lati del duffel, dentro un sacchetto."
          }
        ]
      },
      {
        "h": "Le cose che si portano sempre e non si usano mai",
        "notes": [
          {
            "h": "Da lasciare a casa senza rimpianti",
            "p": "Il phon (c'è ovunque o non serve). Il terzo paio di jeans. Le scarpe eleganti col tacco. L'asciugamano di spugna. Il libro cartaceo pesante. Il secondo obiettivo fotografico. Le pinne. La muta. Il trasformatore di corrente (l'Australia è a 240 V come l'Europa: basta l'adattatore). Le confezioni grandi di shampoo e crema, che compri lì a meno."
          },
          {
            "h": "Il capo di troppo classico",
            "p": "Il maglione 'nel caso faccia freddo' portato in aggiunta a pile e piumino. Con guscio + pile + termica + piumino leggero hai già quattro strati combinabili che coprono fino a 5 °C: il maglione è peso puro."
          },
          {
            "h": "E invece quello che si dimentica",
            "p": "La ciabatta multipresa. Nelle hut di Tidal River e in molti caravan park la presa è una sola, e siete in due con macchina fotografica, GoPro, due telefoni e un powerbank."
          }
        ]
      },
      {
        "h": "Pesi indicativi",
        "notes": [
          {
            "h": "Come dovrebbe distribuirsi",
            "p": "Duffel Base Camp M: abbigliamento ~4,5 kg, scarpe ~1,2 kg, capsule sera ~1,2 kg, articoli da bagno e consumabili comprati lì ~1,5 kg, attrezzatura (asciugamani, sacco, snorkeling) ~2,5 kg. Totale ~11 kg, con margine fino a 12. Zaino piccolo: macchina fotografica, obiettivo, elettronica, documenti, borraccia vuota — sotto i 7 kg, che è il limite del bagaglio a mano e in Australia lo pesano davvero."
          },
          {
            "h": "La verifica onesta",
            "p": "Fai la valigia dieci giorni prima, pesala, poi togli il 10%. Quasi tutto quello che togli non ti mancherà — ed è comunque tutto ricomprabile a Perth il 30 ottobre."
          }
        ]
      }
    ]
  }
];
/* <<< VALIGIA */
