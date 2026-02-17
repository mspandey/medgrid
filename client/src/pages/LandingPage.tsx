import { ArrowRight, Heart, Activity, Stethoscope, BriefcaseMedical } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
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
                        {/* Cards */}
                        <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto bg-green-50 text-orthoGreen rounded-full flex items-center justify-center mb-6 text-3xl group-hover:bg-orthoGreen group-hover:text-white transition">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-orthoDark mb-3">Cardiology</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">Real-time monitoring of ICU beds and cardiac emergency resources.</p>
                            <a href="#" className="text-orthoGreen font-bold text-sm uppercase group-hover:underline">Read More</a>
                        </div>

                        <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 text-3xl group-hover:bg-blue-500 group-hover:text-white transition">
                                <Stethoscope size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-orthoDark mb-3">Diagnosis</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">Advanced diagnostic centers connected via the MediGrid network.</p>
                            <a href="#" className="text-blue-500 font-bold text-sm uppercase group-hover:underline">Read More</a>
                        </div>

                        <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-6 text-3xl group-hover:bg-purple-500 group-hover:text-white transition">
                                <BriefcaseMedical size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-orthoDark mb-3">Surgery</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">Instant operating theater availability updates for emergency cases.</p>
                            <a href="#" className="text-purple-500 font-bold text-sm uppercase group-hover:underline">Read More</a>
                        </div>

                        <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 text-3xl group-hover:bg-red-500 group-hover:text-white transition">
                                <Activity size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-orthoDark mb-3">Emergency</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">Rapid response ambulance dispatch and tracking system.</p>
                            <a href="#" className="text-red-500 font-bold text-sm uppercase group-hover:underline">Read More</a>
                        </div>
                    </div>

                    <div className="mt-16">
                        <button className="bg-orthoGreen text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-teal-600 transition">View All Departments</button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <img src="https://images.unsplash.com/photo-1551076882-68b47d19d60f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" className="rounded-3xl shadow-2xl" alt="About MedGrid" />
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
                        <button className="bg-orthoDark text-white px-8 py-3 rounded-full font-bold hover:bg-black transition">Learn More</button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
