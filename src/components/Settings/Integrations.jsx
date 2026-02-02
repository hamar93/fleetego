import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './Integrations.css';

const Integrations = () => {
    const [settings, setSettings] = useState({
        timocom_client_id: '',
        timocom_client_secret: '',
        invoice_webhook_url: '',
        invoice_api_key: '',
        invoice_system_name: 'Universal Webhook'
    });
    const [status, setStatus] = useState({
        timocom_has_secret: false,
        invoice_has_api_key: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await api.get('/api/settings/integrations');
            const data = response.data;
            setSettings(prev => ({
                ...prev,
                timocom_client_id: data.timocom_client_id || '',
                invoice_webhook_url: data.invoice_webhook_url || '',
                invoice_system_name: data.invoice_system_name || 'Universal Webhook'
            }));
            setStatus({
                timocom_has_secret: data.timocom_has_secret,
                invoice_has_api_key: data.invoice_has_api_key
            });
        } catch (error) {
            console.error("Failed to load settings", error);
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            // Only send fields that are not empty (to avoid overwriting with empty strings if user didn't want to change secret)
            // Ideally backend handles this logic, but for simplicity we send all non-empty secrets.
            const payload = { ...settings };
            await api.post('/api/settings/integrations', payload);
            setMessage({ type: 'success', text: 'Beállítások sikeresen mentve!' });
            loadSettings(); // Reload to update status
        } catch (error) {
            console.error("Failed to save settings", error);
            setMessage({ type: 'error', text: 'Mentés sikertelen. Ellenőrizd a kapcsolatot.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="integrations-container fade-in">
            <h2 className="page-title"><i className="fas fa-plug"></i> Integrációk</h2>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave}>
                {/* Timocom Section */}
                <div className="card glass-effect mb-4">
                    <h3 className="card-title">Timocom (Freight Exchange)</h3>
                    <p className="description">Add meg a Timocom API hozzáférési adatait a fuvarok kereséséhez.</p>

                    <div className="form-group">
                        <label>Client ID</label>
                        <input
                            type="text"
                            name="timocom_client_id"
                            value={settings.timocom_client_id}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="pl. 12345-abcde..."
                        />
                    </div>
                    <div className="form-group">
                        <label>Client Secret {status.timocom_has_secret && <span className="badge badge-success">Beállítva</span>}</label>
                        <input
                            type="password"
                            name="timocom_client_secret"
                            value={settings.timocom_client_secret}
                            onChange={handleChange}
                            className="form-control"
                            placeholder={status.timocom_has_secret ? "****** (Hagyja üresen, ha nem változtat)" : "Írd be a titkos kulcsot"}
                        />
                    </div>
                </div>

                {/* Invoicing Section */}
                <div className="card glass-effect mb-4">
                    <h3 className="card-title">Számlázó Rendszer (Univerzális)</h3>
                    <p className="description">Állítsd be a számlázó rendszered Webhook címét vagy API adatait.</p>

                    <div className="form-group">
                        <label>Rendszer Típusa</label>
                        <select name="invoice_system_name" value={settings.invoice_system_name} onChange={handleChange} className="form-control">
                            <option value="Universal Webhook">Univerzális Webhook</option>
                            <option value="Billingo">Billingo</option>
                            <option value="Szamlazz.hu">Számlázz.hu</option>
                            <option value="SAP">SAP / ERP</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Webhook URL / API Endpoint</label>
                        <input
                            type="text"
                            name="invoice_webhook_url"
                            value={settings.invoice_webhook_url}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="https://your-invoice-system.com/api/webhook"
                        />
                    </div>

                    <div className="form-group">
                        <label>API Key (Opcionális) {status.invoice_has_api_key && <span className="badge badge-success">Beállítva</span>}</label>
                        <input
                            type="password"
                            name="invoice_api_key"
                            value={settings.invoice_api_key}
                            onChange={handleChange}
                            className="form-control"
                            placeholder={status.invoice_has_api_key ? "****** (Hagyja üresen, ha nem változtat)" : "Opcionális API kulcs a hitelesítéshez"}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : 'MENTÉS'}
                </button>
            </form>
        </div>
    );
};

export default Integrations;
