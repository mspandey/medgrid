import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import { User } from '../App';

interface Department {
    name: string;
    available: number; // Changed from avail
    total: number;
}

interface Hospital {
    id: number; // Changed from _id
    name: string;
    location: string;
    departments: Department[]; // Changed from object
    blood_inventory: { blood_group: string; units: number }[]; // Changed from Record
    doctors?: { name: string; specialty: string; available: boolean }[];
}

interface DashboardProps {
    user?: User | null;
    logout?: () => void;
}

const Dashboard = ({ user, logout }: DashboardProps) => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async (q: string = '') => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8000/api/hospitals/?search=${q}`);
            setHospitals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        fetchHospitals(e.target.value);
    };

    // Aggregate doctors from all hospitals
    const allDoctors = hospitals.flatMap(h =>
        (h.doctors || []).map(d => ({ ...d, hospitalName: h.name, location: h.location }))
    );

    const getDept = (h: Hospital, name: string) => {
        return h.departments.find(d => d.name === name) || { available: 0, total: 0 };
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <Navbar user={user} logout={logout} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Dashboard Hero / Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-green-800 to-teal-700 text-white shadow-xl mb-12 flex items-center">
                    <div className="p-10 md:w-2/3 z-10">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome{user ? `, ${user.name}` : ' to MedGrid'}</h1>
                        <p className="text-green-50 text-lg md:text-xl max-w-xl">
                            Real-time insights into hospital resources. Search for care, check bed availability, and manage emergencies efficiently.
                        </p>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 hidden md:block">
                        <img
                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                            alt="Doctor"
                            className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-green-900/80"></div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto relative mb-12">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-orthoGreen" size={24} />
                    <input
                        type="text"
                        className="w-full pl-16 pr-6 py-5 rounded-full border border-gray-200 shadow-lg shadow-gray-200/50 focus:outline-none focus:border-orthoGreen focus:ring-2 focus:ring-teal-100 transition text-lg"
                        placeholder="Search hospitals or doctors..."
                        value={search} onChange={handleSearch}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading nearby facilities...</div>
                ) : (
                    <>
                        {/* Section 1: Hospitals */}
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Activity className="text-green-600" /> Registered Hospitals
                            </h2>

                            {hospitals.length === 0 ? (
                                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Activity className="text-gray-300" size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-400">No Hospitals Found</h3>
                                    <p className="text-gray-400 mt-2">There are currently no hospitals registered in your area.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {hospitals.map(h => {
                                        const icu = getDept(h, 'ICU');
                                        const gen = getDept(h, 'General');
                                        const isAvailable = (icu.available + gen.available) > 0;

                                        return (
                                            <div key={h.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm cursor-pointer group">
                                                <div className="p-8">
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

                                                    <div className="flex gap-4 mb-8">
                                                        <div className={`flex-1 p-4 rounded-2xl text-center ${icu.available > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                            <div className="text-xs uppercase font-bold opacity-60 mb-2">ICU Beds</div>
                                                            <div className="text-2xl font-black">{icu.available} <span className="text-sm font-medium opacity-50">/ {icu.total}</span></div>
                                                        </div>
                                                        <div className={`flex-1 p-4 rounded-2xl text-center ${gen.available > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                                                            <div className="text-xs uppercase font-bold opacity-60 mb-2">General</div>
                                                            <div className="text-2xl font-black">{gen.available} <span className="text-sm font-medium opacity-50">/ {gen.total}</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Section 2: Doctors */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Search className="text-blue-600" /> Available Doctors
                            </h2>

                            {allDoctors.length === 0 ? (
                                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="text-gray-300" size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-400">No Doctors Available</h3>
                                    <p className="text-gray-400 mt-2">Doctors will appear here once hospitals add them to the system.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {allDoctors.map((doc, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                                Dr
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-800">{doc.name}</h4>
                                                <p className="text-blue-600 text-sm font-medium">{doc.specialty}</p>
                                                <p className="text-gray-400 text-xs mt-1">{doc.hospitalName}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${doc.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {doc.available ? 'Today' : 'Off'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
