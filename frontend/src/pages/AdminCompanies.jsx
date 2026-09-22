import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';

const Modal = ({ title, onClose, children }) => (
    <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
    }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '550px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>{title}</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            {children}
        </div>
    </div>
);

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'create' | 'edit'
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', website: '', location: '', industry: '', companySize: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchCompanies = () => {
        setLoading(true);
        api.get('/companies').then(r => setCompanies(r.data)).finally(() => setLoading(false));
    };

    useEffect(() => { fetchCompanies(); }, []);

    const openCreate = () => { setForm({ name: '', description: '', website: '', location: '', industry: '', companySize: '' }); setModal('create'); };
    const openEdit = (c) => { setForm(c); setSelected(c); setModal('edit'); };
    const closeModal = () => { setModal(null); setSelected(null); };

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setSaving(true);
        try {
            if (modal === 'create') {
                await api.post('/companies', form);
                setMsg('Company created!');
            } else {
                await api.put(`/companies/${selected.id}`, form);
                setMsg('Company updated!');
            }
            fetchCompanies();
            closeModal();
        } catch (e) {
            setMsg(e.response?.data?.message || 'Error saving company.');
        }
        setSaving(false);
        setTimeout(() => setMsg(''), 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this company and all its jobs?')) return;
        try {
            await api.delete(`/companies/${id}`);
            setMsg('Company deleted.');
            fetchCompanies();
        } catch { setMsg('Delete failed.'); }
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Manage <span className="text-gradient">Companies</span></h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{companies.length} companies registered</p>
                </div>
                <Button onClick={openCreate}>+ Add Company</Button>
            </div>

            {msg && <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-success)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>{msg}</div>}

            <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                            {['Company', 'Industry', 'Location', 'Size', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
                        ) : companies.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{c.name}</td>
                                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>{c.industry || '—'}</td>
                                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{c.location || '—'}</td>
                                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{c.companySize || '—'}</td>
                                <td style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                                    <Button variant="secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => openEdit(c)}>Edit</Button>
                                    <Button variant="danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleDelete(c.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                        {!loading && companies.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No companies yet. Add one!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modal && (
                <Modal title={modal === 'create' ? 'Add Company' : 'Edit Company'} onClose={closeModal}>
                    <Input label="Company Name *" name="name" value={form.name} onChange={handleChange} required />
                    <Input label="Industry" name="industry" value={form.industry || ''} onChange={handleChange} />
                    <Input label="Location" name="location" value={form.location || ''} onChange={handleChange} />
                    <Input label="Website" name="website" value={form.website || ''} onChange={handleChange} />
                    <Input label="Company Size (e.g. 100-500)" name="companySize" value={form.companySize || ''} onChange={handleChange} />
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <textarea
                            name="description"
                            value={form.description || ''}
                            onChange={handleChange}
                            rows={3}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none' }}
                        />
                    </div>
                    <Button onClick={handleSave} style={{ width: '100%' }}>{saving ? 'Saving...' : 'Save Company'}</Button>
                </Modal>
            )}
        </div>
    );
};

export default AdminCompanies;
