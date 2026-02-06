import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './Settings.css';

const Settings = () => {
    const [settings, setSettings] = useState({
        timocom_id: '',
        timocom_api_key: '',
        timocom_customer_ref: ''
    });
    const [status, setStatus] = useState(null); // connected, disconnected, loading
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await api.get('/api/settings/integrations');
            setSettings({
                timocom_id: response.data.timocom_id || '',
                timocom_api_key: '', // Don't show the masked key, just empty for security or placeholder
                timocom_customer_ref: response.data.timocom_customer_ref || ''
            });

            // Check connection status
            checkStatus();
        } catch (error) {
            console.error("Failed to load settings:", error);
        }
    };

    const checkStatus = async () => {
        try {
            const response = await api.get('/api/timocom/status');
            setStatus(response.data.status);
        } catch (error) {
            setStatus('error');
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            // Only send api key if it has value (to update it)
            const payload = {
                timocom_id: settings.timocom_id,
                timocom_customer_ref: settings.timocom_customer_ref
            };
            if (settings.timocom_api_key) {
                payload.timocom_api_key = settings.timocom_api_key;
            }

            await api.put('/api/settings/integrations', payload);
            setMessage('Beállítások sikeresen mentve.');

            // Re-check status after save
            setTimeout(checkStatus, 1000);

            // Clear password field
            setSettings(prev => ({ ...prev, timocom_api_key: '' }));
        } catch (error) {
            console.error("Failed to save settings:", error);
            setMessage('Hiba történt a mentés során.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h2 className="header-title" style={{ fontSize: '2rem' }}>Beállítások</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Rendszer és integrációs beállítások</p>
            </div>

            <div className="content-card">
                <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                    <i className="fas fa-truck-loading" style={{ color: '#f59e0b', marginRight: '10px' }}></i>
                    Timocom Integráció
                </h3>

                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Adja meg a cég Timocom azonosítóját és API kulcsát a fuvarbörze eléréséhez.
                    </p>

                    <div className={`status-badge ${status === 'connected' ? 'status-approved' : 'status-rejected'}`} style={{ display: 'inline-block' }}>
                        <i className={`fas fa-${status === 'connected' ? 'check-circle' : 'exclamation-circle'}`}></i>
                        {status === 'connected' ? ' Kapcsolódva' : ' Nincs kapcsolat'}
                    </div>
                </div>

                <form onSubmit={handleSave} style={{ maxWidth: '600px' }}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Timocom ID (Ügyfélszám)</label>
                        <input
                            type="text"
                            name="timocom_id"
                            value={settings.timocom_id}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="pl. 123456"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Customer Reference</label>
                        <input
                            type="text"
                            name="timocom_customer_ref"
                            value={settings.timocom_customer_ref}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="pl. 902717"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>API Kulcs (Client Secret)</label>
                        <input
                            type="password"
                            name="timocom_api_key"
                            value={settings.timocom_api_key}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Adja meg az új kulcsot a frissítéshez"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-primary)'
                            }}
                        />
                        <small style={{ color: 'var(--text-muted)' }}>Hagyja üresen, ha nem kívánja módosítani.</small>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button type="submit" className="btn" disabled={saving}>
                            {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                            Mentés
                        </button>
                        {message && (
                            <span style={{ color: message.includes('Hiba') ? 'var(--danger)' : 'var(--success)' }}>
                                {message}
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
