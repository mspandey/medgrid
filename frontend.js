import React, { useState, useEffect } from 'react';
import { AlertCircle, Bed, Droplet, Navigation } from 'lucide-react';

const AmbulanceDashboard = () => {
  const [hospitals, setHospitals] = useState([
    { id: 1, name: "City General", beds: 2, bloodO: 5, dist: "1.2km", status: "Available" },
    { id: 2, name: "District Public", beds: 0, bloodO: 0, dist: "3.5km", status: "Full" },
    { id: 3, name: "Metropolitan", beds: 12, bloodO: 8, dist: "5.1km", status: "Available" }
  ]);

  const [emergencyAlert, setEmergencyAlert] = useState(null);

  // Simulate a real-time update (e.g., from a WebSocket)
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmergencyAlert("CRITICAL: City General ICU just reached 0 capacity. Reroute suggested.");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 font-sans">
      {/* Real-time Alert Banner */}
      {emergencyAlert && (
        <div className="bg-red-600 p-4 rounded-lg mb-6 flex items-center animate-pulse border-2 border-white">
          <AlertCircle className="mr-3" size={32} />
          <p className="font-bold text-lg">{emergencyAlert}</p>
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-2xl font-black tracking-tight flex items-center">
          <Navigation className="mr-2 text-blue-400" /> RESCUE-LINK LIVE
        </h1>
        <p className="text-slate-400">Emergency Dispatcher Interface v1.0</p>
      </header>

      <section className="grid gap-4">
        <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-widest">Nearby Facilities</h2>
        
        {hospitals.map(hosp => (
          <div key={hosp.id} className={`p-4 rounded-xl border-l-8 ${hosp.beds > 0 ? 'bg-slate-800 border-green-500' : 'bg-slate-800 opacity-60 border-red-500'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{hosp.name}</h3>
                <p className="text-slate-400 text-sm">{hosp.dist} away</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${hosp.beds > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                {hosp.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center bg-slate-700 p-3 rounded-lg">
                <Bed className="text-blue-400 mr-2" />
                <div>
                  <p className="text-xs text-slate-400">ICU BEDS</p>
                  <p className="text-lg font-bold">{hosp.beds}</p>
                </div>
              </div>
              <div className="flex items-center bg-slate-700 p-3 rounded-lg">
                <Droplet className="text-red-400 mr-2" />
                <div>
                  <p className="text-xs text-slate-400">O- BLOOD</p>
                  <p className="text-lg font-bold">{hosp.bloodO} Units</p>
                </div>
              </div>
            </div>
            
            {hosp.beds > 0 && (
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition">
                RESERVE BED FOR PATIENT
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default AmbulanceDashboard;