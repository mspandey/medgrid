import { Star } from 'lucide-react';

interface ReviewSummaryProps {
    rating: number;
    totalReviews: number;
    distribution: { [key: number]: number }; // percentage for each star (1-5)
}

const ReviewSummary = ({ rating, totalReviews, distribution }: ReviewSummaryProps) => {
    return (
        <div className="bg-gray-50 rounded-2xl p-6 mt-6 flex flex-col sm:flex-row items-center gap-8 border border-gray-100">
            {/* Left: Big Rating */}
            <div className="text-center sm:text-left">
                <div className="text-5xl font-black text-gray-900 leading-none">{rating.toFixed(1)}</div>
                <div className="flex items-center justify-center sm:justify-start gap-1 my-2 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={20} fill="currentColor" strokeWidth={0} />
                    ))}
                </div>
                <div className="text-sm text-gray-500 font-medium">{totalReviews} reviews</div>
                <div className="text-xs text-gray-400 mt-1">out of 5</div>
            </div>

            {/* Right: Progress Bars */}
            <div className="flex-1 w-full space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3 text-sm">
                        <span className="w-10 text-gray-600 font-bold whitespace-nowrap">{star} star</span>
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${distribution[star]}%` }}
                            ></div>
                        </div>
                        <span className="w-8 text-right text-gray-400 text-xs">{distribution[star]}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSummary;
