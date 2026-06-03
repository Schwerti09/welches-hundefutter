"use client";

import { useState } from "react";

interface CityOfferCardProps {
  offer: {
    id: number;
    city: string;
    device: string;
    image: string;
    provider: string;
    monthlyPrice: number;
    oneTimeCost: number;
    dataVolume: string;
    contractDuration: number;
    features: string[];
    stores: number;
    affiliateLink: string;
    affiliateNetwork: string;
    trackingId: string;
    bonus: string;
    rating: number;
    inStock: boolean;
  };
}

function CityOfferCard({ offer }: CityOfferCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    // Affiliate tracking click event would go here
    window.open(offer.affiliateLink, '_blank');
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'anifit':
        return 'from-pink-500 to-rose-600';
      case 'wolfsblut':
        return 'from-red-500 to-red-700';
      case 'Zooplus':
        return 'from-blue-500 to-blue-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-gray-100 ${
        isHovered ? 'ring-4 ring-blue-500/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Provider Badge */}
      <div className={`bg-gradient-to-r ${getProviderColor(offer.provider)} text-white px-4 py-2 text-sm font-semibold`}>
        {offer.provider}
      </div>

      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={offer.image}
          alt={offer.device}
          className="w-full h-full object-contain"
        />
        {offer.bonus && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {offer.bonus}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.device}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(offer.rating))}
          </div>
          <span className="text-gray-600 text-sm">{offer.rating}/5</span>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">€{offer.monthlyPrice.toFixed(2)}</span>
            <span className="text-gray-600">/Monat</span>
          </div>
          {offer.oneTimeCost > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              Einmalkosten: €{offer.oneTimeCost.toFixed(2)}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {offer.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500">✓</span>
              {feature}
            </div>
          ))}
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <span className="text-2xl">📍</span>
          <span>Bei {offer.stores} Stores in {offer.city}</span>
        </div>

        {/* Affiliate Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
            {offer.affiliateNetwork}
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded-full text-xs text-blue-600">
            ID: {offer.trackingId}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleClick}
          disabled={isClicked}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 ${
            isClicked
              ? 'bg-green-500 text-white cursor-not-allowed'
              : `bg-gradient-to-r ${getProviderColor(offer.provider)} text-white hover:shadow-lg`
          }`}
        >
          {isClicked ? '✓ Weitergeleitet' : '→ Jetzt buchen'}
        </button>

        {/* Stock Status */}
        {!offer.inStock && (
          <div className="mt-3 text-center text-red-500 text-sm font-semibold">
            ⚠️ Derzeit nicht verfügbar
          </div>
        )}
      </div>
    </div>
  );
}

export default CityOfferCard;
