import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center' }}>
            <h1 style={{ fontSize: '8rem', fontWeight: 900, lineHeight: 1 }} className="text-gradient">404</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Page Not Found</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Button onClick={() => navigate('/')}>Go Back Home</Button>
        </div>
    );
};

export default NotFound;
