import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';

const ADMIN_USERNAME = 'medgrid_admin';
const ADMIN_PASSWORD = 'AmishaPandey@2006';
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);
    const [countdown, setCountdown] = useState(0);

    // Redirect if already authenticated
    useEffect(() => {
        if (sessionStorage.getItem('admin_session') === 'true') {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    // Countdown timer for lockout
    useEffect(() => {
        if (!lockedUntil) return;
        const interval = setInterval(() => {
            const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
            if (remaining <= 0) {
                setLockedUntil(null);
                setAttempts(0);
                setCountdown(0);
                clearInterval(interval);
            } else {
                setCountdown(remaining);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lockedUntil]);

    const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked) return;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_session', 'true');
            sessionStorage.setItem('admin_login_time', Date.now().toString());
            navigate('/admin/dashboard');
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            if (newAttempts >= MAX_ATTEMPTS) {
                const lockTime = Date.now() + LOCKOUT_SECONDS * 1000;
                setLockedUntil(lockTime);
                setCountdown(LOCKOUT_SECONDS);
                setError(`Too many failed attempts. Locked for ${LOCKOUT_SECONDS} seconds.`);
            } else {
                setError(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`);
            }
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full opacity-5"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)' }}>
                </div>
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-900 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-red-800 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Header badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-red-950 border border-red-800 text-red-400 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                        <Shield size={14} />
                        Restricted Area
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/50">
                            <Lock size={24} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white mt-4">Admin Access</h1>
                    <p className="text-gray-500 text-sm mt-1">MedGrid System Administration</p>
                </div>

                {/* Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl shadow-black/50">

                    {/* Lockout warning */}
                    {isLocked && (
                        <div className="mb-6 p-4 bg-red-950 border border-red-800 rounded-xl flex items-start gap-3">
                            <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 font-bold text-sm">Account Temporarily Locked</p>
                                <p className="text-red-500 text-xs mt-1">Too many failed attempts. Try again in <span className="font-mono font-bold">{countdown}s</span></p>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && !isLocked && (
                        <div className="mb-6 p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-400 text-sm font-medium">
                            ⚠ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                                Admin Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                                placeholder="Enter username"
                                required
                                disabled={isLocked}
                                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    placeholder="Enter password"
                                    required
                                    disabled={isLocked}
                                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition pr-12 disabled:opacity-40 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLocked}
                            className="w-full py-4 bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/40 mt-2 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isLocked ? `Locked (${countdown}s)` : 'Access Admin Panel'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                        <p className="text-gray-600 text-xs">
                            This is a restricted area. Unauthorized access is prohibited.
                        </p>
                        <a href="/" className="text-gray-600 text-xs hover:text-gray-400 transition mt-1 inline-block">
                            ← Return to MedGrid
                        </a>
                    </div>
                </div>

                {/* Security badge */}
                <div className="text-center mt-6 flex items-center justify-center gap-2 text-gray-700 text-xs">
                    <Shield size={12} />
                    <span>Secured Admin Portal — MedGrid v1.0</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
