// Handkuratierte Partner-Shops — Gutscheine + reine Tracking-Link-Partner (kein Produkt-Feed).
// Kein Live-Feed (ändert sich selten) → bewusst als TS-Daten statt DB-Tabelle, analog breeds.ts/cities.ts.
// Domain-Matching gegen DogFood.affiliateUrl / CrossSell-affiliateUrl, siehe getVoucherForUrl().

export interface PartnerVoucher {
  slug: string;
  shopName: string;
  domain: string;
  affiliateUrl: string;
  affiliateNetwork: "awin" | "adcell";
  category: "ernaehrung" | "zubehoer" | "pflege" | "sonstiges";
  /** null = kein Code nötig, Rabatt greift automatisch über den Link (z.B. AWIN-Tracking) */
  code: string | null;
  discount: string;
  /** Nur gesetzt wenn der Shop einen klaren %-Rabatt nennt — Basis für die kombinierte Ersparnis-Anzeige. */
  discountPercent?: number;
  terms?: string;
  /** true = Shop hat auch echte Produkte in dog_foods/cross_sell (Badge-Matching lohnt sich) */
  hasFeed: boolean;
}

export const PARTNER_VOUCHERS: PartnerVoucher[] = [
  {
    slug: "barfme",
    shopName: "BARF.me",
    domain: "barfme.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=415106-66376",
    affiliateNetwork: "adcell",
    category: "ernaehrung",
    code: "ZKJTH862",
    discount: "7% auf alle Produkte",
    discountPercent: 7,
    terms: "Ausgenommen reduzierte Artikel. Pro Kunde einmal einlösbar.",
    hasFeed: false,
  },
  {
    slug: "amberdog",
    shopName: "amberdog",
    domain: "amberdog.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=376535-66376",
    affiliateNetwork: "adcell",
    category: "pflege",
    code: "amberdog5",
    discount: "5% Rabatt",
    discountPercent: 5,
    hasFeed: true,
  },
  {
    slug: "hurtta",
    shopName: "Hurtta Deutschland",
    domain: "hurtta-deutschland.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=521038-66376",
    affiliateNetwork: "adcell",
    category: "zubehoer",
    code: "Hurtta-Adcell",
    discount: "Rabatt auf Outdoor-Ausrüstung",
    hasFeed: false,
  },
  {
    slug: "barfego",
    shopName: "Barfego",
    domain: "barfego.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=216729-66376",
    affiliateNetwork: "adcell",
    category: "ernaehrung",
    code: "BARFEGO2026",
    discount: "Rabatt auf BARF-Fertigmenüs",
    hasFeed: false,
  },
  {
    slug: "milo-mia",
    shopName: "milo&mia",
    domain: "milo-mia.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=374030-66376",
    affiliateNetwork: "adcell",
    category: "ernaehrung",
    code: "happy10",
    discount: "10% Rabatt",
    discountPercent: 10,
    hasFeed: true,
  },
  {
    slug: "mczoo",
    shopName: "mczoo.de",
    domain: "mczoo.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=652621-66376",
    affiliateNetwork: "adcell",
    category: "zubehoer",
    code: "neu10",
    discount: "10% Neukundenrabatt",
    discountPercent: 10,
    hasFeed: true,
  },
  {
    slug: "salingo",
    shopName: "SALiNGO",
    domain: "salingo.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=528096-66376",
    affiliateNetwork: "adcell",
    category: "ernaehrung",
    code: "NEU2025",
    discount: "Neukundenrabatt",
    hasFeed: true,
  },
  {
    slug: "finnto",
    shopName: "finnto",
    domain: "finnto.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=216934-66376",
    affiliateNetwork: "adcell",
    category: "ernaehrung",
    code: "87BY724M",
    discount: "Rabatt auf Hundefutter-Abo",
    hasFeed: false,
  },
  {
    slug: "petshop24",
    shopName: "petshop24.de",
    domain: "petshop24.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=400205-66376",
    affiliateNetwork: "adcell",
    category: "zubehoer",
    code: "PAW24",
    discount: "Rabatt auf Zubehör & Pflege",
    hasFeed: true,
  },
  {
    slug: "pawzlove",
    shopName: "PAWZLOVE",
    domain: "pawzlove.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=620350-66376",
    affiliateNetwork: "adcell",
    category: "zubehoer",
    code: "PFOTE15",
    discount: "15% Rabatt auf Hunde-Merch",
    discountPercent: 15,
    hasFeed: true,
  },
  {
    slug: "powerpets",
    shopName: "powerpets.de",
    domain: "powerpets.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=411945-66376",
    affiliateNetwork: "adcell",
    category: "pflege",
    code: "ADC10",
    discount: "10% Rabatt auf Pflegeprodukte",
    discountPercent: 10,
    hasFeed: true,
  },
  {
    slug: "meintierdiscount",
    shopName: "meintierdiscount.de",
    domain: "meintierdiscount.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=495720-66376",
    affiliateNetwork: "adcell",
    category: "sonstiges",
    code: "Adcell",
    discount: "Rabatt im Shop",
    hasFeed: false,
  },
  {
    slug: "lokilux",
    shopName: "lokilux",
    domain: "lokilux.de",
    affiliateUrl: "https://t.adcell.com/click.php?bid=419405-66376",
    affiliateNetwork: "adcell",
    category: "zubehoer",
    code: "lokilux5",
    discount: "5% Rabatt",
    discountPercent: 5,
    hasFeed: false,
  },
  {
    slug: "ardapcare",
    shopName: "ardap care",
    domain: "ardapcare.com",
    affiliateUrl: "https://t.adcell.com/click.php?bid=239983-66376",
    affiliateNetwork: "adcell",
    category: "pflege",
    code: "AXUA8B7M",
    discount: "Rabatt auf Pflege- & Desinfektionsprodukte",
    hasFeed: true,
  },
  {
    slug: "justrussel",
    shopName: "Just Russel",
    domain: "justrussel.de",
    affiliateUrl: "https://www.awin1.com/awclick.php?gid=580845&mid=39212&awinaffid=615299&linkid=4507701&clickref=",
    affiliateNetwork: "awin",
    category: "ernaehrung",
    code: null,
    discount: "25% Neukundenrabatt auf die erste Bestellung",
    discountPercent: 25,
    terms: "Rabatt wird automatisch über den Link aktiviert, kein Code nötig.",
    hasFeed: false,
  },
];

/** Reine Tracking-Link-Partner ohne Produkt-Feed UND ohne aktuellen Gutschein-Code. */
export interface PartnerLink {
  slug: string;
  shopName: string;
  domain: string;
  affiliateUrl: string;
  category: PartnerVoucher["category"];
}

export const PARTNER_LINKS: PartnerLink[] = [
  { slug: "dinner-for-dogs", shopName: "Dinner for Dogs", domain: "dinner-for-dogs.de", affiliateUrl: "https://t.adcell.com/click.php?bid=355636-66376", category: "ernaehrung" },
  { slug: "rina-snaxperts", shopName: "RINA Snaxperts", domain: "rina-snaxperts.com", affiliateUrl: "https://t.adcell.com/click.php?bid=380143-66376", category: "ernaehrung" },
  { slug: "zoobande", shopName: "Zoobande", domain: "zoobande.de", affiliateUrl: "https://t.adcell.com/click.php?bid=338160-66376", category: "zubehoer" },
  { slug: "mentra", shopName: "mentra", domain: "mentra.de", affiliateUrl: "https://t.adcell.com/click.php?bid=184419-66376", category: "ernaehrung" },
  { slug: "opbody", shopName: "VetMedCare OP-Body", domain: "opbody.de", affiliateUrl: "https://t.adcell.com/click.php?bid=290057-66376", category: "pflege" },
  { slug: "breer-tierbedarf", shopName: "Breer Tierbedarf", domain: "breer-tierbedarf.de", affiliateUrl: "https://t.adcell.com/click.php?bid=562202-66376", category: "zubehoer" },
  { slug: "fitono-dog", shopName: "fitono", domain: "fitono-dog.de", affiliateUrl: "https://t.adcell.com/click.php?bid=217131-66376", category: "ernaehrung" },
  { slug: "hanfred", shopName: "hanfred", domain: "hanfred.at", affiliateUrl: "https://t.adcell.com/click.php?bid=249477-66376&param0=https%3A%2F%2Fhanfred.at%2F", category: "pflege" },
];

/**
 * Extracts the registrable shop domain from an affiliate URL for matching.
 * AdCell deeplinks (t.adcell.com/p/click?...&param0=<urlencoded target>) hide the
 * real shop domain in param0 — the hostname itself is always t.adcell.com.
 * AWIN deeplinks point directly at the shop, so the hostname is already correct.
 */
function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "t.adcell.com" || parsed.hostname.endsWith(".adcell.com")) {
      const target = parsed.searchParams.get("param0");
      if (target) {
        try {
          return new URL(target).hostname.replace(/^www\./, "");
        } catch {
          return null;
        }
      }
      return null;
    }
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Looks up a voucher by matching the product's own affiliateUrl domain against known partner shops. */
export function getVoucherForUrl(affiliateUrl: string | null | undefined): PartnerVoucher | null {
  if (!affiliateUrl) return null;
  const domain = extractDomain(affiliateUrl);
  if (!domain) return null;
  return PARTNER_VOUCHERS.find((v) => domain === v.domain || domain.endsWith(`.${v.domain}`)) ?? null;
}

export interface CombinedSavings {
  /** Summe der exakt berechenbaren Ersparnis in € (nur Items mit price + discountPercent). */
  euroSavings: number;
  /** Anzahl Items mit exakt berechneter Ersparnis. */
  itemsWithExactSavings: number;
  /** Anzahl Items mit Gutschein, aber ohne bekannten %-Satz (z.B. "Rabatt im Shop"). */
  itemsWithVagueDiscount: number;
  /** true wenn mindestens 2 unterschiedliche Shops im Warenkorb einen Gutschein haben — erst dann lohnt der Banner. */
  worthShowing: boolean;
}

/** Aggregates voucher savings across the primary recommendation + its cross-sell companions. */
export function computeCombinedSavings(items: { price: number | null | undefined; affiliateUrl: string | null | undefined }[]): CombinedSavings {
  let euroSavings = 0;
  let itemsWithExactSavings = 0;
  let itemsWithVagueDiscount = 0;
  const shopsWithVoucher = new Set<string>();

  for (const item of items) {
    const voucher = getVoucherForUrl(item.affiliateUrl);
    if (!voucher) continue;
    shopsWithVoucher.add(voucher.domain);
    if (voucher.discountPercent && item.price) {
      euroSavings += item.price * (voucher.discountPercent / 100);
      itemsWithExactSavings++;
    } else {
      itemsWithVagueDiscount++;
    }
  }

  return {
    euroSavings: Math.round(euroSavings * 100) / 100,
    itemsWithExactSavings,
    itemsWithVagueDiscount,
    worthShowing: shopsWithVoucher.size >= 1 && (itemsWithExactSavings + itemsWithVagueDiscount) >= 1,
  };
}
