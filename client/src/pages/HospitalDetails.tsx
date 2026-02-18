import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Phone, Mail, ArrowLeft, Activity, Heart, Baby, Bed, Star, Stethoscope } from 'lucide-react';
import Navbar from '../components/Navbar';
import { User } from '../App';
import ReviewList from '../components/ReviewList';

interface Department {
    name: string;
    available: number;
    total: number;
}

interface Hospital {
    id: number;
    name: string;
    location: string;
    email?: string;
    phone?: string;
    departments: Department[];
    blood_inventory: { blood_group: string; units: number }[];
}

interface HospitalDetailsProps {
    user?: User | null;
    logout?: () => void;
}

const SECTION_CONFIG: Record<string, { icon: React.ElementType, color: string, label: string }> = {
    'ICU': { icon: Heart, color: 'text-red-500', label: 'ICU' },
    'NICU': { icon: Baby, color: 'text-orange-500', label: 'NICU' },
    'General': { icon: Bed, color: 'text-blue-500', label: 'General Ward' },
    'Women': { icon: Activity, color: 'text-pink-500', label: 'Women / Mat.' },
    'Child': { icon: Baby, color: 'text-yellow-500', label: 'Child Dept.' },
    'Deluxe': { icon: Star, color: 'text-yellow-400', label: 'Deluxe Room' },
    'Emergency': { icon: Activity, color: 'text-red-600', label: 'Emergency' },
    'OT': { icon: Stethoscope, color: 'text-purple-500', label: 'Operation Theatre' },
};

const HospitalDetails = ({ user, logout }: HospitalDetailsProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHospitalDetails();
    }, [id]);

    const fetchHospitalDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8000/api/hospitals/${id}/`);
            setHospital(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (name: string) => {
        const sortedKeys = Object.keys(SECTION_CONFIG).sort((a, b) => b.length - a.length);
        const match = sortedKeys.find(key => name.includes(key));
        return match ? SECTION_CONFIG[match].icon : Activity;
    };

    const getColor = (name: string) => {
        const sortedKeys = Object.keys(SECTION_CONFIG).sort((a, b) => b.length - a.length);
        const match = sortedKeys.find(key => name.includes(key));
        return match ? SECTION_CONFIG[match].color : 'text-gray-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400 animate-pulse">Loading hospital details...</div>
            </div>
        );
    }

    if (!hospital) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-400">Hospital Not Found</h2>
                    <button onClick={() => navigate('/hospitals')} className="mt-4 text-blue-500 underline">
                        Back to Hospitals
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <Navbar user={user} logout={logout} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <button onClick={() => navigate('/hospitals')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-8 font-medium">
                    <ArrowLeft size={20} /> Back to List
                </button>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{hospital.name}</h1>
                        <div className="flex flex-col sm:flex-row gap-4 text-gray-500 text-sm font-medium">
                            <span className="flex items-center gap-2"><MapPin size={16} className="text-orthoGreen" /> {hospital.location}</span>
                            {hospital.phone && <span className="flex items-center gap-2"><Phone size={16} className="text-blue-500" /> {hospital.phone}</span>}
                            {hospital.email && <span className="flex items-center gap-2"><Mail size={16} className="text-purple-500" /> {hospital.email}</span>}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">Verified Facility</span>
                        <button className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition">Contact</button>
                    </div>
                </div>

                {/* Departments Grid */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                        <div className="w-1 h-8 bg-orthoGreen rounded-full"></div>
                        Department Status
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hospital.departments.map((dept, idx) => {
                            const Icon = getIcon(dept.name);
                            const colorClass = getColor(dept.name);
                            const percent = dept.total > 0 ? (dept.available / dept.total) * 100 : 0;
                            const borderColor = colorClass.replace('text-', 'border-');

                            return (
                                <div key={idx} className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-t-4 hover:shadow-lg transition-all duration-300 group`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-3 rounded-xl bg-gray-50 ${colorClass}`}>
                                            <Icon size={28} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Available</p>
                                            <p className={`text-4xl font-black ${dept.available === 0 ? 'text-red-500' : 'text-gray-900'}`}>
                                                {dept.available}
                                            </p>
                                            <p className="text-xs text-gray-400 font-medium mt-1">of {dept.total} beds</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-700 mb-3 group-hover:text-gray-900 transition">{dept.name}</h3>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${dept.available < 5 ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Blood Inventory */}
                {hospital.blood_inventory && hospital.blood_inventory.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                            <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                            Blood Bank Inventory
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {hospital.blood_inventory.map((blood, idx) => (
                                <div key={idx} className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-[150px]">
                                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-black text-sm border border-red-100">
                                        {blood.blood_group}
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{blood.units}</div>
                                        <div className="text-xs text-gray-400 uppercase font-bold">Units</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Patient Reviews Section */}
                <div className="mt-16 pt-16 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <div className="w-1 h-8 bg-yellow-400 rounded-full"></div>
                            Patient Reviews
                        </h2>
                        <button
                            onClick={() => navigate(`/hospitals/${id}/review`)}
                            className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200 flex items-center gap-2"
                        >
                            <Star size={18} className="text-yellow-400 fill-yellow-400" /> Write a Review
                        </button>
                    </div>

                    <ReviewList hospitalId={Number(id)} />
                </div>
            </div>
        </div>
    );
};

export default HospitalDetails;
