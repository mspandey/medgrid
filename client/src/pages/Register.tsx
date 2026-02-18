import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Lock, Building } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', location: '', phone: ''
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/hospitals/', formData);
            if (window.confirm('Registration Successful! Would you like to register as a blood donor?')) {
                navigate('/donate-blood');
            } else {
                navigate('/login', { state: { role: 'hospital' } });
            }
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.msg || err.response?.data?.detail || 'Registration Failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-orthoDark">
                        Register Facility
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        Join the MedGrid Network
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Hospital Name</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-orthoGreen focus:border-orthoGreen transition sm:text-sm"
                                    placeholder="Metro City Hospital"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Location / District</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="location"
                                    type="text"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-orthoGreen focus:border-orthoGreen transition sm:text-sm"
                                    placeholder="Downtown District"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Emergency Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-orthoGreen focus:border-orthoGreen transition sm:text-sm"
                                    placeholder="+1 (555) 000-0000"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Admin Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-orthoGreen focus:border-orthoGreen transition sm:text-sm"
                                    placeholder="admin@hospital.com"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-orthoGreen focus:border-orthoGreen transition sm:text-sm"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-orthoGreen hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orthoGreen transition shadow-lg shadow-teal-500/30"
                        >
                            create Account
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <Link to="/login" className="font-medium text-orthoGreen hover:text-teal-600">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
