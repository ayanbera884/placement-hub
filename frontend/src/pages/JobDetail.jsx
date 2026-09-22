import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';

const JobDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get(`/jobs/${id}`).then(res => setJob(res.data)).catch(() => navigate('/jobs'));
    }, [id]);

    const handleApply = async () => {
        if (!user) { navigate('/login'); return; }
        setApplying(true);
        try {
            await api.post('/applications', { studentId: user.studentId, jobId: job.id });
            setMessage({ type: 'success', text: '🎉 Application submitted successfully!' });
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to apply.';
            setMessage({ type: 'error', text: msg });
        }
        setApplying(false);
        setTimeout(() => setMessage(''), 4000);
    };

    if (!job) return <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading job details...</div>;

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <button onClick={() => navigate('/jobs')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                ← Back to Jobs
            </button>

            {message && (
                <div style={{
                    background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: message.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem'
                }}>{message.text}</div>
            )}

            <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{job.title}</h1>
                        <p style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '1.1rem' }}>{job.companyName}</p>
                    </div>
                    <Button onClick={handleApply} style={{ padding: '0.85rem 2rem', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                        {applying ? 'Applying...' : '🚀 Apply Now'}
                    </Button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    {[
                        ['📍 Location', job.location],
                        ['💼 Type', job.employmentType],
                        ['💰 Package', job.salaryPackage],
                        ['🎓 Min CGPA', job.minimumCgpa],
                        ['📅 Deadline', job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Open']
                    ].filter(([, v]) => v).map(([label, val]) => (
                        <div key={label}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{label.split(' ').slice(1).join(' ')}</p>
                            <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{val}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Job Description</h2>
                <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{job.description}</p>
            </div>

            {job.requiredSkills && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Required Skills</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {job.requiredSkills.split(',').map(skill => (
                            <span key={skill} style={{
                                background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)',
                                padding: '0.35rem 0.9rem', borderRadius: '999px', fontWeight: 500
                            }}>{skill.trim()}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetail;
