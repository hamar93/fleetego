import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Helper to get title based on path
    const getTitle = (path) => {
        if (path.includes('timocom')) return 'Timocom Integráció';
        if (path.includes('shipments')) return 'Fuvarkezelés';
        if (path.includes('fleet')) return 'Járműflotta';
        if (path.includes('reports')) return 'Jelentések';
        if (path.includes('ai-assistant')) return 'AI Asszisztens';
        if (path.includes('settings')) return 'Beállítások';
        return 'Dashboard';
    };

    return (
        <div className="dashboard">
            <div className="bg-animation"></div>

            <Sidebar />

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
