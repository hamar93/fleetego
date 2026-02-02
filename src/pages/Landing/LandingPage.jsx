import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-text">TMS Platform</span>
                        <span className="status-indicator active" style={{ marginLeft: '8px' }}></span>
                    </div>
                    <h1 className="hero-title">
                        <span className="text-gradient">FleetEgo</span> Agent
                    </h1>
                    <p className="hero-subtitle">
                        A jövő szállítmányozási rendszere. Mesterséges intelligenciával támogatott TMS platform európai fuvarozóknak.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                            <i className="fas fa-rocket"></i> Ingyenes Regisztráció
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
                            <i className="fas fa-sign-in-alt"></i> Bejelentkezés
                        </button>
                    </div>
                    <p className="hero-note">
                        <i className="fas fa-shield-alt"></i> Jelenleg ingyenes hozzáférés. Havidíj: COMING SOON.
                    </p>
                </div>
                <div className="hero-visual">
                    <div className="floating-card card glass-effect">
                        <div className="card-icon">
                            <i className="fas fa-robot fa-3x"></i>
                        </div>
                        <h3>AI-Powered</h3>
                        <p>GPT-alapú döntéshozatal</p>
                    </div>
                    <div className="floating-card card glass-effect" style={{ animationDelay: '0.5s' }}>
                        <div className="card-icon">
                            <i className="fas fa-chart-line fa-3x"></i>
                        </div>
                        <h3>Real-Time</h3>
                        <p>Élő fuvarkövetés</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Miért FleetEgo?</h2>
                <div className="features-grid">
                    <div className="feature-card card glass-effect glow-on-hover">
                        <div className="feature-icon">
                            <i className="fas fa-search"></i>
                        </div>
                        <h3>Timocom Integráció</h3>
                        <p>Közvetlen kapcsolat a fuvarbörzékkel. Automata keresés, ajánlattétel.</p>
                    </div>
                    <div className="feature-card card glass-effect glow-on-hover">
                        <div className="feature-icon">
                            <i className="fas fa-truck"></i>
                        </div>
                        <h3>Flottakezelés</h3>
                        <p>Járművek, sofőrök, üzemanyag szintek valós időben.</p>
                    </div>
                    <div className="feature-card card glass-effect glow-on-hover">
                        <div className="feature-icon">
                            <i className="fas fa-route"></i>
                        </div>
                        <h3>Útvonaltervezés</h3>
                        <p>AI-alapú optimalizálás, vezetési idők figyelembevételével.</p>
                    </div>
                    <div className="feature-card card glass-effect glow-on-hover">
                        <div className="feature-icon">
                            <i className="fas fa-file-invoice"></i>
                        </div>
                        <h3>Számlázó Integráció</h3>
                        <p>Univerzális webhook rendszer, bármilyen számlázóval kompatibilis.</p>
                    </div>
                    <div className="feature-card card glass-effect glow-on-hover">
                        <div className="feature-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <h3>Alvállalkozók</h3>
                        <p>Partner management, chat, dokumentumok egy helyen.</p>
                    </div>
                    <div className="feature-card card glass-effect glow-on-hover">
                        <div className="feature-icon">
                            <i className="fas fa-brain"></i>
                        </div>
                        <h3>AI Asszisztens</h3>
                        <p>Chatbot támogatás, automatizált fuvarfigyelés.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content card glass-effect gradient-border">
                    <h2 className="cta-title">Készen állsz a jövőre?</h2>
                    <p className="cta-text">
                        Csatlakozz most, és tapasztald meg, milyen egy AI által támogatott TMS platform.
                    </p>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                        <i className="fas fa-rocket"></i> Kezdjük!
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>&copy; 2026 FleetEgo Agent. Minden jog fenntartva.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
