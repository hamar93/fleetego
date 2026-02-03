import React, { useState } from 'react';

const Dashboard = () => {
    const [showAi, setShowAi] = useState(true);

    return (
        <div className="content-section active">
            {/* Welcome Section */}
            <div className="welcome-section">
                <h2 className="welcome-title">Üdvözöljük a FleetEgo Agent Office-ban!</h2>
                <p className="welcome-subtitle">AI-alapú fuvarszervező és TMS rendszer a hatékony logisztikai menedzsmentért</p>

                {showAi && (
                    <div className="ai-messages">
                        <div className="ai-message">
                            <div className="ai-message-header">
                                <div className="ai-badge">
                                    <i className="fas fa-robot"></i>
                                    AI Asszisztens
                                </div>
                                <button className="close-ai" onClick={() => setShowAi(false)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <p>Jó napot! Segítek megtalálni a legjobb fuvarokat a Timocom platformon. Mondja el, milyen típusú szállítást keres, és én automatikusan leszűröm és rangosolom az ajánlatokat az Ön kritériumai szerint.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00d4aa, #00a0db)' }}>
                            <i className="fas fa-truck"></i>
                        </div>
                        <div className="stat-change positive">+12%</div>
                    </div>
                    <div className="stat-value">24</div>
                    <div className="stat-label">Aktív fuvarok</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ff4757)' }}>
                            <i className="fas fa-euro-sign"></i>
                        </div>
                        <div className="stat-change positive">+8%</div>
                    </div>
                    <div className="stat-value">€485K</div>
                    <div className="stat-label">Havi bevétel</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ffb800, #ff9900)' }}>
                            <i className="fas fa-route"></i>
                        </div>
                        <div className="stat-change positive">+15%</div>
                    </div>
                    <div className="stat-value">98.2%</div>
                    <div className="stat-label">Időben teljesítés</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00ff88, #00cc77)' }}>
                            <i className="fas fa-gas-pump"></i>
                        </div>
                        <div className="stat-change negative">-5%</div>
                    </div>
                    <div className="stat-value">7.2L</div>
                    <div className="stat-label">Átlag fogyasztás</div>
                </div>
            </div>

            {/* Quick Actions (Requested Feature) */}
            <div className="quick-actions" style={{ marginTop: '32px' }}>
                <div className="section-title" style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Gyors Műveletek</div>
                <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="action-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
                        <div className="action-icon" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>➕</div>
                        <div className="action-content">
                            <div className="action-title" style={{ fontWeight: '600', marginBottom: '2px' }}>Új Fuvar</div>
                            <div className="action-description" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Fuvar létrehozása</div>
                        </div>
                    </div>
                    <div className="action-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
                        <div className="action-icon" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📊</div>
                        <div className="action-content">
                            <div className="action-title" style={{ fontWeight: '600', marginBottom: '2px' }}>Jelentés</div>
                            <div className="action-description" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Riport generálás</div>
                        </div>
                    </div>
                    <div className="action-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
                        <div className="action-icon" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔍</div>
                        <div className="action-content">
                            <div className="action-title" style={{ fontWeight: '600', marginBottom: '2px' }}>Timocom</div>
                            <div className="action-description" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Fuvarok keresése</div>
                        </div>
                    </div>
                    <div className="action-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
                        <div className="action-icon" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💬</div>
                        <div className="action-content">
                            <div className="action-title" style={{ fontWeight: '600', marginBottom: '2px' }}>AI Chat</div>
                            <div className="action-description" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Asszisztens indítása</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
