import React, { useRef } from 'react';

const Card = ({ children, style, ...props }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 6;
        const rotateX = ((centerY - y) / centerY) * 6;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-8px)
            scale(1.02)
        `;

        card.style.boxShadow = `
            0 20px 45px rgba(0, 0, 0, 0.35),
            0 0 25px rgba(236, 72, 153, 0.30),
            0 0 60px rgba(168, 85, 247, 0.15)
        `;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;

        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        card.style.boxShadow = 'var(--glass-shadow)';
    };

    return (
        <div
            ref={cardRef}
            className="glass-panel premium-3d-card"
            style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'transform 0.15s ease-out, box-shadow 0.25s ease',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                ...style
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;