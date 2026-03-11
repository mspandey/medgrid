import { useState } from 'react';
import { Zap, Map, Droplet, Star, Stethoscope, Building, QrCode, Siren, X } from 'lucide-react';
import Navbar from '../components/Navbar';

interface Feature {
    icon: any;
    title: string;
    desc: string;
    detail: string;
    popupImg: string;
    color: string;
    bg: string;
}

const features: Feature[] = [
    {
        icon: Zap,
        title: "Real-Time Updates",
        desc: "Live bed availability updates every 10 seconds",
        detail: "Our cutting-edge synchronization instantly reflects bed availability the second it changes at the hospital. This rapid response system is critical during times of surge.",
        popupImg: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2676&auto=format&fit=crop",
        color: "text-orange-500",
        bg: "bg-orange-50"
    },
    {
        icon: Map,
        title: "Smart Maps",
        desc: "Google Maps with traffic data and hospital locations",
        detail: "Integrated routing calculates the fastest time to the appropriate hospital, factoring in real-time traffic conditions and live hospital congestion metrics to optimize ambulance paths.",
        popupImg: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop",
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
    {
        icon: Droplet,
        title: "Blood Inventory",
        desc: "Check blood availability across 8 blood types",
        detail: "We connect directly with local blood banks to let doctors and patients instantly check the exact unit availability of critical blood types, drastically reducing sourcing time during emergencies.",
        popupImg: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=2783&auto=format&fit=crop",
        color: "text-pink-500",
        bg: "bg-pink-50"
    },
    {
        icon: Star,
        title: "Patient Reviews",
        desc: "Read verified reviews and ratings",
        detail: "Transparency is key. Browse hundreds of verified patient reviews mapping personal experiences, standard of care, and overall hygiene of facilities to help you make informed decisions.",
        popupImg: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=2670&auto=format&fit=crop",
        color: "text-yellow-500",
        bg: "bg-yellow-50"
    },
    {
        icon: Stethoscope,
        title: "Doctor Count",
        desc: "See available doctors and specialists",
        detail: "Know exactly who is on shift. The platform monitors the live availability and specialization of doctors on the floor to ensure that incoming patients get matched with the right experts immediately.",
        popupImg: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2664&auto=format&fit=crop",
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        icon: Building,
        title: "Department Filter",
        desc: "Find hospitals by specialization",
        detail: "A robust categorization system allows you to pinpoint exact departments—from Oncology to Pediatrics—guaranteeing that patients are routed to institutions built to handle their specific medical needs.",
        popupImg: "/features/hospital_departments_1773130496941.png",
        color: "text-purple-500",
        bg: "bg-purple-50"
    },
    {
        icon: QrCode,
        title: "QR Scanner",
        desc: "Quick bed status updates for staff",
        detail: "Hospital staff can instantly update a bed's status from Occupied, to Cleaning, to Available with a simple QR scan on their mobile devices, ensuring zero latency in the operational pipeline.",
        popupImg: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2670&auto=format&fit=crop",
        color: "text-indigo-500",
        bg: "bg-indigo-50"
    },
    {
        icon: Siren,
        title: "Emergency Alerts",
        desc: "Distance-based ambulance notifications",
        detail: "When a critical event is logged, ambulances within a specific geofenced radius are pinged immediately with optimal turn-by-turn navigation sent directly to their dispatch units.",
        popupImg: "/features/emergency_dispatch_map_1773130387984.png",
        color: "text-red-500",
        bg: "bg-red-50"
    }
];

const About = () => {
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-20 border-b border-gray-100 pb-8">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h1 className="text-5xl font-extrabold text-teal-600 mb-2">MedGrid</h1>
                        <p className="text-gray-500 text-lg font-medium">Real-Time Hospital Dashboard</p>
                    </div>

                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition flex items-center gap-2 text-lg">
                        <Siren size={24} /> Emergency: 108
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedFeature(feature)}
                            className="flex flex-col items-center group p-6 rounded-2xl hover:bg-gray-50 transition cursor-pointer shadow-sm hover:shadow-md border border-transparent hover:border-gray-100"
                        >
                            <div className={`mb-6 transform group-hover:scale-110 transition duration-300 w-20 h-20 rounded-2xl flex items-center justify-center ${feature.bg} ${feature.color}`}>
                                {<feature.icon size={40} />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm px-2">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Read More Modal - Article Style */}
            {selectedFeature && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md select-none overflow-y-auto" onClick={() => setSelectedFeature(null)}>
                    <div className="bg-white rounded-3xl max-w-5xl w-full relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col md:flex-row my-auto" onClick={(e) => e.stopPropagation()}>

                        <button onClick={() => setSelectedFeature(null)} className="absolute top-4 right-4 z-20 p-2 text-gray-600 bg-white/90 backdrop-blur hover:bg-gray-100 hover:text-gray-900 rounded-full shadow-sm transition">
                            <X size={20} />
                        </button>

                        {/* Left/Top: Hero Image Side */}
                        <div className="md:w-5/12 h-64 md:h-auto relative bg-gray-100 shrink-0">
                            <img src={selectedFeature.popupImg} alt={selectedFeature.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <div className={`w-14 h-14 ${selectedFeature.bg} ${selectedFeature.color} rounded-2xl flex items-center justify-center shadow-lg mb-4`}>
                                    {<selectedFeature.icon size={28} />}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-md">
                                    {selectedFeature.title}
                                </h2>
                            </div>
                        </div>

                        {/* Right/Bottom: Article Content */}
                        <div className="md:w-7/12 p-8 md:p-12 flex flex-col">
                            <div className="flex-1">
                                <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${selectedFeature.bg} ${selectedFeature.color} mb-6`}>
                                    Feature Deep Dive
                                </span>

                                <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
                                    {selectedFeature.desc}
                                </h3>

                                <div className="w-12 h-1 bg-gray-200 rounded-full mb-8"></div>

                                <div className="prose prose-lg text-gray-600">
                                    <p className="leading-relaxed">
                                        {selectedFeature.detail}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                                <button onClick={() => setSelectedFeature(null)} className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition shadow-md flex items-center gap-2">
                                    Close <X size={18} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default About;
