import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, User } from 'lucide-react';

interface Review {
    id: number;
    patient_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewListProps {
    hospitalId: number;
}

const ReviewList = ({ hospitalId }: ReviewListProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [hospitalId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8000/api/reviews/?hospital=${hospitalId}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-gray-400 text-sm py-4">Loading reviews...</div>;

    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No reviews yet. Be the first to share your experience!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3 transition hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                                <User size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{review.patient_name || 'Anonymous Patient'}</h4>
                                <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-200"} />
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed pl-14 opacity-90">
                        {review.comment}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
