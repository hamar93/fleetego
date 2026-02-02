import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './components/Dashboard';
import Placeholder from './components/Placeholder';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Timocom */}
          <Route path="timocom/search" element={<Placeholder title="Timocom Fuvar Keresés" />} />
          <Route path="timocom/offers" element={<Placeholder title="Ajánlataim" />} />
          <Route path="timocom/chat" element={<Placeholder title="Timocom AI Chat" />} />

          {/* Fuvarkezelés */}
          <Route path="shipments/active" element={<Placeholder title="Aktív Fuvarok" />} />
          <Route path="shipments/planning" element={<Placeholder title="Útvonaltervezés" />} />
          <Route path="shipments/tracking" element={<Placeholder title="Nyomon követés" />} />

          {/* Járműflotta */}
          <Route path="fleet/vehicles" element={<Placeholder title="Járművek" />} />
          <Route path="fleet/drivers" element={<Placeholder title="Sofőrök" />} />
          <Route path="fleet/maintenance" element={<Placeholder title="Karbantartás" />} />

          {/* Jelentések */}
          <Route path="reports/financial" element={<Placeholder title="Pénzügyi Jelentések" />} />
          <Route path="reports/performance" element={<Placeholder title="Teljesítmény" />} />
          <Route path="reports/analytics" element={<Placeholder title="Analitika" />} />

          {/* AI */}
          <Route path="ai-assistant" element={<Placeholder title="AI Asszisztens" />} />

          {/* Beállítások */}
          <Route path="settings/profile" element={<Placeholder title="Profil" />} />
          <Route path="settings/integrations" element={<Placeholder title="Integrációk" />} />
          <Route path="settings/notifications" element={<Placeholder title="Értesítések" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
