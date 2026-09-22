import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';

const Modal = ({ title, onClose, children }) => (
    <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
    }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>{title}</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            {children}
        </div>
    </div>
);

const emptyForm = { title: '', description: '', requiredSkills: '', salaryPackage: '', location: '', employmentType: 'FULL_TIME', experienceRequirement: '', minimumCgpa: '', applicationDeadline: '', companyId: '' };

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchJobs = (p = 0) => {
        setLoading(true);
        api.get(`/jobs?page=${p}&size=10`).then(r => {
            setJobs(r.data.content || []);
            setTotalPages(r.data.totalPages || 1);
            setPage(p);
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchJobs();
        api.get('/companies').then(r => setCompanies(r.data));
    }, []);

    const openCreate = () => { setForm(emptyForm); setModal('create'); };
    const openEdit = (j) => {
        setForm({
            ...j,
            applicationDeadline: j.applicationDeadline ? j.applicationDeadline.split('T')[0] : '',
            companyId: j.companyId || ''
        });
        setSelected(j);
        setModal('edit');
    };
    const closeModal = () => { setModal(null); setSelected(null); };
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setSaving(true);
        const payload = {
            ...form,
            companyId: Number(form.companyId),
            minimumCgpa: form.minimumCgpa ? Number(form.minimumCgpa) : null,
            applicationDeadline: form.applicationDeadline
                ? `${form.applicationDeadline}T23:59:59`
                : null
        };
        try {
            if (modal === 'create') {
                await api.post('/jobs', payload);
                setMsg('Job created!');
            } else {
                await api.put(`/jobs/${selected.id}`, payload);
                setMsg('Job updated!');
            }
            fetchJobs(page);
            closeModal();
        } catch (e) {
            setMsg(e.response?.data?.message || 'Error saving job.');
        }
        setSaving(false);
        setTimeout(() => setMsg(''), 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this job?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            setMsg('Job deleted.');
            fetchJobs(page);
        } catch { setMsg('Delete failed.'); }
        setTimeout(() => setMsg(''), 3000);
    };

    const typeColor = t => ({ FULL_TIME: 'var(--accent-success)', INTERNSHIP: 'var(--accent-primary)', PART_TIME: 'var(--accent-warning)' })[t] || 'var(--text-muted)';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Manage <span className="text-gradient">Jobs</span></h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{jobs.length} jobs on this page</p>
                </div>
                <Button onClick={openCreate}>+ Post Job</Button>
            </div>

            {msg && <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-success)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>{msg}</div>}

            <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                            {['Job Title', 'Company', 'Type', 'Location', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
                        ) : jobs.map(j => (
                            <tr key={j.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{j.title}</td>
                                <td style={{ padding: '1rem 1.25rem', color: 'var(--accent-primary)' }}>{j.companyName}</td>
                                <td style={{ padding: '1rem 1.25rem' }}>
                                    <span style={{ color: typeColor(j.employmentType), fontWeight: 600, fontSize: '0.8rem' }}>{(j.employmentType || '').replace('_', ' ')}</span>
                                </td>
                                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{j.location || '—'}</td>
                                <td style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                                    <Button variant="secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => openEdit(j)}>Edit</Button>
                                    <Button variant="danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleDelete(j.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                        {!loading && jobs.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No jobs yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <Button variant="secondary" onClick={() => fetchJobs(page - 1)} style={{ padding: '0.5rem 1rem' }} disabled={page === 0}>← Prev</Button>
                    <span style={{ padding: '0.5rem 1rem', color: 'var(--text-secondary)' }}>Page {page + 1} of {totalPages}</span>
                    <Button variant="secondary" onClick={() => fetchJobs(page + 1)} style={{ padding: '0.5rem 1rem' }} disabled={page >= totalPages - 1}>Next →</Button>
                </div>
            )}

            {modal && (
                <Modal title={modal === 'create' ? 'Post New Job' : 'Edit Job'} onClose={closeModal}>
                    <Input label="Job Title *" name="title" value={form.title} onChange={handleChange} required />
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Company *</label>
                        <select name="companyId" value={form.companyId} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none' }}>
                            <option value="">Select company...</option>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Employment Type</label>
                        <select name="employmentType" value={form.employmentType} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none' }}>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="INTERNSHIP">Internship</option>
                            <option value="PART_TIME">Part Time</option>
                        </select>
                    </div>
                    <Input label="Location" name="location" value={form.location || ''} onChange={handleChange} />
                    <Input label="Salary / Package" name="salaryPackage" value={form.salaryPackage || ''} onChange={handleChange} />
                    <Input label="Required Skills (comma separated)" name="requiredSkills" value={form.requiredSkills || ''} onChange={handleChange} />
                    <Input label="Experience Required" name="experienceRequirement" value={form.experienceRequirement || ''} onChange={handleChange} />
                    <Input label="Minimum CGPA" name="minimumCgpa" value={form.minimumCgpa || ''} onChange={handleChange} />
                    <Input label="Application Deadline" type="date" name="applicationDeadline" value={form.applicationDeadline || ''} onChange={handleChange} />
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Job Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={5}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none' }}
                        />
                    </div>
                    <Button onClick={handleSave} style={{ width: '100%' }}>{saving ? 'Saving...' : 'Save Job'}</Button>
                </Modal>
            )}
        </div>
    );
};

export default AdminJobs;
