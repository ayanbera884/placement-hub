import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            if (user?.studentId) {
                try {
                    const res = await api.get(`/applications/student/${user.studentId}`);
                    setApplications(res.data);
                } catch (error) {
                    console.error("Failed to fetch applications", error);
                }
            }
            setLoading(false);
        };
        fetchApplications();
    }, [user]);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Welcome back, <span className="text-gradient">{user?.email}</span></h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <Card>
                    <h3 style={{ color: 'var(--text-secondary)' }}>Total Applications</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{applications.length}</p>
                </Card>
                <Card>
                    <h3 style={{ color: 'var(--text-secondary)' }}>Interviews</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-warning)' }}>
                        {applications.filter(a => a.status === 'INTERVIEW').length}
                    </p>
                </Card>
                <Card>
                    <h3 style={{ color: 'var(--text-secondary)' }}>Selected</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>
                        {applications.filter(a => a.status === 'SELECTED').length}
                    </p>
                </Card>
            </div>

            <h2>Your Recent Applications</h2>
            {loading ? <p>Loading...</p> : (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {applications.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>You haven't applied to any jobs yet.</p>
                    ) : (
                        applications.map(app => (
                            <div key={app.id} className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem' }}>{app.jobTitle}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{app.companyName}</p>
                                </div>
                                <div>
                                    <span style={{ 
                                        padding: '0.25rem 0.75rem', 
                                        borderRadius: '999px', 
                                        fontSize: '0.8rem', 
                                        fontWeight: '600',
                                        background: app.status === 'SELECTED' ? 'rgba(16, 185, 129, 0.2)' : 
                                                    app.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 
                                                    'rgba(99, 102, 241, 0.2)',
                                        color: app.status === 'SELECTED' ? 'var(--accent-success)' : 
                                               app.status === 'REJECTED' ? 'var(--accent-danger)' : 
                                               'var(--accent-primary)'
                                    }}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
