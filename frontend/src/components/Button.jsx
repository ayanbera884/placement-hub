import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', style, ...props }) => {
    const baseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        transition: 'all var(--transition-normal)',
        fontFamily: 'var(--font-sans)',
        ...style
    };

    const variants = {
        primary: {
            background: 'linear-gradient(135deg, var(--accent-primary), #818cf8)',
            color: 'white',
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
        },
        secondary: {
            background: 'var(--glass-bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--glass-border)',
        },
        danger: {
            background: 'var(--accent-danger)',
            color: 'white',
        }
    };

    return (
        <button 
            type={type} 
            onClick={onClick} 
            style={{ ...baseStyle, ...variants[variant] }}
            {...props}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {children}
        </button>
    );
};

export default Button;
