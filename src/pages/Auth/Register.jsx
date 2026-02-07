import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        company_name: '',
        tax_number: '',
        email: '',
        phone: '',
        fleet_size: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Convert fleet_size to int
            const payload = {
                ...formData,
                fleet_size: parseInt(formData.fleet_size, 10)
            };
            await api.post('/api/auth/register', payload);
            setSuccess(true);
            setTimeout(() => navigate('/pending'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Regisztráció sikertelen. Próbáld újra.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-container card glass-effect fade-in">
                    <div className="success-message">
                        <i className="fas fa-check-circle fa-3x"></i>
                        <h2>Sikeres Regisztráció!</h2>
                        <p>Fiókod létrehozva. Az adminisztrátor jóváhagyása szükséges a belépéshez.</p>
                        <p className="redirect-note">Átirányítás...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container card glass-effect fade-in">
                <div className="auth-header">
                    <h1 className="text-gradient">FleetEgo</h1>
                    <h2>Regisztráció</h2>
                    <p>Hozd létre fiókod és csatlakozz a platformhoz</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label><i className="fas fa-user"></i> Teljes Név</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Pl. Kovács János"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><i className="fas fa-building"></i> Cégnév</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Pl. FleetEgo Kft."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><i className="fas fa-file-invoice"></i> Adószám</label>
                        <input
                            type="text"
                            name="tax_number"
                            value={formData.tax_number}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Pl. 12345678-1-42"
                        />
                    </div>

                    <div className="form-group">
                        <label><i className="fas fa-envelope"></i> Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="email@ceg.hu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><i className="fas fa-phone"></i> Telefonszám</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="+36 30 123 4567"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><i className="fas fa-truck"></i> Flotta Mérete (db)</label>
                        <input
                            type="number"
                            name="fleet_size"
                            value={formData.fleet_size}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Járművek száma"
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><i className="fas fa-lock"></i> Jelszó</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Min. 6 karakter"
                            minLength={6}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-user-plus"></i>}
                        {loading ? ' Regisztráció...' : ' Regisztráció'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Már van fiókod? <Link to="/login" className="link-primary">Bejelentkezés</Link></p>
                    <p><Link to="/" className="link-secondary"><i className="fas fa-arrow-left"></i> Vissza a főoldalra</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
