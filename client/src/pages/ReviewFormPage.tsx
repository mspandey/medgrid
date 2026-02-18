import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { User } from '../App';

interface ReviewFormPageProps {
    user?: User | null;
    logout?: () => void;
}

const ReviewFormPage = ({ user, logout }: ReviewFormPageProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        // Comment is now optional

        if (!user || user.role !== 'user') {
            setError('You must be logged in as a patient to review.'); // Should ideally redirect to login
            return;
        }

        try {
            setSubmitting(true);
            await axios.post('http://localhost:8000/api/reviews/', {
                hospital: id,
                patient: user.id, // Assuming user.id is the patient ID
                rating,
                comment
            });
            navigate(`/hospitals/${id}`);
        } catch (err) {
            console.error(err);
            setError('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <Navbar user={user} logout={logout} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <button onClick={() => navigate(`/hospitals/${id}`)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-8 font-medium">
                    <ArrowLeft size={20} /> Back to Hospital
                </button>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Review</h1>
                    <p className="text-gray-500 mb-8">Share your experience to help others make better health decisions.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Star Rating */}
                        <div className="mb-8 text-center pt-4">
                            <label className="block text-gray-900 font-bold mb-4 uppercase tracking-wide text-sm">Your Rating</label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Star
                                            size={48}
                                            fill={(hover || rating) >= star ? "#fbbf24" : "none"}
                                            className={(hover || rating) >= star ? "text-yellow-400 drop-shadow-sm" : "text-gray-200"}
                                            strokeWidth={1.5}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="mt-2 text-sm font-medium text-gray-400 h-5 transition-opacity">
                                {rating > 0 ? (rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Terrible") : ""}
                            </p>
                        </div>

                        {/* Comment */}
                        <div className="mb-8">
                            <label className="block text-gray-900 font-bold mb-3 uppercase tracking-wide text-sm">Your Experience</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={6}
                                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-orthoGreen focus:ring-2 focus:ring-teal-100 transition text-gray-700 resize-none text-lg"
                                placeholder="Tell us about the staff, facilities, and overall care..."
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-4 rounded-full font-bold text-lg text-white shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 shadow-gray-200'}`}
                        >
                            {submitting ? 'Submitting...' : 'Post Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewFormPage;
