import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [resume, setResume] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user?.studentId) {
            api.get(`/students/${user.studentId}`).then(res => {
                setProfile(res.data);
                setForm(res.data);
            });
            api.get(`/resumes/student/${user.studentId}`).then(res => {
                setResume(res.data);
            }).catch(() => setResume(null));
        }
    }, [user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put(`/students/${user.studentId}`, form);
            setProfile(res.data);
            setEditing(false);
            setMessage('Profile updated successfully!');
        } catch {
            setMessage('Failed to update profile.');
        }
        setSaving(false);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setMessage('Only PDF files are allowed.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);
        try {
            const res = await api.post(`/resumes/student/${user.studentId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResume(res.data);
            setMessage('Resume uploaded successfully!');
        } catch {
            setMessage('Resume upload failed.');
        }
        setUploading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleDeleteResume = async () => {
        try {
            await api.delete(`/resumes/student/${user.studentId}`);
            setResume(null);
            setMessage('Resume deleted.');
        } catch {
            setMessage('Failed to delete resume.');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    if (!profile) return <div style={{ color: 'var(--text-muted)' }}>Loading profile...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>My <span className="text-gradient">Profile</span></h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your student profile and resume</p>

            {message && (
                <div style={{
                    background: message.includes('success') || message.includes('Successfully') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.includes('success') || message.includes('Successfully') ? 'var(--accent-success)' : 'var(--accent-danger)',
                    border: `1px solid ${message.includes('success') || message.includes('Successfully') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem'
                }}>{message}</div>
            )}

            {/* Profile Card */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2>Personal Information</h2>
                    {!editing
                        ? <Button variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>
                        : (
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <Button variant="secondary" onClick={() => { setEditing(false); setForm(profile); }}>Cancel</Button>
                                <Button onClick={handleSave}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                            </div>
                        )
                    }
                </div>

                {editing ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                        <Input label="Full Name" name="name" value={form.name || ''} onChange={handleChange} />
                        <Input label="Email" name="email" value={form.email || ''} onChange={handleChange} />
                        <Input label="Phone" name="phone" value={form.phone || ''} onChange={handleChange} />
                        <Input label="College" name="college" value={form.college || ''} onChange={handleChange} />
                        <Input label="Degree" name="degree" value={form.degree || ''} onChange={handleChange} />
                        <Input label="Branch" name="branch" value={form.branch || ''} onChange={handleChange} />
                        <Input label="Graduation Year" name="graduationYear" value={form.graduationYear || ''} onChange={handleChange} />
                        <Input label="CGPA" name="cgpa" value={form.cgpa || ''} onChange={handleChange} />
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Input label="Skills (comma separated)" name="skills" value={form.skills || ''} onChange={handleChange} />
                        </div>
                        <Input label="GitHub URL" name="githubUrl" value={form.githubUrl || ''} onChange={handleChange} />
                        <Input label="LinkedIn URL" name="linkedinUrl" value={form.linkedinUrl || ''} onChange={handleChange} />
                        <Input label="Portfolio URL" name="portfolioUrl" value={form.portfolioUrl || ''} onChange={handleChange} />
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Bio</label>
                            <textarea
                                name="bio"
                                value={form.bio || ''}
                                onChange={handleChange}
                                rows={4}
                                style={{
                                    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            ['Name', profile.name], ['Email', profile.email], ['Phone', profile.phone],
                            ['College', profile.college], ['Degree', profile.degree], ['Branch', profile.branch],
                            ['Graduation Year', profile.graduationYear], ['CGPA', profile.cgpa],
                        ].map(([label, val]) => (
                            <div key={label}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</p>
                                <p style={{ fontWeight: 500 }}>{val || '—'}</p>
                            </div>
                        ))}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Skills</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {profile.skills ? profile.skills.split(',').map(s => (
                                    <span key={s} style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 500 }}>{s.trim()}</span>
                                )) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                            </div>
                        </div>
                        {profile.bio && <div style={{ gridColumn: '1 / -1' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Bio</p>
                            <p style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
                        </div>}
                    </div>
                )}
            </div>

            {/* Resume Card */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Resume</h2>
                {resume ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '1rem 1.5rem', borderRadius: '10px' }}>
                        <div>
                            <p style={{ fontWeight: 600 }}>📄 {resume.fileName}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                {(resume.fileSize / 1024).toFixed(1)} KB • Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <a href={resume.downloadUrl} target="_blank" rel="noreferrer">
                                <Button variant="secondary">Download</Button>
                            </a>
                            <Button variant="danger" onClick={handleDeleteResume}>Delete</Button>
                        </div>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No resume uploaded yet.</p>
                )}
                <div style={{ marginTop: '1rem' }}>
                    <label style={{
                        display: 'inline-block',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, var(--accent-primary), #818cf8)',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}>
                        {uploading ? 'Uploading...' : resume ? '🔄 Replace Resume (PDF)' : '📤 Upload Resume (PDF)'}
                        <input type="file" accept=".pdf" onChange={handleResumeUpload} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Profile;
