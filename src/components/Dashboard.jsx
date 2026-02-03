import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();

    return (
        <div className="dashboard-container fade-in">
            {/* Welcome / Hero Section */}
            <div className="hero-section" style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.4))',
                borderRadius: '16px',
                padding: '2.5rem',
                border: '1px solid var(--glass-border)',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {t('dashboard.welcome')}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '600px' }}>
                        {t('dashboard.subtitle')}
                    </p>

                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        color: 'var(--accent-success)',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-success)', boxShadow: '0 0 10px var(--accent-success)' }}></span>
                        {t('dashboard.ai_active')}
                    </div>
                </div>

                {/* Background Decor */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)',
                    zIndex: 1
                }}></div>
            </div>

            {/* Statistics Grid - EXACTLY 3 CARDS */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Card 1: Active Tasks */}
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-color)', borderRadius: '12px' }}>
                            <i className="fas fa-truck"></i>
                        </div>
                        <div className="stat-change positive">
                            <i className="fas fa-arrow-up" style={{ fontSize: '0.7em', marginRight: '4px' }}></i>
                            +12%
                        </div>
                    </div>
                    <div className="stat-value">24</div>
                    <div className="stat-label" style={{ marginBottom: '1rem' }}>{t('dashboard.active_shipments')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('dashboard.last_week')}: <span style={{ color: 'var(--text-secondary)' }}>21</span></div>
                </div>

                {/* Card 2: Revenue */}
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', borderRadius: '12px' }}>
                            <i className="fas fa-coins"></i>
                        </div>
                        <div className="stat-change positive">
                            <i className="fas fa-arrow-up" style={{ fontSize: '0.7em', marginRight: '4px' }}></i>
                            +8%
                        </div>
                    </div>
                    <div className="stat-value">€485K</div>
                    <div className="stat-label" style={{ marginBottom: '1rem' }}>{t('dashboard.monthly_revenue')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('dashboard.last_month')}: <span style={{ color: 'var(--text-secondary)' }}>€449K</span></div>
                </div>

                {/* Card 3: Performance */}
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--secondary-color)', borderRadius: '12px' }}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="stat-change positive">
                            <i className="fas fa-arrow-up" style={{ fontSize: '0.7em', marginRight: '4px' }}></i>
                            +2.4%
                        </div>
                    </div>
                    <div className="stat-value">98.2%</div>
                    <div className="stat-label" style={{ marginBottom: '1rem' }}>{t('dashboard.performance')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('dashboard.goal')}: <span style={{ color: 'var(--text-secondary)' }}>95%</span></div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions" style={{ marginTop: '32px' }}>
                <div className="section-title" style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>{t('dashboard.quick_actions')}</div>
                <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    <div className="action-card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.3s' }}>
                        <div className="action-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                            <i className="fas fa-plus"></i>
                        </div>
                        <div className="action-content">
                            <div className="action-title" style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.95rem' }}>{t('dashboard.new_shipment')}</div>
                            <div className="action-description" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('dashboard.create_shipment')}</div>
                        </div>
                    </div>

                    <div className="action-card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.3s' }}>
                        <div className="action-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--accent-success)' }}>
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="action-content">
                            <div className="action-title" style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.95rem' }}>{t('sidebar.reports')}</div>
                            <div className="action-description" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('dashboard.create_report')}</div>
                        </div>
                    </div>

                    <div className="action-card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.3s' }}>
                        <div className="action-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--secondary-color)' }}>
                            <i className="fas fa-search"></i>
                        </div>
                        <div className="action-content">
                            <div className="action-title" style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.95rem' }}>Timocom</div>
                            <div className="action-description" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('dashboard.search_freight')}</div>
                        </div>
                    </div>

                    <div className="action-card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.3s' }}>
                        <div className="action-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#ec4899' }}>
                            <i className="fas fa-comment-alt"></i>
                        </div>
                        <div className="action-content">
                            <div className="action-title" style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.95rem' }}>{t('sidebar.ai_chat')}</div>
                            <div className="action-description" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('dashboard.start_assistant')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
