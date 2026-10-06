"""Prepara la cartella _site per GitHub Pages.

Copia solo i file del sito (pagine, dati, font, icone, PDF) e scrive
precache.json, cioe' l'elenco di cio' che il telefono deve salvare per
funzionare offline. Mette anche un numero di versione nuovo in sw.js,
cosi' a ogni pubblicazione i telefoni scaricano gli aggiornamenti.

Lo usa la GitHub Action (.github/workflows/pages.yml). In locale:
    python tools/build_site.py            -> crea _site/
"""
import json, os, shutil, sys, time
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "_site"

# cosa pubblicare: (cartella, estensioni ammesse)
INCLUDE = [
    (".", {".html", ".js", ".webmanifest"}),      # index.html, documento.html, pwa.js, sw.js
    ("fonts", {".css", ".woff2"}),
    ("icons", {".png"}),
    ("lib", {".js"}),
    ("lib/pdfjs", {".js"}),
    ("hub", {".html", ".js", ".css"}),
    ("Perth_coast", {".html", ".js"}),
    ("Adelaide_Melbourne", {".html", ".js"}),
    ("valigia", {".html", ".js"}),
    ("Documenti_cifrati", {".enc", ".js"}),   # i PDF originali NON vengono pubblicati
]

def url_of(rel: str) -> str:
    # come encodeURIComponent del browser, segmento per segmento
    return "/".join(quote(seg, safe="-_.!~*'()") for seg in rel.split("/"))

def main():
    version = os.environ.get("SITE_VERSION") or time.strftime("%Y%m%d-%H%M%S")
    base_url = os.environ.get("SITE_URL", "").rstrip("/")
    leaked = [p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*.pdf") if "_site" not in p.parts]
    if leaked:
        print("ATTENZIONE: PDF in chiaro nel repository (sono pubblici!):", *leaked, sep="\n  ", file=sys.stderr)
    if OUT.exists():
        shutil.rmtree(OUT)
    files = []
    for folder, exts in INCLUDE:
        src = ROOT / folder
        if not src.is_dir():
            print("manca la cartella", folder, file=sys.stderr); continue
        for p in sorted(src.iterdir()):
            if p.is_file() and p.suffix.lower() in exts:
                rel = p.relative_to(ROOT).as_posix()
                dst = OUT / rel
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(p, dst)
                files.append(rel)

    # versione nel service worker
    sw = OUT / "sw.js"
    sw.write_text(sw.read_text(encoding="utf-8").replace("__VERSION__", version), encoding="utf-8")
    # link assoluto per l'anteprima su WhatsApp/Telegram
    if base_url:
        idx = OUT / "index.html"
        idx.write_text(idx.read_text(encoding="utf-8").replace(
            'content="icons/icon-512.png"', f'content="{base_url}/icons/icon-512.png"'), encoding="utf-8")

    precache = [f for f in files if f != "sw.js"]
    manifest = {
        "version": version,
        "bytes": sum((OUT / f).stat().st_size for f in precache),
        "files": [{"url": url_of(f), "bytes": (OUT / f).stat().st_size} for f in precache],
    }
    (OUT / "precache.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    (OUT / ".nojekyll").write_text("")
    print(f"_site pronto: {len(precache)} file, {manifest['bytes']/1048576:.1f} MB, versione {version}")

if __name__ == "__main__":
    main()
