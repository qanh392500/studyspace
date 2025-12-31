import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MathLayout from './pages/Math/MathLayout';
import MathIntro from './pages/Math/MathIntro';
import GeoGebra3D from './pages/Math/GeoGebra3D';
import PhysicsLayout from './pages/Physics/PhysicsLayout';
import PhysicsDashboard from './pages/Physics/PhysicsDashboard';
import KineticTheory from './pages/Physics/KineticTheory';
import Thermodynamics from './pages/Physics/Thermodynamics/Thermodynamics';
import HeatingCurve from './pages/Physics/HeatingCurve/HeatingCurve';
import GasLaws from './pages/Physics/GasLaws/GasLaws';
import MolecularDynamics from './pages/Physics/MolecularDynamics/MolecularDynamics';
import EnglishLayout from './pages/English/EnglishLayout';
import EnglishDashboard from './pages/English/EnglishDashboard';
import English from './pages/English/Vocabulary';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Nested Routes for Math */}
            <Route path="/math" element={<MathLayout />}>
              <Route index element={<MathIntro />} />
              <Route path="geometry-3d" element={<GeoGebra3D />} />
            </Route>

            {/* Nested Routes for Physics */}
            <Route path="/physics" element={<PhysicsLayout />}>
              <Route index element={<PhysicsDashboard />} />
              <Route path="kinetic-theory" element={<KineticTheory />} />
              <Route path="thermodynamics" element={<Thermodynamics />} />
              <Route path="heating-curve" element={<HeatingCurve />} />
              <Route path="gas-laws" element={<GasLaws />} />
              <Route path="molecular-dynamics" element={<MolecularDynamics />} />
            </Route>

            {/* Nested Routes for English */}
            <Route path="/english" element={<EnglishLayout />}>
              <Route index element={<EnglishDashboard />} />
              <Route path="vocabulary" element={<English />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;