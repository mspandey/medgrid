import { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../App';

interface StaffPortalProps {
    user: User;
}

interface Department {
    avail: number;
    total: number;
}

interface HospitalData {
    _id: string;
    name: string;
    departments: {
        [key: string]: Department;
    };
    blood: Record<string, number>;
}

const StaffPortal = ({ user }: StaffPortalProps) => {
    const [hospital, setHospital] = useState<HospitalData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/hospitals?search=${user.name}`);
            const myHosp = res.data.find((h: HospitalData) => h._id === user.id) || res.data[0];
            setHospital(myHosp);
        } catch (err) {
            console.error(err);
        }
    };

    const updateInventory = async (updates: Partial<HospitalData>) => {
        if (!hospital) return;
        try {
            setHospital(prev => prev ? ({ ...prev, ...updates }) : null);
            await axios.put(`http://localhost:5000/api/hospitals/${hospital._id}/inventory`, updates);
        } catch (err) {
            console.error(err);
            alert('Update Failed');
            fetchData();
        }
    };

    const handleBedUpdate = (dept: string, type: 'avail' | 'total', val: number) => {
        if (!hospital) return;
        const newDepts = { ...hospital.departments };
        if (newDepts[dept]) {
            newDepts[dept] = { ...newDepts[dept], [type]: Math.max(0, newDepts[dept][type] + val) };
            updateInventory({ departments: newDepts });
        }
    };

    const handleBloodUpdate = (type: string, val: number) => {
        if (!hospital) return;
        const newBlood = { ...hospital.blood };
        newBlood[type] = Math.max(0, newBlood[type] + val);
        updateInventory({ blood: newBlood });
    };

    if (!hospital) return <div className="p-10 text-center">Loading Portal...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="font-bold text-lg text-orthoDark flex items-center gap-2">
                    <span className="bg-orthoGreen text-white text-xs px-2 py-1 rounded">STAFF</span>
                    {hospital.name}
                </div>
                <button onClick={() => {
                    // Ideally clear user state here too via props, but reload works for quick migration
                    window.location.href = '/';
                }} className="text-sm font-bold text-gray-400 hover:text-red-500 flex items-center gap-2 transition">
                    <LogOut size={16} /> Logout
                </button>
            </nav>

            <div className="flex-1 p-6 max-w-7xl mx-auto w-full mt-6">

                {/* BEDS SECTION */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-orthoDark mb-6 flex items-center gap-2">
                        <span className="bg-orthoGreen w-2 h-6 rounded-full"></span>
                        Bed Management
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['icu', 'general', 'nicu'].map(dept => {
                            const data = hospital.departments[dept] || { avail: 0, total: 0 };
                            return (
                                <div key={dept} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="uppercase font-bold text-gray-400 text-xs tracking-wider">{dept}</h3>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${data.avail > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {data.avail > 0 ? 'AVAILABLE' : 'FULL'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="text-4xl font-black text-orthoDark">{data.avail}</div>
                                        <div className="text-sm font-bold text-gray-300">/ {data.total} Total</div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleBedUpdate(dept, 'avail', -1)} className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 font-bold transition text-lg">-</button>
                                        <button onClick={() => handleBedUpdate(dept, 'avail', 1)} className="flex-1 py-3 bg-green-50 text-green-500 rounded-xl hover:bg-green-100 font-bold transition text-lg">+</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* BLOOD SECTION */}
                <section>
                    <h2 className="text-xl font-bold text-orthoDark mb-6 flex items-center gap-2">
                        <span className="bg-red-500 w-2 h-6 rounded-full"></span>
                        Blood Bank Inventory
                    </h2>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                        {Object.entries(hospital.blood || {}).map(([type, units]) => (
                            <div key={type} className="flex flex-col items-center p-4 rounded-2xl border border-gray-50 hover:border-gray-200 transition bg-gray-50 hover:bg-white group">
                                <div className="text-lg font-black text-gray-400 mb-2 group-hover:text-orthoDark transition">{type}</div>
                                <div className={`text-3xl font-bold mb-4 ${units < 5 ? 'text-red-500' : 'text-green-600'}`}>{units}</div>
                                <div className="flex w-full gap-2 opacity-50 group-hover:opacity-100 transition">
                                    <button onClick={() => handleBloodUpdate(type, -1)} className="flex-1 py-1 bg-white shadow-sm hover:shadow text-red-500 rounded text-sm font-bold">-</button>
                                    <button onClick={() => handleBloodUpdate(type, 1)} className="flex-1 py-1 bg-white shadow-sm hover:shadow text-green-500 rounded text-sm font-bold">+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default StaffPortal;
