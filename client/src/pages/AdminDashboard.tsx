import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Shield, LogOut, Hospital, Users, Ambulance, Star,
    Droplets, BarChart3, Trash2, RefreshCw, Search,
} from 'lucide-react';
import { API_URL } from '../config';

const BASE_URL = API_URL;
const ADMIN_HEADER = { 'X-Admin-Key': 'medgrid_admin_secret' };

type Tab = 'overview' | 'hospitals' | 'patients' | 'ambulances' | 'reviews' | 'donors';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // Data states
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [ambulances, setAmbulances] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [donors, setDonors] = useState<any[]>([]);

    // Auth guard
    useEffect(() => {
        if (sessionStorage.getItem('admin_session') !== 'true') {
            navigate('/admin');
        }
    }, [navigate]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [hRes, pRes, rRes] = await Promise.all([
                axios.get(`${BASE_URL}/hospitals/`),
                axios.get(`${BASE_URL}/patients/`),
                axios.get(`${BASE_URL}/reviews/`),
            ]);
            setHospitals(Array.isArray(hRes.data) ? hRes.data : hRes.data.results || []);
            setPatients(Array.isArray(pRes.data) ? pRes.data : pRes.data.results || []);
            setReviews(Array.isArray(rRes.data) ? rRes.data : rRes.data.results || []);
        } catch (e) {
            console.error('Admin fetch error:', e);
        }

        // Fetch ambulances from admin stats

        // Fetch donors from admin stats
        try {
            const dRes = await axios.get(`${BASE_URL}/admin/stats`, { headers: ADMIN_HEADER });
            if (dRes.data?.donors) setDonors(dRes.data.donors);
            if (dRes.data?.ambulances) setAmbulances(dRes.data.ambulances);
        } catch (e) { /* skip */ }

        setLoading(false);
    };

    useEffect(() => {
        if (sessionStorage.getItem('admin_session') === 'true') {
            fetchAll();
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('admin_session');
        sessionStorage.removeItem('admin_login_time');
        navigate('/admin');
    };

    const deleteHospital = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this hospital?')) return;
        try {
            await axios.delete(`${BASE_URL}/hospitals/${id}/`);
            setHospitals(hospitals.filter(h => h.id !== id));
        } catch (e: any) {
            alert('Delete failed: ' + (e.response?.data?.detail || e.message));
        }
    };

    const deleteReview = async (id: number) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await axios.delete(`${BASE_URL}/reviews/${id}/`);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (e: any) {
            alert('Delete failed: ' + (e.response?.data?.detail || e.message));
        }
    };

    const deletePatient = async (id: number) => {
        if (!window.confirm('Delete this patient account?')) return;
        try {
            await axios.delete(`${BASE_URL}/patients/${id}/`);
            setPatients(patients.filter(p => p.id !== id));
        } catch (e: any) {
            alert('Delete failed: ' + (e.response?.data?.detail || e.message));
        }
    };

    const filtered = <T extends Record<string, any>>(arr: T[], keys: string[]): T[] => {
        if (!search.trim()) return arr;
        return arr.filter(item =>
            keys.some(k => String(item[k] || '').toLowerCase().includes(search.toLowerCase()))
        );
    };

    const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
        { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
        { id: 'hospitals', label: 'Hospitals', icon: <Hospital size={16} />, count: hospitals.length },
        { id: 'patients', label: 'Patients', icon: <Users size={16} />, count: patients.length },
        { id: 'ambulances', label: 'Ambulances', icon: <Ambulance size={16} />, count: ambulances.length },
        { id: 'reviews', label: 'Reviews', icon: <Star size={16} />, count: reviews.length },
        { id: 'donors', label: 'Blood Donors', icon: <Droplets size={16} />, count: donors.length },
    ];

    const loginTime = sessionStorage.getItem('admin_login_time');
    const loginAgo = loginTime ? Math.floor((Date.now() - parseInt(loginTime)) / 60000) : 0;

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans">
            {/* Top nav */}
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-700 rounded-xl flex items-center justify-center">
                        <Shield size={18} className="text-white" />
                    </div>
                    <div>
                        <span className="font-black text-white text-lg">MedGrid</span>
                        <span className="text-red-500 font-bold text-lg"> Admin</span>
                    </div>
                    <span className="hidden md:block ml-2 bg-red-950 border border-red-800 text-red-400 text-xs px-2.5 py-1 rounded-full font-bold">RESTRICTED</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-xs hidden md:block">
                        Session: {loginAgo}m ago
                    </span>
                    <button
                        onClick={fetchAll}
                        disabled={loading}
                        className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-gray-800"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-red-900 border border-gray-700 hover:border-red-700 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                    >
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            </header>

            <div className="flex min-h-[calc(100vh-65px)]">
                {/* Sidebar */}
                <aside className="w-56 bg-gray-900 border-r border-gray-800 p-4 hidden md:flex flex-col gap-1 sticky top-16 h-[calc(100vh-65px)] overflow-y-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left
                                ${activeTab === tab.id
                                    ? 'bg-red-700/20 text-red-400 border border-red-800/50'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                        >
                            <span className="flex items-center gap-2.5">{tab.icon}{tab.label}</span>
                            {tab.count !== undefined && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-500'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6">

                    {/* Mobile tab selector */}
                    <div className="md:hidden mb-4">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearch(''); }}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex-shrink-0 transition
                                        ${activeTab === tab.id ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                    {tab.icon}{tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div>
                            <h2 className="text-2xl font-black mb-6">System Overview</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                                {[
                                    { label: 'Hospitals', value: hospitals.length, icon: <Hospital size={20} />, color: 'blue' },
                                    { label: 'Patients', value: patients.length, icon: <Users size={20} />, color: 'green' },
                                    { label: 'Ambulances', value: ambulances.length, icon: <Ambulance size={20} />, color: 'orange' },
                                    { label: 'Reviews', value: reviews.length, icon: <Star size={20} />, color: 'yellow' },
                                    { label: 'Donors', value: donors.length, icon: <Droplets size={20} />, color: 'red' },
                                ].map(s => (
                                    <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                                        <div className="text-gray-400 mb-3">{s.icon}</div>
                                        <div className="text-3xl font-black text-white">{loading ? '...' : s.value}</div>
                                        <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Recent Hospitals */}
                                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                                    <h3 className="font-bold text-gray-300 mb-4 flex items-center gap-2"><Hospital size={16} /> Recent Hospitals</h3>
                                    <div className="space-y-2">
                                        {hospitals.slice(0, 5).map(h => (
                                            <div key={h.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                                                <div>
                                                    <p className="text-sm font-semibold text-white truncate">{h.name}</p>
                                                    <p className="text-xs text-gray-500">{h.location}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${h.is_operational ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'}`}>
                                                    {h.is_operational ? 'Active' : 'Offline'}
                                                </span>
                                            </div>
                                        ))}
                                        {hospitals.length === 0 && <p className="text-gray-600 text-sm">No hospitals loaded.</p>}
                                    </div>
                                </div>

                                {/* Recent Reviews */}
                                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                                    <h3 className="font-bold text-gray-300 mb-4 flex items-center gap-2"><Star size={16} /> Recent Reviews</h3>
                                    <div className="space-y-2">
                                        {reviews.slice(0, 5).map(r => (
                                            <div key={r.id} className="py-2 border-b border-gray-800 last:border-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-white">{r.patient_name || 'Patient'}</p>
                                                    <span className="text-yellow-400 text-xs font-bold">{'★'.repeat(r.rating || 0)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">{r.comment || ''}</p>
                                            </div>
                                        ))}
                                        {reviews.length === 0 && <p className="text-gray-600 text-sm">No reviews loaded.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HOSPITALS */}
                    {activeTab === 'hospitals' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black">Hospitals <span className="text-gray-600 font-normal text-lg">({hospitals.length})</span></h2>
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input type="text" placeholder="Search hospitals..." value={search} onChange={e => setSearch(e.target.value)}
                                        className="bg-gray-800 border border-gray-700 text-white text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 w-56" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                {filtered(hospitals, ['name', 'location', 'email']).map(h => (
                                    <div key={h.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 flex items-start justify-between gap-4 transition">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-white">{h.name}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${h.is_operational ? 'bg-green-950 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                                                    {h.is_operational ? '● Active' : '○ Offline'}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm mt-1">{h.location}</p>
                                            <div className="flex gap-4 mt-2 text-xs text-gray-600">
                                                <span>{h.email}</span>
                                                {h.phone && <span>{h.phone}</span>}
                                                {h.beds?.length !== undefined && <span>{h.beds?.length || 0} beds</span>}
                                                {h.doctors?.length !== undefined && <span>{h.doctors?.length || 0} doctors</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-gray-600 text-xs font-mono">#{h.id}</span>
                                            <button onClick={() => deleteHospital(h.id)}
                                                className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-950 rounded-lg transition">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {filtered(hospitals, ['name', 'location', 'email']).length === 0 && (
                                    <div className="text-center py-12 text-gray-600">
                                        <Hospital size={40} className="mx-auto mb-3 opacity-30" />
                                        <p>No hospitals found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PATIENTS */}
                    {activeTab === 'patients' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black">Patients <span className="text-gray-600 font-normal text-lg">({patients.length})</span></h2>
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input type="text" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)}
                                        className="bg-gray-800 border border-gray-700 text-white text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 w-56" />
                                </div>
                            </div>
                            <div className="overflow-x-auto rounded-2xl border border-gray-800">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                                        <tr>
                                            <th className="px-5 py-3 text-left">ID</th>
                                            <th className="px-5 py-3 text-left">Name</th>
                                            <th className="px-5 py-3 text-left">Email</th>
                                            <th className="px-5 py-3 text-left">Phone</th>
                                            <th className="px-5 py-3 text-left">Blood</th>
                                            <th className="px-5 py-3 text-left">Age</th>
                                            <th className="px-5 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered(patients, ['name', 'email', 'phone', 'blood_group']).map((p, i) => (
                                            <tr key={p.id} className={`border-t border-gray-800 hover:bg-gray-800/50 transition ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/50'}`}>
                                                <td className="px-5 py-3 text-gray-600 font-mono">#{p.id}</td>
                                                <td className="px-5 py-3 font-semibold text-white">{p.name}</td>
                                                <td className="px-5 py-3 text-gray-400">{p.email}</td>
                                                <td className="px-5 py-3 text-gray-400">{p.phone || '—'}</td>
                                                <td className="px-5 py-3">
                                                    <span className="bg-red-950 text-red-400 px-2 py-0.5 rounded-full text-xs font-bold">{p.blood_group || '—'}</span>
                                                </td>
                                                <td className="px-5 py-3 text-gray-400">{p.age || '—'}</td>
                                                <td className="px-5 py-3">
                                                    <button onClick={() => deletePatient(p.id)} className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-950 rounded-lg transition">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filtered(patients, ['name', 'email', 'phone', 'blood_group']).length === 0 && (
                                    <div className="text-center py-12 text-gray-600 bg-gray-900">
                                        <Users size={40} className="mx-auto mb-3 opacity-30" />
                                        <p>No patients found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* AMBULANCES */}
                    {activeTab === 'ambulances' && (
                        <div>
                            <h2 className="text-2xl font-black mb-6">Ambulances <span className="text-gray-600 font-normal text-lg">({ambulances.length})</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {ambulances.map((a: any) => (
                                    <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-mono text-gray-400 text-sm font-bold">{a.vehicle_number}</span>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${a.status === 'Available' ? 'bg-green-950 text-green-400' : a.status === 'Busy' ? 'bg-orange-950 text-orange-400' : 'bg-gray-800 text-gray-500'}`}>
                                                {a.status || 'Unknown'}
                                            </span>
                                        </div>
                                        <p className="font-bold text-white">{a.driver_name}</p>
                                        <p className="text-gray-500 text-sm">{a.email}</p>
                                        {a.phone && <p className="text-gray-500 text-sm">{a.phone}</p>}
                                    </div>
                                ))}
                                {ambulances.length === 0 && (
                                    <div className="col-span-3 text-center py-12 text-gray-600">
                                        <Ambulance size={40} className="mx-auto mb-3 opacity-30" />
                                        <p>No ambulances found. Data loads from admin/stats endpoint.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* REVIEWS */}
                    {activeTab === 'reviews' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black">Reviews <span className="text-gray-600 font-normal text-lg">({reviews.length})</span></h2>
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input type="text" placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)}
                                        className="bg-gray-800 border border-gray-700 text-white text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 w-56" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                {filtered(reviews, ['comment', 'patient_name']).map(r => (
                                    <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <span className="font-bold text-white text-sm">{r.patient_name || `Patient #${r.patient}`}</span>
                                                <span className="text-yellow-400 font-mono text-sm">{'★'.repeat(r.rating || 0)}{'☆'.repeat(5 - (r.rating || 0))}</span>
                                                <span className="text-gray-600 text-xs">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm">{r.comment || <em className="text-gray-600">No comment</em>}</p>
                                            {r.hospital_name && <p className="text-gray-600 text-xs mt-2">Hospital: {r.hospital_name}</p>}
                                        </div>
                                        <button onClick={() => deleteReview(r.id)} className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-950 rounded-lg transition self-start flex-shrink-0">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                ))}
                                {filtered(reviews, ['comment', 'patient_name']).length === 0 && (
                                    <div className="text-center py-12 text-gray-600">
                                        <Star size={40} className="mx-auto mb-3 opacity-30" />
                                        <p>No reviews found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* BLOOD DONORS */}
                    {activeTab === 'donors' && (
                        <div>
                            <h2 className="text-2xl font-black mb-6">Blood Donors <span className="text-gray-600 font-normal text-lg">({donors.length})</span></h2>
                            {donors.length === 0 ? (
                                <div className="text-center py-12 text-gray-600">
                                    <Droplets size={40} className="mx-auto mb-3 opacity-30" />
                                    <p>Blood donor data loads from admin/stats endpoint.</p>
                                    <p className="text-xs mt-2">Make sure the backend admin stats endpoint is running.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-2xl border border-gray-800">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                                            <tr>
                                                <th className="px-5 py-3 text-left">Name</th>
                                                <th className="px-5 py-3 text-left">Blood Group</th>
                                                <th className="px-5 py-3 text-left">Email</th>
                                                <th className="px-5 py-3 text-left">Phone</th>
                                                <th className="px-5 py-3 text-left">Emergency</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {donors.map((d: any) => (
                                                <tr key={d.id} className="border-t border-gray-800 hover:bg-gray-800/50 transition bg-gray-900">
                                                    <td className="px-5 py-3 font-semibold text-white">{d.full_name}</td>
                                                    <td className="px-5 py-3"><span className="bg-red-950 text-red-400 px-2 py-0.5 rounded-full text-xs font-bold">{d.blood_group}</span></td>
                                                    <td className="px-5 py-3 text-gray-400">{d.email || '—'}</td>
                                                    <td className="px-5 py-3 text-gray-400">{d.phone || '—'}</td>
                                                    <td className="px-5 py-3">{d.emergency_donor ? '🚨 Yes' : '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
