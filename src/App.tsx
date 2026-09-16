import React, { useState } from 'react';
import { UrgencyBanner } from './components/UrgencyBanner';
import { TopSubheader } from './components/TopSubheader';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AITutorSimulator } from './components/AITutorSimulator';
import { DonationCard } from './components/DonationCard';
import { BusinessSegments } from './components/BusinessSegments';
import { ImpactDashboardPreview } from './components/ImpactDashboardPreview';
import { ComparisonTable } from './components/ComparisonTable';
import { Footer } from './components/Footer';
import { Currency } from './types';

export function App() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('COP');
  const [studentPortalNotice, setStudentPortalNotice] = useState(false);

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

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Student Portal Modal Notice */}
      {studentPortalNotice && (
        <div className="fixed top-24 right-6 z-50 bg-navy-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-fadeIn max-w-sm">
          <h4 className="font-extrabold text-sm text-amber-400">Portal Estudiante & Docente</h4>
          <p className="text-xs text-slate-300 mt-1">
            Redireccionando al área de acceso con credenciales de la Secretaría de Educación de Turbo...
          </p>
        </div>
      )}

      {/* 1. Urgency & Promo Banner (Open English Style) */}
      <UrgencyBanner onOpenAction={() => scrollToSection('donaciones')} />

      {/* 2. Top Subheader Tabs & Phone Line */}
      <TopSubheader onOpenStudentPortal={handleOpenStudentPortal} />

      {/* 3. Main Navbar */}
      <Navbar
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        onOpenDonationModal={() => scrollToSection('donaciones')}
        onOpenStudentPortal={handleOpenStudentPortal}
      />

      {/* Main Content */}
      <main className="flex-1 bg-white">
        
        {/* 4. High-Converting 3-Column Hero Section */}
        <HeroSection
          onOpenDonation={() => scrollToSection('donaciones')}
          onExplorePrograms={() => scrollToSection('segmentos')}
        />

        {/* 5. Interactive AI Tutor Simulator (Jenny AI 24/7) */}
        <AITutorSimulator />

        {/* 6. Módulo de Donaciones de Impacto (Unit Economics) */}
        <DonationCard initialCurrency={selectedCurrency} />

        {/* 7. Catálogo de los 4 Segmentos de Negocio */}
        <BusinessSegments
          onSelectAction={(action) => {
            if (action === 'donate') scrollToSection('donaciones');
            else scrollToSection('donaciones');
          }}
        />

        {/* 8. Dashboard de Auditoría de Becados en Vivo */}
        <ImpactDashboardPreview
          onOpenDonation={() => scrollToSection('donaciones')}
        />

        {/* 9. Comparativa Directa vs Open English y Academias Tradicionales */}
        <ComparisonTable />

      </main>

      {/* 10. Footer Institucional */}
      <Footer
        onOpenDonation={() => scrollToSection('donaciones')}
      />

    </div>
  );
}

export default App;
