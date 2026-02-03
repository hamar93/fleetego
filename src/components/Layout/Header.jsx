import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ title = "Dashboard", onToggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();

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
                <h1 className="header-title">{theme === 'dark' ? 'Pro' : 'Light'} / {title}</h1>
            </div>

            <div className="user-info">
                <button
                    className="btn-secondary"
                    onClick={toggleTheme}
                    style={{
                        borderRadius: '30px',
                        padding: '0.6rem 1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {theme === 'dark' ?
                        <><i className="fas fa-sun"></i> Light Mode</> :
                        <><i className="fas fa-moon"></i> Dark Mode</>
                    }
                </button>

                <button className="btn-secondary" style={{ borderRadius: '50%', padding: '0.8rem', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-bell"></i>
                </button>

                <div className="gradient-border" style={{ borderRadius: '12px', padding: '2px' }}>
                    <div style={{
                        background: 'var(--card-bg)',
                        borderRadius: '10px',
                        padding: '0.5rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer'
                    }}>
                        <div className="user-avatar" style={{ width: '35px', height: '35px', fontSize: '1rem' }}>A</div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Admin Felhasználó</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Super Admin</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
