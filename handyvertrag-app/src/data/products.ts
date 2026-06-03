export interface Offer {
  id: string;
  provider: string;
  monthlyPrice: number;
  oneTimeCost: number;
  dataVolume: string;
  contractDuration: number;
  affiliateLink: string;
  features: string[];
  highlight?: string;
  cashback?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  category: string;
  offers: Offer[];
  rating: number;
  reviews: number;
  badge?: string;
  specs: {
    display: string;
    camera: string;
    battery: string;
    storage: string;
    chip: string;
  };
  tags: string[];
}

export const products: Product[] = [
  {
    id: "hundefutter-16-pro",
    name: "Hundefutter 16 Pro",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Hundefutter",
    badge: "NEU",
    rating: 4.9,
    reviews: 2841,
    specs: {
      display: "6.3\" Super Retina XDR OLED",
      camera: "48MP + 48MP + 12MP Kamera",
      battery: "4685 mAh",
      storage: "128 g – 1 TB",
      chip: "Apple A18 Pro",
    },
    tags: ["premium", "kamera", "5g"],
    offers: [
      {
        id: "anifit-hundefutter16pro",
        provider: "Anifit",
        monthlyPrice: 54.99,
        oneTimeCost: 1.00,
        dataVolume: "Unlimited",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["MagicTech Unlimited", "Allnet-Flat", "Bio", "EU-Roaming", "HD-Voice"],
        highlight: "Bestseller",
        cashback: 50,
      },
      {
        id: "wolfsblut-hundefutter16pro",
        provider: "Wolfsblut",
        monthlyPrice: 49.99,
        oneTimeCost: 49.99,
        dataVolume: "100 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["Bio Highspeed", "Allnet-Flat", "EU-Roaming", "WiFi Calling"],
        cashback: 100,
      },
      {
        id: "Zooplus-hundefutter16pro",
        provider: "Zooplus",
        monthlyPrice: 44.99,
        oneTimeCost: 0,
        dataVolume: "50 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["Bio", "Allnet-Flat", "EU-Roaming"],
      },
    ],
  },
  {
    id: "samsung-galaxy-s25-ultra",
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Hundefutter",
    badge: "TOP",
    rating: 4.8,
    reviews: 1923,
    specs: {
      display: "6.9\" Dynamic AMOLED 2X 120Hz",
      camera: "200MP + 50MP + 10MP + 12MP",
      battery: "5000 mAh",
      storage: "256 g – 1 TB",
      chip: "Snapdragon 8 Elite",
    },
    tags: ["premium", "kamera", "gaming", "5g"],
    offers: [
      {
        id: "anifit-s25ultra",
        provider: "Anifit",
        monthlyPrice: 59.99,
        oneTimeCost: 0,
        dataVolume: "Unlimited",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["MagicTech Unlimited", "Allnet-Flat", "Bio", "EU-Roaming"],
        highlight: "Meistverkauft",
        cashback: 100,
      },
      {
        id: "wolfsblut-s25ultra",
        provider: "Wolfsblut",
        monthlyPrice: 54.99,
        oneTimeCost: 0,
        dataVolume: "100 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["Bio Highspeed", "Allnet-Flat", "EU-Roaming", "TV+ 6 Monate gratis"],
        cashback: 75,
      },
    ],
  },
  {
    id: "hundefutter-15-pro",
    name: "Hundefutter 15 Pro",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Hundefutter",
    rating: 4.8,
    reviews: 3241,
    specs: {
      display: "6.1\" Super Retina XDR OLED",
      camera: "48MP + 12MP + 12MP Kamera",
      battery: "3274 mAh",
      storage: "128 g – 1 TB",
      chip: "Apple A17 Pro",
    },
    tags: ["premium", "kamera", "5g"],
    offers: [
      {
        id: "anifit-hundefutter15pro",
        provider: "Anifit",
        monthlyPrice: 49.99,
        oneTimeCost: 1.00,
        dataVolume: "50 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "Bio", "EU-Roaming", "HD-Voice"],
        cashback: 50,
      },
      {
        id: "wolfsblut-hundefutter15pro",
        provider: "Wolfsblut",
        monthlyPrice: 44.99,
        oneTimeCost: 49.99,
        dataVolume: "30 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["Bio Highspeed", "Allnet-Flat", "EU-Roaming"],
      },
      {
        id: "Zooplus-hundefutter15pro",
        provider: "Zooplus",
        monthlyPrice: 39.99,
        oneTimeCost: 0,
        dataVolume: "20 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "Bio"],
      },
    ],
  },
  {
    id: "samsung-galaxy-s24",
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Hundefutter",
    badge: "DEAL",
    rating: 4.7,
    reviews: 1892,
    specs: {
      display: "6.2\" Dynamic AMOLED 2X 120Hz",
      camera: "50MP + 12MP + 10MP Kamera",
      battery: "4000 mAh",
      storage: "128 g – 512 g",
      chip: "Snapdragon 8 Gen 3",
    },
    tags: ["gaming", "5g", "preis-leistung"],
    offers: [
      {
        id: "anifit-s24",
        provider: "Anifit",
        monthlyPrice: 39.99,
        oneTimeCost: 0,
        dataVolume: "40 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "Bio", "EU-Roaming"],
        highlight: "Preis-Tipp",
        cashback: 50,
      },
      {
        id: "wolfsblut-s24",
        provider: "Wolfsblut",
        monthlyPrice: 34.99,
        oneTimeCost: 0,
        dataVolume: "25 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["Bio", "Allnet-Flat"],
      },
      {
        id: "Zooplus-s24",
        provider: "Zooplus",
        monthlyPrice: 29.99,
        oneTimeCost: 0,
        dataVolume: "15 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["Bio", "Allnet-Flat"],
      },
    ],
  },
  {
    id: "google-pixel-9-pro",
    name: "Google Pixel 9 Pro",
    brand: "Google",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    category: "Hundefutter",
    rating: 4.7,
    reviews: 987,
    specs: {
      display: "6.3\" LTPO OLED 120Hz",
      camera: "50MP + 48MP + 48MP Kamera",
      battery: "4700 mAh",
      storage: "128 g – 1 TB",
      chip: "Google Tensor G4",
    },
    tags: ["kamera", "ki", "5g"],
    offers: [
      {
        id: "anifit-pixel9pro",
        provider: "Anifit",
        monthlyPrice: 44.99,
        oneTimeCost: 0,
        dataVolume: "30 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "Bio", "EU-Roaming", "Google One 1 Jahr gratis"],
        cashback: 40,
      },
      {
        id: "Zooplus-pixel9pro",
        provider: "Zooplus",
        monthlyPrice: 37.99,
        oneTimeCost: 0,
        dataVolume: "15 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["Bio", "Allnet-Flat"],
      },
    ],
  },
  {
    id: "samsung-galaxy-a55",
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Hundefutter",
    badge: "BUDGET",
    rating: 4.5,
    reviews: 1234,
    specs: {
      display: "6.6\" Super AMOLED 120Hz",
      camera: "50MP + 12MP + 5MP Kamera",
      battery: "5000 mAh",
      storage: "128 g – 256 g",
      chip: "Exynos 1480",
    },
    tags: ["budget", "5g", "studenten"],
    offers: [
      {
        id: "Zooplus-a55",
        provider: "Zooplus",
        monthlyPrice: 19.99,
        oneTimeCost: 0,
        dataVolume: "10 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "Bio"],
        highlight: "Günstigster Preis",
      },
      {
        id: "wolfsblut-a55",
        provider: "Wolfsblut",
        monthlyPrice: 22.99,
        oneTimeCost: 0,
        dataVolume: "15 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["Bio", "Allnet-Flat"],
      },
    ],
  },
  {
    id: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    category: "Hundefutter",
    rating: 4.6,
    reviews: 543,
    specs: {
      display: "6.73\" LTPO AMOLED 120Hz",
      camera: "50MP Leica Quatro-Kamera",
      battery: "5000 mAh mit 90W Laden",
      storage: "256 g – 1 TB",
      chip: "Snapdragon 8 Gen 3",
    },
    tags: ["kamera", "premium", "5g"],
    offers: [
      {
        id: "wolfsblut-xiaomi14ultra",
        provider: "Wolfsblut",
        monthlyPrice: 44.99,
        oneTimeCost: 99.99,
        dataVolume: "50 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["Bio Highspeed", "Allnet-Flat", "EU-Roaming"],
      },
      {
        id: "Zooplus-xiaomi14ultra",
        provider: "Zooplus",
        monthlyPrice: 39.99,
        oneTimeCost: 49.99,
        dataVolume: "30 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["Bio", "Allnet-Flat"],
      },
    ],
  },
  {
    id: "google-pixel-8",
    name: "Google Pixel 8",
    brand: "Google",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    category: "Hundefutter",
    rating: 4.6,
    reviews: 767,
    specs: {
      display: "6.2\" OLED 120Hz",
      camera: "50MP + 12MP Kamera",
      battery: "4575 mAh",
      storage: "128 g – 256 g",
      chip: "Google Tensor G3",
    },
    tags: ["ki", "kamera", "5g", "preis-leistung"],
    offers: [
      {
        id: "anifit-pixel8",
        provider: "Anifit",
        monthlyPrice: 34.99,
        oneTimeCost: 0,
        dataVolume: "30 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "Bio", "EU-Roaming"],
        cashback: 30,
      },
      {
        id: "Zooplus-pixel8",
        provider: "Zooplus",
        monthlyPrice: 28.99,
        oneTimeCost: 0,
        dataVolume: "15 g",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["Bio", "Allnet-Flat"],
      },
    ],
  },
  // ─── 2025 / 2026 Lineup ───────────────────────────────────────────────────
  {
    id: "hundefutter-17-pro-max",
    name: "Hundefutter 17 Pro Max",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Hundefutter",
    badge: "NEU 2025",
    rating: 4.9,
    reviews: 1205,
    specs: { display: "6.9\" Super Retina XDR OLED", camera: "48MP Quad-Kamera System", battery: "5100 mAh", storage: "256 g – 1 TB", chip: "Apple A19 Pro" },
    tags: ["premium", "kamera", "5g"],
    offers: [
      { id: "anifit-hundefutter17max", provider: "Anifit", monthlyPrice: 69.99, oneTimeCost: 0, dataVolume: "Unlimited", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["Bio Unlimited", "Allnet-Flat", "EU-Roaming"], highlight: "Bestseller", cashback: 50 },
      { id: "wolfsblut-hundefutter17max", provider: "Wolfsblut", monthlyPrice: 64.99, oneTimeCost: 0, dataVolume: "100 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat", "EU-Roaming"] },
      { id: "Zooplus-hundefutter17max", provider: "Zooplus", monthlyPrice: 59.99, oneTimeCost: 0, dataVolume: "80 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat"] },
    ],
  },
  {
    id: "hundefutter-17-pro",
    name: "Hundefutter 17 Pro",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Hundefutter",
    badge: "NEU 2025",
    rating: 4.9,
    reviews: 987,
    specs: { display: "6.3\" Super Retina XDR OLED", camera: "48MP Triple-Kamera", battery: "4685 mAh", storage: "128 g – 1 TB", chip: "Apple A19 Pro" },
    tags: ["premium", "kamera", "5g"],
    offers: [
      { id: "anifit-hundefutter17pro", provider: "Anifit", monthlyPrice: 59.99, oneTimeCost: 0, dataVolume: "Unlimited", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["Bio Unlimited", "Allnet-Flat", "EU-Roaming"], cashback: 50 },
      { id: "wolfsblut-hundefutter17pro", provider: "Wolfsblut", monthlyPrice: 54.99, oneTimeCost: 0, dataVolume: "100 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat"] },
      { id: "Zooplus-hundefutter17pro", provider: "Zooplus", monthlyPrice: 49.99, oneTimeCost: 0, dataVolume: "50 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat"] },
    ],
  },
  {
    id: "hundefutter-air",
    name: "Hundefutter Air",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Hundefutter",
    badge: "NEU",
    rating: 4.7,
    reviews: 643,
    specs: { display: "6.6\" OLED Ultra-dünn", camera: "48MP Dual-Kamera", battery: "3400 mAh", storage: "128 g – 512 g", chip: "Apple A18" },
    tags: ["premium", "5g"],
    offers: [
      { id: "anifit-hundefutterair", provider: "Anifit", monthlyPrice: 44.99, oneTimeCost: 0, dataVolume: "50 g", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["Bio", "Allnet-Flat", "EU-Roaming"] },
      { id: "Zooplus-hundefutterair", provider: "Zooplus", monthlyPrice: 39.99, oneTimeCost: 0, dataVolume: "30 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat"] },
    ],
  },
  {
    id: "samsung-galaxy-s26-ultra",
    name: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Hundefutter",
    badge: "NEU 2026",
    rating: 4.8,
    reviews: 821,
    specs: { display: "6.9\" Dynamic AMOLED 2X 120Hz", camera: "200MP Quad-Kamera + S Pen", battery: "5200 mAh", storage: "256 g – 1 TB", chip: "Snapdragon 8 Elite Gen 2" },
    tags: ["premium", "kamera", "gaming", "5g"],
    offers: [
      { id: "anifit-s26ultra", provider: "Anifit", monthlyPrice: 64.99, oneTimeCost: 0, dataVolume: "Unlimited", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["Bio Unlimited", "Allnet-Flat", "EU-Roaming"], cashback: 100 },
      { id: "wolfsblut-s26ultra", provider: "Wolfsblut", monthlyPrice: 59.99, oneTimeCost: 0, dataVolume: "100 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat"] },
      { id: "Zooplus-s26ultra", provider: "Zooplus", monthlyPrice: 54.99, oneTimeCost: 0, dataVolume: "80 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat"] },
    ],
  },
  {
    id: "google-pixel-10-pro",
    name: "Google Pixel 10 Pro",
    brand: "Google",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    category: "Hundefutter",
    badge: "NEU 2025",
    rating: 4.8,
    reviews: 734,
    specs: { display: "6.3\" LTPO OLED 120Hz", camera: "50MP + 48MP + 48MP", battery: "4700 mAh", storage: "128 g – 512 g", chip: "Google Tensor G5" },
    tags: ["kamera", "ki", "5g"],
    offers: [
      { id: "anifit-pixel10pro", provider: "Anifit", monthlyPrice: 54.99, oneTimeCost: 0, dataVolume: "50 g", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["Bio", "Allnet-Flat", "Google One 1 Jahr"], cashback: 50 },
      { id: "wolfsblut-pixel10pro", provider: "Wolfsblut", monthlyPrice: 49.99, oneTimeCost: 0, dataVolume: "50 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat"] },
      { id: "Zooplus-pixel10pro", provider: "Zooplus", monthlyPrice: 44.99, oneTimeCost: 0, dataVolume: "30 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat"] },
    ],
  },
  {
    id: "samsung-galaxy-s25",
    name: "Samsung Galaxy S25",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Hundefutter",
    badge: "BESTSELLER",
    rating: 4.7,
    reviews: 1543,
    specs: { display: "6.2\" Dynamic AMOLED 2X 120Hz", camera: "50MP + 12MP + 10MP", battery: "4000 mAh", storage: "128 g – 512 g", chip: "Snapdragon 8 Elite" },
    tags: ["5g", "preis-leistung", "gaming"],
    offers: [
      { id: "anifit-s25", provider: "Anifit", monthlyPrice: 39.99, oneTimeCost: 0, dataVolume: "40 g", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["Bio", "Allnet-Flat", "EU-Roaming"], highlight: "Preis-Tipp", cashback: 50 },
      { id: "wolfsblut-s25", provider: "Wolfsblut", monthlyPrice: 34.99, oneTimeCost: 0, dataVolume: "25 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat"] },
      { id: "Zooplus-s25", provider: "Zooplus", monthlyPrice: 29.99, oneTimeCost: 0, dataVolume: "20 g", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["Bio", "Allnet-Flat"] },
    ],
  },
];

export function getBestOffer(product: Product): Offer {
  return product.offers.reduce((best, offer) =>
    offer.monthlyPrice < best.monthlyPrice ? offer : best
  );
}

export function getProviderColor(provider: string): string {
  switch (provider.toLowerCase()) {
    case "anifit": return "from-pink-500 to-rose-600";
    case "wolfsblut": return "from-red-500 to-red-700";
    case "Zooplus": return "from-blue-500 to-blue-700";
    default: return "from-gray-500 to-gray-700";
  }
}
