import React, { useState, useEffect } from 'react';

const Header = ({ title = "Dashboard", onToggleSidebar }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    className="menu-toggle-btn"
                    onClick={onToggleSidebar}
                    style={{ display: 'none' }} // Visible on mobile via CSS
                >
                    <i className="fas fa-bars"></i>
                </button>
                <h1 className="header-title">{title}</h1>
            </div>

            <div className="user-info">
                <button className="theme-toggle-btn" onClick={toggleTheme} style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    marginRight: '1rem'
                }}>
                    {theme === 'dark' ? <><i className="fas fa-sun"></i> Light</> : <><i className="fas fa-moon"></i> Dark</>}
                </button>

                <span>Admin Felhasználó</span>
                <div className="user-avatar">A</div>
                <button className="logout-btn" onClick={() => console.log('Logout clicked')}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span style={{ marginLeft: '8px' }}>Kijelentkezés</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
