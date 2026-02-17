import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Activity, User, Building, ArrowLeft } from 'lucide-react';
import { User as UserType } from '../App';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface LoginProps {
    setUser: (user: UserType) => void;
}

const Login = ({ setUser }: LoginProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    // role: 'user' (Patient) or 'hospital'
    const [role, setRole] = useState<'user' | 'hospital'>('user');
    // mode: 'login' or 'register' (only for patients here, hospital has separate page)
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Patient Register Fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.role) {
            setRole(location.state.role);
        }
    }, [location]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (role === 'user') {
                // --- PATIENT: Firebase Auth ---
                if (mode === 'register') {
                    // 1. Create Auth User
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    // 2. Save Additional Info to Firestore
                    await setDoc(doc(db, "patients", user.uid), {
                        name,
                        email,
                        phone,
                        age,
                        bloodGroup,
                        uid: user.uid,
                        createdAt: new Date()
                    });

                    // 3. Set App State
                    setUser({ id: user.uid, name: name, role: 'user' });
                    // alert("Registration Successful! Welcome.");
                    navigate('/patient/dashboard');

                } else {
                    // Login
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    // Fetch Profile
                    const docRef = doc(db, "patients", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUser({ id: user.uid, name: data.name, role: 'user' });
                    } else {
                        setUser({ id: user.uid, name: email || 'Patient', role: 'user' });
                    }
                    // alert("Login Successful! Redirecting to Dashboard...");
                    navigate('/patient/dashboard');
                }

            } else {
                // --- HOSPITAL: Existing Backend Auth ---
                const endpoint = 'http://localhost:5000/api/auth/login';
                const payload = { email, password, role }; // Role is always 'hospital' here effectively

                const res = await axios.post(endpoint, payload);
                const userData: UserType = { token: res.data.token, ...res.data.user };
                setUser(userData);
                navigate('/staff');
            }

        } catch (err: any) {
            console.error("Auth Error:", err);
            let msg = 'Authentication Failed';

            // Firebase Error handling
            if (err.code === 'auth/email-already-in-use') {
                msg = 'This email is already registered. Please Login instead.';
                // Auto-switch to login mode for convenience
                setMode('login');
            }
            if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
            if (err.code === 'auth/user-not-found') msg = 'No account found with this email. Please Register first.';
            if (err.code === 'auth/invalid-credential') msg = 'Invalid credentials provided.';
            if (err.response?.data?.msg) msg = err.response.data.msg;

            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans relative">
            {/* Back Arrow */}
            <Link to="/" className="absolute top-6 left-6 text-gray-500 hover:text-green-800 transition flex items-center gap-2 font-bold">
                <ArrowLeft size={24} /> Back to Home
            </Link>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row max-w-4xl w-full">
                {/* Left Side */}
                <div className="md:w-1/2 bg-green-800 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3 text-2xl font-bold mb-2 hover:opacity-90 transition">
                            <div className="bg-white text-green-800 p-2 rounded-lg"><Activity size={24} /></div>
                            MedGrid
                        </Link>
                        <p className="opacity-90 text-sm">Secure Access Portal</p>
                    </div>
                    <div className="relative z-10 mt-8">
                        <h3 className="text-xl font-bold mb-3">
                            {role === 'user' ? (mode === 'login' ? 'Patient Login' : 'Patient Registration') : 'Hospital Staff Portal'}
                        </h3>
                        <p className="opacity-90 leading-relaxed text-sm">
                            {role === 'user'
                                ? 'Access real-time bed availability, find doctors, and manage your emergency profile.'
                                : 'Manage your facility resources, update bed counts, and handle emergency requests.'}
                        </p>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">

                    {/* Role Toggles */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === 'user' ? 'bg-white shadow text-green-800' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => { setRole('user'); setMode('login'); }}
                        >
                            <User size={16} /> Patient
                        </button>
                        <button
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === 'hospital' ? 'bg-white shadow text-green-800' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setRole('hospital')}
                        >
                            <Building size={16} /> Hospital
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </h2>
                    <p className="text-gray-400 mb-4 text-sm">
                        {mode === 'login' ? 'Enter your credentials to access.' : 'Fill in your details to get started.'}
                    </p>

                    <form onSubmit={handleAuth} className="space-y-3">
                        {mode === 'register' && role === 'user' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                                    <input type="text" className="w-full p-2 border rounded-lg text-sm" required value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Age</label>
                                        <input type="number" className="w-full p-2 border rounded-lg text-sm" required value={age} onChange={e => setAge(e.target.value)} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Blood Group</label>
                                        <select className="w-full p-2 border rounded-lg text-sm" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="A+">A+</option> <option value="A-">A-</option>
                                            <option value="B+">B+</option> <option value="B-">B-</option>
                                            <option value="O+">O+</option> <option value="O-">O-</option>
                                            <option value="AB+">AB+</option> <option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                                    <input type="tel" className="w-full p-2 border rounded-lg text-sm" required value={phone} onChange={e => setPhone(e.target.value)} />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                            <input type="email" className="w-full p-2 border rounded-lg text-sm" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                            <input type="password" className="w-full p-2 border rounded-lg text-sm" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 bg-green-800 hover:bg-green-900 text-white font-bold rounded-lg transition shadow-lg mt-2 flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                mode === 'login' ? 'Login' : 'Register'
                            )}
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-400">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setUser({ id: 'guest', name: 'Guest User', role: 'user' });
                                navigate('/patient/dashboard');
                            }}
                            className="w-full py-2.5 bg-white border-2 border-green-800 text-green-800 font-bold rounded-lg hover:bg-green-50 transition"
                        >
                            Continue as Guest
                        </button>
                    </form>

                    {role === 'user' && (
                        <div className="mt-4 text-center text-xs">
                            {mode === 'login' ? (
                                <p className="text-gray-500">New Patient? <button onClick={() => setMode('register')} className="text-green-800 font-bold hover:underline">Register Here</button></p>
                            ) : (
                                <p className="text-gray-500">Already have an account? <button onClick={() => setMode('login')} className="text-green-800 font-bold hover:underline">Login Here</button></p>
                            )}
                        </div>
                    )}

                    {role === 'hospital' && (
                        <p className="mt-4 text-center text-xs text-gray-400">
                            New Facility? <Link to="/register" className="text-green-800 font-bold hover:underline">Register Here</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
