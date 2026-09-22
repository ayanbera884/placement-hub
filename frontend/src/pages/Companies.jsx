import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/companies').then(res => {
            setCompanies(res.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.industry || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-gradient" style={{ marginBottom: '0.5rem' }}>Top Companies</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Explore companies recruiting on PlacementHub</p>

            <input
                placeholder="🔍 Search companies or industry..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                    width: '100%', maxWidth: '500px', padding: '0.75rem 1rem',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                    borderRadius: '8px', color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)', outline: 'none', marginBottom: '2rem'
                }}
            />

            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Loading companies...</div>
            ) : filtered.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No companies found.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map(company => (
                        <Card key={company.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs?keyword=${company.name}`)}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem'
                            }}>
                                {company.name.charAt(0)}
                            </div>
                            <h3 style={{ fontSize: '1.1rem' }}>{company.name}</h3>
                            {company.industry && <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{company.industry}</p>}
                            {company.location && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>📍 {company.location}</p>}
                            {company.companySize && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>👥 {company.companySize}</p>}
                            {company.description && (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
                                    {company.description.slice(0, 100)}{company.description.length > 100 ? '...' : ''}
                                </p>
                            )}
                            <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, marginTop: 'auto' }}>View Jobs →</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Companies;
