import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

import { useTranslation } from 'react-i18next';

const MainLayout = () => {
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Helper to get title based on path
    const getTitle = (path) => {
        if (path.includes('timocom')) return 'Timocom'; // Could be 'sidebar.timocom' but let's keep it simple or specialized
        if (path.includes('shipments')) return t('sidebar.shipments');
        if (path.includes('fleet')) return t('sidebar.fleet');
        if (path.includes('reports')) return t('sidebar.reports');
        if (path.includes('ai-assistant')) return t('sidebar.ai_assistant');
        if (path.includes('settings')) return t('sidebar.settings');
        return t('sidebar.dashboard');
    };

    return (
        <div className="dashboard">
            <div className="bg-animation"></div>

            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main className={`main-content ${sidebarOpen ? 'expanded' : ''}`}>
                <Header
                    title={getTitle(location.pathname)}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <div className="dashboard-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
