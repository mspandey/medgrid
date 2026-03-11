import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Activity, User, Building, ArrowLeft, HeartPulse, Stethoscope } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { User as UserType } from '../App';

interface LoginProps {
    setUser: (user: UserType) => void;
}

const Login = ({ setUser }: LoginProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    // role: 'user' (Patient) or 'hospital' or 'ambulance'
    const [role, setRole] = useState<'user' | 'hospital' | 'ambulance'>('user');
    // mode: 'login' or 'register' (only for patients here)
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const [formData, setFormData] = useState({
        email: '', password: '', name: '', phone: '', age: '', bloodGroup: '', vehicle_number: '', status: 'Available', distance: '', location: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (location.state?.role) {
            setRole(location.state.role);
        }
    }, [location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const BASE_URL = 'http://localhost:8000/api';

        try {
            console.log("Starting Auth Process...", { role, mode, email: formData.email });
            let res;

            if (role === 'user') {
                if (mode === 'register') {
                    // Patient Register
                    res = await axios.post(`${BASE_URL}/auth/patient/register`, formData);
                    setMode('login');
                    alert("Registration Successful! Please Login.");
                    setLoading(false);
                    return;
                } else {
                    // Patient Login
                    res = await axios.post(`${BASE_URL}/auth/patient/login`, {
                        email: formData.email,
                        password: formData.password
                    });
                }
            } else if (role === 'hospital') {
                // Hospital Login
                res = await axios.post(`${BASE_URL}/auth/login`, {
                    email: formData.email,
                    password: formData.password
                });
            } else {
                // Ambulance Auth
                if (mode === 'register') {
                    res = await axios.post(`${BASE_URL}/auth/ambulance/register`, {
                        email: formData.email,
                        password: formData.password,
                        driver_name: formData.name,
                        phone: formData.phone,
                        vehicle_number: (formData as any).vehicle_number,
                        location: (formData as any).location,
                        status: (formData as any).status
                    });
                    setMode('login');
                    alert("Ambulance Registered! Please Login.");
                    setLoading(false);
                    return;
                } else {
                    res = await axios.post(`${BASE_URL}/auth/ambulance/login`, {
                        email: formData.email,
                        password: formData.password
                    });
                }
            }

            console.log("Auth Success:", res.data);
            const userData: UserType = {
                token: res.data.token,
                id: res.data.user.id,
                name: res.data.user.name,
                role: res.data.user.role
            };

            localStorage.setItem('medgrid_user', JSON.stringify(userData));
            setUser(userData);

            if (role === 'user') navigate('/patient/dashboard');
            else if (role === 'hospital') navigate('/staff');
            else navigate('/ambulance');

        } catch (err: any) {
            console.error("Auth Error:", err);
            let msg = 'Authentication Failed';

            if (err.response) {
                // Django Error Response
                if (err.response.data?.msg) msg = err.response.data.msg;
                else if (typeof err.response.data === 'string') msg = err.response.data; // Sometimes detail
            } else if (err.request) {
                msg = "Cannot connect to server. Ensure Django is running.";
            } else {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const BASE_URL = 'http://localhost:8000/api';
            const res = await axios.post(`${BASE_URL}/auth/patient/google`, {
                email: user.email,
                name: user.displayName,
                uid: user.uid
            });

            console.log("Google Auth Success:", res.data);
            const userData: UserType = {
                token: res.data.token,
                id: res.data.user.id,
                name: res.data.user.name,
                role: res.data.user.role
            };

            localStorage.setItem('medgrid_user', JSON.stringify(userData));
            setUser(userData);
            navigate('/patient/dashboard');

        } catch (err: any) {
            console.error("Google Auth Error:", err);
            setError(err.message || "Failed to authenticate with Google");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans relative">
            <Link
                to="/"
                className="absolute top-6 left-6 md:top-10 md:left-10 bg-white text-gray-800 px-5 py-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 font-bold z-50 hover:bg-gray-50 hover:scale-105 transition-all"
            >
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-5xl w-full border border-gray-100 mt-16 md:mt-0">

                {/* Visual Side */}
                <div className="md:w-5/12 bg-gradient-to-br from-green-900 to-teal-800 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3 text-3xl font-bold mb-2">
                            <div className="bg-white text-green-900 p-2.5 rounded-xl"><Activity size={28} /></div>
                            MedGrid
                        </Link>
                        <p className="opacity-80 text-sm ml-1">Unified Healthcare Network</p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-bold leading-tight">
                            {role === 'user' ? "Your Health," : role === 'hospital' ? "Manage Facility" : "Emergency Response"} <br />
                            <span className="text-green-300">Simplified.</span>
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                <div className="bg-white/20 p-2 rounded-lg"><HeartPulse size={20} /></div>
                                <div className="text-sm">
                                    <p className="font-bold">Real-time Availability</p>
                                    <p className="opacity-70 text-xs">Track ICU & General beds instantly.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                <div className="bg-white/20 p-2 rounded-lg"><Stethoscope size={20} /></div>
                                <div className="text-sm">
                                    <p className="font-bold">Expert Doctors</p>
                                    <p className="opacity-70 text-xs">Find specialists near you.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Blobs */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500 rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
                    <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-teal-400 rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
                </div>

                {/* Form Side */}
                <div className="md:w-7/12 p-10 lg:p-14 flex flex-col justify-center bg-white">

                    <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8 self-start gap-1">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${role === 'user' ? 'bg-white shadow-md text-green-800 ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => { setRole('user'); setMode('login'); setError(''); }}
                        >
                            <User size={16} /> Patient
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${role === 'hospital' ? 'bg-white shadow-md text-green-800 ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => { setRole('hospital'); setError(''); }}
                        >
                            <Building size={16} /> Hospital
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${role === 'ambulance' ? 'bg-white shadow-md text-red-600 ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => { setRole('ambulance'); setError(''); }}
                        >
                            <Activity size={16} /> Ambulance
                        </button>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-gray-500">
                            {role === 'user'
                                ? (mode === 'login' ? 'Enter your details to access your dashboard.' : 'Join to find care faster.')
                                : role === 'hospital' ? 'Sign in to manage your hospital resources.' : 'Ambulance Driver Login'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                            Alert: {error}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-5">
                        {mode === 'register' && role === 'user' && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in-down">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Full Name</label>
                                    <input name="name" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required placeholder="John Doe" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Age</label>
                                    <input name="age" type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required placeholder="25" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Blood Group</label>
                                    <select name="bloodGroup" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="A+">A+</option> <option value="A-">A-</option>
                                        <option value="B+">B+</option> <option value="B-">B-</option>
                                        <option value="O+">O+</option> <option value="O-">O-</option>
                                        <option value="AB+">AB+</option> <option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Phone</label>
                                    <input name="phone" type="tel" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required placeholder="+1 234 567 890" onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        {mode === 'register' && role === 'ambulance' && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in-down">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Driver Name</label>
                                    <input name="name" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required placeholder="John Doe" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Vehicle Number</label>
                                    <input name="vehicle_number" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required placeholder="AMB-101" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Contact Number</label>
                                    <input name="phone" type="tel" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required placeholder="+1 234 567 890" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Availability</label>
                                    <select name="status" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" onChange={handleChange}>
                                        <option value="Available">Available</option>
                                        <option value="Busy">Busy</option>
                                        <option value="Offline">Offline</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Distance (km)</label>
                                    <input name="distance" type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required placeholder="5" onChange={handleChange} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Current Location</label>
                                    <input name="location" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required placeholder="Downtown Station" onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">{role === 'ambulance' ? 'Driver Email / ID' : 'Email Address'}</label>
                            <input name="email" type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required placeholder="name@example.com" onChange={handleChange} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1 uppercase tracking-wide">Password</label>
                            <input name="password" type="password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required placeholder="••••••••" onChange={handleChange} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition shadow-xl shadow-gray-200 transform hover:-translate-y-0.5 mt-4"
                        >
                            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {role === 'user' && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleAuth}
                                disabled={loading}
                                className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-200 shadow-sm py-3.5 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition hover:shadow-md"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        {role === 'user' ? (
                            <p className="text-gray-500 text-sm">
                                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                                <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="ml-2 text-green-700 font-bold hover:underline">
                                    {mode === 'login' ? 'Register Now' : 'Login Here'}
                                </button>
                            </p>
                        ) : role === 'hospital' ? (
                            <p className="text-gray-500 text-sm">
                                Registering a new facility?
                                <Link to="/register" className="ml-2 text-green-700 font-bold hover:underline">Hospital Registration</Link>
                            </p>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                {mode === 'login' ? "New Ambulance Driver?" : "Already registered?"}
                                <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="ml-2 text-green-700 font-bold hover:underline">
                                    {mode === 'login' ? 'Register Vehicle' : 'Driver Login'}
                                </button>
                            </p>
                        )}

                        <div className="my-6 flex items-center justify-center gap-4 opacity-50">
                            <span className="h-px w-10 bg-gray-300"></span>
                            <span className="text-xs text-gray-400 font-mono">SECURE LOGIN</span>
                            <span className="h-px w-10 bg-gray-300"></span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};



export default Login;
