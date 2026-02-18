import { useState, useEffect } from 'react';
import { MapPin, Siren, Activity, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Hospital {
    id: number;
    name: string;
    location: string;
    departments: { name: string; available: number }[];
}

interface AmbulanceDashboardProps {
    logout?: () => void;
}

const FAKE_PATIENTS = [
    { id: "PAT_0001", name: "Aarav Mehta", age: 6, gender: "Male", condition: "Severe Asthma Attack", location: "Andheri East", priority: "High" },
    { id: "PAT_0002", name: "Priya Nair", age: 34, gender: "Female", condition: "Complicated Pregnancy", location: "Banashankari", priority: "High" },
    { id: "PAT_0003", name: "Rohan Verma", age: 52, gender: "Male", condition: "Suspected Heart Attack", location: "Karol Bagh", priority: "Critical" },
    { id: "PAT_0004", name: "Neha Sharma", age: 23, gender: "Female", condition: "Road Accident Trauma", location: "MG Road", priority: "Critical" },
    { id: "PAT_0005", name: "Vikram Rao", age: 68, gender: "Male", condition: "Stroke Symptoms", location: "Whitefield", priority: "Critical" },
];

const AmbulanceDashboard = ({ logout }: AmbulanceDashboardProps) => {
    const [status, setStatus] = useState<'idle' | 'alert' | 'enroute' | 'triage' | 'arrival'>('idle');
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [currentPatient, setCurrentPatient] = useState(FAKE_PATIENTS[0]);
    const [distance, setDistance] = useState("3.2 KM");
    const [activeEmergencyId, setActiveEmergencyId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/hospitals/');
            setHospitals(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const simulateEmergency = () => {
        const randomPatient = FAKE_PATIENTS[Math.floor(Math.random() * FAKE_PATIENTS.length)];
        const randomDist = (Math.random() * 8 + 1).toFixed(1);
        setCurrentPatient(randomPatient);
        setDistance(`${randomDist} KM`);
        setStatus('alert');
    };

    const declareEmergency = async (hospital: Hospital) => {
        try {
            const res = await axios.post('http://localhost:8000/api/emergencies/', {
                ambulance: 1, // Simulation ID
                hospital: hospital.id,
                patient_name: currentPatient.name,
                patient_condition: currentPatient.condition,
                severity: currentPatient.priority === 'Critical' ? 'Critical' : 'Moderate',
                eta_minutes: 8,
                distance_km: parseFloat(distance.split(' ')[0]),
                status: 'Enroute'
            });
            setActiveEmergencyId(res.data.id);
            setStatus('arrival');

            // Simulation logic
            let currentDist = parseFloat(distance.split(' ')[0]);
            const interval = setInterval(() => {
                currentDist = Math.max(0, currentDist - 0.5);
                setDistance(`${currentDist.toFixed(1)} KM`);

                axios.patch(`http://localhost:8000/api/emergencies/${res.data.id}/`, {
                    distance_km: currentDist.toFixed(2),
                    eta_minutes: Math.ceil(currentDist * 2),
                    status: currentDist <= 0.2 ? 'Arrived' : 'Enroute'
                }).catch(e => console.error("Update failed", e));

                if (currentDist <= 0) clearInterval(interval);
            }, 5000);

        } catch (err) {
            console.error("Failed to declare emergency", err);
        }
    };

    const confirmArrival = async () => {
        if (activeEmergencyId) {
            try {
                await axios.patch(`http://localhost:8000/api/emergencies/${activeEmergencyId}/`, {
                    status: 'Arrived'
                });
            } catch (err) {
                console.error(err);
            }
        }
        setStatus('idle');
        setActiveEmergencyId(null);
    };

    const getBedCount = (h: Hospital) => {
        const icu = h.departments.find(d => d.name === 'ICU')?.available || 0;
        const gen = h.departments.find(d => d.name === 'General')?.available || 0;
        return icu + gen;
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
            <nav className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-orthoGreen text-white font-bold px-3 py-1 rounded text-sm shadow-sm">MEDGRID</div>
                    <div className="text-red-600 font-bold tracking-wider text-sm border border-red-100 px-3 py-1 bg-red-50 rounded">AMBULANCE</div>
                    <div className={`px-3 py-1 rounded text-xs font-bold tracking-widest ${status === 'alert' ? 'bg-red-600 text-white animate-pulse' : 'bg-green-100 text-green-700'}`}>
                        {status.toUpperCase()}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="font-bold text-gray-500">{new Date().toLocaleTimeString()}</div>
                    <button onClick={() => { if (logout) logout(); navigate('/'); }} className="text-red-500 font-bold">LOGOUT</button>
                </div>
            </nav>

            <div className="flex-1 p-6 relative">
                {status === 'alert' && (
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 shadow-xl border-l-8 border-red-500">
                        <Siren className="text-red-500 mb-4" />
                        <h1 className="text-6xl font-black mb-8">NEW CALL</h1>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="text-xs font-bold text-gray-400 block mb-1">PATIENT</label>
                                <div className="text-2xl font-bold">{currentPatient.name}</div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 block mb-1">CONDITION</label>
                                <div className="text-xl font-bold text-red-600">{currentPatient.condition}</div>
                            </div>
                        </div>
                        <button onClick={() => setStatus('enroute')} className="mt-10 bg-red-600 text-white px-12 py-4 rounded-full font-black flex items-center gap-2">
                            ACCEPT CALL <ArrowRight />
                        </button>
                    </div>
                )}

                {status === 'enroute' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-white rounded-3xl p-8 flex justify-between items-center">
                            <div>
                                <label className="text-xs font-bold text-gray-400">DESTINATION</label>
                                <div className="text-2xl font-bold flex items-center gap-2"><MapPin size={20} /> {currentPatient.location}</div>
                            </div>
                            <button onClick={() => setStatus('triage')} className="bg-black text-white px-8 py-3 rounded-full font-bold">ARRIVED AT SCENE</button>
                        </div>
                        <div className="bg-white rounded-3xl p-12 text-center">
                            <label className="text-xs font-bold text-gray-400 block mb-4">DISTANCE TO PATIENT</label>
                            <div className="text-8xl font-black">{distance}</div>
                        </div>
                    </div>
                )}

                {status === 'triage' && (
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-black mb-8">Select Hospital</h2>
                        <div className="space-y-4">
                            {hospitals.map(h => (
                                <div key={h.id} onClick={() => declareEmergency(h)} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-500 cursor-pointer flex justify-between items-center transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">{h.name.charAt(0)}</div>
                                        <div>
                                            <div className="font-bold text-xl">{h.name}</div>
                                            <div className="text-sm text-gray-400">{h.location}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-400 mb-1">BEDS</div>
                                        <div className="text-2xl font-black text-green-600">{getBedCount(h)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {status === 'arrival' && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-red-600 animate-pulse mb-8"><Siren size={80} /></div>
                        <h1 className="text-7xl font-black mb-4">{distance}</h1>
                        <p className="text-gray-400 font-bold mb-12 uppercase tracking-widest">TO HOSPITAL</p>
                        <button onClick={confirmArrival} className="bg-green-600 text-white px-12 py-4 rounded-full font-black text-xl">CONFIRM ARRIVAL</button>
                    </div>
                )}

                {status === 'idle' && (
                    <div className="flex items-center justify-center py-20">
                        <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
                            <CheckCircle size={60} className="text-green-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold">Ready for Dispatch</h2>
                            <button onClick={simulateEmergency} className="mt-8 bg-red-600 text-white px-8 py-3 rounded-2xl font-bold">Simulate Emergency</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AmbulanceDashboard;
