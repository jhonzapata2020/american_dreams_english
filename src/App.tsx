import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustLogos } from './components/TrustLogos';
import { BusinessSegments } from './components/BusinessSegments';
import { AITutorSimulator } from './components/AITutorSimulator';
import { DonationCard } from './components/DonationCard';
import { ImpactDashboardPreview } from './components/ImpactDashboardPreview';
import { Footer } from './components/Footer';
import { DigitalStoreModal } from './components/DigitalStoreModal';
import { LiveClassesModal } from './components/LiveClassesModal';
import { PresencialModal } from './components/PresencialModal';
import { ScholarshipModal } from './components/ScholarshipModal';
import { Currency } from './types';

export function App() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('COP');
  const [studentPortalNotice, setStudentPortalNotice] = useState(false);
  const [forcedTierId, setForcedTierId] = useState<string>('tier-2');

  // Modals global state
  const [digitalStoreOpen, setDigitalStoreOpen] = useState(false);
  const [liveClassesOpen, setLiveClassesOpen] = useState(false);
  const [presencialOpen, setPresencialOpen] = useState(false);
  const [scholarshipModalOpen, setScholarshipModalOpen] = useState(false);

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

      {/* 1. Navbar */}
      <Navbar
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        onOpenDonationModal={() => setScholarshipModalOpen(true)}
        onOpenStudentPortal={handleOpenStudentPortal}
        onOpenProgramas={() => setPresencialOpen(true)}
        onOpenCursosDigitales={() => setDigitalStoreOpen(true)}
        onOpenClasesEnVivo={() => setLiveClassesOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 bg-white">
        
        {/* 2. HeroSection */}
        <HeroSection
          onOpenDonation={() => setScholarshipModalOpen(true)}
          onExplorePrograms={() => scrollToSection('segmentos')}
        />

        {/* 3. TrustLogos */}
        <TrustLogos />

        {/* 4. BusinessSegments */}
        <BusinessSegments
          currency={selectedCurrency}
          onPreselectTier2={handlePreselectTier2}
          onOpenDigitalStore={() => setDigitalStoreOpen(true)}
          onOpenLiveClasses={() => setLiveClassesOpen(true)}
          onOpenPresencial={() => setPresencialOpen(true)}
        />

        {/* 5. JennySection */}
        <AITutorSimulator />

        {/* 6. DonationSection */}
        <section className="bg-slate-50 py-16 border-b border-slate-200">
          <DonationCard initialCurrency={selectedCurrency} forcedTierId={forcedTierId} />
        </section>

        {/* 7. AuditSection */}
        <ImpactDashboardPreview
          onOpenDonation={() => setScholarshipModalOpen(true)}
        />

      </main>

      {/* 8. Footer Institucional y Legal */}
      <Footer
        onOpenDonation={() => setScholarshipModalOpen(true)}
      />

      {/* MODALES GLOBALES INTERACTIVOS */}
      <DigitalStoreModal
        isOpen={digitalStoreOpen}
        onClose={() => setDigitalStoreOpen(false)}
        currency={selectedCurrency}
      />

      <LiveClassesModal
        isOpen={liveClassesOpen}
        onClose={() => setLiveClassesOpen(false)}
      />

      <PresencialModal
        isOpen={presencialOpen}
        onClose={() => setPresencialOpen(false)}
      />

      <ScholarshipModal
        isOpen={scholarshipModalOpen}
        onClose={() => setScholarshipModalOpen(false)}
        currency={selectedCurrency}
      />

    </div>
  );
}

export default App;
