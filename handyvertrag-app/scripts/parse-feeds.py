#!/usr/bin/env python3
"""
BELLA Feed-Parser — liest AWIN- + AdCell-Feeds, filtert HUNDE-FUTTER (kein Zubehör,
keine Katze), normalisiert auf das dog_foods-Schema und schreibt dog_foods.json.

Run:  python scripts/parse-feeds.py
Danach:  node scripts/load-dog-foods.mjs   (braucht DATABASE_URL)
"""
import csv, gzip, re, io, json, sys, os

csv.field_size_limit(10**7)

# ── Feed-Quellen (anpassen wenn neue Feeds kommen) ───────────────────────────
DL = os.path.expanduser("~/Downloads")
AWIN_FEEDS = [os.path.join(DL, "11703-23513-de_DE-Default.csv.gz")]   # schecker.de
ADCELL_FEEDS = [
    os.path.join(DL, "419197-66376.csv"),
    os.path.join(DL, "521034-66376.csv"),
    os.path.join(DL, "496158-66376.csv"),
]
PUBLISHER = "615299"  # AWIN publisher id (für Tracking-Konsistenz)

# ── Filter-Heuristiken ───────────────────────────────────────────────────────
FOOD_RE = re.compile(r"futter|nahrung|men[üu]\b|trockenfutter|nassfutter|kausnack|kauknochen|kaustange|kauartikel|leckerli|trainingssnack|barf|frostfutter|frischfleisch|dose|dosen|nass\b|trocken\b|kroketten|flocken|alleinfutter|erg[äa]nzungsfutter", re.I)
ACCESSORY_RE = re.compile(r"beutel|tasche|pocket|napf|leine|halsband|geschirr|spielzeug|\bball\b|decke|k[öo]rbchen|kissen|b[üu]rste|\bkamm\b|shampoo|mantel|jacke|schuhe|pfote(?:n)?schutz|transportbox|\bbox\b|eimer|zaun|gitter|clicker|pfeife|markierungs|kotbeutel|handschuh|h[üu]rde|tunnel|g[üu]rtel|rucksack|tragetasche|buch|dvd", re.I)
DOG_RE = re.compile(r"hund|dog|welpe|barf|doggy", re.I)
OTHER_PET_RE = re.compile(r"katz|\bcat\b|nager|kaninchen.?stall|vogel|\bfisch.?tank|aquarium|pferd|reit", re.I)

def is_dog_food(title, cat, merchant_is_dog=False):
    blob = f"{title} {cat}".lower()
    if ACCESSORY_RE.search(blob):
        return False
    if OTHER_PET_RE.search(blob) and not DOG_RE.search(blob):
        return False
    if not (merchant_is_dog or DOG_RE.search(blob)):
        return False
    return bool(FOOD_RE.search(blob))

def infer_type(t):
    t = t.lower()
    if re.search(r"kausnack|kauknochen|kaustange|kauartikel|leckerli|trainingssnack|\bsnack|knochen|sticks?\b", t): return "snack"
    if re.search(r"barf|frostfutter|frischfleisch|\broh\b", t): return "barf"
    if re.search(r"nassfutter|nass-|\bdose|dosen|frischebeutel|men[üu]\b|feucht|pastete", t): return "nass"
    if re.search(r"kaltgepresst", t): return "kaltgepresst"
    if re.search(r"trockenfutter|trocken|kroketten|flocken", t): return "trocken"
    return "trocken"

PROTEINS = [("h[äa]hnchen","Huhn"),("huhn","Huhn"),("rind","Rind"),("lachs","Lachs"),("lamm","Lamm"),
            ("ente","Ente"),("pute","Pute"),("truthahn","Pute"),("wild","Wild"),("kaninchen","Kaninchen"),
            ("pferd","Pferd"),("ziege","Ziege"),("insekt","Insekt"),("fisch","Fisch"),("strauss","Strauß")]
def infer_protein(t):
    t = t.lower()
    for k, lab in PROTEINS:
        if re.search(k, t): return lab
    return None

def suitable_for(t):
    t = t.lower(); s = []
    if re.search(r"welpe|junior|puppy", t): s.append("welpen")
    if re.search(r"senior|\balt\b|ageing|aging|7\+|8\+", t): s.append("senior")
    if re.search(r"adult|erwachsen", t): s.append("adult")
    if re.search(r"allergie|sensitiv|hypoallergen|getreidefrei|grain.?free|monoprotein|magen", t): s.append("allergie")
    return s or ["adult"]

def num(s):
    if not s: return None
    s = str(s).strip()
    # "12,99" / "1.234,56" / "12.99"
    if "," in s and "." in s: s = s.replace(".", "").replace(",", ".")
    else: s = s.replace(",", ".")
    m = re.search(r"-?\d+(?:\.\d+)?", s)
    return float(m.group(0)) if m else None

def weight_kg(t):
    t = t.lower()
    m = re.search(r"(\d+(?:[.,]\d+)?)\s*kg\b", t)
    if m: return float(m.group(1).replace(",", "."))
    m = re.search(r"(\d+)\s*g\b", t)
    if m: return float(m.group(1)) / 1000
    return None

def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")[:90]

def smart_open(path):
    """Decode cp1252 (Latin-1) feeds correctly; fall back to utf-8."""
    raw = gzip.open(path, "rb").read() if path.endswith(".gz") else open(path, "rb").read()
    try:
        return io.StringIO(raw.decode("utf-8"))
    except UnicodeDecodeError:
        return io.StringIO(raw.decode("cp1252", errors="replace"))

# ── Parsing ──────────────────────────────────────────────────────────────────
out = {}  # slug -> record (dedupe)

def add(rec):
    if not rec["affiliateUrl"] or not rec["name"]:
        return
    out.setdefault(rec["slug"], rec)

def parse_awin(path):
    n = 0
    merchant_is_dog = "schecker" in path.lower()
    for row in csv.DictReader(smart_open(path)):
        title = row.get("product_name") or ""
        cat = row.get("merchant_category") or ""
        if not is_dog_food(title, cat, merchant_is_dog):
            continue
        if (cat.split(">")[0] not in ("Hundefutter", "Hundesnacks")) and merchant_is_dog:
            continue
        price = num(row.get("search_price"))
        wk = weight_kg(title)
        ppk = round(price / wk, 2) if (price and wk and wk > 0) else None
        brand = (title.split()[0] if title else "").strip("®™,")
        add({
            "slug": slugify(f"{brand}-{title}-{row.get('aw_product_id','')}"),
            "brand": brand or row.get("merchant_name") or "",
            "name": title.strip(),
            "type": infer_type(f"{title} {cat}"),
            "protein": infer_protein(title),
            "isGrainFree": bool(re.search(r"getreidefrei|grain.?free", title, re.I)),
            "isHypoallergenic": bool(re.search(r"hypoallergen|sensitiv|monoprotein|allergie", title, re.I)),
            "pricePerKg": ppk,
            "price": price,
            "suitableFor": suitable_for(f"{title} {cat}"),
            "imageUrl": row.get("merchant_image_url") or row.get("aw_image_url") or None,
            "affiliateNetwork": "awin",
            "affiliateUrl": row.get("aw_deep_link") or row.get("merchant_deep_link") or "",
            "source": row.get("merchant_name") or "awin",
        })
        n += 1
    return n

def parse_adcell(path):
    n = 0
    for row in csv.DictReader(smart_open(path), delimiter=";"):
        title = row.get("Produkt-Titel") or ""
        cat = row.get("Produktkategorie") or ""
        if not is_dog_food(title, cat):
            continue
        price = num(row.get("Preis (Brutto)"))
        gp_unit = (row.get("Grundpreiseinheit") or "").lower()
        ppk = num(row.get("Grundpreis")) if ("kg" in gp_unit) else None
        if ppk is None:
            wk = weight_kg(f"{title} {row.get('Inhalt','')}")
            ppk = round(price / wk, 2) if (price and wk and wk > 0) else None
        brand = (row.get("Hersteller") or (title.split()[0] if title else "")).strip("®™,")
        add({
            "slug": slugify(f"{brand}-{title}-{row.get('europäische Artikelnummer EAN','') or row.get('Anbieter Artikelnummer AAN','')}"),
            "brand": brand,
            "name": title.strip(),
            "type": infer_type(f"{title} {cat}"),
            "protein": infer_protein(title),
            "isGrainFree": bool(re.search(r"getreidefrei|grain.?free", title, re.I)),
            "isHypoallergenic": bool(re.search(r"hypoallergen|sensitiv|monoprotein|allergie", title, re.I)),
            "pricePerKg": ppk,
            "price": price,
            "suitableFor": suitable_for(f"{title} {cat}"),
            "imageUrl": row.get("Produktbild-URL") or row.get("Vorschaubild-URL") or None,
            "affiliateNetwork": "adcell",
            "affiliateUrl": row.get("Deeplink") or "",
            "source": brand or "adcell",
        })
        n += 1
    return n

print("BELLA Feed-Parser")
for p in AWIN_FEEDS:
    if os.path.exists(p): print(f"  AWIN {os.path.basename(p)}: {parse_awin(p)} Futter")
for p in ADCELL_FEEDS:
    if os.path.exists(p): print(f"  AdCell {os.path.basename(p)}: {parse_adcell(p)} Futter")

records = list(out.values())
json.dump(records, open(os.path.join(os.path.dirname(__file__), "dog_foods.json"), "w", encoding="utf-8"), ensure_ascii=False)
print(f"\n  -> {len(records)} eindeutige Hunde-Futter-Produkte in scripts/dog_foods.json")
print("\n  Typ-Verteilung:", {t: sum(1 for r in records if r['type']==t) for t in set(r['type'] for r in records)})
print("  mit €/kg:", sum(1 for r in records if r['pricePerKg']), "| mit Protein:", sum(1 for r in records if r['protein']))
print("\n  Beispiele:")
for r in records[:6]:
    print(f"   - {r['name'][:50]} | {r['brand']} | {r['type']} | {r['protein']} | {r['pricePerKg']}€/kg")
