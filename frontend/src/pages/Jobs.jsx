import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchJobs = async (p = 0) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: p, size: 9 });
            if (keyword) params.append('keyword', keyword);
            if (location) params.append('location', location);
            if (employmentType) params.append('employmentType', employmentType);

            const res = await api.get(`/jobs?${params.toString()}`);
            setJobs(res.data.content || []);
            setTotalPages(res.data.totalPages || 1);
            setPage(p);
        } catch (err) {
            console.error('Failed to load jobs', err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchJobs(0); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(0);
    };

    const employmentTypeColor = (type) => ({
        FULL_TIME: { bg: 'rgba(16,185,129,0.15)', text: 'var(--accent-success)' },
        INTERNSHIP: { bg: 'rgba(99,102,241,0.15)', text: 'var(--accent-primary)' },
        PART_TIME: { bg: 'rgba(245,158,11,0.15)', text: 'var(--accent-warning)' }
    }[type] || { bg: 'rgba(255,255,255,0.05)', text: 'var(--text-secondary)' });

    return (
        <div>
            <h1 className="text-gradient" style={{ marginBottom: '0.5rem' }}>Browse Opportunities</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Find your perfect placement match</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                <input
                    placeholder="🔍 Search jobs or keywords..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    style={{
                        flex: '1', minWidth: '200px', padding: '0.75rem 1rem',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                        borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none'
                    }}
                />
                <input
                    placeholder="📍 Location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={{
                        width: '160px', padding: '0.75rem 1rem',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                        borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none'
                    }}
                />
                <select
                    value={employmentType}
                    onChange={e => setEmploymentType(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem', background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)', borderRadius: '8px',
                        color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none'
                    }}
                >
                    <option value="">All Types</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="PART_TIME">Part Time</option>
                </select>
                <Button type="submit">Search</Button>
            </form>

            {/* Job Cards */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading jobs...</div>
            ) : jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No jobs found matching your criteria.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {jobs.map(job => {
                        const typeStyle = employmentTypeColor(job.employmentType);
                        return (
                            <Card key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${job.id}`)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ fontSize: '1.1rem', flex: 1 }}>{job.title}</h3>
                                    {job.employmentType && (
                                        <span style={{ background: typeStyle.bg, color: typeStyle.text, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                                            {job.employmentType.replace('_', ' ')}
                                        </span>
                                    )}
                                </div>
                                <p style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{job.companyName}</p>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    {job.location && <span>📍 {job.location}</span>}
                                    {job.salaryPackage && <span>💰 {job.salaryPackage}</span>}
                                    {job.minimumCgpa && <span>🎓 Min CGPA: {job.minimumCgpa}</span>}
                                </div>
                                <Button style={{ marginTop: 'auto', fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}>View & Apply →</Button>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
                    <Button variant="secondary" onClick={() => fetchJobs(page - 1)} style={{ padding: '0.5rem 1rem' }} disabled={page === 0}>← Prev</Button>
                    <span style={{ padding: '0.5rem 1rem', color: 'var(--text-secondary)' }}>Page {page + 1} of {totalPages}</span>
                    <Button variant="secondary" onClick={() => fetchJobs(page + 1)} style={{ padding: '0.5rem 1rem' }} disabled={page >= totalPages - 1}>Next →</Button>
                </div>
            )}
        </div>
    );
};

export default Jobs;
