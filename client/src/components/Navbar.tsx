import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, ChevronDown, User, Building } from 'lucide-react';

interface NavbarProps {
    user?: { name: string; role: 'user' | 'hospital' } | null;
    logout?: () => void;
}

const Navbar = ({ user, logout }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLoginMenu, setShowLoginMenu] = useState(false);
    const navigate = useNavigate();

    const handleLoginClick = (role: 'user' | 'hospital') => {
        navigate('/login', { state: { role } });
        setShowLoginMenu(false);
    };

    const handleDashboardClick = () => {
        if (user?.role === 'user') navigate('/patient/dashboard');
        else if (user?.role === 'hospital') navigate('/staff');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                            <div className="bg-green-800 text-white p-2 rounded-lg">
                                <Activity size={24} />
                            </div>
                            <span className="text-gray-900">Med<span className="text-green-800">Grid</span></span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-orthoGreen font-medium">Home</Link>
                        {user && user.role === 'user' && (
                            <Link to="/dashboard" className="text-gray-600 hover:text-orthoGreen font-bold">Dashboard</Link>
                        )}
                        <Link to="/about" className="text-gray-600 hover:text-orthoGreen font-medium">About</Link>
                        <Link to="/departments" className="text-gray-600 hover:text-orthoGreen font-medium">Departments</Link>
                        <Link to="/doctors" className="text-gray-600 hover:text-orthoGreen font-medium">Doctors</Link>

                        <div className="relative">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-gray-800">Hi, {user.name}</span>
                                    <button
                                        onClick={logout}
                                        className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold hover:bg-red-100 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setShowLoginMenu(!showLoginMenu)}
                                        className="flex items-center gap-2 bg-orthoGreen text-white px-6 py-2.5 rounded-full font-bold hover:bg-teal-600 transition shadow-lg shadow-teal-500/30"
                                    >
                                        Login <ChevronDown size={16} />
                                    </button>

                                    {showLoginMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                            <button
                                                onClick={() => handleLoginClick('user')}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50"
                                            >
                                                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><User size={18} /></div>
                                                <div>
                                                    <div className="font-bold text-gray-800">Patient</div>
                                                    <div className="text-xs text-gray-500">Access Care</div>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => handleLoginClick('hospital')}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                            >
                                                <div className="bg-red-50 text-red-600 p-2 rounded-lg"><Building size={18} /></div>
                                                <div>
                                                    <div className="font-bold text-gray-800">Hospital Staff</div>
                                                    <div className="text-xs text-gray-500">Manage Facility</div>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg">
                    <Link to="/" className="block text-gray-600 font-medium">Home</Link>
                    <Link to="/about" className="block text-gray-600 font-medium">About</Link>
                    <div className="pt-4 border-t border-gray-100">
                        {user ? (
                            <button onClick={logout} className="w-full py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm">Logout</button>
                        ) : (
                            <>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Access Portal</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleLoginClick('user')} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm">Patient</button>
                                    <button onClick={() => handleLoginClick('hospital')} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm">Hospital</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
