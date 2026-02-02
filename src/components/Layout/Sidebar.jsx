import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [openSubmenus, setOpenSubmenus] = useState({});

    const toggleSubmenu = (menu) => {
        setOpenSubmenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const MenuItem = ({ icon, label, to, hasSubmenu = false, submenuId = null }) => {
        if (hasSubmenu) {
            return (
                <div class="menu-item">
                    <button
                        className={`menu-toggle ${openSubmenus[submenuId] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu(submenuId)}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className={`menu-icon fas ${icon}`}></i>
                            {label}
                        </span>
                        <i className={`fas fa-chevron-${openSubmenus[submenuId] ? 'up' : 'down'}`}></i>
                    </button>

                    <div className={`submenu ${openSubmenus[submenuId] ? 'open' : ''}`}>
                        {/* Children will be passed here, simplified for this structure */}
                    </div>
                </div>
            );
        }

        return (
            <div class="menu-item">
                <NavLink
                    to={to}
                    className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}
                    end
                >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <i className={`menu-icon fas ${icon}`}></i>
                        {label}
                    </span>
                </NavLink>
            </div>
        );
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">
                    <i className="fas fa-truck"></i>
                </div>
                <div className="logo-text">FleetEgo Agent</div>
            </div>

            <nav className="sidebar-nav">

                {/* Dashboard */}
                <div className="menu-item">
                    <NavLink to="/dashboard" className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="menu-icon fas fa-tachometer-alt"></i>
                            Dashboard
                        </span>
                    </NavLink>
                </div>

                {/* Timocom */}
                <div className="menu-item">
                    <button
                        className={`menu-toggle ${openSubmenus['timocom'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('timocom')}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="menu-icon fas fa-search"></i>
                            Timocom
                        </span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className={`submenu ${openSubmenus['timocom'] ? 'open' : ''}`}>
                        <NavLink to="/timocom/search" className="submenu-item"><i className="fas fa-search"></i>&nbsp;&nbsp;Fuvar keresés</NavLink>
                        <NavLink to="/timocom/offers" className="submenu-item"><i className="fas fa-file-contract"></i>&nbsp;&nbsp;Ajánlataim</NavLink>
                        <NavLink to="/timocom/chat" className="submenu-item"><i className="fas fa-comments"></i>&nbsp;&nbsp;AI Chat</NavLink>
                    </div>
                </div>

                {/* Fuvarkezelés */}
                <div className="menu-item">
                    <button
                        className={`menu-toggle ${openSubmenus['shipments'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('shipments')}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="menu-icon fas fa-truck-loading"></i>
                            Fuvarkezelés
                        </span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className={`submenu ${openSubmenus['shipments'] ? 'open' : ''}`}>
                        <NavLink to="/shipments/active" className="submenu-item"><i className="fas fa-road"></i>&nbsp;&nbsp;Aktív fuvarok</NavLink>
                        <NavLink to="/shipments/planning" className="submenu-item"><i className="fas fa-route"></i>&nbsp;&nbsp;Útvonaltervezés</NavLink>
                        <NavLink to="/shipments/tracking" className="submenu-item"><i className="fas fa-map-marker-alt"></i>&nbsp;&nbsp;Nyomon követés</NavLink>
                    </div>
                </div>

                {/* Járműflotta */}
                <div className="menu-item">
                    <button
                        className={`menu-toggle ${openSubmenus['fleet'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('fleet')}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="menu-icon fas fa-truck"></i>
                            Járműflotta
                        </span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className={`submenu ${openSubmenus['fleet'] ? 'open' : ''}`}>
                        <NavLink to="/fleet/vehicles" className="submenu-item"><i className="fas fa-truck"></i>&nbsp;&nbsp;Járművek</NavLink>
                        <NavLink to="/fleet/drivers" className="submenu-item"><i className="fas fa-user-tie"></i>&nbsp;&nbsp;Sofőrök</NavLink>
                        <NavLink to="/fleet/maintenance" className="submenu-item"><i className="fas fa-tools"></i>&nbsp;&nbsp;Karbantartás</NavLink>
                    </div>
                </div>

                {/* Dokumentumok (Roadmap 3. & 7.) */}
                <div className="menu-item">
                    <button
                        className={`menu-toggle ${openSubmenus['docs'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('docs')}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="menu-icon fas fa-folder-open"></i>
                            Dokumentumtár
                        </span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className={`submenu ${openSubmenus['docs'] ? 'open' : ''}`}>
                        <NavLink to="/docs/cmr" className="submenu-item"><i className="fas fa-file-invoice"></i>&nbsp;&nbsp;CMR / Szállítólevél</NavLink>
                        <NavLink to="/docs/contracts" className="submenu-item"><i className="fas fa-file-signature"></i>&nbsp;&nbsp;Szerződések</NavLink>
                    </div>
                </div>

                {/* Pénzügyek (Roadmap 7. - Számlázás) */}
                <div className="menu-item">
                    <button
                        className={`menu-toggle ${openSubmenus['finance'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('finance')}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="menu-icon fas fa-wallet"></i>
                            Pénzügyek
                        </span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className={`submenu ${openSubmenus['finance'] ? 'open' : ''}`}>
                        <NavLink to="/finance/invoices" className="submenu-item"><i className="fas fa-file-invoice-dollar"></i>&nbsp;&nbsp;Számlázás</NavLink>
                        <NavLink to="/finance/expenses" className="submenu-item"><i className="fas fa-receipt"></i>&nbsp;&nbsp;Kiadások</NavLink>
                    </div>
                </div>

                {/* Alvállalkozók (Roadmap 8.) */}
                <div className="menu-item">
                    <button
                        className={`menu-toggle ${openSubmenus['subcontractors'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('subcontractors')}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="menu-icon fas fa-handshake"></i>
                            Alvállalkozók
                        </span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className={`submenu ${openSubmenus['subcontractors'] ? 'open' : ''}`}>
                        <NavLink to="/partners/list" className="submenu-item"><i className="fas fa-address-book"></i>&nbsp;&nbsp;Partnerek</NavLink>
                        <NavLink to="/partners/chat" className="submenu-item"><i className="fas fa-comments"></i>&nbsp;&nbsp;Partner Chat</NavLink>
                    </div>
                </div>

                {/* Jelentések */}
                <div className="menu-item">
                    <button
                        className={`menu-toggle ${openSubmenus['reports'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('reports')}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="menu-icon fas fa-chart-bar"></i>
                            Jelentések
                        </span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className={`submenu ${openSubmenus['reports'] ? 'open' : ''}`}>
                        <NavLink to="/reports/financial" className="submenu-item"><i className="fas fa-euro-sign"></i>&nbsp;&nbsp;Pénzügyi jelentés</NavLink>
                        <NavLink to="/reports/performance" className="submenu-item"><i className="fas fa-chart-line"></i>&nbsp;&nbsp;Teljesítmény</NavLink>
                        <NavLink to="/reports/analytics" className="submenu-item"><i className="fas fa-chart-pie"></i>&nbsp;&nbsp;Analitika</NavLink>
                        <NavLink to="/reports/drivers-time" className="submenu-item"><i className="fas fa-clock"></i>&nbsp;&nbsp;Vezetési Idők</NavLink>
                    </div>
                </div>

                {/* AI Asszisztens */}
                <div className="menu-item">
                    <NavLink to="/ai-assistant" className={({ isActive }) => `menu-toggle ${isActive ? 'active' : ''}`}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="menu-icon fas fa-robot"></i>
                            AI Asszisztens
                        </span>
                    </NavLink>
                </div>

                {/* Beállítások */}
                <div className="menu-item">
                    <button
                        className={`menu-toggle ${openSubmenus['settings'] ? 'active' : ''}`}
                        onClick={() => toggleSubmenu('settings')}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="menu-icon fas fa-cog"></i>
                            Beállítások
                        </span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className={`submenu ${openSubmenus['settings'] ? 'open' : ''}`}>
                        <NavLink to="/settings/profile" className="submenu-item"><i className="fas fa-user"></i>&nbsp;&nbsp;Profil</NavLink>
                        <NavLink to="/settings/integrations" className="submenu-item"><i className="fas fa-plug"></i>&nbsp;&nbsp;Integrációk</NavLink>
                        <NavLink to="/settings/notifications" className="submenu-item"><i className="fas fa-bell"></i>&nbsp;&nbsp;Értesítések</NavLink>
                    </div>
                </div>

            </nav>
        </aside>
    );
};

export default Sidebar;
