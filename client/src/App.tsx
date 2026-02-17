import { useState } from 'react'
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
    role: 'user' | 'hospital';
}

function App() {
    const [user, setUser] = useState<User | null>(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard user={user} logout={() => setUser(null)} />} />
                <Route path="/patient/dashboard" element={<Dashboard user={user} logout={() => setUser(null)} />} />
                <Route path="/staff" element={user && user.role === 'hospital' ? <StaffPortal user={user} /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    )
}

export default App
