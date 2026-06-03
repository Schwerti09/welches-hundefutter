import { RecommendationResult } from "../types";

interface RecommendationCardProps {
  recommendation: RecommendationResult;
  onAffiliateClick: (productId: string, offerId: string) => void;
}

export default function RecommendationCard({ recommendation, onAffiliateClick }: RecommendationCardProps) {
  const { products, confidence } = recommendation;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Empfehlungen für dich</h3>
        <div className="text-sm text-gray-600">
          Konfidenz: {Math.round(confidence)}%
        </div>
      </div>

      <div className="space-y-4">
        {products.map((item, index) => (
          <div key={`${item.product.id}-${item.offer.id}`} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-lg font-semibold">{item.product.brand} {item.product.name}</div>
                <div className="text-sm text-gray-600">{item.offer.provider} - €{item.offer.monthlyPrice}/Monat</div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                #{index + 1}
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              {item.offer.dataVolume} • {item.offer.contractDuration} Monate
            </div>

            <div className="mb-3">
              <div className="text-sm font-medium mb-1">Warum diese Empfehlung:</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {item.reasons.slice(0, 3).map((reason, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{reason.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onAffiliateClick(item.product.id, item.offer.id)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Jetzt bei {item.offer.provider} bestellen
            </button>
          </div>
        ))}
      </div>

      {recommendation.nextQuestion && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">{recommendation.nextQuestion}</p>
        </div>
      )}
    </div>
  );
}
