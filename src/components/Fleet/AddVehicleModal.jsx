import React, { useState } from 'react';
import api from '../../api/api';

const AddVehicleModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        plate_number: '',
        type: 'truck',
        body_type: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const vehicleData = {
                ...formData,
                body_type: formData.body_type === '' ? null : formData.body_type
            };
            await api.post('/api/fleet/vehicles', vehicleData);
            onSave();
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || "Hiba történt a mentés során.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Új Jármű Felvétele</h3>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Rendszám</label>
                            <input
                                type="text" name="plate_number"
                                value={formData.plate_number} onChange={handleChange} required
                                className="form-input" placeholder="ABC-123"
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Típus</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="form-input">
                                <option value="truck">Vontató</option>
                                <option value="trailer">Pótkocsi</option>
                                <option value="van">Kisteherautó</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Felépítmény</label>
                            <select name="body_type" value={formData.body_type} onChange={handleChange} className="form-input">
                                <option value="">- Nincs kiválasztva -</option>
                                <option value="tautliner">Ponyvás (Tautliner)</option>
                                <option value="mega">Mega</option>
                                <option value="frigo">Hűtős (Frigo)</option>
                                <option value="box">Dobozos</option>
                                <option value="flatbed">Nyitott / Mélybölcsős</option>
                                <option value="tanker">Tartályos</option>
                                <option value="container">Konténerszállító</option>
                                <option value="tipper">Billencs</option>
                                <option value="other">Egyéb</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Márka</label>
                            <input type="text" name="make" value={formData.make} onChange={handleChange} required className="form-input" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Modell</label>
                            <input type="text" name="model" value={formData.model} onChange={handleChange} required className="form-input" />
                        </div>
                    </div>

                    <div className="form-group-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Évjárat</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} required className="form-input" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Futásteljesítmény (km)</label>
                            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="form-input" />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Mégse</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Mentés'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleModal;
