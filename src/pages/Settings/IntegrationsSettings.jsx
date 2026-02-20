import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const IntegrationsSettings = () => {
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
                timocom_api_key: '', // Don't show the masked key
                timocom_customer_ref: response.data.timocom_customer_ref || ''
            });
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
            const payload = {
                timocom_id: settings.timocom_id,
                timocom_customer_ref: settings.timocom_customer_ref
            };
            if (settings.timocom_api_key) {
                payload.timocom_api_key = settings.timocom_api_key;
            }

            await api.put('/api/settings/integrations', payload);
            setMessage('Beállítások sikeresen mentve.');
            setTimeout(checkStatus, 1000);
            setSettings(prev => ({ ...prev, timocom_api_key: '' }));
        } catch (error) {
            console.error("Failed to save settings:", error);
            setMessage('Hiba történt a mentés során.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="content-card animate-fadeIn">
            <h3 className="card-title text-xl mb-6">
                <i className="fas fa-truck-loading text-yellow-500 mr-2"></i>
                Timocom Integráció
            </h3>

            <div className="mb-8">
                <p className="text-[var(--text-secondary)] mb-4">
                    Adja meg a cég Timocom azonosítóját és API kulcsát a fuvarbörze eléréséhez.
                </p>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <i className={`fas fa-${status === 'connected' ? 'check-circle' : 'exclamation-circle'} mr-2`}></i>
                    {status === 'connected' ? ' Kapcsolódva' : ' Nincs kapcsolat'}
                </div>
            </div>

            <form onSubmit={handleSave} className="max-w-xl space-y-6">
                <div className="form-group">
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Timocom ID (Ügyfélszám)</label>
                    <input
                        type="text"
                        name="timocom_id"
                        value={settings.timocom_id}
                        onChange={handleChange}
                        className="form-control w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                        placeholder="pl. 123456"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Customer Reference</label>
                    <input
                        type="text"
                        name="timocom_customer_ref"
                        value={settings.timocom_customer_ref}
                        onChange={handleChange}
                        className="form-control w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                        placeholder="pl. 902717"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">API Kulcs (Client Secret)</label>
                    <input
                        type="password"
                        name="timocom_api_key"
                        value={settings.timocom_api_key}
                        onChange={handleChange}
                        className="form-control w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                        placeholder="Adja meg az új kulcsot a frissítéshez"
                    />
                    <small className="text-[var(--text-muted)] block mt-1">Hagyja üresen, ha nem kívánja módosítani.</small>
                </div>

                <div className="flex items-center gap-4">
                    <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors" disabled={saving}>
                        {saving ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>}
                        Mentés
                    </button>
                    {message && (
                        <span className={`text-sm ${message.includes('Hiba') ? 'text-red-500' : 'text-green-500'}`}>
                            {message}
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
};

export default IntegrationsSettings;
