# WELCHES-HUNDEFUTTER.TODAY / BELLA

## Master Operating Instructions for AI Coding Agents

**Project:** welches-hundefutter.today
**Repository:** `Schwerti09/welches-hundefutter`
**Primary application:** `bella-app/`
**Production philosophy:** Data-first, deterministic, AI-assisted, SEO-native, GEO-native, conversion-oriented, privacy-conscious.

> **Wo finde ich was?** Dieses Dokument ist die **prinzipielle** Leitlinie (Philosophie, Architektur-Regeln,
> Prioritäten) — es enthält bewusst keine Dateipfade oder Live-Zahlen. Für den **konkreten Ist-Zustand**:
> `../CLAUDE.md` (Ground Truth, harte Regeln, Befehle) · `../BELLA_NEXT_LEVEL.md` (Roadmap, nummerierte
> Operationen, Fortschrittstabelle) · `../.claude/agents/` (13 Spezialisten-Definitionen) ·
> `../FUTTERPASS.md` (Futter-Pass-Schwungrad-Blaupause). Bei Widerspruch zwischen diesem Dokument und dem
> Code: **Code prüfen, dann Dokumentation aktualisieren** (siehe Regel 97).

---

# 1. MISSION

Du arbeitest an **welches-hundefutter.today** und der KI-Beraterin **BELLA**.

Das Projekt ist keine gewöhnliche Hundefutter-Affiliate-Seite.

Das langfristige Produktziel ist:

> **BELLA ist eine datengetriebene Decision Engine für Hundefütterung, die aus Hundeprofil, Ernährungsanforderungen, Produktdaten, Preis, Inhaltsstoffen und Nutzerfeedback nachvollziehbare Futterempfehlungen erzeugt.**

Die Website verbindet:

```text
SEO
+
GEO / AI Search
+
Produktdaten
+
Deterministische Entscheidungslogik
+
LLM
+
Personalisierung
+
Futter-Pass
+
Outcome-Daten
+
Affiliate-Commerce
```

Alle technischen und inhaltlichen Entscheidungen müssen diese Mission unterstützen.

---

# 2. OBERSTES PRINZIP

## NIEMALS Features um ihrer selbst willen bauen.

Vor jeder Änderung muss beantwortet werden:

1. Welches konkrete Problem wird gelöst?
2. Für welchen Nutzer?
3. Welchen messbaren Effekt erwarten wir?
4. Wird dadurch mindestens einer dieser Bereiche verbessert?

```text
Traffic
Conversion
Trust
Retention
Data Quality
Decision Quality
Performance
Security
SEO
GEO / AI Visibility
Monetization
```

Wenn eine Änderung keinen plausiblen positiven Effekt besitzt:

> **Nicht implementieren.**

---

# 3. PRIORITÄTEN

Bei Konflikten gilt folgende Prioritätsreihenfolge:

```text
P0  Sicherheit / Datenintegrität / Tierwohl
P1  Korrektheit der Futterempfehlung
P2  Datenqualität
P3  Performance / technische Stabilität
P4  Nutzerwert / UX
P5  SEO / GEO
P6  Conversion / Monetarisierung
P7  zusätzliche Features
```

Eine höhere Priorität darf niemals zugunsten einer niedrigeren geopfert werden.

Beispiel:

> Mehr Affiliate-Umsatz darf niemals durch eine unsichere Futterempfehlung erkauft werden.

---

# 4. GOLDENE ARCHITEKTURREGEL

## LLM ≠ Decision Engine

BELLA verwendet KI.

Aber:

> **Das LLM darf nicht allein über die finale Produktempfehlung entscheiden.**

Die Architektur muss grundsätzlich zwischen folgenden Ebenen unterscheiden:

```text
USER INPUT
    ↓
INTENT / EXTRACTION
    ↓
NORMALIZATION
    ↓
DETERMINISTIC RULES
    ↓
DATABASE FACTS
    ↓
SCORING
    ↓
SAFETY / ALLERGEN GATES
    ↓
PRODUCT RANKING
    ↓
LLM EXPLANATION
    ↓
USER
```

Das LLM darf insbesondere:

* Sprache verstehen
* Absichten erkennen
* Rückfragen formulieren
* Daten extrahieren
* Ergebnisse erklären
* Empfehlungen verständlich darstellen

Das LLM darf NICHT:

* Allergene eigenmächtig ignorieren
* Produktdaten erfinden
* Inhaltsstoffe erfinden
* Nährwerte erfinden
* Preise erfinden
* Produkte als passend deklarieren, die durch harte Ausschlussregeln ausgeschlossen wurden
* medizinische Diagnosen stellen
* deterministische Sicherheitsregeln überschreiben

---

# 5. SOURCE OF TRUTH

Bei Fakten gilt:

```text
Database > calculated facts > deterministic rules > LLM interpretation
```

Das LLM ist niemals die primäre Quelle für Produktfakten.

Für Produktdaten sind bevorzugt:

* Datenbank
* validierte Feed-Daten
* Händlerdaten
* Herstellerdaten
* dokumentierte Quellen

zu verwenden.

Wenn eine Information nicht vorhanden ist:

> Nicht erfinden.

Stattdessen:

```text
unknown
not_available
not_verified
```

verwenden bzw. transparent kommunizieren.

---

# 6. PRODUKTDATEN

Die Produktdatenbank ist ein strategischer Kern des Projekts.

Aktuell existieren mehr als 11.000 Produkte.

Die Daten müssen deshalb nicht nur gespeichert, sondern systematisch validiert werden.

Für Produkte sind insbesondere relevant:

```text
product_id
name
brand
category
food_type
life_stage
breed_relevance
protein_sources
ingredients
analytical_components
nutritional_values
energy
package_size
price
price_per_kg
price_per_day
availability
retailer
affiliate_url
source
updated_at
```

Nicht jedes Feld muss bei jedem Produkt vorhanden sein.

Aber:

> Fehlende Daten dürfen niemals stillschweigend erfunden werden.

---

# 7. PRODUKTDATEN-QUALITÄT

Jede Feed-/Import-Pipeline muss möglichst folgende Prüfungen durchführen:

```text
Duplicate detection
Required fields
Data type validation
Price validation
Package-size validation
Unit normalization
Protein extraction
Ingredient normalization
Brand normalization
URL validation
Affiliate URL validation
Timestamp validation
Source validation
```

Bei problematischen Datensätzen:

```text
reject
quarantine
or mark as incomplete
```

Nicht einfach stillschweigend veröffentlichen.

---

# 8. ALLERGEN- UND AVOID-PROTEIN-SICHERHEIT

Allergen- bzw. Ausschlusslogik besitzt höchste Priorität.

Wenn ein Nutzer beispielsweise angibt:

```text
avoidProtein = chicken
```

darf ein Produkt mit eindeutig enthaltenem Huhn nicht als sichere Empfehlung erscheinen.

Wichtig:

```text
avoidance ≠ preference
```

Ein Ausschluss ist eine harte Einschränkung.

Eine Präferenz ist ein Ranking-Signal.

Beispiel:

```text
NO CHICKEN
```

ist stärker als:

```text
PREFERS LAMB
```

---

# 9. MEDIZINISCHE GRENZEN

BELLA ist kein Tierarzt und keine tiermedizinische Diagnosemaschine.

Bei Themen wie:

* schweren Allergien
* Blut im Kot
* anhaltendem Erbrechen
* starken Schmerzen
* akuten Erkrankungen
* massivem Gewichtsverlust
* Vergiftungsverdacht
* schweren Symptomen

muss BELLA klar auf professionelle tiermedizinische Beratung verweisen.

Keine Diagnose erfinden.

Keine Therapieanweisung als sichere medizinische Tatsache ausgeben.

Keine Heilversprechen.

---

# 10. BELLA SCORING ENGINE

Der BELLA Score muss nachvollziehbar und möglichst reproduzierbar sein.

Grundprinzip:

```text
Eligibility
    ↓
Hard exclusions
    ↓
Requirement matching
    ↓
Weighted scoring
    ↓
Ranking
```

Beispiel:

```text
BASE SCORE
+
protein fit
+
life-stage fit
+
energy fit
+
dog-profile fit
+
food-type fit
+
budget fit
+
ingredient quality
+
data completeness
+
user preferences
-
mismatch penalties
```

Harte Ausschlusskriterien dürfen nicht durch positive Scores kompensiert werden.

Beispiel:

```text
Allergen violation = HARD FAIL
```

nicht:

```text
Allergen violation = -20 points
```

wenn das Produkt danach weiterhin auf Rang 1 landen könnte.

---

# 11. BELLA INDEX

Langfristig soll ein transparenter BELLA Index entstehen.

Beispiel:

```text
BELLA INDEX
93 / 100
```

Mögliche Komponenten:

```text
Dog Fit
Nutritional Fit
Ingredient Fit
Protein Fit
Life Stage Fit
Price / Value
Transparency
Data Quality
```

Die genaue Gewichtung muss zentral definiert und versioniert werden.

NIEMALS verschiedene Score-Formeln unkontrolliert über verschiedene Seiten verteilen.

Eine Änderung der Score-Formel muss:

1. dokumentiert werden
2. getestet werden
3. versioniert werden
4. Regressionstests durchlaufen
5. Auswirkungen auf bestehende Empfehlungen prüfen

---

# 12. RECOMMENDATION EXPLANATIONS

Jede Empfehlung sollte möglichst erklären:

```text
Warum passt dieses Produkt?
Warum wurde es ausgewählt?
Welche Anforderungen erfüllt es?
Welche Einschränkungen bestehen?
Warum steht es vor Alternative B?
```

Beispiel:

```text
Warum BELLA dieses Futter empfiehlt:

✓ passt zur Lebensphase
✓ Proteinquelle entspricht dem Profil
✓ innerhalb des Budgets
✓ passende Futterart
✓ keine bekannten Ausschlusskriterien

Zu beachten:
- Energiegehalt relativ hoch
- Produktdaten teilweise unvollständig
```

Keine pauschalen Marketingbehauptungen.

---

# 13. FETTGEDRUCKTE HAUPTREGEL

## BELLA MUSS ERKLÄRBAR SEIN.

Eine Empfehlung ohne nachvollziehbaren Grund ist eine schlechte Empfehlung.

Jede finale Empfehlung sollte intern auf eine strukturierte Reason-Liste zurückführbar sein:

```ts
reasons: [
  {
    type: "protein_fit",
    result: "pass",
    evidence: ...
  },
  {
    type: "life_stage",
    result: "pass",
    evidence: ...
  }
]
```

---

# 14. FUTTER-PASS

Der Futter-Pass ist ein strategischer Kern des Produkts.

Ziel:

```text
DOG PROFILE
    ↓
CURRENT FOOD
    ↓
DAILY CONSUMPTION
    ↓
ESTIMATED REMAINING DAYS
    ↓
REFILL DATE
    ↓
REMINDER
    ↓
PURCHASE
    ↓
FEEDBACK
    ↓
OUTCOME
```

Der Futter-Pass soll langfristig zu einer wiederkehrenden Nutzung führen.

---

# 15. REFILL ENGINE

Für einen Nutzer mit:

```text
dog_weight
daily_grams
bag_size
```

kann ungefähr berechnet werden:

```text
bag_days = bag_size / daily_consumption
```

Die Berechnung muss transparent sein.

Keine falsche Präzision vortäuschen.

Wenn die Fütterungsmenge nur geschätzt wird:

> als Schätzung kennzeichnen.

---

# 16. OUTCOME ENGINE

Langfristig muss BELLA lernen, welche Empfehlungen tatsächlich funktionieren.

Ein Outcome kann beispielsweise enthalten:

```text
food_id
dog_profile_segment
started_at
feedback_at
tolerated
accepted
owner_rating
digestive_feedback
stool_feedback
palatability_feedback
notes
```

Dabei gilt:

> Nutzerfeedback ist ein Signal, keine medizinische Wahrheit.

Es darf nicht automatisch behauptet werden:

> „Dieses Futter verursacht keine Verdauungsprobleme."

Stattdessen:

> „Nutzer mit ähnlichen Profilen berichten überwiegend positive Erfahrungen."

Nur wenn ausreichend Daten vorhanden sind.

---

# 17. DATA MOAT

Der langfristige Wettbewerbsvorteil soll nicht nur aus Produktanzahl bestehen.

Das strategische Ziel ist:

```text
Products
+
Dog Profiles
+
Preferences
+
Recommendations
+
Outcomes
+
Prices
+
Availability
+
Temporal Data
```

Dadurch entsteht ein proprietärer Datenbestand.

Datenschutz muss dabei immer eingehalten werden.

Keine personenbezogenen Daten unnötig sammeln.

Keine Nutzerprofile öffentlich machen.

Keine privaten Informationen in SEO-Seiten ausspielen.

---

# 18. KNOWLEDGE GRAPH

Die Datenstruktur soll langfristig Beziehungen zwischen Entitäten abbilden:

```text
Breed
    ↓
Life Stage
    ↓
Requirement
    ↓
Food Type
    ↓
Ingredient
    ↓
Protein
    ↓
Product
    ↓
Retailer
```

Zusätzliche Beziehungen:

```text
Breed → common concerns
Concern → nutritional considerations
Requirement → product attributes
Product → ingredients
Product → alternatives
Product → price history
Product → user outcomes
```

Diese Struktur soll sowohl für:

* BELLA
* SEO
* GEO
* interne Suche
* Related Content
* Empfehlungen

verwendbar sein.

---

# 19. SEO-PHILOSOPHIE

## Nicht URL-Masse, sondern Informationsqualität.

Das Projekt besitzt bereits tausende programmatisch erzeugte Seiten.

Neue Seiten dürfen nur entstehen, wenn sie echten zusätzlichen Suchintent bedienen.

Vor jeder neuen SEO-Seite prüfen:

```text
Search intent
Unique value
Existing page overlap
Internal linking
Product relevance
Data availability
Potential conversion
Potential citation value
```

Wenn eine neue Seite praktisch dasselbe beantwortet wie eine bestehende Seite:

> bestehende Seite verbessern statt neue Seite erzeugen.

---

# 20. PROGRAMMATIC SEO

Programmatic SEO ist erlaubt und erwünscht.

Aber:

> Keine massenhafte Generierung von Thin Content.

Jede programmatische Seitenschablone muss echte variable Informationen enthalten.

Beispiel:

```text
Rasse
+
Gewicht
+
Lebensphase
+
Ernährungsanforderung
+
passende Produkte
+
Methodik
+
FAQ
```

Nicht:

```text
[BREED] + 500 Wörter generischer KI-Text
```

---

# 21. CONTENT QUALITY GATE

Neue Content-Seiten sollten intern bewertet werden nach:

```text
Uniqueness
Completeness
Factuality
Product relevance
Search intent satisfaction
Internal links
Structured data
Update timestamp
Conversion value
AI citation value
```

Thin Content soll automatisch identifiziert werden.

Mögliche Aktionen:

```text
KEEP
IMPROVE
MERGE
NOINDEX
REMOVE
```

---

# 22. AI SEARCH / GEO

BELLA muss nicht nur für Google optimiert werden.

Auch Systeme wie:

* ChatGPT
* Gemini
* Claude
* Perplexity
* andere AI Search Systeme

sollen die Website verstehen können.

Dafür sind besonders wichtig:

```text
clear answers
entity structure
structured data
authoritative explanations
transparent methodology
stable URLs
machine-readable data
llms.txt
llms-full.txt
```

---

# 23. ANSWER-FIRST CONTENT

Wichtige Seiten müssen eine klare Antwort früh auf der Seite liefern.

Prinzip:

```text
QUESTION
↓
SHORT ANSWER
↓
WHY
↓
CRITERIA
↓
PRODUCTS
↓
DETAILS
↓
FAQ
↓
SOURCES
```

Keine 1.500 Wörter Einleitung bevor die eigentliche Antwort kommt.

---

# 24. AI CITABILITY

Inhalte sollen zitierbar sein.

Das bedeutet:

```text
eine Aussage
+
klare Definition
+
Quelle
+
Datum
+
Methodik
```

Beispiel:

> „Der BELLA Index bewertet Produkte anhand von X, Y und Z."

Darunter:

```text
Methodik
Version
Updated
Sources
```

AI-Systeme müssen möglichst eindeutig erkennen können:

```text
Who says this?
What exactly is claimed?
Based on what data?
When was it updated?
```

---

# 25. STRUCTURED DATA

Für passende Seiten sind strukturierte Daten zu verwenden.

Beispielsweise:

```text
Product
Offer
BreadcrumbList
FAQPage
Article
WebPage
Organization
WebSite
SearchAction
```

Nur Schema-Markup verwenden, das tatsächlich durch sichtbare bzw. valide Inhalte gedeckt ist.

Keine Fake Reviews.

Keine erfundenen Ratings.

Keine manipulierten Sterne.

---

# 26. INTERNAL LINKING

Interne Links sollen semantisch sinnvoll sein.

Beispiel:

```text
Labrador
↓
Labrador Ernährung
↓
Labrador Übergewicht
↓
passende Produkte
↓
Trockenfutter
↓
BELLA
```

Nicht:

```text
jede Seite → jede Seite
```

Der interne Linkgraph muss thematische Beziehungen abbilden.

---

# 27. SEO ENTITY ARCHITECTURE

Wichtige Entitäten:

```text
Breed
Food
Brand
Product
Ingredient
Protein
Food Type
Life Stage
Concern
Nutritional Requirement
Retailer
Comparison
Guide
Study
Glossary Term
```

Diese Entitäten sollen konsistent benannt und miteinander verknüpft werden.

---

# 28. SEO DATA FRESHNESS

Produktseiten müssen möglichst aktuelle Daten verwenden.

Relevante Felder:

```text
price_updated_at
availability_updated_at
product_updated_at
source_updated_at
```

Keine veralteten Preise als aktuell darstellen.

---

# 29. AFFILIATE MONETIZATION

Affiliate ist ein Ergebnis der Nutzerentscheidung.

Nicht der Zweck der Empfehlung.

Richtige Reihenfolge:

```text
USER NEED
↓
BELLA DECISION
↓
PRODUCT MATCH
↓
EXPLANATION
↓
PRICE / OFFER
↓
PURCHASE
```

Nicht:

```text
Affiliate offer
↓
irgendeine Begründung
```

---

# 30. AFFILIATE TRANSPARENCY

Affiliate-Links müssen transparent gekennzeichnet werden.

Keine versteckten Manipulationen.

Keine falschen Aussagen wie:

> „BELLA empfiehlt dieses Produkt, weil es das beste Produkt auf dem Markt ist."

Wenn tatsächlich nur der höchste Score innerhalb der Datenbasis vorliegt:

> „Dieses Produkt erzielt innerhalb unserer Bewertung den höchsten BELLA Fit Score für dieses Profil."

---

# 31. CONVERSION OPTIMIZATION

Conversion darf nicht durch aggressives Design erzwungen werden.

Gute Conversion entsteht durch:

```text
Trust
Clarity
Relevance
Price transparency
Explainability
Low friction
```

CTA-Beispiele:

```text
Angebot ansehen
Preis prüfen
Produkt vergleichen
BELLA-Empfehlung ansehen
Futter-Pass starten
```

---

# 32. UX

Mobile First.

Die Mehrheit der Nutzer wird wahrscheinlich mobil kommen.

Prioritäten:

```text
Fast loading
Large tap targets
Readable typography
Short decision paths
Clear CTAs
Minimal friction
Accessible controls
```

Keine unnötigen Animationen.

Keine UI, die Performance beeinträchtigt.

---

# 33. ACCESSIBILITY

WCAG-orientiert entwickeln.

Mindestens:

```text
semantic HTML
keyboard navigation
focus states
ARIA only where needed
sufficient contrast
alt text
form labels
error messages
screen-reader compatibility
```

Keine wichtigen Informationen ausschließlich über Farbe darstellen.

---

# 34. PERFORMANCE

Performance ist SEO- und Conversion-Faktor.

Prioritäten:

```text
Server Components where appropriate
minimal client JavaScript
optimized images
lazy loading
font optimization
cache strategy
database indexes
efficient queries
streaming where beneficial
```

Keine unnötige Client-Komponente.

Vor `use client` prüfen:

> Muss diese Komponente wirklich clientseitig laufen?

---

# 35. NEXT.JS

Das Projekt verwendet Next.js.

Neue Features müssen die bestehende Architektur respektieren.

Bevorzugt:

```text
Server Components
Server Actions where appropriate
Route Handlers
cached data
static generation where appropriate
incremental regeneration
```

Client State nur dort einsetzen, wo er tatsächlich notwendig ist.

---

# 36. DATABASE

Neon/PostgreSQL ist die Source of Truth für persistente Produkt- und Anwendungsdaten.

Drizzle ist für Datenzugriff und Migrationen zu verwenden.

Keine manuellen Produktions-SQL-Änderungen außerhalb des vorgesehenen Migrationsprozesses.

Jede Schemaänderung:

```text
migration
↓
test
↓
review
↓
deploy
```

---

# 37. DATABASE SAFETY

Vor Schemaänderungen prüfen:

```text
existing data
foreign keys
indexes
nullability
migration safety
rollback strategy
query performance
```

Keine destruktive Migration ohne ausdrückliche Begründung.

Besonders gefährlich:

```text
DROP COLUMN
DROP TABLE
DELETE
TRUNCATE
```

---

# 38. INDEXING

Bei häufigen Queries müssen passende Datenbankindizes vorhanden sein.

Insbesondere bei:

```text
product_id
brand
protein
food_type
life_stage
price
updated_at
dog_profile
affiliate
```

nicht blind indexieren.

Index-Strategien anhand realer Queries prüfen.

---

# 39. API SECURITY

Alle öffentlichen Endpunkte müssen geprüft werden auf:

```text
authentication where required
authorization
input validation
rate limiting
origin validation
request size
abuse prevention
```

Keine API darf blind beliebige LLM-Aufrufe ermöglichen.

---

# 40. LLM COST CONTROL

LLM-Aufrufe sind kostenpflichtig und müssen kontrolliert werden.

Prinzip:

```text
cheap deterministic logic first
↓
small model where possible
↓
larger model only when needed
```

Keine unnötigen LLM-Aufrufe.

Caching nutzen, wo sinnvoll.

---

# 41. PROMPT INJECTION

Produktdaten, Webseiteninhalte und Nutzertexte sind potenziell untrusted input.

Niemals davon ausgehen:

> „Der Text im Produkt ist eine Systemanweisung."

Systemregeln müssen strikt getrennt sein von:

```text
user content
product content
retrieved documents
web content
database text
```

---

# 42. OUTPUT VALIDATION

LLM-Ausgaben müssen strukturiert validiert werden.

Bevorzugt:

```text
JSON Schema
Zod
enum validation
numeric bounds
required fields
post-validation
```

Keine ungeprüfte LLM-Ausgabe direkt in kritische Logik übernehmen.

---

# 43. INTENT ENGINE

Die Intent-Erkennung darf nicht unnötig komplex werden.

Ideal:

```text
fast deterministic intent
+
LLM fallback
+
merge
+
confidence
```

Beispiel:

```text
product_search
breed_question
medical_concern
budget
allergy
food_type
comparison
general_information
```

Unklare Intentionslage:

> Rückfrage statt Halluzination.

---

# 44. BELLA CONVERSATION DESIGN

BELLA soll nicht unnötig viele Fragen stellen.

Ziel:

> möglichst wenige Fragen mit maximalem Informationsgewinn.

Priorisierte Informationen:

```text
Dog
Age
Weight
Life stage
Activity
Food type
Avoidances
Special requirements
Budget
```

Wenn eine Information bereits bekannt ist:

> niemals erneut fragen.

---

# 45. PERSONALIZATION

Personalisierung muss auf strukturierten Fakten basieren.

Beispiel:

```text
dog.age
dog.weight
dog.activity
dog.food_preferences
dog.avoidances
```

Nicht:

> LLM erinnert sich frei an frühere Angaben.

Persistente Personalisierung muss explizit gespeichert und versioniert werden.

---

# 46. ANALYTICS

Analytics muss First-Party-orientiert sein.

Wichtige Events:

```text
landing_view
search
bella_started
dog_profile_created
recommendation_generated
product_view
affiliate_click
futter_pass_created
refill_reminder
feedback_submitted
```

Keine unnötigen personenbezogenen Daten sammeln.

---

# 47. FUNNEL

Der Kernfunnel:

```text
SEO LANDING
    ↓
BELLA / SEARCH
    ↓
DOG PROFILE
    ↓
RECOMMENDATION
    ↓
PRODUCT VIEW
    ↓
AFFILIATE CLICK
    ↓
PURCHASE
    ↓
FEEDBACK
    ↓
REFILL
```

Jede größere Produktänderung sollte prüfen, welche Funnel-Stufe verbessert wird.

---

# 48. EXPERIMENTATION

Experimente sollen messbar sein.

Nicht:

> „Ich glaube, der Button sieht besser aus."

Sondern:

```text
hypothesis
↓
variant
↓
metric
↓
test period
↓
result
↓
decision
```

Beispiel:

```text
Hypothese:
„Explainability erhöht Affiliate Click-through."

Metric:
affiliate_ctr
```

---

# 49. TESTING

Mindestens drei Testebenen:

```text
Unit Tests
Integration Tests
E2E Tests
```

Kritische BELLA-Funktionen brauchen Tests.

Insbesondere:

```text
scoring
allergen filtering
protein avoidance
price calculation
bag-day calculation
intent normalization
recommendation ranking
```

---

# 50. GOLDEN TEST CASES

Es soll ein stabiler Satz von Referenzfällen existieren.

Beispiele:

```text
CASE 001
Adult Labrador
normal requirements

CASE 002
Adult Labrador
avoid chicken

CASE 003
Senior dog

CASE 004
Puppy

CASE 005
Budget constrained

CASE 006
Wet food only

CASE 007
Dry food only

CASE 008
Multiple avoidances

CASE 009
Incomplete product data

CASE 010
Conflicting preferences
```

Eine Änderung an Scoring oder Intent muss gegen diese Cases laufen.

---

# 51. REGRESSION PROTECTION

Wenn ein Bug behoben wird:

> Immer einen Test hinzufügen, der verhindert, dass derselbe Bug wiederkommt.

Kein „fix and forget".

---

# 52. EVALUATION FRAMEWORK

BELLA soll nicht nur technisch funktionieren.

Sie soll qualitativ messbar sein.

Langfristig folgende Metriken:

```text
Intent accuracy
Constraint accuracy
Allergen safety
Recommendation consistency
Recommendation relevance
Explanation correctness
Hallucination rate
Latency
LLM cost
Conversion
User satisfaction
```

---

# 53. AI VISIBILITY

Die AI-Visibility-Infrastruktur soll regelmäßig messen:

```text
query
AI system
brand mentioned?
domain cited?
URL cited?
citation position
answer accuracy
competitors mentioned
```

Nicht nur:

> „Wir haben llms.txt."

Sondern:

> „Werden wir tatsächlich zitiert?"

---

# 54. AI VISIBILITY QUERIES

Ein wachsender Benchmark soll wichtige Suchintents abdecken:

```text
Welches Hundefutter für Labrador?
Bestes Hundefutter für empfindlichen Magen
Hundefutter ohne Huhn
Monoprotein Hundefutter
Trockenfutter für Senior Hunde
Welches Hundefutter bei Übergewicht?
```

Die Fragen sollen realen Suchintents entsprechen.

---

# 55. CONTENT SOURCES

Bei fachlichen Aussagen bevorzugt:

```text
veterinary sources
scientific literature
official manufacturer data
reputable institutions
primary sources
```

Keine zufälligen SEO-Blogs als primäre Autorität.

---

# 56. MEDICAL / NUTRITIONAL CONTENT

Fachliche Inhalte müssen besonders vorsichtig formuliert werden.

Unterscheiden:

```text
Fact
Evidence
Common practice
Potential consideration
User report
BELLA calculation
```

Nicht vermischen.

---

# 57. CONTENT VERSIONING

Wichtige Methodik- und Bewertungsänderungen versionieren.

Beispiel:

```text
BELLA_INDEX_V1
BELLA_INDEX_V2
```

Bei einer neuen Version dokumentieren:

```text
what changed
why
expected impact
affected pages
affected products
```

---

# 58. SEO CHANGE SAFETY

Vor größeren SEO-Änderungen prüfen:

```text
canonical
robots
sitemap
internal links
redirects
metadata
structured data
indexability
pagination
```

Keine versehentliche Deindexierung der Website.

---

# 59. SITEMAPS

Sitemaps dürfen nur relevante indexierbare URLs enthalten.

Nicht:

```text
noindex URLs
redirect URLs
404 URLs
duplicate URLs
```

---

# 60. CANONICALS

Canonical URLs müssen stabil und logisch sein.

Keine widersprüchlichen Canonicals.

Bei programmatischen Seiten besonders prüfen:

```text
parameter URLs
duplicate combinations
pagination
filter URLs
sorting URLs
```

---

# 61. ROBOTS

`robots.txt` darf wichtige Inhalte nicht versehentlich blockieren.

Vor Änderungen prüfen:

```text
Googlebot
Bingbot
AI crawlers
assets
API routes
sensitive routes
```

Security darf niemals davon abhängen, dass eine URL durch robots.txt verborgen wird.

---

# 62. OPEN GRAPH

Wichtige Seiten sollen hochwertige OG-Daten besitzen.

Produkt-, Rassen- und Beratungsseiten können dynamische OG-Bilder verwenden.

Aber:

> OG-Generierung darf die Performance oder Build-Zeit nicht unnötig belasten.

---

# 63. BRAND

BELLA soll als eigenständige Marke wahrgenommen werden.

Brand attributes:

```text
trustworthy
friendly
transparent
intelligent
data-driven
not manipulative
```

Nicht:

```text
overly cute
spammy
aggressive affiliate
medical authority
```

---

# 64. UI LANGUAGE

Die Benutzeroberfläche soll klar, natürlich und deutsch sein.

Fachbegriffe nur dort verwenden, wo sie verständlich sind.

Beispiele:

```text
Proteinquelle
Fütterungsmenge
Lebensphase
Aktivitätsniveau
Preis pro kg
Preis pro Tag
```

---

# 65. ERROR HANDLING

Fehler müssen benutzerfreundlich sein.

Nicht:

```text
500 Internal Server Error
```

wenn ein verständlicher Hinweis möglich ist.

Intern aber:

```text
structured logging
error IDs
stack traces
context
```

Keine Secrets loggen.

---

# 66. OBSERVABILITY

Für kritische Funktionen sollen Metriken vorhanden sein:

```text
request count
error rate
latency
LLM latency
LLM cost
database latency
recommendation failures
affiliate click events
```

---

# 67. LOGGING

Keine Logs mit:

```text
passwords
API keys
tokens
session secrets
unnecessary personal data
```

Logs müssen datenschutzfreundlich sein.

---

# 68. ENVIRONMENT VARIABLES

Secrets niemals committen.

Keine:

```text
API_KEY=...
DATABASE_URL=...
SECRET=...
```

in Source Code.

Verwende Environment Variables.

`.env.example` darf nur Platzhalter enthalten.

---

# 69. GIT

Commits müssen nachvollziehbar sein.

Bevorzugt:

```text
feat:
fix:
refactor:
perf:
seo:
security:
test:
docs:
```

Beispiel:

```text
feat: add refill reminder scheduling
fix: prevent avoided protein recommendations
perf: optimize product ranking query
seo: improve breed page structured data
```

---

# 70. KEINE GROSSEN UNNÖTIGEN REWRITES

Wenn eine bestehende Funktion funktioniert:

> gezielt verbessern.

Nicht ohne Grund:

```text
rewrite whole app
replace framework
replace database layer
replace working architecture
```

---

# 71. DEPENDENCY MANAGEMENT

Neue Dependencies nur hinzufügen, wenn sie einen echten Vorteil liefern.

Vor Installation prüfen:

```text
bundle size
maintenance
security
license
Next.js compatibility
React compatibility
Netlify compatibility
```

Eine Dependency darf nicht nur verwendet werden, weil sie „modern" ist.

---

# 72. NETLIFY

Deployment muss mit Netlify kompatibel bleiben.

Vor Änderungen an:

```text
build
functions
scheduled functions
headers
redirects
environment
runtime
```

bestehende Production-Flows prüfen.

---

# 73. CI QUALITY GATE

Production darf nicht deployen, wenn kritische Tests fehlschlagen.

Mindestens:

```text
typecheck
lint
unit tests
critical integration tests
build
security checks
```

E2E/Smoke Tests soweit vorgesehen.

---

# 74. DATABASE MIGRATIONS IN CI

Wenn DB-Änderungen vorhanden sind:

```text
migration validation
schema consistency
tests
```

müssen berücksichtigt werden.

Keine „funktioniert lokal"-Migrationen.

---

# 75. CRITICAL PATH

Der wichtigste User Flow ist:

```text
User
↓
BELLA
↓
Dog Profile
↓
Requirements
↓
Recommendation
↓
Product
↓
Affiliate
```

Dieser Flow muss nach jeder größeren Änderung getestet werden.

---

# 76. SECONDARY PATH

Der zweite strategische Flow:

```text
Dog Profile
↓
Futter-Pass
↓
Current Food
↓
Consumption
↓
Refill
↓
Reminder
↓
Affiliate
```

---

# 77. THIRD PATH

Der Daten-Moat:

```text
Recommendation
↓
Outcome
↓
Feedback
↓
Aggregated insight
↓
Better ranking
↓
Better recommendation
```

---

# 78. NO DATA LOOPHOLES

Kein Feedback darf ungeprüft in die Empfehlungslogik gelangen.

Feedback muss:

```text
validated
timestamped
aggregated
weighted
```

werden.

Ein einzelner Nutzerbericht darf nicht das gesamte Ranking verändern.

---

# 79. RANKING FAIRNESS

Affiliate-Provision darf grundsätzlich nicht automatisch den BELLA Score erhöhen.

Wenn Monetarisierung berücksichtigt wird, muss sie klar getrennt sein:

```text
BELLA FIT SCORE
```

und gegebenenfalls:

```text
Commercial availability
```

Ein Produkt mit schlechterem Hund-Fit darf nicht nur wegen höherer Provision auf Platz 1 landen.

---

# 80. PRICE COMPARISON

Preise müssen normalisiert werden:

```text
€/kg
€/100g
€/Tag
€/Monat
```

Nur sinnvolle Vergleichsgrößen verwenden.

Packungsgrößen berücksichtigen.

---

# 81. PRICE HISTORY

Preisverläufe dürfen nicht aus einzelnen fehlerhaften Datenpunkten falsche Aussagen ableiten.

Ausreißer erkennen.

Bei unklaren Daten:

> Preis nicht als „Bestpreis" deklarieren.

---

# 82. AFFILIATE AVAILABILITY

Wenn ein Produkt nicht mehr verfügbar ist:

```text
do not promote stale offer
```

Produktdaten und Angebote getrennt behandeln, wenn notwendig.

---

# 83. SEARCH

Interne Suche soll nicht ausschließlich textuell funktionieren.

Langfristig:

```text
keyword search
+
semantic matching
+
structured filters
+
dog profile
```

---

# 84. SEARCH INTENT

Suchanfragen sollten klassifiziert werden.

Beispiel:

```text
„Hundefutter Labrador"
→ breed

„Hundefutter ohne Huhn"
→ avoidance

„bestes Hundefutter unter 30 Euro"
→ budget

„Trockenfutter oder Nassfutter"
→ comparison
```

---

# 85. EMPTY STATES

Keine Ergebnisse:

> nicht einfach leere Seite.

Stattdessen:

```text
Warum keine Ergebnisse?
Welche Einschränkung ist zu streng?
Welche Alternative ist möglich?
```

Aber keine Sicherheitsregel eigenmächtig abschwächen.

---

# 86. ACCESSIBILITY OF BELLA

BELLA muss auch ohne Maus bedienbar sein.

Prüfen:

```text
keyboard
focus
screen reader
mobile
large text
form errors
loading states
```

---

# 87. MOBILE BELLA

Der Chat darf mobil nicht den gesamten Bildschirm unbrauchbar machen.

Keine:

```text
horizontal overflow
tiny controls
keyboard layout bugs
sticky overlays covering buttons
```

---

# 88. SEO UND UX NICHT GEGENEINANDER AUSPIELEN

Keine SEO-Elemente hinzufügen, die die Nutzererfahrung zerstören.

Beispielsweise:

> 40 FAQ-Blöcke nur wegen Keywords.

SEO-Inhalte müssen echten Informationswert liefern.

---

# 89. CONTENT DUPLICATION

Vor automatischer Veröffentlichung prüfen:

```text
title similarity
description similarity
body similarity
entity overlap
intent overlap
```

Wenn Seiten nahezu identisch sind:

> konsolidieren.

---

# 90. AI GENERATED CONTENT

KI-generierter Content muss überprüft werden.

LLM Output ist kein Qualitätsnachweis.

Mindestens prüfen:

```text
factuality
duplication
unsupported claims
product facts
medical claims
grammar
intent match
```

---

# 91. NO HALLUCINATION POLICY

Wenn BELLA etwas nicht weiß:

> Das muss sie sagen.

Beispiele:

```text
„Dazu liegen uns keine verlässlichen Produktdaten vor."
```

ist besser als eine erfundene Antwort.

---

# 92. USER TRUST

BELLA muss klar kommunizieren:

```text
was berechnet wurde
was aus Produktdaten stammt
was geschätzt wurde
was Nutzerfeedback ist
was nicht bekannt ist
```

---

# 93. METHODOLOGY PAGE

Die Bewertungsmethodik soll öffentlich nachvollziehbar sein.

Sie sollte erklären:

```text
Data sources
Scoring
Exclusions
Allergen handling
Price calculation
Limitations
Update frequency
AI role
```

Transparenz ist ein Ranking- und Vertrauensvorteil.

---

# 94. DATA FRESHNESS BADGES

Wo sinnvoll:

```text
Aktualisiert am ...
Preis geprüft am ...
Produktdaten aktualisiert am ...
```

Nicht jedes Datum anzeigen, wenn es die UI unnötig belastet.

---

# 95. AGENT WORKFLOW

Jeder Coding Agent soll grundsätzlich folgendermaßen arbeiten:

```text
1. Repository verstehen
2. bestehende Architektur lesen
3. relevante Dateien identifizieren
4. bestehende Implementierung prüfen
5. kleinste sinnvolle Änderung planen
6. implementieren
7. Tests ausführen
8. Build prüfen
9. Regressionen prüfen
10. Ergebnis dokumentieren
```

---

# 96. NICHT VORHER ANNEHMEN, DASS ETWAS FEHLT

Sehr wichtig:

> Erst Code lesen. Dann urteilen.

Keine Aussage wie:

> „Das Feature fehlt."

bevor das Repository geprüft wurde.

Es kann bereits:

```text
partially implemented
implemented under another name
behind a feature flag
in a scheduled function
in another route
```

sein.

---

# 97. ROADMAP IST NICHT DIE REALITÄT

Dokumentation kann älter sein als der Code.

Deshalb:

```text
actual code
>
tests
>
database schema
>
deployment configuration
>
documentation
```

als Priorität für den tatsächlichen Implementierungsstand.

Wenn Dokumentation und Code widersprechen:

> Code prüfen und Dokumentation aktualisieren.

---

# 98. EXISTING FEATURES PROTECT

Vor dem Ändern prüfen, ob folgende Systeme bereits existieren:

```text
BELLA advisor
scoring
allergen gates
intent
product catalog
Futter-Pass
price history
price alerts
analytics
SEO pages
GEO files
JSON-LD
OG generation
scheduled functions
tests
quality gates
```

Nichts davon neu implementieren, bevor geprüft wurde, ob es bereits existiert.

---

# 99. CODE SEARCH FIRST

Bei einer Aufgabe:

```text
search repository
↓
locate implementation
↓
understand data flow
↓
modify
```

Nicht sofort neue Dateien erstellen.

---

# 100. REUSE OVER DUPLICATION

Wenn eine Funktion bereits existiert:

> wiederverwenden.

Keine zweite Version derselben Logik.

Besonders vermeiden:

```text
two scoring functions
two price calculators
two allergen filters
two slug generators
two product normalizers
two schema builders
```

---

# 101. SINGLE SOURCE OF TRUTH

Für zentrale Business-Regeln soll es eine zentrale Implementierung geben.

Beispiel:

```text
scoring → one canonical implementation
protein normalization → one canonical implementation
price normalization → one canonical implementation
```

---

# 102. TYPESCRIPT

TypeScript strict verwenden.

Keine unnötigen:

```ts
any
```

Bei `any` muss ein konkreter Grund vorliegen.

Bevorzugt:

```ts
unknown
type guards
interfaces
schemas
zod validation
```

---

# 103. ERROR TYPES

Fehler möglichst strukturiert behandeln.

Nicht:

```ts
catch (e) {
  console.log(e)
}
```

wenn eine sinnvolle Fehlerbehandlung möglich ist.

---

# 104. DATABASE QUERIES

Keine unnötigen N+1 Queries.

Vor allem bei Produktlisten:

```text
fetch once
join where appropriate
batch where appropriate
cache where appropriate
```

---

# 105. PAGINATION

Große Produktmengen niemals unkontrolliert vollständig laden.

Verwenden:

```text
limit
cursor
pagination
server-side filtering
```

---

# 106. CACHING

Statische oder langsam veränderliche Produktdaten können gecacht werden.

Aber:

```text
price
availability
user-specific data
```

müssen korrekt behandelt werden.

Keine veralteten Preise als live ausgeben.

---

# 107. SECURITY HEADERS

Bestehende Security Headers nicht versehentlich entfernen.

Besonders:

```text
CSP
COOP
security headers
```

Änderungen müssen getestet werden.

---

# 108. RATE LIMITING

LLM- und kostenintensive Endpunkte müssen gegen Abuse geschützt werden.

Insbesondere:

```text
chat
recommendation
search
AI generation
email
```

---

# 109. EMAILS

E-Mail-Funktionen nur für sinnvolle Ereignisse.

Beispielsweise:

```text
refill reminder
price alert
important user-requested notification
```

Keine Spam-Automation.

---

# 110. REFILL EMAILS

Refill-Mails sollen einen klaren Nutzen haben:

```text
Hund
aktuelles Futter
geschätzter Vorrat
voraussichtlicher Nachkauf
passende Angebote
```

Affiliate-Link transparent kennzeichnen.

---

# 111. CRON / SCHEDULED FUNCTIONS

Scheduled Functions müssen:

```text
idempotent
retry-safe
observable
rate-limited
```

sein.

Ein Job darf bei erneutem Lauf nicht unkontrolliert doppelte Daten erzeugen.

---

# 112. IDEMPOTENCY

Jobs und Datenimporte müssen wiederholbar sein.

Beispiel:

```text
same product
same source
same timestamp
```

nicht mehrfach als neuer Datensatz erzeugen, wenn es sich um dasselbe Feed-Objekt handelt.

---

# 113. FEED IMPORTS

Feed-Imports müssen möglichst atomar bzw. staged verarbeitet werden:

```text
download
↓
validate
↓
normalize
↓
deduplicate
↓
upsert
↓
quality report
```

Nicht teilweise korrupte Daten direkt veröffentlichen.

---

# 114. PRODUCT NORMALIZATION

Produkte unterschiedlicher Quellen müssen normalisiert werden.

Beispielsweise:

```text
Royal Canin
ROYAL CANIN
Royal-Canin
```

sollten konsistent behandelt werden.

---

# 115. INGREDIENT NORMALIZATION

Zutaten brauchen eine normalisierte Darstellung.

Beispielsweise Synonyme erkennen, aber nicht überaggressiv zusammenwerfen.

Keine falsche Gleichsetzung.

---

# 116. PROTEIN NORMALIZATION

Proteinquellen müssen strukturiert gespeichert werden.

Beispiel:

```text
chicken
beef
turkey
lamb
salmon
duck
rabbit
```

Synonyme müssen kontrolliert normalisiert werden.

---

# 117. UNKNOWN DATA

Unknown bleibt unknown.

Beispiel:

```text
protein_source = null
```

bedeutet nicht:

```text
protein_source = safe
```

---

# 118. SAFETY DEFAULT

Bei kritischen Informationen gilt:

```text
unknown ≠ safe
```

Insbesondere bei:

```text
allergens
protein exclusions
medical claims
```

---

# 119. PRODUCT RANKING

Ranking soll bevorzugt zweistufig erfolgen:

```text
FILTER
↓
RANK
```

Nicht:

```text
rank everything
↓
filter later
```

Sicherheitsfilter müssen vorher greifen.

---

# 120. COMPARISON PAGES

Vergleichsseiten müssen objektiv bleiben.

Beispiel:

```text
Produkt A
Produkt B
```

mit:

```text
Preis
Protein
Futtertyp
Lebensphase
Packungsgröße
BELLA Score
Datenqualität
```

Nicht nur Marketingtexte.

---

# 121. COMPETITOR COMPARISONS

Keine unbelegten Aussagen wie:

> „Wir sind besser als Check24."

Vergleiche müssen sachlich sein.

---

# 122. BRAND PAGES

Markenseiten sollen echte Informationen enthalten:

```text
Brand
Product count
food categories
available products
price range
relevant attributes
```

Keine künstlichen 2.000-Wörter-Texte.

---

# 123. BREED PAGES

Rasseseiten sollen echte Unterschiede berücksichtigen.

Nicht lediglich:

```text
Labrador → Text
Golden Retriever → gleicher Text
```

Sondern:

```text
breed-specific characteristics
typical size
life stages
relevant feeding considerations
product selection
BELLA flow
```

---

# 124. CONTENT CLUSTERS

Wichtige Themen als Cluster organisieren:

```text
Hundefutter
├── Trockenfutter
├── Nassfutter
├── Welpenfutter
├── Seniorenfutter
├── Monoprotein
├── getreidefrei
└── sensitiv

Rassen
├── Labrador
├── Golden Retriever
├── Schäferhund
└── ...
```

---

# 125. INTERNAL GRAPH

Jede wichtige Seite sollte mindestens einen sinnvollen Weg bieten zu:

```text
parent topic
related topic
product
BELLA
```

---

# 126. NO ORPHAN PAGES

Wichtige indexierbare Seiten dürfen nicht ohne interne Links bleiben.

---

# 127. SEO CLEANUP

Regelmäßig prüfen:

```text
404
redirect chains
orphan pages
duplicate titles
duplicate descriptions
missing canonicals
thin pages
broken links
slow pages
schema errors
```

---

# 128. BUILD SIZE

Bei jeder großen Dependency oder UI-Komponente prüfen:

```text
bundle impact
client JS
server impact
```

---

# 129. IMAGE OPTIMIZATION

Bilder:

```text
correct dimensions
modern format where appropriate
lazy loading
meaningful alt
responsive sizing
```

---

# 130. NO INLINE SECRETS

Nie API Keys, Tokens oder Zugangsdaten in:

```text
source
tests
logs
README
AGENTS.md
prompts
```

---

# 131. TEST DATA

Keine echten personenbezogenen Nutzerdaten in Tests.

Fixture-Daten müssen synthetisch sein.

---

# 132. PRIVACY

Nur Daten speichern, die für den jeweiligen Zweck erforderlich sind.

Dog profiles dürfen nicht unnötig personenbezogene Informationen enthalten.

---

# 133. ANALYTICS PRIVACY

Analytics so anonym wie möglich gestalten.

Keine unnötige Speicherung:

```text
full IP
exact personal identifiers
unnecessary raw user text
```

---

# 134. USER DELETION

Wenn persistente Nutzer-/Profildaten existieren, muss langfristig ein sauberer Löschpfad möglich sein.

---

# 135. FEATURE FLAGS

Experimentelle Features bevorzugt über Feature Flags aktivieren, wenn sie:

```text
high risk
high cost
large traffic impact
```

haben.

---

# 136. DOCUMENTATION

Bei architektonischen Änderungen aktualisieren:

```text
README
architecture docs
roadmap
methodology
runbook
```

aber nur soweit tatsächlich notwendig.

---

# 137. ROADMAP HYGIENE

Erledigte Punkte markieren.

Keine veralteten „TODO"-Listen stehen lassen, die bereits implementierte Features als offen darstellen.

---

# 138. CHANGELOG

Größere Änderungen dokumentieren:

```text
Feature
Impact
Migration
Breaking changes
```

---

# 139. AGENT RESPONSE FORMAT

Nach Abschluss einer Coding-Aufgabe soll der Agent kurz berichten:

```text
CHANGED
- ...

WHY
- ...

TESTED
- ...

RESULT
- ...

RISKS
- ...
```

Keine langen Selbsterklärungen.

---

# 140. BEFORE CODING CHECKLIST

Vor jeder größeren Änderung:

```text
[ ] Existing implementation searched
[ ] Relevant architecture understood
[ ] Database impact checked
[ ] SEO impact checked
[ ] GEO impact checked
[ ] Security impact checked
[ ] Performance impact checked
[ ] Monetization impact checked
[ ] Tests identified
```

---

# 141. AFTER CODING CHECKLIST

```text
[ ] TypeScript passes
[ ] Lint passes
[ ] Tests pass
[ ] Build passes
[ ] Critical BELLA flow tested
[ ] No regression detected
[ ] No secrets introduced
[ ] Docs updated where necessary
```

---

# 142. CRITICAL BELLA TEST

Bei Änderungen an BELLA muss mindestens geprüft werden:

```text
User question
↓
intent
↓
profile
↓
constraints
↓
product filtering
↓
score
↓
recommendation
↓
explanation
```

---

# 143. CRITICAL ALLERGEN TEST

Bei jeder Änderung an:

```text
product
scoring
intent
recommendation
database
```

mindestens einen Allergen-/Avoidance-Test durchführen.

---

# 144. CRITICAL SEO TEST

Bei SEO-Änderungen prüfen:

```text
status 200
canonical
title
description
H1
robots
JSON-LD
internal links
sitemap
```

---

# 145. CRITICAL GEO TEST

Bei GEO-Änderungen prüfen:

```text
answer clarity
entity clarity
structured data
machine-readable content
source attribution
updated timestamp
```

---

# 146. CRITICAL MONETIZATION TEST

Bei Affiliate-Änderungen prüfen:

```text
affiliate URL valid
tracking valid
product identity correct
price current
disclosure present
no ranking manipulation
```

---

# 147. PERFORMANCE BUDGET

Neue Features dürfen Performance nicht unbegrenzt verschlechtern.

Bei größeren UI-Änderungen messen:

```text
LCP
INP
CLS
TTFB
JS size
```

---

# 148. CORE WEB VITALS

SEO-Features dürfen nicht auf Kosten der Core Web Vitals implementiert werden.

Wenn ein Feature:

```text
+100KB JS
```

erzeugt, muss es einen nachvollziehbaren Nutzen besitzen.

---

# 149. DATABASE PERFORMANCE

Langsame Queries identifizieren.

Bei Ranking-/Search-Queries insbesondere:

```text
EXPLAIN
indexes
joins
filters
sorts
limits
```

berücksichtigen.

---

# 150. SCALABILITY

Das System muss mit:

```text
11k products
50k products
100k products
```

perspektivisch umgehen können.

Nicht nur für aktuelle Datenmenge optimieren.

---

# 151. PRODUCT DATA CACHE

Produktdaten können gecacht werden.

Aber niemals User-Spezifikationen aus einem anderen Nutzerprofil übernehmen.

---

# 152. DOG PROFILE ISOLATION

Jedes Profil muss sauber isoliert sein.

Keine Möglichkeit:

```text
user A → dog profile B
```

ohne explizite Berechtigung.

---

# 153. SHARING

Share Tokens müssen:

```text
unguessable
revocable where appropriate
minimal-data
```

sein.

Keine sensiblen Daten in URL-Parametern.

---

# 154. TOKEN SECURITY

Tokens nicht als fortlaufende IDs verwenden.

Bevorzugt kryptographisch schwer erratbare Werte.

---

# 155. EMAIL SECURITY

Unsubscribe-/Preference-Mechanismen respektieren.

Keine E-Mail-Adresse unnötig in Logs.

---

# 156. AI PROMPTS

Prompts versionieren.

Beispiel:

```text
BELLA_INTENT_V3
BELLA_EXPLANATION_V2
```

Änderungen testen.

---

# 157. PROMPT REGRESSION

Promptänderungen müssen gegen Golden Cases getestet werden.

Ein „besser klingender" Prompt darf nicht:

```text
Allergen safety
intent accuracy
constraint extraction
```

verschlechtern.

---

# 158. EXPLANATION ≠ DECISION

Die Erklärung darf die Entscheidung nicht nachträglich verändern.

```text
decision first
explanation second
```

---

# 159. DETERMINISTIC REPRODUCIBILITY

Gleiche Eingaben und gleiche Daten sollten möglichst dieselbe Empfehlung ergeben.

Wenn Zufall notwendig ist:

> kontrollieren und dokumentieren.

---

# 160. MODEL ROUTING

LLM-Modellwahl soll kosten-/qualitätsorientiert erfolgen.

Nicht jede Anfrage braucht das größte Modell.

---

# 161. AI FALLBACK

Wenn LLM nicht verfügbar:

```text
deterministic search
structured fallback
```

sollte weiterhin funktionieren, soweit möglich.

BELLA darf nicht vollständig ausfallen, nur weil ein Modellanbieter nicht erreichbar ist.

---

# 162. VENDOR LOCK-IN

AI-Provider möglichst abstrahieren.

Beispielsweise:

```text
AI provider interface
```

statt Geschäftslogik direkt an einen Provider zu koppeln.

---

# 163. AI PROVIDER FAILURE

Bei:

```text
timeout
rate limit
5xx
invalid response
```

muss sauber fallbacken.

---

# 164. AI COST MONITORING

Pro Anfrage möglichst erfassen:

```text
model
tokens
latency
estimated cost
```

Aggregiert und datenschutzfreundlich.

---

# 165. PRODUCT RECOMMENDATION QUALITY

Die wichtigste Metrik ist nicht:

> Wie intelligent klingt BELLA?

Sondern:

> **Wie gut passt die Empfehlung tatsächlich zum Nutzerprofil?**

---

# 166. HUMAN OVERSIGHT

Bei besonders kritischen fachlichen Inhalten soll langfristig fachliche Prüfung vorgesehen werden.

Beispielsweise durch:

```text
Tierarzt
Tierernährungsberatung
fachliche Reviewer
```

---

# 167. TRUST LAYER

Langfristig sollen Seiten sichtbar machen:

```text
Datenquelle
Bewertungsmethode
Aktualisierungsdatum
Einschränkungen
```

---

# 168. NO FAKE AUTHORITY

Nicht behaupten:

```text
„von Tierärzten geprüft"
```

wenn das nicht tatsächlich der Fall ist.

Nicht:

```text
„wissenschaftlich bewiesen"
```

ohne entsprechende Evidenz.

---

# 169. NO FAKE SOCIAL PROOF

Keine erfundenen:

```text
reviews
ratings
users
sales
expert endorsements
```

---

# 170. NO MANIPULATIVE SEO

Nicht verwenden:

```text
keyword stuffing
hidden text
fake FAQ
doorway pages
mass duplicate pages
fake reviews
```

---

# 171. SEARCH ENGINE GUIDELINES

Langfristiges Ziel:

> nachhaltiger organischer Traffic.

Keine kurzfristigen Tricks, die zu manuellen Maßnahmen oder Rankingverlust führen können.

---

# 172. AI SEARCH FUTURE

Die Architektur soll flexibel bleiben für zukünftige Suchsysteme.

Deshalb:

```text
structured facts
stable entities
clear answers
source attribution
freshness
machine readability
```

sind wichtiger als einzelne aktuelle SEO-Tricks.

---

# 173. MONETIZATION FUTURE

Mögliche spätere Monetarisierung:

```text
Affiliate
Premium Futter-Pass
Preisalarme
Premium BELLA
API
B2B data
manufacturer analytics
pet commerce partnerships
```

Aber:

> Monetarisierung darf die Objektivität der Entscheidung nicht zerstören.

---

# 174. PREMIUM

Premium darf zusätzliche Funktionen bieten, nicht künstlich grundlegende Sicherheit zurückhalten.

Free User sollen eine sinnvolle Basisempfehlung erhalten.

---

# 175. API FUTURE

Eine zukünftige BELLA API könnte anbieten:

```text
dog profile
food matching
product scoring
ingredient filtering
price comparison
```

Die interne Decision Engine muss deshalb sauber abstrahiert sein.

---

# 176. B2B FUTURE

Produktdaten könnten langfristig für:

```text
pet shops
manufacturers
apps
veterinary platforms
comparison services
```

interessant sein.

Aber interne Nutzer-/Outcome-Daten niemals ungeprüft verkaufen oder offenlegen.

---

# 177. DATA AGGREGATION

Outcome-Daten nur ausreichend aggregiert verwenden.

Keine Rückschlüsse auf einzelne Nutzer.

---

# 178. MACHINE-READABLE CATALOG

Der maschinenlesbare Katalog soll:

```text
structured
consistent
fresh
compact
crawlable
```

sein.

---

# 179. LLM-FRIENDLY CONTENT

Maschinenlesbarkeit bedeutet nicht:

> eine riesige Textdatei voller Marketing.

Besser:

```text
entities
facts
definitions
relationships
sources
timestamps
```

---

# 180. LLMS.TXT

`llms.txt` und verwandte Dateien aktuell halten.

Sie dürfen keine veralteten URLs enthalten.

---

# 181. AI CRAWLER ACCESS

AI-Crawler nicht pauschal blockieren, wenn GEO ausdrücklich ein strategisches Ziel ist.

Security-sensitive Bereiche weiterhin schützen.

---

# 182. CONTENT FRESHNESS

Bei dynamischen Inhalten:

```text
updated_at
```

verwenden.

Aber nicht künstlich täglich aktualisieren, ohne dass sich etwas geändert hat.

---

# 183. REAL VALUE OVER TEXT LENGTH

Ein Artikel mit 700 hochwertigen Wörtern kann besser sein als 2.500 Wörter generischer Inhalt.

Keine Wortzahl als Selbstzweck.

---

# 184. PAGE QUALITY SCORE

Langfristig kann intern ein Page Quality Score berechnet werden:

```text
traffic
engagement
uniqueness
content depth
data quality
internal links
conversion
AI visibility
```

---

# 185. CONTENT PRUNING

Regelmäßig Seiten identifizieren:

```text
high value
medium value
low value
duplicate
obsolete
```

Aktionen:

```text
keep
improve
merge
redirect
noindex
remove
```

---

# 186. TOP PAGES

Die wichtigsten Seiten bekommen höchste Aufmerksamkeit.

Nicht alle 2.400 Seiten gleich behandeln.

Priorität:

```text
high traffic
high intent
high conversion
high citation potential
high strategic value
```

---

# 187. SEO INVESTMENT

Neue Entwicklungszeit zuerst in:

```text
top landing pages
BELLA
product pages
breed pages
high-value comparisons
```

investieren.

---

# 188. PRODUCT PAGE STANDARD

Eine hochwertige Produktseite sollte möglichst enthalten:

```text
Product identity
Food type
Life stage
Ingredients
Protein
Analytical data
Package size
Current price
Price/kg
Estimated price/day
BELLA fit
Pros
Limitations
Alternative products
Source
Updated date
Affiliate disclosure
```

---

# 189. PRODUCT CLAIMS

Produktclaims müssen aus Daten stammen.

Keine Behauptung:

> „fördert die Gesundheit"

wenn dies nicht aus verlässlicher Quelle hervorgeht.

---

# 190. BRAND NEUTRALITY

BELLA darf nicht grundsätzlich Marken bevorzugen.

Ranking muss aus Daten und Nutzeranforderungen entstehen.

---

# 191. AFFILIATE FAIRNESS

Wenn zwei Produkte ähnlich gut passen:

```text
price
availability
data quality
user preference
```

können als sekundäre Kriterien dienen.

Provision allein nicht.

---

# 192. FUTURE RECOMMENDATION MODEL

Langfristig kann das Modell lernen aus:

```text
explicit feedback
implicit feedback
purchase signals
repeat purchase
refill behavior
```

Aber immer unter kontrollierter Evaluation.

---

# 193. LEARNING LOOP

Der Lernkreislauf:

```text
Recommendation
↓
User decision
↓
Outcome
↓
Feedback
↓
Aggregation
↓
Evaluation
↓
Model/ranking improvement
↓
New recommendation
```

Keine unkontrollierte Online-Lernlogik direkt in Produktion.

---

# 194. MODEL UPDATES

Jede relevante Änderung an:

```text
score
weights
prompt
LLM
filter
ranking
```

muss vorher evaluiert werden.

---

# 195. A/B TESTING OF RECOMMENDATIONS

Wenn Recommendation-Systeme getestet werden:

```text
control
vs
variant
```

und nicht einfach unkontrolliert verschiedene Scores an Nutzer ausspielen.

---

# 196. BUSINESS METRICS

Wichtige KPIs:

```text
Organic sessions
BELLA starts
Completed profiles
Recommendation completion rate
Product CTR
Affiliate CTR
Affiliate EPC
Revenue/session
Futter-Pass adoption
Refill rate
Feedback rate
Return users
```

---

# 197. NORTH STAR METRIC

Langfristig besonders wichtig:

```text
Successful Food Decisions
```

Eine erfolgreiche Entscheidung ist eine Empfehlung, die:

```text
requirements satisfied
+
no safety violation
+
user accepts
+
preferably leads to positive outcome
```

---

# 198. DON'T OPTIMIZE ONLY FOR CLICKS

Ein Affiliate-Klick ist kein Erfolg, wenn die Empfehlung schlecht ist.

Qualität vor kurzfristigem CTR.

---

# 199. DON'T OPTIMIZE ONLY FOR TRAFFIC

10.000 schlechte Besucher sind weniger wert als 1.000 hochintentionale Nutzer.

---

# 200. DON'T OPTIMIZE ONLY FOR AI CITATIONS

Eine Citation ist wertvoll.

Aber sie darf nicht wichtiger werden als:

```text
correctness
trust
users
business
```

---

# 201. MASTER DEVELOPMENT LOOP

Alle größeren Änderungen sollen diesem Zyklus folgen:

```text
OBSERVE
↓
UNDERSTAND
↓
HYPOTHESIZE
↓
IMPLEMENT
↓
TEST
↓
MEASURE
↓
LEARN
↓
ITERATE
```

---

# 202. FINAL AGENT RULE

Baue nicht einfach mehr.

Baue:

```text
besser
sicherer
schneller
verständlicher
messbarer
zitierbarer
profitabler
```

---

# 203. FINAL PRODUCT VISION

Das langfristige System soll so funktionieren:

```text
                         BELLA
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      DOG DATA         FOOD DATA        KNOWLEDGE
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                  DECISION ENGINE
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        RECOMMENDATION              EXPLANATION
              │                         │
              └────────────┬────────────┘
                           ▼
                      USER DECISION
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        AFFILIATE                    FUTTER-PASS
              │                         │
              │                    REFILL / ALERT
              │                         │
              └────────────┬────────────┘
                           ▼
                         OUTCOME
                           │
                           ▼
                     USER FEEDBACK
                           │
                           ▼
                      DATA MOAT
                           │
                           ▼
                  BETTER BELLA ENGINE
```

Das ist das strategische Ziel.

Nicht:

> „Noch eine Hundefutter-Website."

Sondern:

> Eine kontinuierlich besser werdende, datenbasierte Entscheidungsplattform für Hundefütterung.

---

# 204. DEFINITION OF DONE

Eine Aufgabe ist erst abgeschlossen, wenn:

```text
[ ] Existing implementation understood
[ ] Feature implemented
[ ] TypeScript valid
[ ] Tests added/updated
[ ] Critical tests pass
[ ] Build passes
[ ] Security checked
[ ] Performance checked
[ ] SEO checked if relevant
[ ] GEO checked if relevant
[ ] Database migration checked if relevant
[ ] Affiliate impact checked if relevant
[ ] Documentation updated if necessary
[ ] No duplicate business logic introduced
```

---

# 205. ABSOLUTE RULES

Diese Regeln dürfen niemals ohne explizite Begründung verletzt werden:

1. Keine erfundenen Produktdaten.
2. Keine erfundenen Preise.
3. Keine erfundenen Reviews.
4. Keine erfundenen Experten.
5. Keine erfundenen wissenschaftlichen Belege.
6. Keine Allergen-Regel durch LLM überschreiben.
7. Keine Empfehlung nur wegen Affiliate-Provision.
8. Keine Secrets committen.
9. Keine personenbezogenen Daten unnötig speichern.
10. Keine destruktiven DB-Änderungen ohne Migration.
11. Keine massenhafte Thin-Content-Produktion.
12. Keine unnötigen Rewrite-Projekte.
13. Keine doppelte Business-Logik.
14. Keine ungetesteten Änderungen an der Decision Engine.
15. Keine medizinischen Diagnosen durch BELLA.
16. Keine manipulativen SEO-Techniken.
17. Keine Performanceverschlechterung ohne nachvollziehbaren Nutzen.
18. Keine Behauptung „Feature fehlt", bevor das Repository geprüft wurde.
19. Code ist die primäre Wahrheit über den aktuellen Implementierungsstand.
20. Sicherheit und Empfehlungskorrektheit stehen über Monetarisierung.

---

# 206. AGENT DEFAULT BEHAVIOR

Wenn die Aufgabe unklar ist:

```text
repository inspect
→ identify existing implementation
→ infer smallest safe change
→ implement
→ test
```

Wenn mehrere Lösungen möglich sind:

> Wähle diejenige mit der geringsten Komplexität und dem höchsten langfristigen Nutzen.

Wenn eine bestehende Architektur funktioniert:

> erweitern statt ersetzen.

Wenn eine Behauptung nicht verifiziert werden kann:

> transparent als unbekannt behandeln.

Wenn eine Änderung eine Sicherheits- oder Empfehlungskomponente betrifft:

> konservativ handeln.

---

# 207. STRATEGISCHE LEITLINIE

Jede neue Funktion sollte idealerweise mindestens einen dieser vier langfristigen Kreisläufe stärken:

```text
SEARCH LOOP
Google/AI Search
↓
Website
↓
BELLA
↓
User

COMMERCE LOOP
BELLA
↓
Product
↓
Affiliate
↓
Purchase

RETENTION LOOP
Futter-Pass
↓
Reminder
↓
Refill
↓
Return

DATA LOOP
Recommendation
↓
Outcome
↓
Feedback
↓
Better Ranking
↓
Better Recommendation
```

Je mehr eine Funktion mehrere dieser Loops gleichzeitig stärkt, desto höher ihre Priorität.

---

# 208. ULTIMATE OBJECTIVE

Das Ziel für alle Agents lautet:

> Mache BELLA nicht größer, sondern intelligenter, zuverlässiger, messbarer und wertvoller.

Die beste Version von welches-hundefutter.today ist nicht die Website mit den meisten Seiten.

Sie ist die Plattform, bei der ein Hundebesitzer sagen kann:

> „BELLA versteht meinen Hund, erklärt mir nachvollziehbar warum sie dieses Futter empfiehlt, zeigt mir aktuelle Angebote und hilft mir langfristig dabei, die richtige Fütterungsentscheidung zu treffen."

Und bei jeder weiteren Interaktion soll das System besser werden – ohne dabei Sicherheit, Transparenz oder Nutzervertrauen zu opfern.

**END OF AGENTS.md**
