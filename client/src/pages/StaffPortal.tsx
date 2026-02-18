import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Activity, Droplets, User as UserIcon, LogOut, Clock,
    Phone, Edit2, Save, X, QrCode, Building, Plus, Siren
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../App';
import StaffChat from '../components/StaffChat';

interface StaffPortalProps {
    user: User;
    logout?: () => void;
}

const StaffPortal = ({ user, logout }: StaffPortalProps) => {
    const [hospital, setHospital] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'beds' | 'doctors'>('dashboard');
    const [editingDoc, setEditingDoc] = useState<any>(null);
    const [isAddingDoc, setIsAddingDoc] = useState(false);
    const [isAddingBed, setIsAddingBed] = useState(false);

    // Form States for adding new items
    const [newDoc, setNewDoc] = useState({ name: '', specialty: '', phone: '', shift_timings: '' });
    const [newBed, setNewBed] = useState({ bed_code: '', department_name: 'General' });

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [user]);

    const [activeEmergencies, setActiveEmergencies] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/hospitals/${user.id}/`);
            setHospital(res.data);

            // Also fetch active emergencies
            const emRes = await axios.get(`http://localhost:8000/api/emergencies/?hospital=${user.id}&status=Enroute`);
            setActiveEmergencies(emRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (hospital) {
                axios.get(`http://localhost:8000/api/emergencies/?hospital=${hospital.id}&status=Enroute`)
                    .then(res => setActiveEmergencies(res.data))
                    .catch(err => console.error("Emergency poll failed", err));
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [hospital]);

    const handleUpdate = async (updates: any) => {
        if (!hospital) return;
        try {
            const res = await axios.patch(`http://localhost:8000/api/hospitals/${hospital.id}/`, updates);
            setHospital(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleBed = async (bedId: number) => {
        try {
            await axios.post(`http://localhost:8000/api/beds/${bedId}/toggle`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (!hospital) return <div className="p-10 text-center font-bold text-gray-500">Loading MediGrid Staff Portal...</div>;

    const renderProfileForm = () => (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-black text-orthoDark mb-8">Hospital Profile Registration</h1>
            <div className="space-y-10">
                <section>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-orthoGreen">
                        <Building size={20} /> 1. Basic Hospital Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400">Hospital Name</label>
                            <input className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:border-orthoGreen outline-none transition" defaultValue={hospital.name} onBlur={(e) => handleUpdate({ name: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400">Hospital ID</label>
                            <input className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:border-orthoGreen outline-none transition" defaultValue={hospital.hospital_id_code} onBlur={(e) => handleUpdate({ hospital_id_code: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400">Contact Number</label>
                            <input className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:border-orthoGreen outline-none transition" defaultValue={hospital.phone} onBlur={(e) => handleUpdate({ phone: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400">Email</label>
                            <input className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:border-orthoGreen outline-none transition" defaultValue={hospital.email} disabled />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold text-gray-400">Address</label>
                            <textarea className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:border-orthoGreen outline-none transition" defaultValue={hospital.full_address} onBlur={(e) => handleUpdate({ full_address: e.target.value })} />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-500">
                        <Clock size={20} /> 2. Operating Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400">Opening Time</label>
                            <input type="time" className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:border-amber-500 outline-none transition" defaultValue={hospital.opening_time} onBlur={(e) => handleUpdate({ opening_time: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400">Closing Time</label>
                            <input type="time" className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:border-amber-500 outline-none transition" defaultValue={hospital.closing_time} onBlur={(e) => handleUpdate({ closing_time: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => handleUpdate({ is_24_7: !hospital.is_24_7 })} className={`flex-1 py-3 rounded-xl font-bold transition ${hospital.is_24_7 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                24/7 Emergency {hospital.is_24_7 ? 'YES' : 'NO'}
                            </button>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-500">
                        <Activity size={20} /> 3. Treatment / Specialties
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Gynecology', 'Emergency Care', 'ICU Care', 'NICU', 'Oncology', 'General Medicine'].map(sp => {
                            const isSelected = (hospital.specialties || '').includes(sp);
                            return (
                                <button key={sp} onClick={() => {
                                    const current = (hospital.specialties || '').split(',').map((x: string) => x.trim()).filter((x: string) => x);
                                    const next = isSelected ? current.filter((x: string) => x !== sp) : [...current, sp];
                                    handleUpdate({ specialties: next.join(',') });
                                }} className={`p-3 rounded-xl border text-sm font-bold transition flex items-center gap-2 ${isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-100 text-gray-400'}`}>
                                    <input type="checkbox" checked={isSelected} readOnly />
                                    {sp}
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );

    const renderBeds = () => (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black text-orthoDark">Bed & QR Management</h1>
                <button onClick={() => setIsAddingBed(true)} className="bg-orthoGreen text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-green-100 hover:scale-[1.02] transition active:scale-95">
                    <Plus size={20} /> ADD NEW BED
                </button>
            </div>

            {(hospital.beds || []).length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                    <QrCode size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-400 font-bold">No beds registered yet. Click "Add New Bed" to start.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(hospital.beds || []).map((bed: any) => (
                        <div key={bed.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                                <QrCode size={120} className="text-orthoDark" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">{bed.bed_code}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{bed.department_name}</p>
                            <button onClick={() => toggleBed(bed.id)} className={`w-full py-4 rounded-2xl font-black transition text-lg ${bed.is_available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {bed.is_available ? 'AVAILABLE' : 'OCCUPIED'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isAddingBed && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-orthoDark">Add New Bed</h2>
                            <button onClick={() => setIsAddingBed(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Bed Code (e.g. ICU-101)</label>
                                <input type="text" value={newBed.bed_code} onChange={(e) => setNewBed({ ...newBed, bed_code: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-orthoDark focus:ring-2 focus:ring-orthoGreen/20 transition" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Department</label>
                                <select value={newBed.department_name} onChange={(e) => setNewBed({ ...newBed, department_name: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-orthoDark focus:ring-2 focus:ring-orthoGreen/20 transition">
                                    <option>General</option>
                                    <option>ICU</option>
                                    <option>NICU</option>
                                    <option>Pediatrics</option>
                                    <option>Emergency</option>
                                </select>
                            </div>
                            <button onClick={() => {
                                handleUpdate({ beds: [newBed] }).then(() => {
                                    setIsAddingBed(false);
                                    setNewBed({ bed_code: '', department_name: 'General' });
                                });
                            }} className="w-full bg-orthoGreen text-white font-black py-4 rounded-2xl shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                                <Plus size={18} /> CREATE BED
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderDoctors = () => {
        const doctors = hospital.doctors || [];
        const onShift = doctors.filter((d: any) => d.on_shift);
        const onCall = doctors.filter((d: any) => d.on_call);

        return (
            <div className="space-y-12">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-black text-orthoDark">Staff Management</h1>
                    <button onClick={() => setIsAddingDoc(true)} className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-purple-100 hover:scale-[1.02] transition active:scale-95">
                        <Plus size={20} /> ADD NEW DOCTOR
                    </button>
                </div>

                {doctors.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                        <UserIcon size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400 font-bold">No doctors registered yet. Click "Add New Doctor" to start.</p>
                    </div>
                ) : (
                    <>
                        <section>
                            <h2 className="text-xl font-black text-orthoDark mb-8 flex items-center gap-3">
                                <div className="w-3 h-8 bg-purple-600 rounded-full"></div>
                                Doctors On-Shift
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {doctors.map((doc: any) => (
                                    <div key={doc.id} className={`bg-white p-6 rounded-3xl shadow-sm border transition flex flex-col items-center text-center relative group ${doc.on_shift ? 'border-purple-500 shadow-md ring-2 ring-purple-100' : 'border-gray-100'}`}>
                                        <button onClick={() => setEditingDoc(doc)} className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-orthoGreen rounded-full transition opacity-0 group-hover:opacity-100">
                                            <Edit2 size={14} />
                                        </button>
                                        <div className={`w-20 h-20 ${doc.on_shift ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'} rounded-full flex items-center justify-center mb-4 text-2xl font-bold transition`}>
                                            {doc.name.charAt(0)}
                                        </div>
                                        <h3 className="font-bold text-orthoDark text-lg mb-1">{doc.name}</h3>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{doc.specialty}</p>
                                        {doc.shift_timings && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 mb-4 px-3 py-1 bg-gray-50 rounded-full">
                                                <Clock size={10} /> {doc.shift_timings}
                                            </div>
                                        )}
                                        <button onClick={() => axios.post(`http://localhost:8000/api/doctors/${doc.id}/toggle`, { type: 'shift' }).then(fetchData)} className={`px-6 py-2 rounded-full text-xs font-black transition ${doc.on_shift ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-purple-100 hover:text-purple-600'}`}>
                                            {doc.on_shift ? 'ON SHIFT' : 'MARK ON SHIFT'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-orthoDark mb-8 flex items-center gap-3">
                                <div className="w-3 h-8 bg-amber-500 rounded-full"></div>
                                Doctors On-Call (Emergency)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {doctors.map((doc: any) => (
                                    <div key={doc.id} className={`bg-white p-6 rounded-3xl shadow-sm border transition flex flex-col items-center text-center relative group ${doc.on_call ? 'border-amber-500 shadow-md ring-2 ring-amber-100' : 'border-gray-100'}`}>
                                        <button onClick={() => setEditingDoc(doc)} className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-orthoGreen rounded-full transition opacity-0 group-hover:opacity-100">
                                            <Edit2 size={14} />
                                        </button>
                                        <div className={`w-20 h-20 ${doc.on_call ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'} rounded-full flex items-center justify-center mb-4 text-2xl font-bold transition`}>
                                            {doc.name.charAt(0)}
                                        </div>
                                        <h3 className="font-bold text-orthoDark text-lg mb-1">{doc.name}</h3>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{doc.specialty}</p>
                                        <div className="space-y-2 mb-4">
                                            {doc.phone && (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 px-3 py-1 bg-amber-50 rounded-full">
                                                    <Phone size={10} /> {doc.phone}
                                                </div>
                                            )}
                                            {doc.shift_timings && (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 px-3 py-1 bg-gray-50 rounded-full">
                                                    <Clock size={10} /> {doc.shift_timings}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => axios.post(`http://localhost:8000/api/doctors/${doc.id}/toggle`, { type: 'call' }).then(fetchData)} className={`px-6 py-2 rounded-full text-xs font-black transition ${doc.on_call ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-amber-100 hover:text-amber-600'}`}>
                                            {doc.on_call ? 'ON CALL' : 'MARK ON CALL'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {/* Edit Doctor Modal */}
                {editingDoc && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                        <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl anim-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-orthoDark">Edit Doctor Info</h2>
                                <button onClick={() => setEditingDoc(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Specialty</label>
                                    <input type="text" value={editingDoc.specialty} onChange={(e) => setEditingDoc({ ...editingDoc, specialty: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-orthoDark focus:ring-2 focus:ring-orthoGreen/20 transition" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Shift Timings</label>
                                    <input type="text" value={editingDoc.shift_timings || ''} onChange={(e) => setEditingDoc({ ...editingDoc, shift_timings: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-orthoDark focus:ring-2 focus:ring-orthoGreen/20 transition" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Contact Number</label>
                                    <input type="text" value={editingDoc.phone || ''} onChange={(e) => setEditingDoc({ ...editingDoc, phone: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-orthoDark focus:ring-2 focus:ring-orthoGreen/20 transition" />
                                </div>
                                <button onClick={() => {
                                    handleUpdate({
                                        doctors: [{
                                            id: editingDoc.id,
                                            specialty: editingDoc.specialty,
                                            phone: editingDoc.phone,
                                            shift_timings: editingDoc.shift_timings
                                        }]
                                    }).then(() => { fetchData(); setEditingDoc(null); });
                                }} className="w-full bg-orthoGreen text-white font-black py-4 rounded-2xl shadow-lg shadow-green-100 hover:scale-[1.02] transition active:scale-95 flex items-center justify-center gap-2">
                                    <Save size={18} /> SAVE CHANGES
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Doctor Modal */}
                {isAddingDoc && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                        <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-orthoDark">Register New Doctor</h2>
                                <button onClick={() => setIsAddingDoc(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Full Name</label>
                                    <input type="text" value={newDoc.name} onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-orthoDark focus:ring-2 focus:ring-orthoGreen/20 transition" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Specialty</label>
                                    <input type="text" value={newDoc.specialty} onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-orthoDark focus:ring-2 focus:ring-orthoGreen/20 transition" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Phone Number</label>
                                    <input type="text" value={newDoc.phone} onChange={(e) => setNewDoc({ ...newDoc, phone: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-orthoDark focus:ring-2 focus:ring-orthoGreen/20 transition" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Shift Timings (Optional)</label>
                                    <input type="text" value={newDoc.shift_timings} onChange={(e) => setNewDoc({ ...newDoc, shift_timings: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-orthoDark focus:ring-2 focus:ring-orthoGreen/20 transition" placeholder="e.g. 09:00 AM - 05:00 PM" />
                                </div>
                                <button onClick={() => {
                                    handleUpdate({ doctors: [newDoc] }).then(() => {
                                        setIsAddingDoc(false);
                                        setNewDoc({ name: '', specialty: '', phone: '', shift_timings: '' });
                                    });
                                }} className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-100 flex items-center justify-center gap-2">
                                    <Plus size={18} /> REGISTER DOCTOR
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="font-bold text-lg text-orthoDark flex items-center gap-2">
                    <span className="bg-orthoGreen text-white text-xs px-2 py-1 rounded">STAFF</span>
                    {hospital.name}
                </div>
                <div className="hidden md:flex gap-4">
                    <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 font-bold text-sm rounded-xl transition ${activeTab === 'dashboard' ? 'bg-gray-100 text-orthoGreen' : 'text-gray-400'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 font-bold text-sm rounded-xl transition ${activeTab === 'profile' ? 'bg-gray-100 text-orthoGreen' : 'text-gray-400'}`}>Profile</button>
                    <button onClick={() => setActiveTab('beds')} className={`px-4 py-2 font-bold text-sm rounded-xl transition ${activeTab === 'beds' ? 'bg-gray-100 text-orthoGreen' : 'text-gray-400'}`}>Beds & QR</button>
                    <button onClick={() => setActiveTab('doctors')} className={`px-4 py-2 font-bold text-sm rounded-xl transition ${activeTab === 'doctors' ? 'bg-gray-100 text-orthoGreen' : 'text-gray-400'}`}>Shift</button>
                </div>
                <button onClick={() => { if (logout) logout(); navigate('/'); }} className="text-sm font-bold text-gray-400 hover:text-red-500 flex items-center gap-2 transition">
                    <LogOut size={16} /> Logout
                </button>
            </nav>

            <div className="flex-1 p-6 max-w-7xl mx-auto w-full mt-6">
                {activeEmergencies.length > 0 && (
                    <div className="mb-8 space-y-4">
                        {activeEmergencies.map((em: any) => (
                            <div key={em.id} className="bg-red-50 border-2 border-red-500 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse shadow-xl shadow-red-100">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-red-600 text-white rounded-full"><Siren size={32} /></div>
                                    <div>
                                        <div className="text-red-500 font-bold tracking-widest text-xs uppercase mb-1">Incoming Emergency</div>
                                        <div className="text-2xl font-black text-orthoDark">{em.patient_name}</div>
                                        <div className="text-red-600 font-bold text-sm">{em.patient_condition} • {em.severity}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 text-center">
                                    <div>
                                        <div className="text-gray-400 font-bold text-xs uppercase mb-1">Distance</div>
                                        <div className="text-3xl font-black text-orthoDark">{em.distance_km} <span className="text-xs">KM</span></div>
                                    </div>
                                    <div className="w-px h-10 bg-red-200"></div>
                                    <div>
                                        <div className="text-gray-400 font-bold text-xs uppercase mb-1">ETA</div>
                                        <div className="text-3xl font-black text-red-600">{em.eta_minutes} <span className="text-xs">MIN</span></div>
                                    </div>
                                    <button onClick={() => axios.patch(`http://localhost:8000/api/emergencies/${em.id}/`, { status: 'Arrived' }).then(fetchData)} className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-red-700 transition shadow-lg shadow-red-200">
                                        CONFIRM ARRIVAL
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'dashboard' && (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                                <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><Activity size={32} /></div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Beds Avail</div>
                                    <div className="text-3xl font-black text-orthoDark">{(hospital.departments || []).reduce((acc: number, d: any) => acc + d.available, 0)}</div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><Droplets size={32} /></div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Blood Units</div>
                                    <div className="text-3xl font-black text-orthoDark">{(hospital.blood_inventory || []).reduce((acc: number, b: any) => acc + b.units, 0)}</div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                                <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><UserIcon size={32} /></div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Staff</div>
                                    <div className="flex gap-4">
                                        <div>
                                            <div className="text-2xl font-black text-orthoDark">{(hospital.doctors || []).filter((d: any) => d.on_shift).length}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase">Shift</div>
                                        </div>
                                        <div className="w-px h-8 bg-gray-100"></div>
                                        <div>
                                            <div className="text-2xl font-black text-amber-500">{(hospital.doctors || []).filter((d: any) => d.on_call).length}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase">Call</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* BED MANAGEMENT */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-100">
                                <h3 className="text-lg font-bold mb-6">Bed Toggles</h3>
                                <div className="space-y-4">
                                    {(hospital.departments || []).map((dept: any) => (
                                        <div key={dept.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                            <span className="font-bold text-gray-600 uppercase text-xs">{dept.name}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-black text-orthoDark">{dept.available}/{dept.total}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => axios.patch(`http://localhost:8000/api/hospitals/${hospital.id}/`, { departments: hospital.departments.map((d: any) => d.id === dept.id ? { ...d, available: Math.max(0, d.available - 1) } : d) }).then(fetchData)} className="p-2 bg-white rounded-lg shadow-sm font-bold">-</button>
                                                    <button onClick={() => axios.patch(`http://localhost:8000/api/hospitals/${hospital.id}/`, { departments: hospital.departments.map((d: any) => d.id === dept.id ? { ...d, available: Math.min(d.total, d.available + 1) } : d) }).then(fetchData)} className="p-2 bg-white rounded-lg shadow-sm font-bold">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BLOOD INVENTORY */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-100">
                                <h3 className="text-lg font-bold mb-6">Blood Units</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {(hospital.blood_inventory || []).map((b: any) => (
                                        <div key={b.blood_group} className="p-4 bg-red-50 rounded-2xl flex flex-col items-center">
                                            <span className="font-black text-red-700 text-lg">{b.blood_group}</span>
                                            <span className="text-2xl font-black text-red-900">{b.units}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-gray-100">
                                <h3 className="text-lg font-bold mb-6">Staff Status</h3>
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                    {(hospital.doctors || []).filter((d: any) => d.on_shift || d.on_call).map((doc: any) => (
                                        <div key={doc.id} className={`flex items-center justify-between p-3 rounded-2xl border ${doc.on_call ? 'border-amber-100 bg-amber-50/30' : 'border-purple-100 bg-purple-50/30'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 ${doc.on_call ? 'bg-amber-200 text-amber-700' : 'bg-purple-200 text-purple-700'} rounded-full flex items-center justify-center font-bold text-xs`}>{doc.name.charAt(0)}</div>
                                                <div>
                                                    <div className="text-sm font-bold text-orthoDark">{doc.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase">{doc.specialty}</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1">
                                                    {doc.on_shift && <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>}
                                                    {doc.on_call && <div className="w-2 h-2 bg-amber-500 rounded-full"></div>}
                                                </div>
                                                {doc.on_call && doc.phone && (
                                                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                                        {doc.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <StaffChat />
                        </div>
                    </div>
                )}
                {activeTab === 'profile' && renderProfileForm()}
                {activeTab === 'beds' && renderBeds()}
                {activeTab === 'doctors' && renderDoctors()}
            </div>
        </div>
    );
};

export default StaffPortal;
