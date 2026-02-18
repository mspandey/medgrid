import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { User } from '../App';

interface Doctor {
    name: string;
    specialty: string;
    available: boolean;
    hospitalName: string;
    location: string;
}

interface Hospital {
    name: string;
    location: string;
    doctors: { name: string; specialty: string; available: boolean }[];
}

interface DoctorsProps {
    user?: User | null;
    logout?: () => void;
}

const Doctors = ({ user, logout }: DoctorsProps) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8000/api/hospitals/');
            const allDocs = res.data.flatMap((h: Hospital) =>
                (h.doctors || []).map(d => ({
                    ...d,
                    hospitalName: h.name,
                    location: h.location
                }))
            );
            setDoctors(allDocs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
        doc.hospitalName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar user={user} logout={logout} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Find a Specialist</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Browse our network of top-rated doctors across all registered hospitals.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto relative mb-12">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-orthoGreen" size={24} />
                    <input
                        type="text"
                        className="w-full pl-16 pr-6 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:border-orthoGreen focus:ring-2 focus:ring-teal-100 transition text-lg"
                        placeholder="Search by name, specialty, or hospital..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading directory...</div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-300" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">No Doctors Found</h3>
                        <p className="text-gray-400 mt-2">Try adjusting your search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDoctors.map((doc, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mb-4 group-hover:scale-110 transition">
                                    {doc.name.charAt(0)}
                                </div>
                                <h3 className="font-bold text-xl text-gray-800 mb-1">{doc.name}</h3>
                                <p className="text-blue-600 font-medium mb-4">{doc.specialty}</p>

                                <div className="w-full border-t border-gray-50 pt-4 mt-auto">
                                    <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mb-3">
                                        <MapPin size={14} /> {doc.hospitalName}
                                    </div>
                                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${doc.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {doc.available ? 'AVAILABLE TODAY' : 'UNAVAILABLE'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Doctors;
