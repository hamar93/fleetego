import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./Integrations.css";

const Integrations = () => {
    const [settings, setSettings] = useState({
        timocom_id: "",
        timocom_api_key: "",
        timocom_customer_ref: "",
        timocom_company_name: "",
        invoice_webhook_url: "",
        invoice_auth_type: "api_key_header",
        invoice_auth_token: "",
        invoice_api_key_header: "X-API-KEY",
        invoice_payload_template: "",
        invoice_enabled: false
    });
    const [status, setStatus] = useState({
        timocom_has_secret: false,
        timocom_configured: false,
        invoice_has_secret: false,
        invoice_configured: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await api.get("/api/settings/integrations");
            const data = response.data;
            setSettings({
                timocom_id: data.timocom_id || "",
                timocom_api_key: "",
                timocom_customer_ref: data.timocom_customer_ref || "",
                timocom_company_name: data.timocom_company_name || "",
                invoice_webhook_url: data.invoice_webhook_url || "",
                invoice_auth_type: data.invoice_auth_type || "api_key_header",
                invoice_auth_token: "",
                invoice_api_key_header: data.invoice_api_key_header || "X-API-KEY",
                invoice_payload_template: data.invoice_payload_template || "",
                invoice_enabled: Boolean(data.invoice_enabled)
            });
            setStatus({
                timocom_has_secret: Boolean(data.timocom_api_key_masked),
                timocom_configured: Boolean(data.timocom_configured),
                invoice_has_secret: Boolean(data.invoice_auth_masked),
                invoice_configured: Boolean(data.invoice_configured)
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
            const payload = {
                timocom_id: settings.timocom_id,
                timocom_customer_ref: settings.timocom_customer_ref,
                timocom_company_name: settings.timocom_company_name,
                invoice_webhook_url: settings.invoice_webhook_url,
                invoice_auth_type: settings.invoice_auth_type,
                invoice_api_key_header: settings.invoice_api_key_header,
                invoice_payload_template: settings.invoice_payload_template,
                invoice_enabled: settings.invoice_enabled
            };
            if (settings.timocom_api_key) {
                payload.timocom_api_key = settings.timocom_api_key;
            }
            if (settings.invoice_auth_token) {
                payload.invoice_auth_token = settings.invoice_auth_token;
            }
            await api.put("/api/settings/integrations", payload);
            setMessage({ type: "success", text: "Beállítások sikeresen mentve!" });
            loadSettings();
        } catch (error) {
            console.error("Failed to save settings", error);
            setMessage({ type: "error", text: "Mentés sikertelen. Ellenőrizd a kapcsolatot." });
        } finally {
            setLoading(false);
        }
    };

    const handleInvoiceTest = async () => {
        setLoading(true);
        setMessage(null);
        try {
            await api.post("/api/invoice/test");
            setMessage({ type: "success", text: "Teszt kérés elküldve." });
        } catch (error) {
            console.error("Invoice test failed", error);
            setMessage({ type: "error", text: "Teszt sikertelen. Ellenőrizd a webhookot." });
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
                <div className="card glass-effect mb-4">
                    <h3 className="card-title">Timocom (Freight Exchange)</h3>
                    <p className="description">Add meg a Timocom API hozzáférési adatait a fuvarok kereséséhez.</p>

                    <div className="form-group">
                        <label>Principal Name (Group)</label>
                        <input
                            type="text"
                            name="timocom_id"
                            value={settings.timocom_id}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="pl. FLEETEGO"
                        />
                    </div>

                    <div className="form-group">
                        <label>Customer Reference</label>
                        <input
                            type="text"
                            name="timocom_customer_ref"
                            value={settings.timocom_customer_ref}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="pl. 902717"
                        />
                    </div>
                    <div className="form-group">
                        <label>Timocom Company Name</label>
                        <input
                            type="text"
                            name="timocom_company_name"
                            value={settings.timocom_company_name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="pl. FleetEgo Kft."
                        />
                    </div>

                    <div className="form-group">
                        <label>Jelszó {status.timocom_has_secret && <span className="badge badge-success">Beállítva</span>}</label>
                        <input
                            type="password"
                            name="timocom_api_key"
                            value={settings.timocom_api_key}
                            onChange={handleChange}
                            className="form-control"
                            placeholder={status.timocom_has_secret ? "****** (Hagyja üresen, ha nem változtat)" : "Írd be a titkos kulcsot"}
                        />
                    </div>

                    <div className="small" style={{ opacity: 0.7 }}>
                        {status.timocom_configured ? "Timocom konfiguráció rendben." : "Timocom nincs konfigurálva."}
                    </div>
                </div>

                <div className="card glass-effect mb-4">
                    <h3 className="card-title">Számlázó Integráció (Univerzális Webhook)</h3>
                    <p className="description">Bármilyen EU‑s számlázó rendszer webhookját kezeli. JSON template‑tel testre szabható.</p>

                    <div className="form-group">
                        <label>Webhook URL</label>
                        <input
                            type="text"
                            name="invoice_webhook_url"
                            value={settings.invoice_webhook_url}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="https://invoice.example.com/webhook"
                        />
                    </div>

                    <div className="form-group">
                        <label>Auth típus</label>
                        <select
                            name="invoice_auth_type"
                            value={settings.invoice_auth_type}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="api_key_header">API Key (Header)</option>
                            <option value="bearer">Bearer Token</option>
                            <option value="basic">Basic Auth</option>
                            <option value="none">Nincs</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Auth kulcs {status.invoice_has_secret && <span className="badge badge-success">Beállítva</span>}</label>
                        <input
                            type="password"
                            name="invoice_auth_token"
                            value={settings.invoice_auth_token}
                            onChange={handleChange}
                            className="form-control"
                            placeholder={status.invoice_has_secret ? "****** (Hagyja üresen, ha nem változtat)" : "Add meg a kulcsot"}
                        />
                    </div>

                    <div className="form-group">
                        <label>API Key header név</label>
                        <input
                            type="text"
                            name="invoice_api_key_header"
                            value={settings.invoice_api_key_header}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="X-API-KEY"
                        />
                    </div>

                    <div className="form-group">
                        <label>Payload Template (JSON)</label>
                        <textarea
                            name="invoice_payload_template"
                            value={settings.invoice_payload_template}
                            onChange={handleChange}
                            className="form-control"
                            rows={8}
                            placeholder={`{\n  \"event\": \"{{event_type}}\",\n  \"timestamp\": \"{{timestamp}}\",\n  \"company\": \"{{company.name}}\",\n  \"shipmentId\": \"{{shipment.id}}\",\n  \"cmrUrl\": \"{{cmr.url}}\",\n  \"amount\": \"{{invoice.amount}}\",\n  \"currency\": \"{{invoice.currency}}\"\n}`}
                        />
                        <small>Használható változók: `company.name`, `user.email`, `shipment.id`, `cmr.url`, `invoice.amount`, stb.</small>
                    </div>

                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                            type="checkbox"
                            name="invoice_enabled"
                            checked={Boolean(settings.invoice_enabled)}
                            onChange={(e) => setSettings({ ...settings, invoice_enabled: e.target.checked })}
                        />
                        <label>Számlázó integráció engedélyezve</label>
                    </div>

                    <div className="small" style={{ opacity: 0.7, marginBottom: "0.5rem" }}>
                        {status.invoice_configured ? "Számlázó integráció konfigurálva." : "Számlázó integráció nincs kész."}
                    </div>

                    <button type="button" className="btn btn-secondary" onClick={handleInvoiceTest} disabled={loading}>
                        Teszt Webhook
                    </button>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : "MENTÉS"}
                </button>
            </form>
        </div>
    );
};

export default Integrations;
