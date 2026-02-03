import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const AssignDriverModal = ({ vehicle, onClose, onSave }) => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(vehicle.current_driver_id || '');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            // Get colleagues/users. Ideally filter by role='USER' or a specific 'DRIVER' role if we had it.
            // For now, listing all colleagues as potential drivers.
            const response = await api.get('/api/auth/colleagues');
            setDrivers(response.data);
        } catch (error) {
            console.error("Failed to load drivers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await api.post('/api/fleet/assign', {
                vehicle_id: vehicle.id,
                driver_id: selectedDriver || null // Send null to unassign
            });
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to assign driver", error);
            alert("Hiba történt a mentés során.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Sofőr Hozzárendelése</h3>
                <p style={{ marginBottom: '1rem' }}>
                    Jármű: <strong>{vehicle.plate_number}</strong> ({vehicle.make} {vehicle.model})
                </p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <i className="fas fa-spinner fa-spin"></i> Betöltés...
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Válassz sofőrt:</label>
                        <select
                            className="form-input"
                            value={selectedDriver}
                            onChange={(e) => setSelectedDriver(e.target.value)}
                        >
                            <option value="">-- Nincs sofőr (Leválasztás) --</option>
                            {drivers.map(driver => (
                                <option key={driver.id} value={driver.id}>
                                    {driver.email} {driver.company_name ? `(${driver.company_name})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Mégse</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || loading}>
                        {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Mentés'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignDriverModal;
