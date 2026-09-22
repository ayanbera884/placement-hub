
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import './app.css';

import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminCompanies from './pages/AdminCompanies';
import AdminJobs from './pages/AdminJobs';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-muted)' }}>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
    return children;
};

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <nav style={{
            padding: '1rem 2rem',
            background: 'rgba(15, 17, 26, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h2 className="text-gradient" style={{ fontSize: '1.5rem' }}>⚡ PlacementHub</h2>
            </Link>
            <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
                <Link className="nav-link" to="/" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Home</Link>
                <Link className="nav-link" to="/jobs" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Jobs</Link>
                {user ? (
                    <>
                        <Link className="nav-link" to={user.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Dashboard</Link>
                        {user.role === 'ROLE_STUDENT' && (
                            <Link className="nav-link" to="/profile" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Profile</Link>
                        )}
                        <button onClick={logout} style={{
                            background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: 'var(--accent-danger)', cursor: 'pointer', fontSize: '0.9rem',
                            padding: '0.4rem 1rem', borderRadius: '8px', fontFamily: 'var(--font-sans)', fontWeight: 600
                        }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Login</Link>
                        <Link to="/register" style={{
                            background: 'linear-gradient(135deg, var(--accent-primary), #818cf8)',
                            color: 'white', padding: '0.45rem 1.2rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem'
                        }}>Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            {/* Public */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/jobs" element={<Jobs />} />
                            <Route path="/jobs/:id" element={<JobDetail />} />

                            {/* Student Protected */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute requiredRole="ROLE_STUDENT"><Dashboard /></ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute requiredRole="ROLE_STUDENT"><Profile /></ProtectedRoute>
                            } />

                            {/* Admin Protected */}
                            <Route path="/admin" element={
                                <ProtectedRoute requiredRole="ROLE_ADMIN"><AdminDashboard /></ProtectedRoute>
                            } />
                            <Route path="/admin/companies" element={
                                <ProtectedRoute requiredRole="ROLE_ADMIN"><AdminCompanies /></ProtectedRoute>
                            } />
                            <Route path="/admin/jobs" element={
                                <ProtectedRoute requiredRole="ROLE_ADMIN"><AdminJobs /></ProtectedRoute>
                            } />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
