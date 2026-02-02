import React from 'react';

const Header = ({ title = "Dashboard", onToggleSidebar }) => {
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
