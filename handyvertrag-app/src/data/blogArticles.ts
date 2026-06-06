export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  sections: {
    heading: string;
    content: string;
  }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "hundefutter-test-2026",
    title: "Hundefutter Test 2026: Welche Sorten sind wirklich gut?",
    description: "BELLA hat 8.442 Hundefutter-Sorten analysiert und nach Fleischqualität, Deklaration und Preis bewertet. Das sind die Ergebnisse des BELLA-Score-Rankings 2026.",
    keyword: "hundefutter test 2026",
    publishedAt: "2026-05-15",
    updatedAt: "2026-06-01",
    readingTime: 9,
    sections: [
      {
        heading: "Wie wir getestet haben",
        content: "Dieser Test basiert nicht auf bezahlten Proben oder Hersteller-Kooperationen. BELLA hat 8.442 aktive Produkte aus dem AWIN-Affiliate-Feed automatisiert nach dem BELLA-Score bewertet – einem transparenten, nachvollziehbaren Punktesystem auf Basis vier objektiver Kriterien.\n\nDie vier Kriterien:\n- Proteinquelle: Ist Fleisch spezifisch benannt? Welche Tierart? (max. 18 Punkte)\n- Getreidefreiheit: Enthält das Futter keine Getreidearten? (max. 12 Punkte)\n- Hypoallergen-Status: Ist es als monoprotein oder hypoallergen deklariert? (max. 10 Punkte)\n- Preis-Leistung: €/kg-Verhältnis in drei Stufen (max. 15 Punkte)\n- Verarbeitungstyp: BARF oder Kaltgepresst vor Nass vor Trocken (max. 8 Punkte)\n\nBasiswert: 35 Punkte. Minimum: 35, Maximum möglich: 98, tatsächliches Maximum im Katalog: 94.",
      },
      {
        heading: "Ergebnisse: Die Score-Verteilung",
        content: "Von 8.442 bewerteten Produkten ergibt sich folgendes Bild:\n\n| Tier | Score | Anzahl Produkte |\n| --- | --- | --- |\n| Premium ★ | ≥ 75 Punkte | 159 (1,9 %) |\n| Gut ◆ | 55–74 Punkte | 2.871 (34,0 %) |\n| Basis · | < 55 Punkte | 5.412 (64,1 %) |\n\nDer Durchschnittsscore liegt bei 53 – leicht unter der 'Gut'-Schwelle. Das bedeutet: Die Mehrheit der Produkte im Markt ist Basis-Qualität. Premium-Futter macht weniger als 2 % des Katalogs aus.\n\nWichtig: Ein niedriger Score bedeutet nicht, dass das Futter schädlich ist. Er zeigt, dass es keine besondere Qualitätsmerkmale aufweist. Viele Basis-Sorten sind für gesunde Hunde völlig ausreichend.",
      },
      {
        heading: "Kategorien-Sieger nach Futtertyp",
        content: "**Bestes Trockenfutter (Score ≥ 80)**\nAnifit Weidefleisch, Wolfsblut Wild Duck, Bewital Petfood und Futalis Trockenfutter-Sorten erzielen regelmäßig hohe Scores durch konkrete Fleischdeklaration und getreidefrei-Zusammensetzung. Durchschnittspreis: 8–15 €/kg.\n\n**Bestes Nassfutter (Score ≥ 75)**\nAnimonda Carny, Almo Nature HFC, MAC's (Monoprotein-Sorten) und Herrmann's Bio führen die Nassfutter-Rangliste an. Hohe Scores durch spezifische Fleischdeklaration und wenig Füllstoffe. Durchschnittspreis: 4–9 €/kg (feuchtgewichtsbereinigt ca. 12–25 €/kg Trockenmasse).\n\n**Bestes BARF (Score ≥ 85)**\nBARF-Produkte aus dem Katalog erzielen strukturell die höchsten Scores durch Rohfütterung und minimale Verarbeitung. Voraussetzung: korrekte Zusammensetzung mit Muskelfleisch + Knochen + Organe.\n\n**Bestes Hypoallergenes (Score ≥ 70)**\nWolfsblut-Sorten mit einzelner Proteinquelle (Wild, Rentier, Strauß), Bellfor Hypoallergen und GranataPet DeliCatessen erreichen durch Monoprotein-Status hohe Scores.",
      },
      {
        heading: "Was der Score nicht abdeckt – und warum das wichtig ist",
        content: "Der BELLA-Score ist transparent und verteidigbar, aber er ist kein Allheilmittel. Er misst keine Palatabilität (schmeckt es deinem Hund?), keine Verträglichkeit (individuell unterschiedlich) und keine Produktionsbedingungen jenseits der Deklaration.\n\nEin Score von 85 bedeutet: Das Futter erfüllt objektive Qualitätskriterien überdurchschnittlich gut. Es bedeutet nicht: Dein Hund wird es lieben, oder es passt perfekt zu seiner Rasse und seinem Gesundheitszustand.\n\nDaher ist BELLA als Ergänzung zum Score gedacht: Sie fragt nach Rasse, Alter, Gewicht, Aktivitätslevel und Gesundheitsthemen – und filtert den Katalog auf die Top-3 Sorten, die zum konkreten Hund passen.\n\nDie vollständige Score-Methodik ist öffentlich dokumentiert unter /analyse/methodik.",
      },
      {
        heading: "Preis vs. Qualität: Was kostet gutes Futter wirklich?",
        content: "Eine häufige Frage: Muss gutes Hundefutter teuer sein? Die Antwort ist differenzierter als oft dargestellt.\n\nUnsere Daten zeigen: Ein Trockenfutter ab 6–8 €/kg kann gute Qualität liefern – wenn die Fleischdeklaration stimmt. Produkte unter 4 €/kg haben in 95 % der Fälle keine spezifische Fleischdeklaration und erzielen niedrige Basis-Scores.\n\nRichtwerte aus dem Katalog:\n\n| Kategorie | Preis/kg | Ø Score |\n| --- | --- | --- |\n| Budget (< 4 €/kg) | 3,20 € | 38 |\n| Standard (4–8 €/kg) | 6,10 € | 51 |\n| Premium (8–15 €/kg) | 11,40 € | 67 |\n| Ultra-Premium (> 15 €/kg) | 19,80 € | 76 |\n\nAbsolut teures Futter (> 20 €/kg) hat nicht zwingend einen höheren Score als gutes 12 €/kg-Futter. Ab einem gewissen Preisniveau zahlt man für Marketing und Verpackung – nicht für messbar bessere Inhaltsstoffe.",
      },
      {
        heading: "Unsere Empfehlung: So findest du das Richtige",
        content: "Kein Ranking der Welt kann deinen Hund kennen. Was wir bieten: eine datenbasierte Vorauswahl, die Schlechtes rausfiltert. Was du dazu brauchst: die Beobachtung deines eigenen Hundes.\n\nUnser Vorschlag:\n1. Lies den Score als Einstiegsfilter: Sorten unter 45 meidest du (außer bei medizinischen Gründen).\n2. Lass BELLA die Auswahl auf deinen Hund zuschneiden: Rasse, Alter, Gesundheit.\n3. Teste 4–6 Wochen: Beobachte Kotqualität, Fellzustand, Gewicht, Energielevel.\n4. Pass an wenn nötig: Hundeernährung ist keine einmalige Entscheidung – sie entwickelt sich mit dem Hund.",
      },
    ],
    faqs: [
      {
        question: "Welche Hundefutter-Marke hat den höchsten BELLA-Score?",
        answer: "BARF-Produkte und Kaltgepresstes erzielen strukturell die höchsten Scores. Bei Fertigfutter führen Anifit, Wolfsblut, MAC's und Animonda Carny die Rangliste an – hauptsächlich durch spezifische Fleischdeklaration und Monoprotein-Varianten.",
      },
      {
        question: "Ist teureres Hundefutter immer besser?",
        answer: "Nein. Unser Preisindex zeigt: Ab ca. 12–15 €/kg flacht der Qualitätszuwachs ab. Gutes Trockenfutter ist ab 7–9 €/kg erhältlich. Sehr günstiges Futter (< 4 €/kg) hat fast immer niedrige Scores.",
      },
      {
        question: "Wie oft wird der BELLA-Score aktualisiert?",
        answer: "Der Score wird bei jedem täglichen Feed-Import neu berechnet. Preisänderungen und neue Produkte fließen automatisch ein. Die Score-Methodik selbst bleibt stabil – Änderungen werden auf /analyse/methodik dokumentiert.",
      },
      {
        question: "Kann ich den Score als einziges Kriterium nutzen?",
        answer: "Nein. Der Score filtert objektive Qualitätsmerkmale, aber nicht Verträglichkeit oder Palatabilität. Allergien, Rassebesonderheiten und individuelle Vorlieben deines Hundes müssen zusätzlich berücksichtigt werden – das macht BELLA im Gespräch.",
      },
    ],
    relatedSlugs: ["barf-hund-anfaenger", "hund-uebergewicht-futter", "hundefutter-allergie-hund"],
  },
  {
    slug: "barf-hund-anfaenger",
    title: "BARF für Anfänger: Die komplette Anleitung zur Rohfütterung",
    description: "BARF richtig machen: Zusammensetzung, Portionsgrößen, Fleischsorten, Ergänzungen und die häufigsten Anfängerfehler. Alle Infos für den sicheren Einstieg.",
    keyword: "barf hund anfänger",
    publishedAt: "2026-05-20",
    updatedAt: "2026-06-01",
    readingTime: 11,
    sections: [
      {
        heading: "Was ist BARF?",
        content: `BARF steht für "Biologisch Artgerechtes Rohes Futter" – manchmal auch als "Bones And Raw Food" interpretiert. Das Prinzip: Hunde fressen ausschließlich rohe, unverarbeitete Lebensmittel in einer Zusammensetzung, die der Ernährung von Wildcaniden (Wölfen) ähnelt.\n\nBARF ist keine Randerscheinung: In Deutschland ernähren laut Umfragen ca. 8–12 % aller Hundebesitzer ihren Hund ganz oder teilweise per BARF. Das entspricht etwa 1–1,5 Millionen Hunden.\n\nWarum BARF? Befürworter nennen: Bessere Verträglichkeit bei sensiblen Mägen, gesünderes Fell, festigerer Kot, mehr Energie, weniger Allergiesymptome. Studien dazu sind limitiert – aussagekräftige kontrollierte Langzeitstudien fehlen. Die Erfahrungsberichte vieler Besitzer sind jedoch konsistent positiv, wenn BARF korrekt zusammengestellt wird.`,
      },
      {
        heading: "Die Grundregel: 70-15-10-5",
        content: "Die wichtigste Formel für BARF-Einsteiger ist die 70-15-10-5-Regel. Sie beschreibt die prozentuale Zusammensetzung einer ausgewogenen BARF-Ration:\n\n| Komponente | Anteil | Was zählt dazu |\n| --- | --- | --- |\n| Muskelfleisch | 70 % | Rind, Geflügel, Lamm, Wild, Pansen |\n| Rohe Knochen | 15 % | Hühnerflügel/-hälse, Rinderknochen roh |\n| Organe | 10 % | Leber (max. 5 %), Niere, Herz, Milz |\n| Gemüse/Extras | 5 % | Zucchini, Möhre, Spinat, Kräuter |\n\nDiese Aufteilung ist ein Ausgangspunkt, kein starres Gesetz. Für Welpen, Senioren oder kranke Hunde gelten andere Verhältnisse – dann ist tierärztliche Begleitung empfehlenswert.\n\nWichtig: Nie isoliert füttern. Nur Muskelfleisch ist ein Fehler – die Knochen liefern Kalzium, die Organe liefern fettlösliche Vitamine und Spurenelemente.",
      },
      {
        heading: "Welches Fleisch ist geeignet?",
        content: "**Geeignete Fleischsorten für Muskelfleisch:**\nRind (Maultierfleisch, Herzfleisch, Pansen), Geflügel (Hähnchen, Pute, Ente – ohne Knochen wenn gehackt), Lamm, Pferd, Wild (Hirsch, Reh, Kaninchen), Weißfisch (Kabeljau, Seelachs).\n\n**Besonders wertvoll:**\nHerzfleisch – reich an Taurin und L-Carnitin. Rinderpansen – günstig, gute Nährstoffdichte. Lachs und Makrele – hohe Omega-3-Dichte (EPA/DHA).\n\n**Verboten:**\nRohes Schweinefleisch – Aujeszky-Virus (tödlich für Hunde). Rohes Wildschwein – gleiches Risiko. Alle Fleischsorten für Schweine müssen auf -20°C eingefroren werden (mind. 3 Wochen) um Parasiten abzutöten.\n\n**Geflügel-Knochen:**\nRohe Hähnchenhälse, Hühnerflügel und Putenflügel sind für die meisten Hunde geeignet. Nie kochen oder braten – dann splittern sie! Knochenanteil auf 10–15 % der Gesamtration beschränken.",
      },
      {
        heading: "Tagesration berechnen",
        content: "Faustregel: Hund frisst täglich 2–3 % des Körpergewichts als Frischfutter-Ration.\n\nBeispiele:\n\n| Gewicht Hund | Tagesration (2,5 %) | Davon Muskelfleisch (70 %) |\n| --- | --- | --- |\n| 5 kg | 125 g | 88 g |\n| 15 kg | 375 g | 263 g |\n| 30 kg | 750 g | 525 g |\n| 50 kg | 1.250 g | 875 g |\n\nAnpassen nach:\n- Aktivitätslevel: Sehr aktive Hunde bis 3,5 %, inaktive Senioren 1,8 %\n- Gewichtsentwicklung: Kontrolliere alle 2 Wochen – passe ±0,25 % an wenn nötig\n- Alter: Welpen brauchen 5–8 % (aufgeteilt auf 3–4 Mahlzeiten)\n\nBELLA berechnet die Tagesration nach RER-Formel (70 × kg^0,75 × Aktivitätsfaktor) automatisch wenn du dein Hundeprofil anlegst.",
      },
      {
        heading: "Notwendige Nahrungsergänzungen",
        content: "BARF ist ohne Ergänzungen nicht vollständig. Drei Nährstoffe sind kritisch:\n\n**1. Lachs- oder Leinöl (Omega-3)**\nDosis: 0,05 ml pro kg Körpergewicht täglich. Lachsöl liefert EPA und DHA direkt nutzbar; Leinöl liefert ALA (muss umgewandelt werden – schlechtere Rate). Lagere Öl dunkel und kühl – ranziges Öl ist schädlicher als keines.\n\n**2. Seegrasmehl oder Jod-Supplement**\nFleisch allein enthält kaum Jod. Jodmangel führt zu Schilddrüsenproblemen. Dosis: ca. 180 µg Jod pro Tag für einen 20-kg-Hund. Seegrasmehl ist natürliche Quelle; alternativ Tierarzt-Supplement.\n\n**3. Kalzium-Phosphor-Ausgleich**\nWenn keine rohen Knochen gefüttert werden: Kalziumcarbonat oder Eierschalenpulver. Knochen-freie BARF-Rationen haben fast immer ein zu niedriges Ca:P-Verhältnis.\n\nOptional aber sinnvoll: Vitamin E (als Antioxidans, besonders wenn viel fetthaltiges Fleisch), Zinkgluconat (häufig defizitär in reinen Fleischrationen).",
      },
      {
        heading: "Hygieneregeln – unterschätzt von Einsteigern",
        content: "BARF-Fütterung bedeutet: rohes Fleisch im Haushalt. Das erfordert konsequente Hygiene:\n\n1. Separate Schneidebretter und Messer nur für Hundefutter\n2. Napf nach jeder Mahlzeit heiß auswaschen (> 60°C)\n3. Aufgetautes Fleisch nicht wieder einfrieren\n4. Fleischreste nicht länger als 2h bei Raumtemperatur stehen lassen\n5. Hände nach Zubereitung gründlich waschen\n\nBesonders wichtig: In Haushalten mit Kleinkindern, Schwangeren oder immungeschwächten Personen ist das Salmonellen-Risiko realer. Das ist kein Argument gegen BARF – aber ein Argument für konsequente Hygiene.\n\nStudien zeigen: 20–50 % aller BARF-Rationen im Haushalt tragen Salmonellen. Die meisten Hunde zeigen keine Symptome (natürliche Resistenz), können aber Träger sein.",
      },
      {
        heading: "Einstieg: So startest du",
        content: "**Empfohlener Einstiegsplan für Einsteiger:**\n\nWoche 1: Eine Fleischsorte (z.B. Rinderhackfleisch 80/20) ohne Knochen, ohne Ergänzungen. Einfach beobachten: Wie reagiert der Magen? Wie ist die Kotqualität?\n\nWoche 2: Knochen einführen (rohe Hähnchenhälse, wenn der Hund die richtige Größe hat). Parallel Lachs- oder Fischöl starten.\n\nWoche 3: Organe einführen. Beginne mit Herz (milder), nicht mit Leber. Leber erst ab Woche 4–5 in kleinen Mengen.\n\nWoche 4–6: Sukzessive verschiedene Fleischsorten einführen. Ziel: 3–4 verschiedene Proteinquellen pro Woche.\n\nNach 6–8 Wochen: Vollbild-BARF nach 70-15-10-5-Formel, alle Ergänzungen etabliert. Dann Blutbild beim Tierarzt – überprüft ob die Nährstoffversorgung stimmt.",
      },
    ],
    faqs: [
      {
        question: "Kann ich meinen Welpen barfen?",
        answer: "Ja, aber mit Vorsicht. Welpen haben andere Nährstoffbedarfe als Erwachsene: mehr Protein, andere Ca:P-Verhältnisse, mehr DHA. Selbst gemischtes BARF für Welpen ist fehleranfällig – Fertig-BARF von seriösen Anbietern (B.A.R.F. Direkt, Barf-Manufaktur) ist sicherer. Tierärztliche Begleitung empfehlenswert.",
      },
      {
        question: "Wie bewahre ich BARF-Portionen auf?",
        answer: "Tiefgekühlte BARF-Rationen (Portionsbeutel à Tagesration) im Gefrierfach (mind. -18°C). Auftauen im Kühlschrank über Nacht, nie in der Mikrowelle (zerstört Nährwerte). Aufgetaute Portion 2h auf Raumtemperatur bringen vor dem Füttern – die meisten Hunde mögen kaltgepufferte Portionen nicht.",
      },
      {
        question: "Was kostet BARF im Monat?",
        answer: "Für einen 20-kg-Hund ca. 60–120 €/Monat bei selbst zusammengestelltem BARF (Direktkauf beim Metzger oder Hundefutter-Großhandel). Fertig-BARF aus dem Handel: 100–180 €/Monat. Günstiger als hochwertiges Premium-Trockenfutter ist BARF meist nicht.",
      },
      {
        question: "Muss ich jeden Tag die genaue 70-15-10-5-Formel einhalten?",
        answer: "Nein. BARF funktioniert als Wochendurchschnitt. An einem Tag kann es mehr Knochen sein, am nächsten mehr Muskelfleisch. Wichtig ist die Balance über 7 Tage. Ausnahme: Leber nie täglich – max. 2–3x pro Woche und max. 5 % der Gesamtration.",
      },
    ],
    relatedSlugs: ["hundefutter-test-2026", "hund-uebergewicht-futter"],
  },
  {
    slug: "hund-uebergewicht-futter",
    title: "Hund hat Übergewicht: Das richtige Futter und die richtige Strategie",
    description: "Wie erkennst du ob dein Hund zu dick ist? Welches Futter hilft beim Abnehmen, was ist Mythos? Der komplette Guide – ohne Light-Futter-Hype.",
    keyword: "hund übergewicht futter",
    publishedAt: "2026-05-25",
    updatedAt: "2026-06-01",
    readingTime: 10,
    sections: [
      {
        heading: "Wie häufig ist Übergewicht bei Hunden?",
        content: "Übergewicht ist das häufigste Ernährungsproblem bei Hunden in Deutschland. Studien schätzen: 54 % aller Hunde in DACH-Ländern sind übergewichtig oder adipös. Das ist kein Schönheitsproblem – Übergewicht verkürzt die Lebenserwartung messbar, erhöht das Risiko für Gelenkerkrankungen, Diabetes, Herzprobleme und Krebserkrankungen.\n\nDie meisten Übergewichts-Hunde haben keine Erkrankung als Ursache – der Grund ist simpel: zu viele Kalorien, zu wenig Bewegung. Das ist die gute Nachricht: Es ist behebbar.",
      },
      {
        heading: "Ist mein Hund zu dick? Der Body Condition Score",
        content: "Der Body Condition Score (BCS) ist der Standard zur Beurteilung des Körperzustands beim Hund. Skala 1–9:\n\n| BCS | Beschreibung |\n| --- | --- |\n| 1–3 | Untergewicht: Rippen, Wirbel und Hüftknochen sichtbar ohne Berühren |\n| 4–5 | Ideal: Rippen leicht fühlbar ohne Druck, Taille von oben sichtbar |\n| 6–7 | Übergewicht: Rippen nur mit Druck fühlbar, Taille kaum sichtbar |\n| 8–9 | Adipositas: Rippen nicht mehr fühlbar, keine Taille, Fettansammlung am Hals |\n\nDer einfachste Test: Lege deine Hände flach auf den Brustkorb deines Hundes. Kannst du die Rippen ohne Druck deutlich fühlen? Wenn nicht (bei normalem Fell), ist er wahrscheinlich übergewichtig.\n\nWichtiger Hinweis: BCS 5/9 ist das Ziel – manche Hunderassen (Greyhound, Whippet) sehen bei idealem Gewicht sehr dünn aus. Verglichen mit Fotos von Hunden der gleichen Rasse im Idealgewicht ist das sinnvoller als intuitives Schätzen.",
      },
      {
        heading: "Der Light-Futter-Mythos",
        content: "Light-Futter ist die meistgekaufte Antwort auf Hundeübergewicht. Und oft die falsche.\n\nWas Light-Futter ist: Weniger Fett (oft 6–10 % statt 14–18 %), mehr Ballaststoffe, manchmal mehr Cellulose. Was Light-Futter oft nicht ist: sättigender, nährstoffreicher oder besser verträglich.\n\nDas Problem: Weniger Fett bedeutet weniger Energie pro Gramm. Manche Hersteller kompensieren das mit mehr Füllstoffen (Cellulose, Rübenschnitzel) – das füllt den Bauch, liefert aber kaum Nährwert. Gleichzeitig machen viele Light-Sorten Hunde nicht mehr satter als normale Sorten, weil Fett einer der stärksten Sättigungssignale ist.\n\nBesser: Normales qualitativ hochwertiges Futter, einfach 20–25 % weniger davon. Gemüse (rohe Möhren, Zucchini) als kalorienarmes Füllmaterial ergänzen. Snacks auf Tagesration anrechnen – viele Übergewichts-Hunde bekommen täglich 20–30 % ihrer Kalorien durch Snacks, ohne dass die Besitzer es realisieren.",
      },
      {
        heading: "Welches Futter beim Abnehmen?",
        content: "Prinzipien für sinnvolles Abnehmfutter:\n\n**1. Hohes Protein, wenig Fett**\nProtein sättigt besser als Kohlenhydrate bei gleicher Kalorienmenge. Ziel: Rohprotein ≥ 30 %, Rohfett < 12 %. Mageres Fleisch als Erstzutat (Hähnchenbrust, Pute, mageres Rind).\n\n**2. Viel Feuchtigkeit**\nNassfutter hat ca. 75–80 % Wasseranteil. Bei gleicher Kalorienmenge ist eine Portion Nassfutter deutlich größer als Trockenfutter – das erhöht das Sättigungsgefühl messbar. Für Übergewichtshunde ist Nassfutter als Hauptfutter daher oft sinnvoller als Trockenfutter.\n\n**3. Ballaststoffe aus echten Quellen**\nNicht Cellulose (wertloser Füllstoff), sondern fermentierbare Ballaststoffe: Rübenschnitzel, Chicorée-Inulin, Flohsamenschalen. Diese fördern Darmgesundheit und haben einen echten Sättigungseffekt.\n\n**4. Kein zugesetzter Zucker**\nMelasse, Rübenzucker, Honig in Futter sind in Übergewichtshunden absolut fehl am Platz – sie liefern Kalorien ohne Nährwert und stimulieren Insulin.",
      },
      {
        heading: "Die Abnehmstrategie: Schritt für Schritt",
        content: "**Schritt 1: Idealgewicht bestimmen**\nFür die meisten Rassen: Gewicht bei BCS 5/9 aus dem Rassestandard. Tierarzt kann helfen. Als grobe Formel: Wenn BCS = 7, sind ca. 15 % Körpergewicht Übergewicht; wenn BCS = 8, ca. 25 %.\n\n**Schritt 2: Tagesration berechnen**\nBerechne die Kalorienmenge für das ZIELGEWICHT (nicht das aktuelle Gewicht!) multipliziert mit Aktivitätsfaktor 1,2 (leichte Aktivität). Das ist die anzustrebende Tagesmenge.\n\n**Schritt 3: Langsam abnehmen lassen**\nZiel: 1–2 % Körpergewichtsverlust pro Woche. Schnelleres Abnehmen ist für die meisten Hunde nicht gesund. Für einen 30-kg-Hund: 300–600 g pro Woche. Geduld ist entscheidend – seriöses Abnehmen dauert 3–6 Monate.\n\n**Schritt 4: Alle Kalorien zählen**\nSnacks, Leckerlis beim Training, Reste vom Tisch, Käsestücke als Belohnung – all das zählt. Entweder vollständig weglassen oder von der Tagesration abziehen. Gemüse-Snacks (Möhren, Kohlrabi, Gurke) sind kalorienarm und akzeptabel.\n\n**Schritt 5: Wöchentlich wiegen und dokumentieren**\nNicht täglich (zu starke Schwankungen), aber wöchentlich zur gleichen Zeit. Wenn nach 3 Wochen keine Veränderung: Kalorienmenge um weitere 10 % reduzieren.",
      },
      {
        heading: "Rassen mit erhöhtem Übergewichtsrisiko",
        content: "Manche Rassen haben genetisch bedingt eine höhere Übergewichtstendenz:\n\n**Labrador Retriever:** POMC-Gen-Mutation bei ca. 25 % aller Labradors beeinträchtigt das Sättigungsgefühl direkt. Betroffene Labradors fressen buchstäblich nie genug – konsequente Dosierung ist pflicht.\n\n**Beagle:** Nahrungsmotiviert wie kaum eine andere Rasse. Oft nach Nase, nicht nach Hunger – daher besonders anfällig für Übergewicht durch Leckerli-Training.\n\n**Basset Hound, Cavalier King Charles:** Genetisch vorbelastet, dazu oft wenig körperlich aktiv.\n\n**Kastrierte Hunde aller Rassen:** Kastration reduziert den Grundumsatz um ca. 20–30 % – das Futter muss entsprechend reduziert werden, sonst folgt Übergewicht fast zwangsläufig.\n\nFür diese Hunde gilt: Tägliche Grammgenauigkeit bei der Fütterung ist kein Pedantismus, sondern notwendige Fürsorge.",
      },
    ],
    faqs: [
      {
        question: "Wie schnell sollte mein Hund abnehmen?",
        answer: "Maximal 1–2 % Körpergewicht pro Woche. Für einen 30-kg-Hund: 300–600 g pro Woche. Schnelleres Abnehmen belastet Organe und kann zu Muskelverlust führen. Geduld zahlt sich aus.",
      },
      {
        question: "Darf mein übergewichtiger Hund Snacks bekommen?",
        answer: "Ja, aber eingerechnet in die Tagesration. Oder: Gemüse-Snacks statt Leckerlis (rohe Möhren, Kohlrabi, Gurke – kalorienarm und die meisten Hunde mögen sie). Kommerzielle Leckerlis sind oft kalorienreicher als angenommen.",
      },
      {
        question: "Ist mehr Bewegung allein ausreichend?",
        answer: "Nicht bei starkem Übergewicht. Mehr Bewegung erhöht den Grundumsatz nur moderat. Ein 30-minütiger zusätzlicher Spaziergang verbrennt bei einem 30-kg-Hund ca. 100–150 kcal – das entspricht einem kleinen Leckerli. Futterkontrolle ist effektiver als Bewegungssteigerung allein.",
      },
      {
        question: "Wann sollte ich den Tierarzt aufsuchen?",
        answer: "Wenn dein Hund trotz klarer Kalorienkontrolle über 4 Wochen nicht abnimmt, könnte eine Schilddrüsenunterfunktion (Hypothyreose) oder ein Cushing-Syndrom vorliegen. Beides ist behandelbar. Beim ersten Verdacht: Blutuntersuchung beim Tierarzt.",
      },
    ],
    relatedSlugs: ["hundefutter-test-2026", "barf-hund-anfaenger"],
  },
  {
    slug: "hundefutter-allergie-hund",
    title: "Hundefutter bei Allergie: Was wirklich hilft und was Mythos ist",
    description: "Futterallergie oder Unverträglichkeit? Welche Zutaten sind häufige Auslöser? Wie läuft eine Eliminationsdiät ab? Der vollständige Guide für Hunde mit Futterproblemen.",
    keyword: "hundefutter allergie hund",
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
    readingTime: 9,
    sections: [
      {
        heading: "Allergie vs. Unverträglichkeit: Der wichtigste Unterschied",
        content: "Diese Unterscheidung ist medizinisch relevant, wird aber häufig verwechselt:\n\n**Echte Futterallergie (IgE-vermittelt):** Das Immunsystem bildet Antikörper gegen ein spezifisches Protein. Reaktion: Hautsymptome (Juckreiz, Rötungen, Schuppenbildung), manchmal Magen-Darm-Beschwerden. Häufig akuter Beginn nach Kontakt mit dem Allergen.\n\n**Futtermittelunverträglichkeit (nicht-immunologisch):** Verdauliche Probleme durch bestimmte Zutaten ohne Immunbeteiligung. Typisch: Durchfall, Blähungen, weicher Kot nach bestimmten Futtermitteln.\n\nWarum das wichtig ist: Nur etwa 10 % aller Hautsymptome beim Hund sind echte Futterallergien. Die meisten Hautsymptome haben andere Ursachen (Umweltallergien, Parasiten, Pilzinfektionen). Vor teuren Futterumstellungen lohnt sich tierärztliche Differenzialdiagnose.",
      },
      {
        heading: "Die häufigsten Allergie-Auslöser",
        content: "Laut Studien sind die häufigsten Proteine, auf die Hunde allergisch reagieren:\n\n| Auslöser | Häufigkeit |\n| --- | --- |\n| Huhn / Geflügel | 34 % |\n| Rind | 26 % |\n| Weizen | 15 % |\n| Milchprodukte | 10 % |\n| Ei | 6 % |\n| Lamm / Soja | je 4 % |\n\nAuffällig: Die häufigsten Auslöser sind die am häufigsten verwendeten Zutaten in Hundefutter. Das ist kein Zufall – Allergien entwickeln sich typischerweise gegen Proteine, mit denen man regelmäßig in Kontakt kommt. Hunde, die jahrelang Hühnerfutter bekommen, entwickeln häufiger Huhn-Allergien als Hunde mit wechselnden Proteinquellen.\n\nImportant: Eine Reaktion bedeutet nicht immer Allergie. Oft liegt eine Intoleranz gegen die Verarbeitungsart (z.B. bestimmte Konservierungsmittel) oder gegen Füllstoffe vor.",
      },
      {
        heading: "Die Eliminationsdiät: So geht es richtig",
        content: "Die Eliminationsdiät ist der einzige wissenschaftlich anerkannte Weg, eine Futterallergie zu identifizieren. Kein Bluttest, kein Haaranalyse-Test kann das zuverlässig leisten – diese Tests haben in kontrollierten Studien keine valide Trennschärfe bewiesen.\n\n**Ablauf:**\n1. Einziges neues Protein wählen: Eine Tierart, die der Hund noch nie gegessen hat (z.B. Pferd, Känguru, Strauß, Insekten). Keine Snacks, keine Leckerlis außer dem Diätfutter.\n2. Diät für mindestens 8–12 Wochen strikt einhalten. Nicht 3 Wochen und dann aufhören weil keine Besserung – Allergien brauchen 8+ Wochen zum Ausheilen.\n3. Strikte Kontrolle: Kein Fleisch vom Tisch, keine anderen Snacks, keine Zahnpflege-Kaustreifen (oft Geflügelanteile).\n4. Wenn Symptome verschwinden: Provokationstest – altes Futter wieder einführen. Kehren Symptome zurück: Allergie bestätigt.\n5. Wenn Symptome nicht verschwinden: keine Futterallergie oder mehrere Allergien. Tierarzt aufsuchen.",
      },
      {
        heading: "Hypoallergenes Futter: Was der Begriff wirklich bedeutet",
        content: `"Hypoallergen" ist keine geschützte Bezeichnung in der EU. Jeder Hersteller kann sein Futter so nennen.\n\nWas gute hypoallergene Sorten ausmacht:\n1. Monoprotein: Nur eine Tierart als Proteinquelle, klar deklariert\n2. Ohne die häufigen Allergene (Huhn, Rind, Weizen, Milch)\n3. Hydrolysiertes Protein (optional): Protein ist aufgespalten in kleinere Peptide, die das Immunsystem schwerer erkennt – besonders für schwere Fälle\n\nWas den Begriff entwertet:\n- "Hypoallergen" mit Huhn als Erstzutat: nutzlos für Hunde mit Hühnerallergie\n- Futter mit 8 verschiedenen Fleischsorten und dem Label "hypo": nutzlos\n- Labs zeigen: Viele als hypoallergen beworbene Sorten enthalten Spuren anderer Proteine durch Kreuzkontamination in der Herstellung\n\nEmpfehlung: Produkte mit klar deklamierten Monoprotein-Sorten und wenigen Zutaten sind zuverlässiger als solche, die nur das Label tragen.`,
      },
      {
        heading: "Empfohlene Futtertypen bei Allergie",
        content: "**1. Monoprotein-Nassfutter**\nBeste Wahl für Eliminationsdiät und Dauerfütterung. Kontrollierbare Zusammensetzung, hohe Akzeptanz. Marken: Wolfsblut (Wild, Rentier, Strauß-Sorten), MAC's Monoprotein, Bellfor Hypoallergen.\n\n**2. Kaltgepresstes Monoprotein**\nWeniger verbreitet, aber wertvoll: Niedrige Verarbeitungstemperatur erhält Proteinstruktur – möglicherweise weniger Irritation empfindlicher Immunsysteme. Keine Studien dazu, aber positive Erfahrungsberichte.\n\n**3. Insektenfutter**\nHermetia illucens ist für die allermeisten Hunde ein völlig neues Protein – ideal als Eliminationsdiät-Protein. Gut verträglich, vollständiges Aminosäureprofil. Vorteil: Auch ökologisch sinnvoll.\n\n**4. Exotic Protein BARF**\nPferdefleisch, Kängurufleisch, Krokodil, Kaninchen – für echte Eliminationsdiäten mit BARF. Hochwertig, teuer, aber für die Diagnose-Phase (8–12 Wochen) sinnvoll.",
      },
    ],
    faqs: [
      {
        question: "Kann ich eine Futterallergie mit einem Bluttest nachweisen?",
        answer: "Nein – zuverlässig nicht. Kommerziell angebotene Allergie-Bluttests (ELISA) für Hunde zeigen in wissenschaftlichen Studien niedrige Sensitivität und Spezifität. Die einzige valide Methode ist die Eliminationsdiät über 8–12 Wochen.",
      },
      {
        question: "Wie lange dauert es, bis sich eine Allergie beim Hund zeigt?",
        answer: "Allergien entwickeln sich bei wiederholtem Kontakt mit dem Allergen – oft erst nach Jahren regelmäßiger Exposition. Ein Hund, der jahrelang dasselbe Futter verträgt, kann plötzlich eine Allergie entwickeln. Deshalb empfehlen Ernährungsexperten, die Proteinquelle alle 3–6 Monate zu wechseln als Vorbeugung.",
      },
      {
        question: "Welches Futter bei Hautallergie beim Hund?",
        answer: "Zuerst ausschließen: Ist es wirklich eine Futterallergie? 70–80 % aller Haut-Allergien beim Hund sind Umweltallergien (Pollen, Milben, Gras) – diese verschwinden nicht durch Futterumstellung. Wenn Futterallergie vermutet: Eliminationsdiät mit exotischem Monoprotein für 8–12 Wochen.",
      },
      {
        question: "Was ist der Unterschied zwischen hypoallergenem Futter und Monoprotein-Futter?",
        answer: "Monoprotein bedeutet konkret: nur eine Tierart als Eiweißquelle. Hypoallergen ist ein Marketing-Begriff ohne gesetzliche Definition. Echtes hypoallergenes Futter ist meist Monoprotein – aber nicht jedes Futter mit dem Label \"hypoallergen\" ist wirklich Monoprotein.",
      },
    ],
    relatedSlugs: ["hundefutter-test-2026", "hund-uebergewicht-futter"],
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}
