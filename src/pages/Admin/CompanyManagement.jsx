import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const CompanyManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const response = await api.get('/api/admin/companies');
            setCompanies(response.data);
        } catch (error) {
            console.error("Failed to load companies:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin fa-2x"></i>
        </div>
    );

    return (
        <div className="fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h2 className="header-title" style={{ fontSize: '2rem' }}>Cégek Kezelése</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Regisztrált cégek és statisztikák</p>
            </div>

            <div className="stats-grid">
                {companies.map((company, index) => (
                    <div key={index} className="stat-card" style={{ position: 'relative' }}>
                        <div className="stat-header">
                            <div className="stat-icon" style={{ background: 'rgba(0, 229, 192, 0.15)', color: 'var(--primary-color)' }}>
                                <i className="fas fa-building"></i>
                            </div>
                            <div className="stat-change positive">Aktív</div>
                        </div>
                        <div className="stat-value" style={{ fontSize: '1.5rem', marginBottom: '1rem', wordBreak: 'break-all' }}>
                            {company.name}
                        </div>
                        <div className="stat-label">
                            <i className="fas fa-users" style={{ marginRight: '8px' }}></i>
                            {company.user_count} Felhasználó
                        </div>
                        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Regisztrálva: {new Date(company.created_at).toLocaleDateString('hu-HU')}
                        </div>
                    </div>
                ))}
            </div>

            {companies.length === 0 && (
                <div className="content-card" style={{ textAlign: 'center' }}>
                    <p>Nincs megjeleníthető cég.</p>
                </div>
            )}
        </div>
    );
};

export default CompanyManagement;
