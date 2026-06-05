#!/usr/bin/env python3
"""
BELLA Cross-Selling-Parser — liest dieselben AWIN-/AdCell-Feeds und sammelt
HUNDE-NON-FOOD-Produkte (Zeckenschutz, Snacks, Gesundheit/NEM, Zubehör,
Versicherung) für den Quer-Verkauf nach der Futter-Empfehlung.

Output: scripts/cross_sell.json  →  laden mit scripts/load-crosssell.mjs
"""
import csv, gzip, re, io, json, os, urllib.request, tempfile
csv.field_size_limit(10**7)

DL = os.environ.get("FEED_DIR", os.path.expanduser("~/Downloads"))

def _download(url, dest, i):
    path = os.path.join(dest, f"x_{i}.dat")
    req = urllib.request.Request(url, headers={"User-Agent": "BELLA-FeedBot/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f:
        f.write(r.read())
    return path

_awin = [u.strip() for u in os.environ.get("AWIN_FEED_URLS", "").split(",") if u.strip()]
_adcell = [u.strip() for u in os.environ.get("ADCELL_FEED_URLS", "").split(",") if u.strip()]
if _awin or _adcell:
    _t = tempfile.mkdtemp(prefix="bella-x-")
    AWIN_FEEDS = [_download(u, _t, f"a{i}") for i, u in enumerate(_awin)]
    ADCELL_FEEDS = [_download(u, _t, f"c{i}") for i, u in enumerate(_adcell)]
else:
    AWIN_FEEDS = [os.path.join(DL, "11703-23513-de_DE-Default.csv.gz"),
                  os.path.join(DL, "56633-107909-de_DE-Default.csv.gz")]
    ADCELL_FEEDS = [os.path.join(DL, "419197-66376.csv"), os.path.join(DL, "521034-66376.csv"),
                    os.path.join(DL, "496158-66376.csv"), os.path.join(DL, "376594-66376.csv"),  # amberdog
                    os.path.join(DL, "402766-66376.csv"),  # Canosept Hunde-Pflege (Augen/Fell/Haut/Zahn/Gelenk/Darmflora)
                    os.path.join(DL, "356592-66376 (4).csv"),  # SAUERLAND Zwinger/Hütten (überwiegend Equipment → Kurator filtert)
                    os.path.join(DL, "372775-66376.csv")]  # PAWZLOVE Print-Merch (Apparel → Kurator filtert)

DOG_RE = re.compile(r"hund|dog|welpe|barf|doggy", re.I)
OTHER_PET_RE = re.compile(r"katz|\bcat\b|nager|\bvogel\b|aquarium|pferd|reitsport", re.I)
# Junk, das BELLA nicht querverkauft (Deko/Print/Bücher)
SKIP_RE = re.compile(r"drucksache|poster|tasse|aufkleber|sticker|postkarte|gru[ßs]karte|kalender|\bbuch\b|\bdvd\b|gem[äa]lde|leinwand|deko\b|figur", re.I)

# Kategorie-Erkennung (Reihenfolge = Priorität)
CATS = [
    ("zeckenschutz", re.compile(r"bernstein|amber|kupfer|zecke|floh|\bem-?keramik", re.I)),
    ("versicherung", re.compile(r"versicherung|haftpflicht|krankenversicherung|op-?versicherung", re.I)),
    ("gesundheit",   re.compile(r"nahrungserg[äa]nz|\bnem\b|vitamin|gelenk|glucosamin|\b[öo]l\b|lachs[öo]l|zahnpflege|zahnpasta|zahncreme|zahnb[üu]rste|fellpflege|wurmkur|pflege|darmflora|probiotik|wundspray|wundgel|wundpflege|silberspray|ohrreiniger", re.I)),
    ("snack",        re.compile(r"kausnack|kauknochen|kaustange|kauartikel|leckerli|leckerchen|trainingssnack|\bsnack|kaurolle|ochsenziemer", re.I)),
    ("zubehoer",     re.compile(r"leine|halsband|geschirr|napf|spielzeug|\bball\b|decke|k[öo]rbchen|kissen|b[üu]rste|tasche|transportbox|schmuck|kette|anh[äa]nger", re.I)),
]

def categorize(title, cat):
    blob = f"{title} {cat}".lower()
    for name, rx in CATS:
        if rx.search(blob):
            return name
    return None

PROTEINS = [("h[äa]hnchen", "Huhn"), ("huhn", "Huhn"), ("rind", "Rind"), ("lachs", "Lachs"),
            ("lamm", "Lamm"), ("ente", "Ente"), ("pute", "Pute"), ("wild", "Wild"),
            ("kaninchen", "Kaninchen"), ("pferd", "Pferd"), ("fisch", "Fisch")]
def infer_protein(t):
    t = t.lower()
    for k, lab in PROTEINS:
        if re.search(k, t): return lab
    return None

def companion_for(category, title):
    """Strukturierte Eignung: zu welchem Problem/Verhalten/Lebensphase passt das Begleitprodukt.
    Gemeinsame Basis für Matching UND (später) retention-growth Preis-Alerts."""
    t = title.lower()
    issue, behavior, life = [], [], []
    if category == "zeckenschutz":
        issue += ["zecken", "parasiten"]
    if re.search(r"lachs[öo]l|fell|haut|omega", t): issue += ["fell", "haut"]
    if re.search(r"gelenk|glucosamin|chondroitin|gr[üu]nlippmuschel", t): issue += ["gelenke"]; life += ["senior"]
    if re.search(r"zahn|dental", t): issue += ["zahn"]
    if re.search(r"magen|darm|verdau|probiotik|darmflora", t): issue += ["magen", "verdauung"]
    if re.search(r"beruhig|angst|stress|entspann", t): issue += ["stress"]
    if re.search(r"schlecknapf|anti.?schling|sch?lingnapf", t): behavior += ["schlingt"]
    if re.search(r"welpen?|junior", t): life += ["welpen"]
    if re.search(r"senior|\balt\b", t): life += ["senior"]
    out = {}
    if issue: out["issue"] = sorted(set(issue))
    if behavior: out["behavior"] = sorted(set(behavior))
    if life: out["lifeStage"] = sorted(set(life))
    return out

def num(s):
    if not s: return None
    s = str(s).strip()
    s = s.replace(".", "").replace(",", ".") if ("," in s and "." in s) else s.replace(",", ".")
    m = re.search(r"-?\d+(?:\.\d+)?", s)
    return float(m.group(0)) if m else None

def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")[:90]

def smart_open(path):
    raw = open(path, "rb").read()
    if raw[:2] == b"\x1f\x8b":
        raw = gzip.decompress(raw)
    try: return io.StringIO(raw.decode("utf-8"))
    except UnicodeDecodeError: return io.StringIO(raw.decode("cp1252", errors="replace"))

out = {}
def add(rec):
    if rec["affiliateUrl"] and rec["name"] and rec["category"]:
        out.setdefault(rec["slug"], rec)

def keep(title, cat):
    blob = f"{title} {cat}".lower()
    if SKIP_RE.search(blob): return False
    if OTHER_PET_RE.search(blob) and not DOG_RE.search(blob): return False
    return DOG_RE.search(blob) is not None

def parse_awin(path):
    n = 0
    dog_merchant = "schecker" in path.lower() or "bellerei" in path.lower()
    for row in csv.DictReader(smart_open(path)):
        title = row.get("product_name") or ""; cat = row.get("merchant_category") or ""
        if not (dog_merchant or keep(title, cat)): continue
        c = categorize(title, cat)
        if not c: continue
        brand = (title.split()[0] if title else "").strip("®™,")
        add({"slug": slugify(f"{brand}-{title}-{row.get('aw_product_id','')}"), "brand": brand,
             "name": title.strip(), "category": c, "protein": infer_protein(title),
             "companionFor": companion_for(c, title), "price": num(row.get("search_price")),
             "imageUrl": row.get("merchant_image_url") or row.get("aw_image_url") or None,
             "affiliateNetwork": "awin", "affiliateUrl": row.get("aw_deep_link") or ""}); n += 1
    return n

def parse_adcell(path):
    n = 0
    for row in csv.DictReader(smart_open(path), delimiter=";"):
        title = row.get("Produkt-Titel") or ""; cat = row.get("Produktkategorie") or ""
        if not keep(title, cat): continue
        c = categorize(title, cat)
        if not c: continue
        brand = (row.get("Hersteller") or (title.split()[0] if title else "")).strip("®™,")
        add({"slug": slugify(f"{brand}-{title}-{row.get('europäische Artikelnummer EAN','') or row.get('Anbieter Artikelnummer AAN','')}"),
             "brand": brand, "name": title.strip(), "category": c, "protein": infer_protein(title),
             "companionFor": companion_for(c, title), "price": num(row.get("Preis (Brutto)")),
             "imageUrl": row.get("Produktbild-URL") or row.get("Vorschaubild-URL") or None,
             "affiliateNetwork": "adcell", "affiliateUrl": row.get("Deeplink") or ""}); n += 1
    return n

print("BELLA Cross-Selling-Parser")
for p in AWIN_FEEDS:
    if os.path.exists(p): print(f"  AWIN {os.path.basename(p)}: {parse_awin(p)} Quer-Verkauf")
for p in ADCELL_FEEDS:
    if os.path.exists(p): print(f"  AdCell {os.path.basename(p)}: {parse_adcell(p)} Quer-Verkauf")

records = list(out.values())
json.dump(records, open(os.path.join(os.path.dirname(__file__), "cross_sell.json"), "w", encoding="utf-8"), ensure_ascii=False)
import collections
dist = collections.Counter(r["category"] for r in records)
print(f"\n  -> {len(records)} Cross-Sell-Produkte in scripts/cross_sell.json")
print("  Kategorien:", dict(dist))
