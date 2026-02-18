import { Zap, Map, Droplet, Star, Stethoscope, Building, QrCode, Siren } from 'lucide-react';
import Navbar from '../components/Navbar';

const features = [
    {
        icon: <Zap size={40} className="text-orange-400" fill="currentColor" />,
        title: "Real-Time Updates",
        desc: "Live bed availability updates every 10 seconds"
    },
    {
        icon: <Map size={40} className="text-blue-400" fill="currentColor" />,
        title: "Smart Maps",
        desc: "Google Maps with traffic data and hospital locations"
    },
    {
        icon: <Droplet size={40} className="text-pink-500" fill="currentColor" />,
        title: "Blood Inventory",
        desc: "Check blood availability across 8 blood types"
    },
    {
        icon: <Star size={40} className="text-yellow-400" fill="currentColor" />,
        title: "Patient Reviews",
        desc: "Read verified reviews and ratings"
    },
    {
        icon: <Stethoscope size={40} className="text-blue-600" />,
        title: "Doctor Count",
        desc: "See available doctors and specialists"
    },
    {
        icon: <Building size={40} className="text-purple-400" />,
        title: "Department Filter",
        desc: "Find hospitals by specialization"
    },
    {
        icon: <QrCode size={40} className="text-indigo-600" />,
        title: "QR Scanner",
        desc: "Quick bed status updates for staff"
    },
    {
        icon: <Siren size={40} className="text-red-500" />,
        title: "Emergency Alerts",
        desc: "Distance-based ambulance notifications"
    }
];

const About = () => {
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
                        <div key={idx} className="flex flex-col items-center group p-4 rounded-xl hover:bg-gray-50 transition cursor-default">
                            <div className="mb-6 transform group-hover:scale-110 transition duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm px-2">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default About;
