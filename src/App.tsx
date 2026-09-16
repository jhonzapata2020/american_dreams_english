import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustLogos } from './components/TrustLogos';
import { BusinessSegments } from './components/BusinessSegments';
import { AITutorSimulator } from './components/AITutorSimulator';
import { DonationCard } from './components/DonationCard';
import { ImpactDashboardPreview } from './components/ImpactDashboardPreview';
import { Footer } from './components/Footer';
import { Currency } from './types';

export function App() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('COP');
  const [studentPortalNotice, setStudentPortalNotice] = useState(false);
  const [forcedTierId, setForcedTierId] = useState<string>('tier-2');

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenStudentPortal = () => {
    setStudentPortalNotice(true);
    setTimeout(() => {
      setStudentPortalNotice(false);
    }, 4000);
  };

  const handlePreselectTier2 = () => {
    setForcedTierId('tier-2');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-crimson-600 selection:text-white">
      
      {/* Student Portal Modal Notice */}
      {studentPortalNotice && (
        <div className="fixed top-24 right-6 z-50 bg-navy-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-fadeIn max-w-sm">
          <h4 className="font-extrabold text-sm text-amber-400">Portal Estudiante & Docente</h4>
          <p className="text-xs text-slate-300 mt-1">
            Redireccionando al área de acceso con credenciales de la Secretaría de Educación de Turbo...
          </p>
        </div>
      )}

      {/* 1. Navbar (Un Solo Piso) */}
      <Navbar
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        onOpenDonationModal={() => scrollToSection('donaciones')}
        onOpenStudentPortal={handleOpenStudentPortal}
      />

      {/* Main Content (Modular & Respira con Generoso Espacio en Blanco) */}
      <main className="flex-1 bg-white">
        
        {/* 2. HeroSection (Equilibrado en 2 Columnas) */}
        <HeroSection
          onOpenDonation={() => scrollToSection('donaciones')}
          onExplorePrograms={() => scrollToSection('segmentos')}
        />

        {/* 3. TrustLogos / Respaldo Oficial (Cinta Sutil) */}
        <TrustLogos />

        {/* 4. BusinessSegments (4 Unidades de Negocio con Modales Interactivos) */}
        <BusinessSegments
          currency={selectedCurrency}
          onPreselectTier2={handlePreselectTier2}
        />

        {/* 5. JennySection (Tutora IA Jenny 24/7 Exclusiva) */}
        <AITutorSimulator />

        {/* 6. DonationSection (Fondo de Becas & Unit Economics con Fondo bg-slate-50) */}
        <section className="bg-slate-50 py-16 border-b border-slate-200">
          <DonationCard initialCurrency={selectedCurrency} forcedTierId={forcedTierId} />
        </section>

        {/* 7. AuditSection (Dashboard Auditado de Becarios) */}
        <ImpactDashboardPreview
          onOpenDonation={() => scrollToSection('donaciones')}
        />

      </main>

      {/* 8. Footer Institucional y Legal */}
      <Footer
        onOpenDonation={() => scrollToSection('donaciones')}
      />

    </div>
  );
}

export default App;
