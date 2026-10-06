#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
valigia.py - editor interattivo della lista valigia.

COSA FA
    Legge e riscrive i dati dentro valigia-data.js, senza toccare
    valigia.html ne' valigia-app.js. Dopo aver salvato, ricarica la
    pagina nel browser e vedi le modifiche.

COME SI USA
    Mettilo nella stessa cartella di valigia-data.js e lancia:

        python valigia.py

    Serve solo Python 3, nessun pacchetto da installare.

SICUREZZA
    Prima di ogni salvataggio fa una copia in valigia-data.js.bak.
    Se combini un guaio: cancella valigia-data.js e rinomina il .bak.
"""

import json
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "valigia-data.js")
BACKUP = DATA + ".bak"

TAGS = ["leg1", "leg2", "sera", "foto", "key"]
TAG_HELP = {
    "leg1": "leg 1, la parte calda in WA",
    "leg2": "leg 2, la parte fresca in Victoria",
    "sera": "capsule della sera",
    "foto": "fotografia",
    "key":  "critico, da non dimenticare",
}


# --------------------------------------------------------------------
#  Lettura e scrittura del file dati
# --------------------------------------------------------------------

def _block_re(name):
    return re.compile(
        r"(/\* >>> %s \*/\s*const %s = )(.*?)(;\s*/\* <<< %s \*/)" % (name, name, name),
        re.S,
    )


def load():
    if not os.path.exists(DATA):
        die("Non trovo valigia-data.js in questa cartella.\n"
            "Metti valigia.py nella stessa cartella del file dati.")
    raw = open(DATA, encoding="utf-8").read()
    out = {}
    for name in ("VALIGIA_UI", "VALIGIA"):
        m = _block_re(name).search(raw)
        if not m:
            die("Nel file dati manca il blocco %s.\n"
                "I marcatori /* >>> %s */ e /* <<< %s */ non vanno cancellati."
                % (name, name, name))
        try:
            out[name] = json.loads(m.group(2))
        except json.JSONDecodeError as e:
            die("Il blocco %s non e' JSON valido: %s\n"
                "Probabilmente una virgola o una parentesi di troppo, riga %d."
                % (name, e.msg, e.lineno))
    return raw, out["VALIGIA_UI"], out["VALIGIA"]


def save(raw, ui, sections):
    shutil.copyfile(DATA, BACKUP)
    new = raw
    for name, obj in (("VALIGIA_UI", ui), ("VALIGIA", sections)):
        body = json.dumps(obj, ensure_ascii=False, indent=2)
        # replacement come funzione: re.sub non interpreta le sequenze di
        # escape nel testo restituito, quindi il contenuto passa intatto.
        new = _block_re(name).sub(lambda m: m.group(1) + body + m.group(3), new, count=1)
    open(DATA, "w", encoding="utf-8").write(new)
    ok("Salvato. Copia di sicurezza in valigia-data.js.bak")
    ok("Ricarica la pagina nel browser (Ctrl+F5) per vedere le modifiche.")


# --------------------------------------------------------------------
#  Utilita' di stampa
# --------------------------------------------------------------------

if os.name == "nt":
    os.system("")  # abilita i colori ANSI su Windows

C = {"b": "\033[1m", "dim": "\033[2m", "g": "\033[32m", "y": "\033[33m",
     "r": "\033[31m", "c": "\033[36m", "0": "\033[0m"}


def title(s):
    print("\n" + C["b"] + s + C["0"])
    print(C["dim"] + "-" * min(len(s), 60) + C["0"])


def ok(s):
    print(C["g"] + s + C["0"])


def warn(s):
    print(C["y"] + s + C["0"])


def die(s):
    print(C["r"] + s + C["0"])
    sys.exit(1)


def ask(prompt, default=None):
    suffix = (" [%s]" % default) if default is not None else ""
    try:
        v = input(C["c"] + prompt + suffix + ": " + C["0"]).strip()
    except (EOFError, KeyboardInterrupt):
        print()
        return None
    if v == "" and default is not None:
        return default
    return v


def confirm(prompt):
    v = ask(prompt + " (s/n)", "n")
    return bool(v) and v.lower().startswith("s")


def pick(prompt, options, labeller=str):
    """Mostra una lista numerata e restituisce l'indice scelto, o None."""
    for i, o in enumerate(options, 1):
        print("  %2d) %s" % (i, labeller(o)))
    print("   0) indietro")
    while True:
        v = ask(prompt)
        if v is None or v == "0":
            return None
        if v.isdigit() and 1 <= int(v) <= len(options):
            return int(v) - 1
        warn("Scegli un numero fra 1 e %d, oppure 0." % len(options))


# --------------------------------------------------------------------
#  Descrizioni
# --------------------------------------------------------------------

def sec_label(s):
    kind = " (note)" if s.get("kind") == "notes" else ""
    n = sum(len(g.get("items", [])) + len(g.get("notes", [])) for g in s.get("groups", []))
    return "%s%s  %s%d voci%s" % (s["title"], kind, C["dim"], n, C["0"])


def grp_label(g):
    n = len(g.get("items", [])) + len(g.get("notes", []))
    return "%s  %s%d%s" % (g["h"], C["dim"], n, C["0"])


def item_label(it):
    qty = ("  " + it["qty"]) if it.get("qty") else ""
    tags = ("  [" + ",".join(it.get("tags", [])) + "]") if it.get("tags") else ""
    return "%s%s%s%s%s" % (it["name"], C["dim"], qty, tags, C["0"])


def show_item(it):
    print()
    print("  " + C["b"] + it["name"] + C["0"] + ("  " + it.get("qty", "") if it.get("qty") else ""))
    if it.get("note"):
        for line in wrap(it["note"], 72):
            print("    " + C["dim"] + line + C["0"])
    if it.get("tags"):
        print("    etichette: " + ", ".join(it["tags"]))
    print("    " + C["dim"] + "id: " + it["id"] + C["0"])


def wrap(text, width):
    words, line, out = text.split(), "", []
    for w in words:
        if len(line) + len(w) + 1 > width:
            out.append(line)
            line = w
        else:
            line = (line + " " + w).strip()
    if line:
        out.append(line)
    return out


# --------------------------------------------------------------------
#  Modifica di una voce
# --------------------------------------------------------------------

def all_ids(sections):
    ids = set()
    for s in sections:
        for g in s.get("groups", []):
            for it in g.get("items", []):
                ids.add(it["id"])
    return ids


def edit_tags(it):
    print("\n  Etichette disponibili:")
    for t in TAGS:
        mark = "x" if t in it.get("tags", []) else " "
        print("    [%s] %s  %s%s%s" % (mark, t.ljust(5), C["dim"], TAG_HELP[t], C["0"]))
    v = ask("  Scrivi le etichette separate da virgola (vuoto = nessuna)",
            ",".join(it.get("tags", [])))
    if v is None:
        return
    tags = [t.strip() for t in v.split(",") if t.strip()]
    bad = [t for t in tags if t not in TAGS]
    if bad:
        warn("  Ignoro le etichette sconosciute: " + ", ".join(bad))
    tags = [t for t in tags if t in TAGS]
    if tags:
        it["tags"] = tags
    else:
        it.pop("tags", None)


def edit_item(it):
    while True:
        show_item(it)
        print("""
    n) nome     q) quantita'    t) testo della nota
    e) etichette                0) fatto""")
        v = ask("  Cosa cambio?")
        if v is None or v == "0":
            return
        v = v.lower()
        if v == "n":
            nv = ask("  Nome", it["name"])
            if nv:
                it["name"] = nv
        elif v == "q":
            nv = ask("  Quantita' (vuoto per toglierla)", it.get("qty", ""))
            if nv:
                it["qty"] = nv
            else:
                it.pop("qty", None)
        elif v == "t":
            print("  " + C["dim"] + "Nota attuale: " + (it.get("note") or "(nessuna)") + C["0"])
            nv = ask("  Nuova nota (vuoto per toglierla)", "")
            if nv:
                it["note"] = nv
            elif nv == "":
                it.pop("note", None)
        elif v == "e":
            edit_tags(it)


def new_item(sections, group):
    name = ask("  Nome della voce")
    if not name:
        return
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:20] or "voce"
    existing = all_ids(sections)
    nid, i = base, 2
    while nid in existing:
        nid, i = "%s-%d" % (base, i), i + 1
    it = {"id": nid, "name": name}
    qty = ask("  Quantita' (vuoto per saltare)", "")
    if qty:
        it["qty"] = qty
    note = ask("  Nota (vuoto per saltare)", "")
    if note:
        it["note"] = note
    edit_tags(it)
    group.setdefault("items", []).append(it)
    ok("  Aggiunta: %s" % name)


def move_item(sections, group, idx):
    it = group["items"][idx]
    print("\n  Spostare %s%s%s dove?" % (C["b"], it["name"], C["0"]))
    targets = []
    for s in sections:
        if s.get("kind") == "notes":
            continue
        for g in s.get("groups", []):
            targets.append((s, g))
    j = pick("  Gruppo di destinazione",
             targets, lambda t: "%s  >  %s" % (t[0]["title"], t[1]["h"]))
    if j is None:
        return
    dest = targets[j][1]
    if dest is group:
        return
    group["items"].pop(idx)
    dest.setdefault("items", []).append(it)
    ok("  Spostata in: %s" % dest["h"])


# --------------------------------------------------------------------
#  Note (sezione 5)
# --------------------------------------------------------------------

def notes_menu(group):
    while True:
        title("Note - %s" % group["h"])
        notes = group.setdefault("notes", [])
        for i, n in enumerate(notes, 1):
            print("  %2d) %s" % (i, n["h"]))
        print("""
    a) aggiungi     m) modifica     x) elimina     0) indietro""")
        v = ask("  Cosa faccio?")
        if v is None or v == "0":
            return
        v = v.lower()
        if v == "a":
            h = ask("  Titolo della nota")
            if not h:
                continue
            p = ask("  Testo")
            if not p:
                continue
            notes.append({"h": h, "p": p})
            ok("  Aggiunta.")
        elif v in ("m", "x"):
            if not notes:
                warn("  Non ci sono note.")
                continue
            j = pick("  Quale nota?", notes, lambda n: n["h"])
            if j is None:
                continue
            if v == "x":
                if confirm("  Elimino '%s'?" % notes[j]["h"]):
                    notes.pop(j)
                    ok("  Eliminata.")
            else:
                n = notes[j]
                print("\n  " + C["dim"] + n["p"] + C["0"])
                nh = ask("  Titolo", n["h"])
                if nh:
                    n["h"] = nh
                np_ = ask("  Testo (vuoto = lascia com'e')", "")
                if np_:
                    n["p"] = np_


# --------------------------------------------------------------------
#  Passaggio in rassegna: la modalita' "cosa voglio e cosa no"
# --------------------------------------------------------------------

def review(sections):
    title("Passaggio in rassegna")
    print(C["dim"] + """  Ti mostro una voce alla volta. Per ognuna:
    INVIO  la tengo cosi' com'e'
    x      la elimino
    m      la modifico
    s      la sposto in un altro gruppo
    q      esco dalla rassegna""" + C["0"])

    removed = 0
    for s in sections:
        if s.get("kind") == "notes":
            continue
        for g in s.get("groups", []):
            items = g.get("items", [])
            i = 0
            while i < len(items):
                it = items[i]
                print("\n" + C["dim"] + "%s > %s" % (s["title"], g["h"]) + C["0"])
                show_item(it)
                v = ask("  [invio/x/m/s/q]", "")
                if v is None or (v and v.lower() == "q"):
                    print()
                    ok("Rassegna interrotta. %d voci eliminate finora." % removed)
                    return
                v = v.lower()
                if v == "x":
                    items.pop(i)
                    removed += 1
                    ok("  Eliminata.")
                    continue
                if v == "m":
                    edit_item(it)
                elif v == "s":
                    move_item(sections, g, i)
                    continue
                i += 1
    print()
    ok("Rassegna completata. %d voci eliminate." % removed)


# --------------------------------------------------------------------
#  Ricerca
# --------------------------------------------------------------------

def search(sections):
    q = ask("Cerca")
    if not q:
        return
    q = q.lower()
    hits = []
    for s in sections:
        for g in s.get("groups", []):
            for it in g.get("items", []):
                blob = (it["name"] + " " + it.get("note", "") + " " + it.get("qty", "")).lower()
                if q in blob:
                    hits.append((s, g, it))
    if not hits:
        warn("Nessun risultato.")
        return
    title("%d risultati" % len(hits))
    j = pick("Quale apro?", hits,
             lambda h: "%s%s > %s%s  %s" % (C["dim"], h[0]["title"], h[1]["h"], C["0"], h[2]["name"]))
    if j is not None:
        edit_item(hits[j][2])


# --------------------------------------------------------------------
#  Navigazione
# --------------------------------------------------------------------

def group_menu(sections, section, group):
    if section.get("kind") == "notes":
        notes_menu(group)
        return
    while True:
        title("%s > %s" % (section["title"], group["h"]))
        items = group.setdefault("items", [])
        for i, it in enumerate(items, 1):
            print("  %2d) %s" % (i, item_label(it)))
        print("""
    a) aggiungi voce      x) elimina voce      s) sposta voce
    numero) modifica      0) indietro""")
        v = ask("  Cosa faccio?")
        if v is None or v == "0":
            return
        if v.isdigit() and 1 <= int(v) <= len(items):
            edit_item(items[int(v) - 1])
            continue
        v = v.lower()
        if v == "a":
            new_item(sections, group)
        elif v == "x":
            if not items:
                continue
            j = pick("  Quale elimino?", items, item_label)
            if j is not None and confirm("  Elimino '%s'?" % items[j]["name"]):
                ok("  Eliminata: %s" % items.pop(j)["name"])
        elif v == "s":
            if not items:
                continue
            j = pick("  Quale sposto?", items, item_label)
            if j is not None:
                move_item(sections, group, j)


def section_menu(sections, section):
    while True:
        title(section["title"])
        print(C["dim"] + "  " + section.get("sub", "") + C["0"])
        groups = section.setdefault("groups", [])
        j = pick("\n  Quale gruppo?", groups, grp_label)
        if j is None:
            return
        group_menu(sections, section, groups[j])


def stats(sections):
    title("Situazione")
    tot = 0
    for s in sections:
        n = sum(len(g.get("items", [])) + len(g.get("notes", [])) for g in s.get("groups", []))
        kind = "note" if s.get("kind") == "notes" else "voci"
        print("  %-34s %3d %s" % (s["title"], n, kind))
        if s.get("kind") != "notes":
            tot += n
    print("  " + "-" * 44)
    print("  %-34s %3d voci spuntabili" % ("TOTALE", tot))

    counts = {}
    for s in sections:
        for g in s.get("groups", []):
            for it in g.get("items", []):
                for t in it.get("tags", []):
                    counts[t] = counts.get(t, 0) + 1
    if counts:
        print("\n  Per etichetta:")
        for t in TAGS:
            if counts.get(t):
                print("    %-6s %3d   %s" % (t, counts[t], TAG_HELP[t]))


def main():
    raw, ui, sections = load()
    dirty = False
    title("Valigia Australia - editor")
    print(C["dim"] + "  Dati: " + DATA + C["0"])

    while True:
        print("""
  %sMENU%s
    1) sfoglia le sezioni
    2) passa in rassegna tutte le voci  (tieni / togli / modifica)
    3) cerca una voce
    4) situazione e conteggi
    s) salva        q) esci""" % (C["b"], C["0"]))
        v = ask("  ")
        if v is None:
            v = "q"
        v = v.lower()

        if v == "1":
            j = pick("\n  Quale sezione?", sections, sec_label)
            if j is not None:
                section_menu(sections, sections[j])
                dirty = True
        elif v == "2":
            review(sections)
            dirty = True
        elif v == "3":
            search(sections)
            dirty = True
        elif v == "4":
            stats(sections)
        elif v == "s":
            save(raw, ui, sections)
            raw, ui, sections = load()
            dirty = False
        elif v == "q":
            if dirty and confirm("\nHai modifiche non salvate. Salvo prima di uscire?"):
                save(raw, ui, sections)
            print("Ciao.")
            return


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterrotto. Niente e' stato salvato.")
