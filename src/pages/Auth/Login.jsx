import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        totp_code: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [requiresTwoFA, setRequiresTwoFA] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/auth/login', formData);
            const { access_token, user } = response.data;

            // Store token and user info
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/app/dashboard');
            }
        } catch (err) {
            const detail = err.response?.data?.detail;

            if (detail === 'TOTP_REQUIRED') {
                setRequiresTwoFA(true);
                setError(null);
            } else if (detail && detail.includes('pending')) {
                navigate('/pending');
            } else {
                setError(detail || 'Bejelentkezés sikertelen. Ellenőrizd adataid.');
                // Reset flow if error occurs during 2FA
                if (requiresTwoFA) {
                    // Maybe keep 2FA input but show error
                }
            }
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container card glass-effect fade-in">
                <div className="auth-header">
                    <h1 className="text-gradient">FleetEgo</h1>
                    <h2>{requiresTwoFA ? 'Kétlépcsős Azonosítás' : 'Bejelentkezés'}</h2>
                    <p>{requiresTwoFA ? 'Add meg a hitelesítő kódot' : 'Üdvözlünk újra!'}</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!requiresTwoFA ? (
                        <>
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
                                <label><i className="fas fa-lock"></i> Jelszó</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Jelszó"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <div className="form-group animate-slideIn">
                            <label><i className="fas fa-shield-alt"></i> Hitelesítő Kód (6 szj.)</label>
                            <input
                                type="text"
                                name="totp_code"
                                value={formData.totp_code}
                                onChange={handleChange}
                                className="form-control text-center text-xl tracking-widest"
                                placeholder="000 000"
                                maxLength="6"
                                autoFocus
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
                        {loading ? ' Ellenőrzés...' : (requiresTwoFA ? ' Belépés' : ' Bejelentkezés')}
                    </button>

                    {requiresTwoFA && (
                        <button
                            type="button"
                            className="btn btn-link btn-block mt-2 text-sm"
                            onClick={() => {
                                setRequiresTwoFA(false);
                                setFormData({ ...formData, totp_code: '' });
                            }}
                        >
                            Vissza
                        </button>
                    )}
                </form>

                <div className="auth-footer">
                    <p>Nincs még fiókod? <Link to="/register" className="link-primary">Regisztráció</Link></p>
                    <p><Link to="/" className="link-secondary"><i className="fas fa-arrow-left"></i> Vissza a főoldalra</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
