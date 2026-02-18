import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import StaffPortal from './pages/StaffPortal'
import LandingPage from './pages/LandingPage'

// Define User Interface
export interface User {
    token?: string;
    id: string;
    name: string;
    role: 'user' | 'hospital' | 'ambulance';
}

import Chatbot from './components/Chatbot';

import Doctors from './pages/Doctors';
import Hospitals from './pages/Hospitals';
import HospitalDetails from './pages/HospitalDetails';
import ReviewFormPage from './pages/ReviewFormPage';
import BloodDonation from './pages/BloodDonation';

import About from './pages/About';
import AmbulanceDashboard from './pages/AmbulanceDashboard';

function App() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('medgrid_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('medgrid_user');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('medgrid_user');
        setUser(null);
    };

    return (
        <Router>
            <div className="relative min-h-screen">
                <Chatbot user={user} />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/ambulance" element={<AmbulanceDashboard logout={handleLogout} />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard user={user} logout={handleLogout} />} />
                    <Route path="/patient/dashboard" element={<Dashboard user={user} logout={handleLogout} />} />
                    <Route path="/doctors" element={<Doctors user={user} logout={handleLogout} />} />
                    <Route path="/hospitals" element={<Hospitals user={user} logout={handleLogout} />} />
                    <Route path="/hospitals/:id" element={<HospitalDetails user={user} logout={handleLogout} />} />
                    <Route path="/hospitals/:id/review" element={<ReviewFormPage user={user} logout={handleLogout} />} />
                    <Route path="/departments" element={<Navigate to="/hospitals" replace />} />
                    <Route path="/donate-blood" element={<BloodDonation />} />
                    <Route path="/staff" element={user && user.role === 'hospital' ? <StaffPortal user={user} logout={handleLogout} /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App
