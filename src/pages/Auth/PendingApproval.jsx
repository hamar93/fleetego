import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const PendingApproval = () => {
    return (
        <div className="auth-page">
            <div className="auth-container card glass-effect fade-in">
                <div className="pending-content">
                    <div className="pending-icon">
                        <i className="fas fa-hourglass-half fa-4x"></i>
                    </div>
                    <h2>Jóváhagyásra Vár</h2>
                    <p className="pending-message">
                        Fiókod sikeresen létrejött, de jelenleg adminisztrátori jóváhagyásra vár.
                    </p>
                    <p className="pending-note">
                        Értesítünk emailben, amint hozzáférést kapsz a rendszerhez. Ez általában 24 órán belül megtörténik.
                    </p>
                    <div className="pending-actions">
                        <Link to="/" className="btn btn-secondary">
                            <i className="fas fa-home"></i> Vissza a főoldalra
                        </Link>
                        <Link to="/login" className="btn btn-outline-primary">
                            <i className="fas fa-sign-in-alt"></i> Újrapróbálom
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;
