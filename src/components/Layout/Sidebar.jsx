import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [openSubmenus, setOpenSubmenus] = useState({});

    const toggleSubmenu = (menu) => {
        setOpenSubmenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    return (
        <aside className="sidebar">
            <div className="logo">
                <div className="logo-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div className="logo-text">
                    <div className="logo-text-main">FleetEgo</div>
                    <div className="logo-text-sub">Agent</div>
                </div>
            </div>

            <nav>
                {/* Main Section */}
                <div className="nav-section">
                    <div className="nav-section-title">Main</div>

                    <NavLink to="/app/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <div className="nav-icon">📊</div>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/app/ai-assistant" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <div className="nav-icon">🤖</div>
                        <span>AI Asszisztens</span>
                    </NavLink>
                </div>

                {/* Operations Section */}
                <div className="nav-section">
                    <div className="nav-section-title">Operations</div>

                    {/* Timocom */}
                    <div
                        className={`nav-item ${openSubmenus['timocom'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('timocom')}
                    >
                        <div className="nav-icon">🚚</div>
                        <span style={{ flex: 1 }}>Timocom</span>
                        <i className={`fas fa-chevron-${openSubmenus['timocom'] ? 'up' : 'down'}`} style={{ fontSize: '10px', opacity: 0.7 }}></i>
                    </div>
                    {openSubmenus['timocom'] && (
                        <div className="submenu" style={{ paddingLeft: '10px' }}>
                            <NavLink to="/app/timocom/search" className="nav-item small">
                                <span style={{ fontSize: '12px' }}>Fuvar keresés</span>
                            </NavLink>
                            <NavLink to="/app/timocom/offers" className="nav-item small">
                                <span style={{ fontSize: '12px' }}>Ajánlataim</span>
                            </NavLink>
                            <NavLink to="/app/timocom/chat" className="nav-item small">
                                <span style={{ fontSize: '12px' }}>AI Chat</span>
                            </NavLink>
                        </div>
                    )}

                    {/* Fuvarkezelés */}
                    <div
                        className={`nav-item ${openSubmenus['shipments'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('shipments')}
                    >
                        <div className="nav-icon">🚛</div>
                        <span style={{ flex: 1 }}>Fuvarkezelés</span>
                        <i className={`fas fa-chevron-${openSubmenus['shipments'] ? 'up' : 'down'}`} style={{ fontSize: '10px', opacity: 0.7 }}></i>
                    </div>
                    {openSubmenus['shipments'] && (
                        <div className="submenu" style={{ paddingLeft: '10px' }}>
                            <NavLink to="/app/shipments/active" className="nav-item small">
                                <span style={{ fontSize: '12px' }}>Aktív fuvarok</span>
                            </NavLink>
                            <NavLink to="/app/shipments/planning" className="nav-item small">
                                <span style={{ fontSize: '12px' }}>Útvonaltervezés</span>
                            </NavLink>
                            <NavLink to="/app/shipments/tracking" className="nav-item small">
                                <span style={{ fontSize: '12px' }}>Nyomon követés</span>
                            </NavLink>
                        </div>
                    )}

                    {/* Járműflotta */}
                    <div
                        className={`nav-item ${openSubmenus['fleet'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('fleet')}
                    >
                        <div className="nav-icon">🚐</div>
                        <span style={{ flex: 1 }}>Járműflotta</span>
                        <i className={`fas fa-chevron-${openSubmenus['fleet'] ? 'up' : 'down'}`} style={{ fontSize: '10px', opacity: 0.7 }}></i>
                    </div>
                    {openSubmenus['fleet'] && (
                        <div className="submenu" style={{ paddingLeft: '10px' }}>
                            <NavLink to="/app/fleet/vehicles" className="nav-item small">
                                <span style={{ fontSize: '12px' }}>Járművek</span>
                            </NavLink>
                            <NavLink to="/app/fleet/drivers" className="nav-item small">
                                <span style={{ fontSize: '12px' }}>Sofőrök</span>
                            </NavLink>
                            <NavLink to="/app/fleet/maintenance" className="nav-item small">
                                <span style={{ fontSize: '12px' }}>Karbantartás</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Management Section */}
                <div className="nav-section">
                    <div className="nav-section-title">Management</div>

                    <NavLink to="/app/docs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <div className="nav-icon">📄</div>
                        <span>Dokumentumtár</span>
                    </NavLink>

                    <NavLink to="/app/finance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <div className="nav-icon">💰</div>
                        <span>Pénzügyek</span>
                    </NavLink>

                    <NavLink to="/app/partners/list" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <div className="nav-icon">👥</div>
                        <span>Alvállalkozók</span>
                    </NavLink>

                    <NavLink to="/app/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <div className="nav-icon">📋</div>
                        <span>Jelentések</span>
                    </NavLink>

                    {/* Admin - Only visible to admins in real app */}
                    <div className="nav-section-title" style={{ marginTop: '20px' }}>Adminisztráció</div>
                    <NavLink to="/app/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <div className="nav-icon">🛡️</div>
                        <span>Felhasználók</span>
                    </NavLink>
                    <NavLink to="/app/admin/companies" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <div className="nav-icon">🏢</div>
                        <span>Cégek</span>
                    </NavLink>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
