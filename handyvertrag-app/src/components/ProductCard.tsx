import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">{product.brand}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {"★".repeat(Math.floor(product.rating))}
          </div>
          <span className="ml-2 text-gray-600 text-sm">({product.reviews} Reviews)</span>
        </div>
        <div className="space-y-2">
          {product.offers.map((offer) => (
            <div key={offer.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{offer.provider}</span>
                <span className="text-lg font-bold text-green-600">€{offer.monthlyPrice}/Monat</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <span>{offer.dataVolume}</span>
                <span className="mx-2">•</span>
                <span>{offer.contractDuration} Monate</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {offer.features.map((feature) => (
                  <span key={feature} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
              <a
                href={offer.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Jetzt bestellen
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
