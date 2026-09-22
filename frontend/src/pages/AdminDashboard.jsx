import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        companies: 0,
        jobs: 0,
        applications: 0
    });

    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, companiesRes, jobsRes, appsRes] = await Promise.all([
                    api.get('/students'),
                    api.get('/companies'),
                    api.get('/jobs'),
                    api.get('/applications')
                ]);

                setStats({
                    students: studentsRes.data.length ?? 0,
                    companies: companiesRes.data.length ?? 0,
                    jobs: jobsRes.data.totalElements ?? jobsRes.data.content?.length ?? 0,
                    applications: appsRes.data.length ?? 0
                });

                const apps = Array.isArray(appsRes.data)
                    ? appsRes.data.slice(0, 8)
                    : [];

                setRecentApplications(apps);

            } catch (err) {
                console.error('Admin dashboard error', err);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const updateStatus = async (appId, status) => {
        try {
            await api.patch(`/applications/${appId}/status?status=${status}`);

            setRecentApplications(prev =>
                prev.map(a =>
                    a.id === appId
                        ? { ...a, status }
                        : a
                )
            );

        } catch (err) {
            console.error('Status update failed', err);
        }
    };

    const statusColor = (s) => ({
        APPLIED: 'rgba(99,102,241,0.2)',
        SHORTLISTED: 'rgba(245,158,11,0.2)',
        INTERVIEW: 'rgba(59,130,246,0.2)',
        SELECTED: 'rgba(16,185,129,0.2)',
        REJECTED: 'rgba(239,68,68,0.2)',
        WITHDRAWN: 'rgba(100,116,139,0.2)'
    })[s] || 'rgba(255,255,255,0.05)';

    const statusText = (s) => ({
        APPLIED: 'var(--accent-primary)',
        SHORTLISTED: 'var(--accent-warning)',
        INTERVIEW: '#3b82f6',
        SELECTED: 'var(--accent-success)',
        REJECTED: 'var(--accent-danger)',
        WITHDRAWN: 'var(--text-muted)'
    })[s] || 'var(--text-secondary)';

    return (
        <div>

            {/* Header */}
            <div className="admin-page-header">
                <div>
                    <div className="admin-eyebrow">
                        ⚡ ADMIN CONTROL CENTER
                    </div>

                    <h1 className="admin-title">
                        Admin <span className="text-gradient">Dashboard</span>
                    </h1>

                    <p
                        style={{
                            display: 'inline-block',
                            margin: '0.75rem 0 0',
                            padding: '0.5rem 0.9rem',
                            color: '#cbd5e1',
                            fontSize: '0.92rem',
                            fontWeight: 500,
                            background: 'rgba(34, 211, 238, 0.06)',
                            border: '1px solid rgba(34, 211, 238, 0.18)',
                            borderRadius: '8px',
                            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.18)',
                            textShadow: '0 0 10px rgba(34, 211, 238, 0.15)'
                        }}
                    >
                        <span style={{ color: '#22d3ee' }}>Platform</span>
                        {' overview '}
                        <span style={{ color: 'rgba(255,255,255,0.25)' }}>•</span>
                        {' Application management'}
                    </p>
                </div>

                <div className="admin-header-badge" style={{ visibility: 'hidden' }}>
                    <span className="status-dot"></span>
                    hhv
                </div>
            </div>


            {/* Stats */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                }}
            >
                {[
                    {
                        label: 'Students',
                        value: stats.students,
                        icon: '🎓',
                        color: 'var(--accent-primary)'
                    },
                    {
                        label: 'Companies',
                        value: stats.companies,
                        icon: '🏢',
                        color: 'var(--accent-secondary)'
                    },
                    {
                        label: 'Jobs',
                        value: stats.jobs,
                        icon: '💼',
                        color: 'var(--accent-warning)'
                    },
                    {
                        label: 'Applications',
                        value: stats.applications,
                        icon: '📋',
                        color: 'var(--accent-success)'
                    }
                ].map(({ label, value, icon, color }) => (
                    <Card
                        key={label}
                        style={{
                            textAlign: 'center',
                            cursor: 'default',
                            position: 'relative',
                            overflow: 'hidden',
                            padding: '1.75rem',

                            border: '1px solid var(--border-color)'
                        }}
                    >
                        <div
                            style={{
                                width: '58px',
                                height: '58px',
                                margin: '0 auto 1rem',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-color)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            }}
                        >
                            {icon}
                        </div>

                        <h3
                            style={{
                                fontSize: '2.35rem',
                                letterSpacing: '-0.04em',
                                marginBottom: '0.25rem',
                                fontWeight: 800,
                                color
                            }}
                        >
                            {loading ? '—' : value}
                        </h3>

                        <p
                            style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.9rem'
                            }}
                        >
                            {label}
                        </p>
                    </Card>
                ))}
            </div>


            {/* Quick Management */}
            <h2 style={{ marginBottom: '1rem' }}>
                Quick Management
            </h2>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                }}
            >

                {/* Manage Companies */}
                <Link
                    to="/admin/companies"
                    style={{
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    <Card
                        style={{
                            cursor: 'pointer',

                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                            🏢
                        </div>

                        <h3 style={{ marginBottom: '0.5rem' }}>
                            Manage Companies
                        </h3>

                        <p style={{
                            color: 'var(--text-muted)',
                            marginBottom: '1rem'
                        }}>
                            Add, edit and delete companies
                        </p>

                        <span
                            style={{
                                color: 'var(--accent-primary)',
                                fontWeight: 600
                            }}
                        >
                            Open Companies →
                        </span>
                    </Card>
                </Link>


                {/* Manage Jobs */}
                <Link
                    to="/admin/jobs"
                    style={{
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    <Card
                        style={{
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease, border-color 0.2s ease'
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                            💼
                        </div>

                        <h3 style={{ marginBottom: '0.5rem' }}>
                            Manage Jobs
                        </h3>

                        <p style={{
                            color: 'var(--text-muted)',
                            marginBottom: '1rem'
                        }}>
                            Create, edit and delete job postings
                        </p>

                        <span
                            style={{
                                color: 'var(--accent-primary)',
                                fontWeight: 600
                            }}
                        >
                            Open Jobs →
                        </span>
                    </Card>
                </Link>

            </div>


            {/* Applications Table */}
            <h2 style={{ marginBottom: '1rem' }}>
                Recent Applications
            </h2>

            <div
                className="glass-panel"
                style={{
                    overflow: 'hidden',
                    padding: 0
                }}
            >
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.9rem'
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                borderBottom: '1px solid var(--border-color)',
                                background: 'rgba(255,255,255,0.02)'
                            }}
                        >
                            {[
                                'Student',
                                'Job',
                                'Company',
                                'Status',
                                'Actions'
                            ].map(h => (
                                <th
                                    key={h}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        textAlign: 'left',
                                        color: 'var(--text-muted)',
                                        fontWeight: 600
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    style={{
                                        padding: '2rem',
                                        textAlign: 'center',
                                        color: 'var(--text-muted)'
                                    }}
                                >
                                    Loading...
                                </td>
                            </tr>

                        ) : recentApplications.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={5}
                                    style={{
                                        padding: '2rem',
                                        textAlign: 'center',
                                        color: 'var(--text-muted)'
                                    }}
                                >
                                    No applications yet.
                                </td>
                            </tr>

                        ) : (

                            recentApplications.map(app => (
                                <tr
                                    key={app.id}
                                    style={{
                                        borderBottom: '1px solid var(--border-color)'
                                    }}
                                >

                                    <td style={{
                                        padding: '0.9rem 1.25rem',
                                        fontWeight: 500
                                    }}>
                                        {app.studentName}
                                    </td>

                                    <td style={{
                                        padding: '0.9rem 1.25rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {app.jobTitle}
                                    </td>

                                    <td style={{
                                        padding: '0.9rem 1.25rem',
                                        color: 'var(--text-muted)'
                                    }}>
                                        {app.companyName}
                                    </td>

                                    <td style={{
                                        padding: '0.9rem 1.25rem'
                                    }}>
                                        <span
                                            style={{
                                                padding: '0.2rem 0.65rem',
                                                borderRadius: '999px',
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                background: statusColor(app.status),
                                                color: statusText(app.status)
                                            }}
                                        >
                                            {app.status}
                                        </span>
                                    </td>

                                    <td style={{
                                        padding: '0.9rem 1.25rem'
                                    }}>
                                        <select
                                            value={app.status}
                                            onChange={(e) =>
                                                updateStatus(
                                                    app.id,
                                                    e.target.value
                                                )
                                            }
                                            style={{
                                                background: 'var(--bg-secondary)',
                                                color: 'var(--text-primary)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '6px',
                                                padding: '0.3rem 0.5rem',
                                                fontFamily: 'var(--font-sans)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {[
                                                'APPLIED',
                                                'SHORTLISTED',
                                                'INTERVIEW',
                                                'SELECTED',
                                                'REJECTED'
                                            ].map(s => (
                                                <option
                                                    key={s}
                                                    value={s}
                                                >
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                </tr>
                            ))

                        )}

                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminDashboard;