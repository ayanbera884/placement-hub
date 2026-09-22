import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{desc}</p>
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    return (
        <div>
            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '5rem 1rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
                <span style={{
                    display: 'inline-block', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)',
                    border: '1px solid rgba(99,102,241,0.3)', borderRadius: '999px',
                    padding: '0.35rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem'
                }}>
                    🚀 Your Campus to Career Platform
                </span>
                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                    Land Your Dream Job <br />
                    <span className="text-gradient">Faster Than Ever</span>
                </h1>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '550px', margin: '0 auto 3rem' }}>
                    PlacementHub connects engineering students with top companies. Manage your profile, apply to jobs, and track your entire placement journey — all in one place.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button onClick={() => navigate('/jobs')} style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                        Browse Jobs →
                    </Button>
                    {!user && (
                        <Button variant="secondary" onClick={() => navigate('/register')} style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                            Create Free Account
                        </Button>
                    )}
                    {user && (
                        <Button variant="secondary" onClick={() => navigate('/dashboard')} style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                            Go to Dashboard
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', margin: '3rem 0' }}>
                {[
                    { val: '500+', label: 'Active Jobs' },
                    { val: '100+', label: 'Partner Companies' },
                    { val: '10k+', label: 'Students Placed' },
                    { val: '95%', label: 'Success Rate' },
                ].map(({ val, label }) => (
                    <div key={label} className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
                        <h3 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.3rem' }}>{val}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</p>
                    </div>
                ))}
            </div>

            {/* Features */}
            <div style={{ margin: '4rem 0' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.75rem' }}>Everything You Need to <span className="text-gradient">Get Placed</span></h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>Built for students, by people who understand placement season stress.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    <FeatureCard icon="💼" title="Browse & Apply to Jobs" desc="Explore thousands of jobs filtered by type, location, and skill requirements. Apply with one click." />
                    <FeatureCard icon="📋" title="Track Applications" desc="Know exactly where you stand. See your application status updated in real-time from APPLIED to SELECTED." />
                    <FeatureCard icon="📄" title="Resume Management" desc="Upload your PDF resume once. It's securely stored and can be downloaded any time by you or recruiters." />
                    <FeatureCard icon="🎓" title="Student Profile" desc="Build a comprehensive profile with your education, skills, CGPA, GitHub, LinkedIn, and portfolio." />
                    <FeatureCard icon="🏢" title="Company Explorer" desc="Research top companies recruiting at your campus. View industry, size, and open roles." />
                    <FeatureCard icon="⚡" title="Instant Notifications" desc="Never miss a deadline. Get notified when your application status changes." />
                </div>
            </div>

            {/* CTA */}
            {!user && (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', margin: '3rem 0', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.1))' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to Start Your Journey?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Join thousands of students already using PlacementHub.</p>
                    <Button onClick={() => navigate('/register')} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Get Started — It's Free</Button>
                </div>
            )}

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border-color)', marginTop: '4rem', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', paddingBottom: '2rem' }}>
                <p>⚡ <strong className="text-gradient">PlacementHub</strong> — Built with Spring Boot + React</p>
            </footer>
        </div>
    );
};

export default Home;
