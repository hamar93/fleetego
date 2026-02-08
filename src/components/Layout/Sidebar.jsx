import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [openSubmenus, setOpenSubmenus] = useState({});
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check for 'role' field in token. Standard is usually 'role' or 'http://schemas.../role'
                // Our backend puts 'role' directly in payload.
                setUserRole(decoded.role);
            } catch (e) {
                console.error("Token decode error", e);
            }
        }
    }, []);

    const toggleSubmenu = (menu) => {
        setOpenSubmenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const isSubcontractor = userRole === 'subcontractor';

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[999] transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <i className="fas fa-bolt"></i>
                    </div>
                    <div className="logo-text">
                        FleetEgo
                        <span>AGENT</span>
                    </div>
                    {/* Mobile Close Button */}
                    <button className="md:hidden ml-auto text-gray-500 hover:text-white" onClick={() => setIsOpen(false)}>
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {/* Main Section */}
                    <div className="nav-section">
                        <div className="nav-section-title">{t('sidebar.main')}</div>

                        {!isSubcontractor && (
                            <div className="menu-item">
                                <NavLink to="/app/dashboard" className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="menu-icon fas fa-chart-pie" style={{ color: '#3b82f6' }}></i>
                                        {t('sidebar.dashboard')}
                                    </span>
                                </NavLink>
                            </div>
                        )}

                        <div className="menu-item">
                            <NavLink to="/app/chat" className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <i className="menu-icon fas fa-comments" style={{ color: '#ec4899' }}></i>
                                    {t('sidebar.chat')}
                                </span>
                            </NavLink>
                        </div>

                        {!isSubcontractor && (
                            <div className="menu-item">
                                <NavLink to="/app/ai-assistant" className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="menu-icon fas fa-robot" style={{ color: '#a855f7' }}></i>
                                        {t('sidebar.ai_assistant')}
                                    </span>
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* Operations Section - Hide for Subcontractor */}
                    {!isSubcontractor && (
                        <div className="nav-section">
                            <div className="nav-section-title">{t('sidebar.operations')}</div>

                            {/* Timocom */}
                            <div className="menu-item">
                                <button
                                    className={`menu-toggle ${openSubmenus['timocom'] ? 'active' : ''}`}
                                    onClick={() => toggleSubmenu('timocom')}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="menu-icon fas fa-search" style={{ color: '#f59e0b' }}></i>
                                        {t('sidebar.timocom')}
                                    </span>
                                    <i className={`fas fa-chevron-${openSubmenus['timocom'] ? 'up' : 'down'}`} style={{ fontSize: '0.7em' }}></i>
                                </button>
                                <div className={`submenu ${openSubmenus['timocom'] ? 'open' : ''}`}>
                                    <NavLink to="/app/timocom/live" className="submenu-item" style={{ color: '#ef4444', fontWeight: 'bold' }}>Live Watcher (Beta)</NavLink>
                                    <NavLink to="/app/timocom/search" className="submenu-item">{t('sidebar.freight_search')}</NavLink>
                                    <NavLink to="/app/timocom/offers" className="submenu-item">{t('sidebar.my_offers')}</NavLink>
                                    <NavLink to="/app/timocom/chat" className="submenu-item">{t('sidebar.ai_chat')}</NavLink>
                                </div>
                            </div>

                            {/* Fuvarkezelés */}
                            <div className="menu-item">
                                <button
                                    className={`menu-toggle ${openSubmenus['shipments'] ? 'active' : ''}`}
                                    onClick={() => toggleSubmenu('shipments')}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="menu-icon fas fa-shipping-fast" style={{ color: '#10b981' }}></i>
                                        {t('sidebar.shipments')}
                                    </span>
                                    <i className={`fas fa-chevron-${openSubmenus['shipments'] ? 'up' : 'down'}`} style={{ fontSize: '0.7em' }}></i>
                                </button>
                                <div className={`submenu ${openSubmenus['shipments'] ? 'open' : ''}`}>
                                    <NavLink to="/app/shipments/active" className="submenu-item">{t('sidebar.active_shipments')}</NavLink>
                                    <NavLink to="/app/shipments/planning" className="submenu-item">{t('sidebar.route_planning')}</NavLink>
                                    <NavLink to="/app/shipments/calendar" className="submenu-item">Dispatch Calendar</NavLink>
                                    <NavLink to="/app/shipments/tracking" className="submenu-item">{t('sidebar.tracking')}</NavLink>
                                </div>
                            </div>

                            {/* Járműflotta */}
                            <div className="menu-item">
                                <button
                                    className={`menu-toggle ${openSubmenus['fleet'] ? 'active' : ''}`}
                                    onClick={() => toggleSubmenu('fleet')}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="menu-icon fas fa-truck" style={{ color: '#6366f1' }}></i>
                                        {t('sidebar.fleet')}
                                    </span>
                                    <i className={`fas fa-chevron-${openSubmenus['fleet'] ? 'up' : 'down'}`} style={{ fontSize: '0.7em' }}></i>
                                </button>
                                <div className={`submenu ${openSubmenus['fleet'] ? 'open' : ''}`}>
                                    <NavLink to="/app/fleet/vehicles" className="submenu-item">{t('sidebar.vehicles')}</NavLink>
                                    <NavLink to="/app/fleet/drivers" className="submenu-item">{t('sidebar.drivers')}</NavLink>
                                    <NavLink to="/app/fleet/logs" className="submenu-item">Vezetési Napló</NavLink>
                                    <NavLink to="/app/fleet/maintenance" className="submenu-item">{t('sidebar.maintenance')}</NavLink>
                                </div>
                            </div>

                            {/* Management Section */}
                            <div className="nav-section-title" style={{ marginTop: '1rem' }}>{t('sidebar.management')}</div>

                            <div className="menu-item">
                                <NavLink to="/app/docs" className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="menu-icon fas fa-file-alt" style={{ color: '#94a3b8' }}></i>
                                        {t('sidebar.documents')}
                                    </span>
                                </NavLink>
                            </div>

                            <div className="menu-item">
                                <NavLink to="/app/finance" className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="menu-icon fas fa-coins" style={{ color: '#eab308' }}></i>
                                        {t('sidebar.finance')}
                                    </span>
                                </NavLink>
                            </div>

                            {/* Partnerek (NEW) */}
                            <div className="menu-item">
                                <NavLink to="/app/partners/list" className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="menu-icon fas fa-handshake" style={{ color: '#be185d' }}></i>
                                        Partnerek (Megbízók)
                                    </span>
                                </NavLink>
                            </div>

                            {/* Céges Felhasználók (NEW - Only for Company Admin/Office) */}
                            {(userRole === 'admin' || userRole === 'user' || userRole === 'office') && (
                                <div className="menu-item">
                                    <NavLink to="/app/company/users" className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}>
                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                            <i className="menu-icon fas fa-users-cog" style={{ color: '#06b6d4' }}></i>
                                            Munkatársak
                                        </span>
                                    </NavLink>
                                </div>
                            )}

                            <div className="menu-item">
                                <NavLink to="/app/reports" className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="menu-icon fas fa-chart-bar" style={{ color: '#ec4899' }}></i>
                                        {t('sidebar.reports')}
                                    </span>
                                </NavLink>
                            </div>

                            <div className="menu-item">
                                <button
                                    className={`menu-toggle ${openSubmenus['settings'] ? 'active' : ''}`}
                                    onClick={() => toggleSubmenu('settings')}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <i className="menu-icon fas fa-cog" style={{ color: '#9ca3af' }}></i>
                                        {t('sidebar.settings')}
                                    </span>
                                    <i className={`fas fa-chevron-${openSubmenus['settings'] ? 'up' : 'down'}`} style={{ fontSize: '0.7em' }}></i>
                                </button>
                                <div className={`submenu ${openSubmenus['settings'] ? 'open' : ''}`}>
                                    <NavLink to="/app/settings/profile" className="submenu-item">{t('sidebar.profile')}</NavLink>
                                    <NavLink to="/app/settings/integrations" className="submenu-item">{t('sidebar.integrations')}</NavLink>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
