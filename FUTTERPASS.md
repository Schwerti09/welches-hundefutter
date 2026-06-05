# FUTTERPASS.md — Die Erfindung: Bella als Ernährungsmanager fürs ganze Hundeleben

> Geteilte Blaupause für die ganze Flotte. `lifecycle-architect` ist der Eigentümer.
> Ergänzt `CLAUDE.md`. Wenn ein Agent eine Entscheidung trifft, prüft er sie gegen dieses Dokument.

---

## 1. Die These (warum das Check24 in den Schatten stellt)

Check24 und idealo sind **zustandslos über *dich***. Du kommst, vergleichst, gehst. Perfekt für
Versicherung und Fernseher — **Einmalkäufe**. Hundefutter ist strukturell anders:
**wiederkehrend, verbrauchbar, und an ein lebendes Tier gebunden, das sich verändert** (Welpe →
Adult → Senior, entwickelt Allergien, nimmt zu, wird krank). **Kein Vergleichsportal nutzt das.**

> **Bella ist kein Vergleichsportal. Bella ist der Ernährungsmanager fürs ganze Hundeleben —
> sie kennt *diesen* Hund und kümmert sich, ohne dass man fragt.**

**Die Atomeinheit ist nicht das Produkt, sondern der Hund.** Das ist der Burggraben, den
Breite und Domain-Power nicht einholen.

---

## 2. Das Schwungrad (5 Stufen)

```
   ┌─────────────────────────────────────────────────────────────┐
   │  alle Wege → BELLA → PROFIL anlegen (der Hund, nicht Produkt) │
   └─────────────────────────────────────────────────────────────┘
        │
   1. PROFIL            Bello, Labrador, 3 J., 32 kg, Hühnerallergie,
                        frisst Marke X (12-kg-Sack). Persistiert, an DOI-Audience gekoppelt.
        ↓
   2. VERBRAUCHS-       Tagesration · wie lange hält der Sack · €/Monat.
      MATHEMATIK        (RER = 70·kg^0.75 · Aktivitätsfaktor → g/Tag → Sack-Tage)
        ↓
   3. NACHSCHUB-        „Bellos Futter geht in 5 Tagen zur Neige. Günstigster Preis
      WECKER ★          gerade 18€ bei X — 12% unter 90-Tage-Schnitt. Nachbestellen →"
      (die Erfindung)   = Wiederkauf-Provision, ein Hundeleben lang. Ohne Lager.
        ↓
   4. LEBENSPHASEN-     Senior-Umstellung mit 7 · Gelenk-NEM zur rechten Zeit ·
      TRIGGER           VERSICHERUNG (Top-Provision) im Bedarfsmoment, nicht zufällig.
        ↓
   5. TEILBARER         „Bellos Futterprofil" — schöne Seite pro Hund.
      STECKBRIEF        Viral (Hundebesitzer zeigen ihren Hund) + Backlink + Wiedereinstieg.
        │
        └────────────► zurück zu BELLA (Profil-Update, neuer Hund, Empfehlung)
```

★ = der neue, nie dagewesene Kern. Stufe 3 ist die Evolution des bestehenden Preis-Weckers:
Preis-Wecker = „wann günstiger". **Nachschub-Wecker = „günstiger UND du wirst knapp" = der Kaufmoment.**

---

## 3. Datenmodell (baut auf Vorhandenem auf)

**Voraussetzung (BLOCKER):** Zuerst muss `platform-architect` den **Schema-Drift** heilen —
`subscribers`, `price_alerts`, `price_history` und die Spalten `category`/`companion_for` leben
heute nur in rohem SQL, nicht in `src/db/schema.ts`, und es gibt keine Migration. **Bevor neue
Tabellen dazukommen, kommt das alles in Drizzle + eine Migration.** Sonst droppt `drizzle-kit push`
die Audience.

Neue/erweiterte Tabellen (Drizzle, mit Migration):
- `dog_profiles` — `id`, `subscriber_id?` (FK, optional bis E-Mail), `name`, `breed_slug`,
  `birth_or_age`, `weight_kg`, `activity_level`, `allergies` (text[]), `health_flags` (text[]),
  `current_food_slug?`, `current_package_g?`, `last_purchase_at?`, `est_daily_grams`,
  `est_bag_days`, `share_token` (für den öffentlichen Steckbrief), `created_at`, `updated_at`.
- `price_alerts` erweitern → **Nachschub-Modus**: `mode` (`price` | `refill`), `refill_due_at`
  (= `last_purchase_at` + `est_bag_days`), `last_notified_at`.
- Verbrauchsmathematik liegt im Code (deterministisch), nicht im LLM. Felder dafür sind schon da:
  `dog_foods.pricePerKg`, `packageSizes`, `suitableFor`, plus `price_history` für den 90-Tage-Schnitt.

---

## 4. „Alle Wege führen zu Bella" — Funnel-Umbau

Jede Programmatic-Seite (Rasse / Problem / Futtertyp / Vergleich — der ganze SEO-Long-Tail) endet
**nicht** in „Produkte ansehen", sondern in **„Lass Bella einen Futterplan für deinen [Rasse]
erstellen"** → Profil-Capture → Schwungrad. SEO-Traffic füttert die Profil-Maschine, nicht
Einmal-Klicks. (`content-engineer` + `seo-strategist` bauen die Seiten so, `visual-designer`/
`experience-architect` machen den Profil-Einstieg verführerisch.)

---

## 5. Umsatz-Stack

1. **Wiederkehrende Nachschub-Provision** — der große Hebel. Affiliate-Marge auf einen
   Quasi-Abo-Kauf alle paar Wochen, über das ganze Hundeleben.
2. **High-AOV-Cross-Sell im Bedarfsmoment** — Versicherung (Top-Provision) bei Krankheits-Nennung,
   NEM bei Senior-Umstellung. Lebensphasen-getriggert, nicht zufällig. (`cross-sell-curator`)
3. **Eigene Audience, die sich verzinst** — jeder Hund = eine Beziehung über Jahre, kein One-Shot.

---

## 6. Guardrails (nicht verhandelbar)

- **Verbrauchsmathematik = Orientierung, keine Tiermedizin.** Rationen als Faustregel kennzeichnen,
  „Anpassung je nach Hund / mit Tierarzt abstimmen". Keine Heilversprechen. (Veto: `trust-compliance`)
- **DSGVO:** ein Hundeprofil mit E-Mail ist ein Personenbezug. Rechtsgrundlage, Datensparsamkeit,
  Löschkonzept, Profil jederzeit löschbar. Öffentlicher Steckbrief nur opt-in, anonymisierbar.
- **Kuratiert, nicht zugemüllt (Regel #9).** Nachschub-Wecker max. 1 pro Fälligkeit; kein Spam;
  echte Tiefpreise aus `price_history`, nie erfunden. Wert vor Frequenz.
- **DB-first, Build grün, mobile-first** wie in `CLAUDE.md`.

---

## 7. Baureihenfolge

1. `platform-architect`: Schema-Drift heilen (Drizzle + Migration), Zombie-`import-awin.ts` +
   Legacy (`api/contract-tuev`, `api/devices`, `CityOfferCard`) entfernen. **Blocker für alles.**
2. `lifecycle-architect` + `platform-architect`: `dog_profiles` + `price_alerts`-Erweiterung.
3. `bella-advisor`: Profil-Capture in den Flow (am Ende der Empfehlung: „soll ich auf Bello aufpassen?").
4. `lifecycle-architect` + `retention-growth`: Verbrauchsmathematik + Nachschub-Wecker an den
   bestehenden 06:00-Cron hängen (`check-price-alerts.mjs` um `mode='refill'` erweitern).
5. `feed-engineer`: Katalog um NEM/Öl + **Versicherung** verbreitern (heute von `parse-feeds.py`
   ausgefiltert) → Lebensphasen-Cross-Sell hat Ware.
6. `lifecycle-architect` + `experience-architect`: teilbarer Futter-Steckbrief (`/hund/[share_token]`).
7. `content-engineer` + `seo-strategist`: Funnel-CTA-Umbau auf allen Programmatic-Seiten.

## 8. Definition of Done

- `dog_profiles` in Drizzle + Migration; Schema-Drift Geschichte.
- Bella legt im Flow ein persistentes Profil an; Verbrauchsmathematik zeigt Sack-Tage + €/Monat.
- Nachschub-Wecker feuert nachweislich bei Fälligkeit **und** echtem Tiefpreis (Testfall: Profil mit
  `last_purchase_at` vor X Tagen + Preis unter 90-Tage-Schnitt → genau eine Mail).
- Teilbarer Steckbrief live unter `/hund/[token]`, opt-in, DSGVO-konform.
- Mind. 3 Programmatic-Seitentypen leiten per CTA in den Profil-Flow.
- `trust-compliance`-Freigabe; `npm run build` grün.
