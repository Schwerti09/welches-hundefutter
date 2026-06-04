#!/bin/bash
# 🐕 BELLA Migration Script
# Migriert das geforkte HANSI-Repo zu BELLA (Hundefutter-Berater)
# Ausführen aus dem Repo-Root: bash scripts/migrate-from-hansi.sh

set -e

echo "🐕 BELLA Migration startet..."
echo "════════════════════════════════════════"

# ─── STEP 1: ORDNER UMBENENNEN ─────────────────────────────────
if [ -d "handyvertrag-app" ]; then
  echo "📁 Benenne handyvertrag-app/ → bella-app/"
  git mv handyvertrag-app bella-app
else
  echo "⏭️  handyvertrag-app/ existiert nicht, skip"
fi

cd bella-app || { echo "❌ bella-app Ordner nicht gefunden"; exit 1; }

# ─── STEP 2: PACKAGE.JSON ─────────────────────────────────────
if [ -f "package.json" ]; then
  echo "📦 Update package.json name"
  sed -i.bak 's/"name": "handyvertrag-app"/"name": "bella-app"/g' package.json
  sed -i.bak 's/"name": "hansi"/"name": "bella"/g' package.json
  rm -f package.json.bak
fi

# ─── STEP 3: GLOBAL FIND & REPLACE ────────────────────────────
echo "🔄 Massen-Find-and-Replace im gesamten Code"

# Dateien zum Patchen finden (TypeScript, TSX, JS, JSX, MD, JSON, ENV)
FILES=$(find . -type f \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \
     -o -name "*.md" -o -name "*.json" -o -name "*.env*" \
     -o -name "*.toml" -o -name "*.yaml" -o -name "*.yml" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./.git/*" \
  -not -name "package-lock.json" \
  -not -name "pnpm-lock.yaml")

# Replace-Pairs (alt -> neu)
declare -A REPLACEMENTS=(
  # Branding
  ["HANSI Intelligence System"]="BELLA Intelligence System"
  ["HANSI"]="BELLA"
  ["hansi"]="bella"
  ["Hansi"]="Bella"

  # Domain
  ["handytrotzschufa.today"]="welches-hundefutter.today"
  ["handytrotzschufa.de"]="welches-hundefutter.today"

  # Produkt/Thema
  ["Handyvertrag trotz Schufa"]="Hundefutter für deinen Hund"
  ["Handyvertrag trotz negativer Schufa"]="Hundefutter bei Allergie"
  ["handyvertrag trotz schufa"]="welches hundefutter für meinen hund"
  ["Handyvertrag"]="Hundefutter"
  ["handyvertrag"]="hundefutter"
  ["Mobilfunkvertrag"]="Hundeernährung"
  ["mobilfunkvertrag"]="hundeernaehrung"

  # Datenbank
  ["mobile_contracts"]="dog_foods"
  ["mobileContracts"]="dogFoods"
  ["MobileContract"]="DogFood"

  # Komponenten
  ["HansiDecisionWrapper"]="BellaAdvisorWrapper"
  ["HansiChat"]="BellaChat"
  ["HansiAdvisor"]="BellaAdvisor"

  # Konzepte
  ["Schufa-Eintrag"]="Futtermittelallergie"
  ["Schufa-Score"]="Aktivitätslevel"
  ["negative Schufa"]="Allergie"
  ["Bonitätsprüfung"]="Allergiecheck"
  ["Tarif"]="Futter"
  ["Datenvolumen"]="Tagesmenge"
  ["Allnet-Flat"]="Komplettmenü"
  ["Netz"]="Marke"

  # Anbieter zu Hundefutter-Marken (häufige Erwähnungen ersetzen)
  ["freenet"]="anifit"
  ["congstar"]="bellfor"
  ["otelo"]="futalis"

  # Routen
  ["/anbieter/"]="/futter/"
  ["/handy/"]="/rasse/"
  ["/stadt/"]="/problem/"
  ["/schufa-rechner"]="/futter-finder"
)

for OLD in "${!REPLACEMENTS[@]}"; do
  NEW="${REPLACEMENTS[$OLD]}"
  echo "  🔁  '$OLD' → '$NEW'"
  for FILE in $FILES; do
    if grep -q "$OLD" "$FILE" 2>/dev/null; then
      sed -i.bak "s|${OLD}|${NEW}|g" "$FILE" 2>/dev/null || true
      rm -f "${FILE}.bak"
    fi
  done
done

# ─── STEP 4: NETLIFY.TOML ─────────────────────────────────────
cd ..
if [ -f "netlify.toml" ]; then
  echo "🌐 Update netlify.toml base"
  sed -i.bak 's|base = "handyvertrag-app"|base = "bella-app"|g' netlify.toml
  rm -f netlify.toml.bak
fi

# ─── STEP 5: NEUE ORDNER STRUKTUR ─────────────────────────────
cd bella-app

# Lege neue Routen-Ordner an (falls nicht existent)
mkdir -p src/app/rasse/\[slug\]
mkdir -p src/app/problem/\[slug\]
mkdir -p src/app/lebensphase/\[slug\]
mkdir -p src/app/futtertyp/\[slug\]
mkdir -p src/app/empfehlung/\[slug\]
mkdir -p src/app/api/cron/import-feeds
mkdir -p src/lib
mkdir -p scripts

echo "📁 Neue Route-Ordner angelegt"

# ─── STEP 6: .ENV.EXAMPLE ─────────────────────────────────────
cat > .env.example << 'ENVEOF'
# ═══════════════════════════════════════════════════
# BELLA – welches-hundefutter.today
# ═══════════════════════════════════════════════════

# Database (Neon Postgres)
DATABASE_URL="postgresql://..."

# KI
GEMINI_API_KEY=""
ANTHROPIC_API_KEY=""

# Cron Security
CRON_SECRET=""

# ═══════════════════════════════════════════════════
# AWIN — Hier kommen deine Feeds rein.
# Sobald die 5 Partner angenommen sind, hier eintragen.
# Danach: pnpm import-feeds
# ═══════════════════════════════════════════════════

# Anifit (Provision: 30€ + 8% recurring)
AWIN_ANIFIT_ID=""
AWIN_ANIFIT_FEED_URL=""

# Futalis (Provision: 40€ pro Lead)
AWIN_FUTALIS_ID=""
AWIN_FUTALIS_FEED_URL=""

# Bellfor (Provision: 30€ + 10% recurring)
AWIN_BELLFOR_ID=""
AWIN_BELLFOR_FEED_URL=""

# Zooplus (Provision: 5%)
AWIN_ZOOPLUS_ID=""
AWIN_ZOOPLUS_FEED_URL=""

# Fressnapf (Provision: 5%)
AWIN_FRESSNAPF_ID=""
AWIN_FRESSNAPF_FEED_URL=""
ENVEOF

echo "📝 .env.example geschrieben"

# ─── STEP 7: PACKAGE.JSON ENHANCEMENTS ───────────────────────
if [ -f "package.json" ]; then
  echo "📦 Erinnerung: Füge in package.json hinzu:"
  echo '   "scripts": {'
  echo '     "import-feeds": "tsx scripts/import-feeds.ts",'
  echo '     "seed:breeds": "tsx scripts/seed-breeds.ts",'
  echo '     "seed:issues": "tsx scripts/seed-issues.ts"'
  echo '   }'
  echo '   "dependencies": { "fast-xml-parser": "^4.5.0", "tsx": "^4.0.0" }'
fi

cd ..

# ─── DONE ──────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════"
echo "✅ Migration abgeschlossen!"
echo "════════════════════════════════════════"
echo ""
echo "📋 Nächste Schritte:"
echo "  1. cd bella-app && pnpm install"
echo "  2. .env.local befüllen (DATABASE_URL, API-Keys)"
echo "  3. Schema-Migration: npx drizzle-kit push"
echo "  4. Seed-Daten: pnpm seed:breeds && pnpm seed:issues"
echo "  5. AWIN-Partner bewerben, Feed-URLs in .env eintragen"
echo "  6. pnpm import-feeds"
echo "  7. pnpm dev → Test auf http://localhost:3000"
echo "  8. git add -A && git commit -m 'feat: BELLA migration complete'"
echo "  9. git push → Netlify deployt automatisch"
echo ""
echo "🐕 Viel Erfolg mit BELLA!"
