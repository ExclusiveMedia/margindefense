/**
 * MarginDefense.ai
 * Revenue Protection System
 * 
 * Main Application Component
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ScopeShieldPage } from '@/pages/ScopeShieldPage';
import { LeakagePage } from '@/pages/LeakagePage';
import { SettingsPage } from '@/pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="scope-shield" element={<ScopeShieldPage />} />
          <Route path="leakage" element={<LeakagePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
