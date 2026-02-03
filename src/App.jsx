import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './components/Dashboard';
import SearchPanel from './components/Timocom/SearchPanel';
import Integrations from './components/Settings/Integrations';
import VehicleList from './components/Fleet/VehicleList';
import UserManagement from './pages/Admin/UserManagement';
import CompanyManagement from './pages/Admin/CompanyManagement';
import LandingPage from './pages/Landing/LandingPage';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import PendingApproval from './pages/Auth/PendingApproval';
import ChatPage from './pages/Chat/ChatPage';
import Placeholder from './components/Placeholder';
import './index.css';

import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes (No MainLayout) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pending" element={<PendingApproval />} />

          {/* Protected App Routes (With MainLayout and Sidebar) */}
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<ChatPage />} />
            {/* Timocom */}
            <Route path="timocom/search" element={<SearchPanel />} />
            <Route path="timocom/offers" element={<Placeholder title={t('sidebar.my_offers')} />} />
            <Route path="timocom/chat" element={<Placeholder title={t('sidebar.ai_chat')} />} />

            {/* Fuvarkezelés */}
            <Route path="shipments/active" element={<Placeholder title={t('sidebar.active_shipments')} />} />
            <Route path="shipments/planning" element={<Placeholder title={t('sidebar.route_planning')} />} />
            <Route path="shipments/tracking" element={<Placeholder title={t('sidebar.tracking')} />} />

            {/* Járműflotta */}
            <Route path="fleet/vehicles" element={<VehicleList />} />
            <Route path="fleet/drivers" element={<Placeholder title={t('sidebar.drivers')} />} />
            <Route path="fleet/maintenance" element={<Placeholder title={t('sidebar.maintenance')} />} />

            {/* Dokumentumok */}
            <Route path="docs/cmr" element={<Placeholder title="CMR / Szállítólevél" />} />
            <Route path="docs/contracts" element={<Placeholder title={t('sidebar.documents')} />} />

            {/* Pénzügyek */}
            <Route path="finance/invoices" element={<Placeholder title={t('sidebar.finance')} />} />
            <Route path="finance/expenses" element={<Placeholder title={t('sidebar.finance')} />} />

            {/* Alvállalkozók */}
            <Route path="partners/list" element={<Placeholder title={t('sidebar.subcontractors')} />} />
            <Route path="partners/chat" element={<Placeholder title="Partner Chat" />} />

            {/* Jelentések */}
            <Route path="reports/financial" element={<Placeholder title={t('sidebar.reports')} />} />
            <Route path="reports/performance" element={<Placeholder title={t('sidebar.reports')} />} />
            <Route path="reports/analytics" element={<Placeholder title={t('sidebar.reports')} />} />
            <Route path="reports/drivers-time" element={<Placeholder title={t('sidebar.reports')} />} />

            {/* AI */}
            <Route path="ai-assistant" element={<Placeholder title={t('sidebar.ai_assistant')} />} />

            {/* Beállítások */}
            <Route path="settings/profile" element={<Placeholder title="Profil" />} />
            <Route path="settings/integrations" element={<Integrations />} />
            <Route path="settings/notifications" element={<Placeholder title="Értesítések" />} />

            {/* Admin */}
            <Route path="admin/users" element={<UserManagement />} />
            <Route path="admin/companies" element={<CompanyManagement />} />
          </Route>

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
