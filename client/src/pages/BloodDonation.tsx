
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Heart, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const BloodDonation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // 1. Personal Info
        fullName: '',
        age: '',
        gender: '',
        bloodGroup: '',
        weight: '',
        phone: '',
        email: '',
        address: '',

        // 2. Health & Eligibility
        healthyToday: false,
        recentIllness: false,
        chronicDiseases: false,
        recentSurgery: false,
        takingMeds: false,
        pregnancy: false,
        tattooPiercing: false,
        historyHighRisk: false, // Hepatitis, HIV, Heart, etc.

        // 3. Donation History
        firstTimeDonor: true,
        lastDonationDate: '',
        complications: false,

        // 4. Availability
        emergencyDonor: false,
        preferredTime: '',
        donationType: { whol: false, platelet: false, plasma: false },

        // 5. Consent
        accuracyConfirmed: false,
        voluntaryAgreed: false,
        eligibilityUnderstood: false,
        privacyConsented: false
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const [successData, setSuccessData] = useState<{ hospital: string; hospital_address: string } | null>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/blood-donation', formData);
            setSuccessData({ hospital: res.data.hospital, hospital_address: res.data.hospital_address });
        } catch (err) {
            console.error(err);
            alert('Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                {/* SUCCESS SCREEN */}
                {successData ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                            <CheckCircle className="text-green-500" size={48} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">You're Registered! 🎉</h1>
                        <p className="text-lg text-gray-500 mb-8">
                            A confirmation email has been sent to <strong>{formData.email}</strong>.
                        </p>
                        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 text-left max-w-lg mx-auto">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Heart className="text-red-500" size={20} fill="currentColor" />
                                Please Visit This Hospital
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                <div>
                                    <span className="text-xs font-bold uppercase text-gray-400 tracking-widest">Hospital</span>
                                    <p className="font-bold text-lg">{successData.hospital}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase text-gray-400 tracking-widest">Address</span>
                                    <p>{successData.hospital_address}</p>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-red-50 rounded-xl text-sm text-red-700">
                                <strong>Next Steps:</strong> Visit the hospital for a quick health screening, complete your donation (~30 mins), and receive your donor certificate. Bring a valid ID and stay hydrated! 💧
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-8 bg-white text-gray-800 px-5 py-3 rounded-xl shadow border border-gray-200 font-bold hover:bg-gray-50 flex items-center justify-center gap-2 mx-auto transition-all"
                        >
                            <ArrowLeft size={20} /> Back to Home
                        </button>
                    </div>
                ) : (
                    <>

                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
                                <Heart className="text-red-500" size={32} fill="currentColor" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900">Become a Life Saver</h1>
                            <p className="mt-4 text-xl text-gray-500">Join our community of blood donors and help save lives.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

                            {/* Step 1: Personal Information */}
                            <div className="p-8 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                    Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input name="fullName" placeholder="Full Name" className="p-3 border rounded-xl bg-gray-50" onChange={handleChange} required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="age" type="number" placeholder="Age" className="p-3 border rounded-xl bg-gray-50" onChange={handleChange} required />
                                        <input name="weight" type="number" placeholder="Weight (kg)" className="p-3 border rounded-xl bg-gray-50" onChange={handleChange} required />
                                    </div>
                                    <select name="gender" className="p-3 border rounded-xl bg-gray-50" onChange={handleChange} required>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <select name="bloodGroup" className="p-3 border rounded-xl bg-gray-50" onChange={handleChange} required>
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                    <input name="phone" placeholder="Phone Number" className="p-3 border rounded-xl bg-gray-50" onChange={handleChange} required />
                                    <input name="email" type="email" placeholder="Email (Optional)" className="p-3 border rounded-xl bg-gray-50" onChange={handleChange} />
                                    <input name="address" placeholder="Address / City" className="p-3 border rounded-xl bg-gray-50 md:col-span-2" onChange={handleChange} required />
                                </div>
                            </div>

                            {/* Step 2: Health & Eligibility */}
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                    Health & Eligibility
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Are you feeling healthy today?', name: 'healthyToday' },
                                        { label: 'Any recent illness / fever?', name: 'recentIllness' },
                                        { label: 'Any chronic diseases?', name: 'chronicDiseases' },
                                        { label: 'Recent surgery?', name: 'recentSurgery' },
                                        { label: 'Taking medications?', name: 'takingMeds' },
                                        { label: 'Pregnant / recently pregnant?', name: 'pregnancy' },
                                        { label: 'Tattoo / piercing in last 6-12 months?', name: 'tattooPiercing' },
                                        { label: 'History of Hep/HIV/Heart Disease?', name: 'historyHighRisk' },
                                    ].map((q, idx) => (
                                        <label key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                                            <input type="checkbox" name={q.name} onChange={handleChange} className="w-5 h-5 text-red-600 focus:ring-red-500 rounded" />
                                            <span className="text-gray-700 font-medium">{q.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Step 3: Donation History */}
                            <div className="p-8 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                    Donation History
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex items-center gap-3">
                                        <input type="checkbox" name="firstTimeDonor" checked={formData.firstTimeDonor} onChange={handleChange} className="w-5 h-5 text-red-600 rounded" />
                                        <span className="font-medium text-gray-700">First-time donor?</span>
                                    </label>

                                    {!formData.firstTimeDonor && (
                                        <div className="space-y-4">
                                            <input type="date" name="lastDonationDate" className="w-full p-3 border rounded-xl" onChange={handleChange} />
                                            <label className="flex items-center gap-3">
                                                <input type="checkbox" name="complications" onChange={handleChange} className="w-5 h-5 text-red-600 rounded" />
                                                <span className="text-sm text-gray-600">Any complications previously?</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 4: Availability */}
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                                    Availability
                                </h2>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                                        <input type="checkbox" name="emergencyDonor" onChange={handleChange} className="w-6 h-6 text-red-600 rounded" />
                                        <div>
                                            <span className="font-bold text-gray-900 block">Available for emergency donation?</span>
                                            <span className="text-xs text-gray-500">We will only contact you in critical need.</span>
                                        </div>
                                    </label>
                                    <input name="preferredTime" placeholder="Preferred contact time (e.g. Weekends, Evenings)" className="w-full p-3 border rounded-xl bg-white" onChange={handleChange} />
                                </div>
                            </div>

                            {/* Step 5: Declaration */}
                            <div className="p-8 bg-gray-900 text-white">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <FileText size={20} /> Declaration & Consent
                                </h2>
                                <div className="space-y-3 mb-8">
                                    {[
                                        { text: 'I confirm all provided information is accurate', name: 'accuracyConfirmed' },
                                        { text: 'I voluntarily agree to donate blood', name: 'voluntaryAgreed' },
                                        { text: 'I understand the eligibility rules', name: 'eligibilityUnderstood' },
                                        { text: 'I consent to data privacy terms', name: 'privacyConsented' },
                                    ].map((item, idx) => (
                                        <label key={idx} className="flex items-start gap-3 cursor-pointer opacity-90 hover:opacity-100">
                                            <input type="checkbox" name={item.name} required onChange={handleChange} className="mt-1 w-4 h-4 text-green-500 rounded border-gray-600 bg-gray-800 focus:ring-offset-gray-900" />
                                            <span className="text-sm">{item.text}</span>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/50'}`}
                                >
                                    {loading ? 'Submitting...' : <><CheckCircle /> Submit Donor Registration</>}
                                </button>
                            </div>

                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default BloodDonation;
