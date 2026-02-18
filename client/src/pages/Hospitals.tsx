import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import { User } from '../App';
import ReviewSummary from '../components/ReviewSummary';

interface Department {
    name: string;
    available: number;
    total: number;
}

interface Hospital {
    id: number;
    name: string;
    location: string;
    departments: Department[];
    blood_inventory: { blood_group: string; units: number }[];
    rating?: number;
    totalReviews?: number;
    distribution?: { [key: number]: number };
}

interface HospitalsProps {
    user?: User | null;
    logout?: () => void;
}

const Hospitals = ({ user, logout }: HospitalsProps) => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8000/api/hospitals/`);

            // Add random ratings to each hospital
            const hospitalsWithRatings = res.data.map((h: any) => {
                const rating = 3.5 + Math.random() * 1.5; // Random rating 3.5 - 5.0
                const totalReviews = Math.floor(Math.random() * 500) + 50;

                // Generate distribution based on rating
                // This is a rough approximation to make it look somewhat realistic
                let d5 = Math.floor(Math.random() * 50) + (rating > 4.5 ? 40 : 20);
                let d4 = Math.floor(Math.random() * 30) + 10;
                let d3 = Math.floor(Math.random() * 15);
                let d2 = Math.floor(Math.random() * 5);
                let d1 = Math.floor(Math.random() * 5);

                const total = d5 + d4 + d3 + d2 + d1;
                const normalize = (val: number) => Math.round((val / total) * 100);

                const distribution = {
                    5: normalize(d5),
                    4: normalize(d4),
                    3: normalize(d3),
                    2: normalize(d2),
                    1: normalize(d1)
                };

                // Adjust to ensure sum is 100 (fix rounding errors on largest)
                const sum = Object.values(distribution).reduce((a, b) => a + b, 0);
                if (sum !== 100) distribution[5] += (100 - sum);

                return { ...h, rating, totalReviews, distribution };
            });

            setHospitals(hospitalsWithRatings);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getDept = (h: Hospital, name: string) => {
        return h.departments.find(d => d.name === name) || { available: 0, total: 0 };
    };

    const navigate = useNavigate();

    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar user={user} logout={logout} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Facilities</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Find top-rated hospitals and check real-time bed availability in your area.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto relative mb-12">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-orthoGreen" size={24} />
                    <input
                        type="text"
                        className="w-full pl-16 pr-6 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:border-orthoGreen focus:ring-2 focus:ring-teal-100 transition text-lg"
                        placeholder="Search hospitals by name or location..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading facilities...</div>
                ) : filteredHospitals.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="text-gray-300" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">No Hospitals Found</h3>
                        <p className="text-gray-400 mt-2">Try searching for a different location.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredHospitals.map(h => {
                            const icu = getDept(h, 'ICU');
                            const gen = getDept(h, 'General');
                            const isAvailable = (icu.available + gen.available) > 0;

                            return (
                                <div key={h.id}
                                    onClick={() => navigate(`/hospitals/${h.id}`)}
                                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm cursor-pointer group flex flex-col"
                                >
                                    <div className="p-8 flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="font-bold text-xl text-orthoDark group-hover:text-orthoGreen transition">{h.name}</h3>
                                                <div className="flex items-center gap-1 text-sm text-gray-400 mt-2 font-medium">
                                                    <MapPin size={14} /> {h.location}
                                                </div>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {isAvailable ? 'OPEN' : 'FULL'}
                                            </span>
                                        </div>

                                        <div className="flex gap-4 mb-6">
                                            <div className={`flex-1 p-4 rounded-2xl text-center ${icu.available > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                <div className="text-xs uppercase font-bold opacity-60 mb-2">ICU Beds</div>
                                                <div className="text-2xl font-black">{icu.available} <span className="text-sm font-medium opacity-50">/ {icu.total}</span></div>
                                            </div>
                                            <div className={`flex-1 p-4 rounded-2xl text-center ${gen.available > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                                                <div className="text-xs uppercase font-bold opacity-60 mb-2">General</div>
                                                <div className="text-2xl font-black">{gen.available} <span className="text-sm font-medium opacity-50">/ {gen.total}</span></div>
                                            </div>
                                        </div>

                                        {/* Added Review Summary */}
                                        <div className="pt-6 border-t border-gray-100">
                                            <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">Patient Reviews</h4>
                                            <ReviewSummary
                                                rating={h.rating || 0}
                                                totalReviews={h.totalReviews || 0}
                                                distribution={h.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hospitals;
