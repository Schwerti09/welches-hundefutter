#!/usr/bin/env python3
"""
BELLA Rassen-Bilder — erweitert breed-gallery.json auf moeglichst viele der 185
Rassen mit ECHTEN Fotos von dog.ceo (Stanford Dogs Dataset, frei nutzbar).
Nur Mappings, bei denen dog.ceo-Pfad == tatsaechlich dieselbe Rasse (oder eine
direkte Farbvariante derselben Rasse, z.B. Cavalier=blenheim) -> keine
irrefuehrenden Fotos.

Run: python scripts/build-breed-gallery.py
"""
import json, os, urllib.request

# slug -> dog.ceo Pfad ("breed" oder "breed/sub")
MAPPING = {
    "labrador-retriever": "labrador",
    "golden-retriever": "retriever/golden",
    "franzoesische-bulldogge": "bulldog/french",
    "deutscher-schaeferhund": "german/shepherd",
    "jack-russell-terrier": "terrier/russell",
    "chihuahua": "chihuahua",
    "beagle": "beagle",
    "mops": "pug",
    "dackel": "dachshund",
    "border-collie": "collie/border",
    "australian-shepherd": "australian/shepherd",
    "cocker-spaniel": "spaniel/cocker",
    "malteser": "maltese",
    "rottweiler": "rottweiler",
    "boxer": "boxer",
    "yorkshire-terrier": "terrier/yorkshire",
    "shih-tzu": "shihtzu",
    "havaneser": "havanese",
    "pudel": "poodle/standard",
    "zwergpinscher": "pinscher/miniature",
    "cavalier-king-charles": "spaniel/blenheim",
    "berner-sennenhund": "mountain/bernese",
    "dobermann": "doberman",
    "rhodesian-ridgeback": "ridgeback/rhodesian",
    "weimaraner": "weimaraner",
    "dalmatiner": "dalmatian",
    "siberian-husky": "husky",
    "alaskan-malamute": "malamute",
    "shiba-inu": "shiba",
    "akita-inu": "akita",
    "chow-chow": "chow",
    "pekinese": "pekinese",
    "lhasa-apso": "lhasa",
    "bichon-frise": "frise/bichon",
    "whippet": "whippet",
    "greyhound": "greyhound/italian",
    "irish-setter": "setter/irish",
    "magyar-vizsla": "vizsla",
    "samojede": "samoyed",
    "english-setter": "setter/english",
    "pointer": "pointer/german",
    "labradoodle": "labradoodle",
    "cavapoo": "cavapoo",
    "cockapoo": "cockapoo",
    "husky": "husky",
    "englische-bulldogge": "bulldog/english",
    "pomeranian": "pomeranian",
    "mischling": "mix",
    "malinois": "malinois",
    "belgischer-schaeferhund-groenendael": "groenendael",
    "tervueren": "tervuren",
    "sheltie": "sheepdog/shetland",
    "rough-collie": "rough/collie",
    "old-english-sheepdog": "sheepdog/english",
    "miniaturschnauzer": "schnauzer/miniature",
    "riesenschnauzer": "schnauzer/giant",
    "deutsche-dogge": "dane/great",
    "leonberger": "leonberg",
    "neufundlaender": "newfoundland",
    "bernhardiner": "stbernard",
    "tibetischer-mastiff": "mastiff/tibetan",
    "westie": "terrier/westhighland",
    "cairn-terrier": "terrier/cairn",
    "scottish-terrier": "terrier/scottish",
    "airedale-terrier": "airedale",
    "staffordshire-bull-terrier": "bullterrier/staffordshire",
    "border-terrier": "terrier/border",
    "parson-russell-terrier": "terrier/russell",
    "wolfsspitz": "keeshond",
    "basenji": "basenji",
    "norsk-elkhund": "elkhound/norwegian",
    "basset-hound": "hound/basset",
    "bloodhound": "hound/blood",
    "deutsch-kurzhaar": "pointer/german",
    "deutsch-drahthaar": "pointer/germanlonghair",
    "epagneul-breton": "spaniel/brittany",
    "flat-coated-retriever": "retriever/flatcoated",
    "irischer-wasserspaniel": "spaniel/irish",
    "papillon": "papillon",
    "coton-de-tulear": "cotondetulear",
    "saluki": "saluki",
    "afghane": "hound/afghan",
    "borzoi": "borzoi",
    "irischer-wolfshund": "wolfhound/irish",
    "kleiner-italienischer-windhund": "greyhound/italian",
    "komondor": "komondor",
    "langhaardackel": "dachshund",
    "rauhaardackel": "dachshund",
    "zwerg-dackel": "dachshund",
    "japanischer-spitz": "spitz/japanese",
    "husky-mix": "mix",
    "bouvier-des-flandres": "bouvier",
    "briard": "briard",
    "australian-cattle-dog": "cattledog/australian",
    "australian-kelpie": "australian/kelpie",
    "cardigan-welsh-corgi": "corgi/cardigan",
    "finnischer-lapphund": "finnish/lapphund",
    "bullmastiff": "mastiff/bull",
    "englischer-mastiff": "mastiff/english",
    "kuvasz": "kuvasz",
    "kaukasischer-owtscharka": "ovcharka/caucasian",
    "wire-fox-terrier": "terrier/fox",
    "welsh-terrier": "terrier/welsh",
    "irish-terrier": "terrier/irish",
    "soft-coated-wheaten": "terrier/wheaten",
    "american-staffordshire-terrier": "bullterrier/staffordshire",
    "ibizenhund": "hound/ibizan",
    "petit-basset-griffon-vendeen": "hound/basset",
    "otterhound": "otterhound",
    "gordon-setter": "setter/gordon",
    "chesapeake-bay-retriever": "retriever/chesapeake",
    "curly-coated-retriever": "retriever/curly",
    "english-springer-spaniel": "springer/english",
    "welsh-springer-spaniel": "spaniel/welsh",
    "affenpinscher": "affenpinscher",
    "boston-terrier": "terrier/boston",
    "japanisches-chin": "spaniel/japanese",
    "tibetischer-terrier": "terrier/tibetan",
    "schottischer-deerhound": "deerhound/scottish",
    "american-akita": "akita",
    "american-bully": "pitbull",
    "puggle": "puggle",
}

DOG_CEO = "https://dog.ceo/api/breed/{path}/images/random"

def fetch_image(path):
    url = DOG_CEO.format(path=path)
    with urllib.request.urlopen(url, timeout=20) as r:
        data = json.load(r)
    return data.get("message")

def main():
    base = os.path.dirname(__file__)
    breeds = json.load(open(os.path.join(base, "breeds_dump.json"), encoding="utf-8"))
    by_slug = {b["slug"]: b for b in breeds}

    gallery_path = os.path.join(base, "..", "src", "data", "breed-gallery.json")
    existing = json.load(open(gallery_path, encoding="utf-8"))
    existing_by_slug = {g["slug"]: g for g in existing}

    out = []
    ok, fail, skipped = 0, 0, 0
    for slug, b in by_slug.items():
        path = MAPPING.get(slug)
        if not path:
            skipped += 1
            continue
        try:
            img = fetch_image(path)
            if img:
                out.append({"slug": slug, "name": b["name"], "img": img, "dogCeoBreed": path})
                ok += 1
                print(f"  OK  {slug:45s} -> {path}")
            else:
                fail += 1
        except Exception as e:
            fail += 1
            print(f"  FAIL {slug:45s} -> {path}: {e}")

    json.dump(out, open(gallery_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"\n{ok} Rassen mit echtem Foto, {fail} Fehler, {skipped} ohne Mapping (Fallback bleibt aktiv)")
    print(f"-> {gallery_path}")

if __name__ == "__main__":
    main()
