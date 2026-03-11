import { useState } from 'react';
import { ArrowRight, Heart, Activity, Stethoscope, BriefcaseMedical, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    const [selectedFeature, setSelectedFeature] = useState<{ title: string, desc: string, detail: string, icon: any, color: string, bg: string, img: string, popupImg: string } | null>(null);

    const features = [
        {
            title: "ICU Beds Tracking",
            desc: "Real-time monitoring of ICU beds and critical care resources.",
            detail: "Our platform integrates directly with hospital management systems to provide up-to-the-minute data on ICU bed availability. This ensures that emergency responders can route critical patients to the nearest facility with immediate capacity, saving vital time.",
            icon: Heart,
            color: "text-green-500",
            bg: "bg-green-50",
            img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2653&auto=format&fit=crop",
            popupImg: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=2670&auto=format&fit=crop"
        },
        {
            title: "Diagnosis",
            desc: "Advanced diagnostic centers connected via the MediGrid network.",
            detail: "Access a wide network of diagnostic centers equipped with state-of-the-art imaging and laboratory facilities. Results are securely transmitted and instantly available to authorized medical personnel to expedite treatment.",
            icon: Stethoscope,
            color: "text-blue-500",
            bg: "bg-blue-50",
            img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2670&auto=format&fit=crop",
            popupImg: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2640&auto=format&fit=crop"
        },
        {
            title: "Surgery",
            desc: "Instant operating theater availability updates for emergency cases.",
            detail: "Coordinate complex surgical interventions by verifying operating theater schedules and surgical team availability in real time. This minimizes delays for patients requiring emergency surgical care.",
            icon: BriefcaseMedical,
            color: "text-purple-500",
            bg: "bg-purple-50",
            img: "/features/surgery_room_1773128172379.png",
            popupImg: "/features/surgery_popup_1773128260176.png"
        },
        {
            title: "Emergency",
            desc: "Rapid response ambulance dispatch and tracking system.",
            detail: "Our smart dispatch system utilizes GPS tracking and proprietary routing algorithms to send the closest available ambulance. Once dispatched, hospitals can track the ETA of incoming emergencies to prepare their trauma teams.",
            icon: Activity,
            color: "text-red-500",
            bg: "bg-red-50",
            img: "/features/ambulance_truck_1773128228029.png",
            popupImg: "/features/emergency_popup_1773128320010.png"
        }
    ];
    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-orthoGreen to-teal-600 text-white pb-32 pt-20 overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/4">
                    <Activity size={600} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 space-y-6">
                            <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                                Welcome to MediGrid
                            </span>
                            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                We Provide Best <br /> Healthcare
                            </h1>
                            <p className="text-teal-50 text-lg max-w-lg leading-relaxed">
                                Experience the future of medical coordination. Real-time hospital bed availability, blood bank inventory, and emergency response synchronization.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <button className="bg-white text-orthoGreen px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-50 transition flex items-center gap-2">
                                    Read More <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Image Placeholder inspired by Orthoc - Doctor with stethoscope */}
                        <div className="md:w-1/2 mt-12 md:mt-0 relative">
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                                {/* Using a placeholder image or a generated one would be better. For now verify logic. */}
                                <img
                                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                                    alt="Doctor"
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            {/* Decor elements */}
                            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl text-orthoDark z-20 hidden md:block">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                                    <div className="bg-blue-100 p-3 rounded-full text-blue-600"><BriefcaseMedical /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Doctors</p>
                                        <p className="font-bold text-xl">50+</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-full text-green-600"><Activity /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Success</p>
                                        <p className="font-bold text-xl">99%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wavy Bottom Separator */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg className="relative block w-[calc(100%+1.3px)] h-[150px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-white"></path>
                    </svg>
                </div>
            </section>

            {/* Departments Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-orthoGreen font-bold tracking-widest uppercase mb-2">Available Resources</p>
                    <h2 className="text-4xl font-bold text-orthoDark mb-16">Our Departments</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feat, idx) => {
                            const Icon = feat.icon;
                            return (
                                <div key={idx} className="group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                                    <div className="h-48 w-full bg-gray-200 overflow-hidden relative">
                                        <img src={feat.img} alt={feat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className={`absolute top-4 left-4 w-12 h-12 bg-white ${feat.color} rounded-full flex items-center justify-center shadow-lg`}>
                                            <Icon size={24} />
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-bold text-orthoDark mb-3">{feat.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6">{feat.desc}</p>
                                        <button onClick={() => setSelectedFeature(feat)} className={`${feat.color} font-bold text-sm uppercase group-hover:underline flex items-center gap-2`}>
                                            Read More <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-16">
                        <Link to="/hospitals" className="bg-orthoGreen text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-teal-600 transition inline-block">View All Hospitals</Link>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <img src="/doctor.jpg" className="rounded-3xl shadow-2xl w-full object-contain" alt="About MedGrid" />
                    </div>
                    <div className="md:w-1/2">
                        <p className="text-orthoGreen font-bold tracking-widest uppercase mb-2">About Us</p>
                        <h2 className="text-4xl font-bold text-orthoDark mb-6">Connecting Healthcare <br /> Saving Lives</h2>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            MediGrid is a state-of-the-art platform designed to bridge the gap between hospitals, ambulances, and patients. By providing real-time data on bed availability and blood inventory, we ensure that no time is lost when it matters most.
                        </p>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-orthoGreen"></div>
                                <span className="font-bold text-gray-700">Real-time Bed Tracking</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-orthoGreen"></div>
                                <span className="font-bold text-gray-700">Blood Bank Integration</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-orthoGreen"></div>
                                <span className="font-bold text-gray-700">Ambulance Dispatch</span>
                            </div>
                        </div>
                        <Link to="/about" className="bg-orthoDark text-white px-8 py-3 rounded-full font-bold hover:bg-black transition inline-block">Learn More</Link>
                    </div>
                </div>
            </section>

            {/* Read More Modal */}
            {selectedFeature && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none" onClick={() => setSelectedFeature(null)}>
                    <div className="bg-white rounded-3xl max-w-xl w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedFeature(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 transition bg-gray-100 hover:bg-gray-200 rounded-full">
                            <X size={20} />
                        </button>

                        <div className={`w-16 h-16 ${selectedFeature.bg} ${selectedFeature.color} rounded-2xl flex items-center justify-center mb-6`}>
                            {<selectedFeature.icon size={32} />}
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedFeature.title}</h2>

                        <div className="h-48 w-full rounded-2xl overflow-hidden mb-6">
                            <img src={selectedFeature.popupImg} alt={selectedFeature.title} className="w-full h-full object-cover" />
                        </div>

                        <p className="text-gray-600 leading-relaxed font-medium mb-4">
                            {selectedFeature.desc}
                        </p>

                        <p className="text-gray-500 leading-relaxed">
                            {selectedFeature.detail}
                        </p>

                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setSelectedFeature(null)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LandingPage;
