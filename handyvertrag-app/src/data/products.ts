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
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Smartphone",
    badge: "NEU",
    rating: 4.9,
    reviews: 2841,
    specs: {
      display: "6.3\" Super Retina XDR OLED",
      camera: "48MP + 48MP + 12MP Kamera",
      battery: "4685 mAh",
      storage: "128 GB – 1 TB",
      chip: "Apple A18 Pro",
    },
    tags: ["premium", "kamera", "5g"],
    offers: [
      {
        id: "telekom-iphone16pro",
        provider: "Telekom",
        monthlyPrice: 54.99,
        oneTimeCost: 1.00,
        dataVolume: "Unlimited",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["MagicTech Unlimited", "Allnet-Flat", "5G", "EU-Roaming", "HD-Voice"],
        highlight: "Bestseller",
        cashback: 50,
      },
      {
        id: "vodafone-iphone16pro",
        provider: "Vodafone",
        monthlyPrice: 49.99,
        oneTimeCost: 49.99,
        dataVolume: "100 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["5G Highspeed", "Allnet-Flat", "EU-Roaming", "WiFi Calling"],
        cashback: 100,
      },
      {
        id: "o2-iphone16pro",
        provider: "o2",
        monthlyPrice: 44.99,
        oneTimeCost: 0,
        dataVolume: "50 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["5G", "Allnet-Flat", "EU-Roaming"],
      },
    ],
  },
  {
    id: "samsung-galaxy-s25-ultra",
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Smartphone",
    badge: "TOP",
    rating: 4.8,
    reviews: 1923,
    specs: {
      display: "6.9\" Dynamic AMOLED 2X 120Hz",
      camera: "200MP + 50MP + 10MP + 12MP",
      battery: "5000 mAh",
      storage: "256 GB – 1 TB",
      chip: "Snapdragon 8 Elite",
    },
    tags: ["premium", "kamera", "gaming", "5g"],
    offers: [
      {
        id: "telekom-s25ultra",
        provider: "Telekom",
        monthlyPrice: 59.99,
        oneTimeCost: 0,
        dataVolume: "Unlimited",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["MagicTech Unlimited", "Allnet-Flat", "5G", "EU-Roaming"],
        highlight: "Meistverkauft",
        cashback: 100,
      },
      {
        id: "vodafone-s25ultra",
        provider: "Vodafone",
        monthlyPrice: 54.99,
        oneTimeCost: 0,
        dataVolume: "100 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["5G Highspeed", "Allnet-Flat", "EU-Roaming", "TV+ 6 Monate gratis"],
        cashback: 75,
      },
    ],
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Smartphone",
    rating: 4.8,
    reviews: 3241,
    specs: {
      display: "6.1\" Super Retina XDR OLED",
      camera: "48MP + 12MP + 12MP Kamera",
      battery: "3274 mAh",
      storage: "128 GB – 1 TB",
      chip: "Apple A17 Pro",
    },
    tags: ["premium", "kamera", "5g"],
    offers: [
      {
        id: "telekom-iphone15pro",
        provider: "Telekom",
        monthlyPrice: 49.99,
        oneTimeCost: 1.00,
        dataVolume: "50 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "5G", "EU-Roaming", "HD-Voice"],
        cashback: 50,
      },
      {
        id: "vodafone-iphone15pro",
        provider: "Vodafone",
        monthlyPrice: 44.99,
        oneTimeCost: 49.99,
        dataVolume: "30 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["5G Highspeed", "Allnet-Flat", "EU-Roaming"],
      },
      {
        id: "o2-iphone15pro",
        provider: "o2",
        monthlyPrice: 39.99,
        oneTimeCost: 0,
        dataVolume: "20 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "5G"],
      },
    ],
  },
  {
    id: "samsung-galaxy-s24",
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Smartphone",
    badge: "DEAL",
    rating: 4.7,
    reviews: 1892,
    specs: {
      display: "6.2\" Dynamic AMOLED 2X 120Hz",
      camera: "50MP + 12MP + 10MP Kamera",
      battery: "4000 mAh",
      storage: "128 GB – 512 GB",
      chip: "Snapdragon 8 Gen 3",
    },
    tags: ["gaming", "5g", "preis-leistung"],
    offers: [
      {
        id: "telekom-s24",
        provider: "Telekom",
        monthlyPrice: 39.99,
        oneTimeCost: 0,
        dataVolume: "40 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "5G", "EU-Roaming"],
        highlight: "Preis-Tipp",
        cashback: 50,
      },
      {
        id: "vodafone-s24",
        provider: "Vodafone",
        monthlyPrice: 34.99,
        oneTimeCost: 0,
        dataVolume: "25 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["5G", "Allnet-Flat"],
      },
      {
        id: "o2-s24",
        provider: "o2",
        monthlyPrice: 29.99,
        oneTimeCost: 0,
        dataVolume: "15 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["5G", "Allnet-Flat"],
      },
    ],
  },
  {
    id: "google-pixel-9-pro",
    name: "Google Pixel 9 Pro",
    brand: "Google",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    category: "Smartphone",
    rating: 4.7,
    reviews: 987,
    specs: {
      display: "6.3\" LTPO OLED 120Hz",
      camera: "50MP + 48MP + 48MP Kamera",
      battery: "4700 mAh",
      storage: "128 GB – 1 TB",
      chip: "Google Tensor G4",
    },
    tags: ["kamera", "ki", "5g"],
    offers: [
      {
        id: "telekom-pixel9pro",
        provider: "Telekom",
        monthlyPrice: 44.99,
        oneTimeCost: 0,
        dataVolume: "30 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "5G", "EU-Roaming", "Google One 1 Jahr gratis"],
        cashback: 40,
      },
      {
        id: "o2-pixel9pro",
        provider: "o2",
        monthlyPrice: 37.99,
        oneTimeCost: 0,
        dataVolume: "15 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["5G", "Allnet-Flat"],
      },
    ],
  },
  {
    id: "samsung-galaxy-a55",
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Smartphone",
    badge: "BUDGET",
    rating: 4.5,
    reviews: 1234,
    specs: {
      display: "6.6\" Super AMOLED 120Hz",
      camera: "50MP + 12MP + 5MP Kamera",
      battery: "5000 mAh",
      storage: "128 GB – 256 GB",
      chip: "Exynos 1480",
    },
    tags: ["budget", "5g", "studenten"],
    offers: [
      {
        id: "o2-a55",
        provider: "o2",
        monthlyPrice: 19.99,
        oneTimeCost: 0,
        dataVolume: "10 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "5G"],
        highlight: "Günstigster Preis",
      },
      {
        id: "vodafone-a55",
        provider: "Vodafone",
        monthlyPrice: 22.99,
        oneTimeCost: 0,
        dataVolume: "15 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["5G", "Allnet-Flat"],
      },
    ],
  },
  {
    id: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    category: "Smartphone",
    rating: 4.6,
    reviews: 543,
    specs: {
      display: "6.73\" LTPO AMOLED 120Hz",
      camera: "50MP Leica Quatro-Kamera",
      battery: "5000 mAh mit 90W Laden",
      storage: "256 GB – 1 TB",
      chip: "Snapdragon 8 Gen 3",
    },
    tags: ["kamera", "premium", "5g"],
    offers: [
      {
        id: "vodafone-xiaomi14ultra",
        provider: "Vodafone",
        monthlyPrice: 44.99,
        oneTimeCost: 99.99,
        dataVolume: "50 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID",
        features: ["5G Highspeed", "Allnet-Flat", "EU-Roaming"],
      },
      {
        id: "o2-xiaomi14ultra",
        provider: "o2",
        monthlyPrice: 39.99,
        oneTimeCost: 49.99,
        dataVolume: "30 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["5G", "Allnet-Flat"],
      },
    ],
  },
  {
    id: "google-pixel-8",
    name: "Google Pixel 8",
    brand: "Google",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    category: "Smartphone",
    rating: 4.6,
    reviews: 767,
    specs: {
      display: "6.2\" OLED 120Hz",
      camera: "50MP + 12MP Kamera",
      battery: "4575 mAh",
      storage: "128 GB – 256 GB",
      chip: "Google Tensor G3",
    },
    tags: ["ki", "kamera", "5g", "preis-leistung"],
    offers: [
      {
        id: "telekom-pixel8",
        provider: "Telekom",
        monthlyPrice: 34.99,
        oneTimeCost: 0,
        dataVolume: "30 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14777&awinaffid=YOUR_ID",
        features: ["Allnet-Flat", "5G", "EU-Roaming"],
        cashback: 30,
      },
      {
        id: "o2-pixel8",
        provider: "o2",
        monthlyPrice: 28.99,
        oneTimeCost: 0,
        dataVolume: "15 GB",
        contractDuration: 24,
        affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID",
        features: ["5G", "Allnet-Flat"],
      },
    ],
  },
  // ─── 2025 / 2026 Lineup ───────────────────────────────────────────────────
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Smartphone",
    badge: "NEU 2025",
    rating: 4.9,
    reviews: 1205,
    specs: { display: "6.9\" Super Retina XDR OLED", camera: "48MP Quad-Kamera System", battery: "5100 mAh", storage: "256 GB – 1 TB", chip: "Apple A19 Pro" },
    tags: ["premium", "kamera", "5g"],
    offers: [
      { id: "telekom-iphone17max", provider: "Telekom", monthlyPrice: 69.99, oneTimeCost: 0, dataVolume: "Unlimited", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["5G Unlimited", "Allnet-Flat", "EU-Roaming"], highlight: "Bestseller", cashback: 50 },
      { id: "vodafone-iphone17max", provider: "Vodafone", monthlyPrice: 64.99, oneTimeCost: 0, dataVolume: "100 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat", "EU-Roaming"] },
      { id: "o2-iphone17max", provider: "o2", monthlyPrice: 59.99, oneTimeCost: 0, dataVolume: "80 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat"] },
    ],
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Smartphone",
    badge: "NEU 2025",
    rating: 4.9,
    reviews: 987,
    specs: { display: "6.3\" Super Retina XDR OLED", camera: "48MP Triple-Kamera", battery: "4685 mAh", storage: "128 GB – 1 TB", chip: "Apple A19 Pro" },
    tags: ["premium", "kamera", "5g"],
    offers: [
      { id: "telekom-iphone17pro", provider: "Telekom", monthlyPrice: 59.99, oneTimeCost: 0, dataVolume: "Unlimited", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["5G Unlimited", "Allnet-Flat", "EU-Roaming"], cashback: 50 },
      { id: "vodafone-iphone17pro", provider: "Vodafone", monthlyPrice: 54.99, oneTimeCost: 0, dataVolume: "100 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat"] },
      { id: "o2-iphone17pro", provider: "o2", monthlyPrice: 49.99, oneTimeCost: 0, dataVolume: "50 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat"] },
    ],
  },
  {
    id: "iphone-air",
    name: "iPhone Air",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Smartphone",
    badge: "NEU",
    rating: 4.7,
    reviews: 643,
    specs: { display: "6.6\" OLED Ultra-dünn", camera: "48MP Dual-Kamera", battery: "3400 mAh", storage: "128 GB – 512 GB", chip: "Apple A18" },
    tags: ["premium", "5g"],
    offers: [
      { id: "telekom-iphoneair", provider: "Telekom", monthlyPrice: 44.99, oneTimeCost: 0, dataVolume: "50 GB", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["5G", "Allnet-Flat", "EU-Roaming"] },
      { id: "o2-iphoneair", provider: "o2", monthlyPrice: 39.99, oneTimeCost: 0, dataVolume: "30 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat"] },
    ],
  },
  {
    id: "samsung-galaxy-s26-ultra",
    name: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Smartphone",
    badge: "NEU 2026",
    rating: 4.8,
    reviews: 821,
    specs: { display: "6.9\" Dynamic AMOLED 2X 120Hz", camera: "200MP Quad-Kamera + S Pen", battery: "5200 mAh", storage: "256 GB – 1 TB", chip: "Snapdragon 8 Elite Gen 2" },
    tags: ["premium", "kamera", "gaming", "5g"],
    offers: [
      { id: "telekom-s26ultra", provider: "Telekom", monthlyPrice: 64.99, oneTimeCost: 0, dataVolume: "Unlimited", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["5G Unlimited", "Allnet-Flat", "EU-Roaming"], cashback: 100 },
      { id: "vodafone-s26ultra", provider: "Vodafone", monthlyPrice: 59.99, oneTimeCost: 0, dataVolume: "100 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat"] },
      { id: "o2-s26ultra", provider: "o2", monthlyPrice: 54.99, oneTimeCost: 0, dataVolume: "80 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat"] },
    ],
  },
  {
    id: "google-pixel-10-pro",
    name: "Google Pixel 10 Pro",
    brand: "Google",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    category: "Smartphone",
    badge: "NEU 2025",
    rating: 4.8,
    reviews: 734,
    specs: { display: "6.3\" LTPO OLED 120Hz", camera: "50MP + 48MP + 48MP", battery: "4700 mAh", storage: "128 GB – 512 GB", chip: "Google Tensor G5" },
    tags: ["kamera", "ki", "5g"],
    offers: [
      { id: "telekom-pixel10pro", provider: "Telekom", monthlyPrice: 54.99, oneTimeCost: 0, dataVolume: "50 GB", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["5G", "Allnet-Flat", "Google One 1 Jahr"], cashback: 50 },
      { id: "vodafone-pixel10pro", provider: "Vodafone", monthlyPrice: 49.99, oneTimeCost: 0, dataVolume: "50 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat"] },
      { id: "o2-pixel10pro", provider: "o2", monthlyPrice: 44.99, oneTimeCost: 0, dataVolume: "30 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat"] },
    ],
  },
  {
    id: "samsung-galaxy-s25",
    name: "Samsung Galaxy S25",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Smartphone",
    badge: "BESTSELLER",
    rating: 4.7,
    reviews: 1543,
    specs: { display: "6.2\" Dynamic AMOLED 2X 120Hz", camera: "50MP + 12MP + 10MP", battery: "4000 mAh", storage: "128 GB – 512 GB", chip: "Snapdragon 8 Elite" },
    tags: ["5g", "preis-leistung", "gaming"],
    offers: [
      { id: "telekom-s25", provider: "Telekom", monthlyPrice: 39.99, oneTimeCost: 0, dataVolume: "40 GB", contractDuration: 24, affiliateLink: "https://www.communicationads.net/tc.php?t=19811C13424057T", features: ["5G", "Allnet-Flat", "EU-Roaming"], highlight: "Preis-Tipp", cashback: 50 },
      { id: "vodafone-s25", provider: "Vodafone", monthlyPrice: 34.99, oneTimeCost: 0, dataVolume: "25 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14778&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat"] },
      { id: "o2-s25", provider: "o2", monthlyPrice: 29.99, oneTimeCost: 0, dataVolume: "20 GB", contractDuration: 24, affiliateLink: "https://www.awin1.com/cread.php?awinmid=14779&awinaffid=YOUR_ID", features: ["5G", "Allnet-Flat"] },
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
    case "telekom": return "from-pink-500 to-rose-600";
    case "vodafone": return "from-red-500 to-red-700";
    case "o2": return "from-blue-500 to-blue-700";
    default: return "from-gray-500 to-gray-700";
  }
}
