import React from 'react';

const Placeholder = ({ title }) => {
    return (
        <div className="content-card">
            <h2 className="card-title">{title}</h2>
            <p className="card-subtitle">Ez a modul fejlesztés alatt áll.</p>
            <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                <i className="fas fa-tools" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                <p>Hamarosan érkezik...</p>
            </div>
        </div>
    );
};

export default Placeholder;
