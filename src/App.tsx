import React, { useState, useEffect } from 'react';
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
import { LocationModal } from './components/LocationModal';
import { Currency } from './types';
import { useCurrency } from './context/CurrencyContext';

// Views for client-side route fallback
import { LoginView } from './components/views/LoginView';
import AdminDashboardPage from './app/dashboard/admin/page';
import AdminProductsPage from './app/dashboard/admin/products/page';
import TeacherDashboardPage from './app/dashboard/teacher/page';
import StudentDashboardPage from './app/dashboard/student/page';
import MatriculaPage from './app/matricula/page';
import CampusVirtualPage from './app/campus/page';
import CampusLoginPage from './app/campus/login/page';
import AulaVirtualPage from './app/campus/curso/[id]/page';
import AdminLoginPage from './app/admin/login/page';
import LiquidacionesCorplexPage from './app/admin/liquidaciones/page';
import AdminEstudiantesPage from './app/admin/estudiantes/page';

export function App() {
  const { currency: selectedCurrency, setCurrency: setSelectedCurrency } = useCurrency();
  const [forcedTierId, setForcedTierId] = useState<string>('tier-2');

  // Client path detection for hybrid SPA & SSR routing
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Modals global state
  const [digitalStoreOpen, setDigitalStoreOpen] = useState(false);
  const [liveClassesOpen, setLiveClassesOpen] = useState(false);
  const [presencialOpen, setPresencialOpen] = useState(false);
  const [scholarshipModalOpen, setScholarshipModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId) || document.getElementById('registro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = el.querySelector('input') || document.getElementById('primer-campo-nombre');
        if (input) {
          (input as HTMLInputElement).focus({ preventScroll: true });
        }
      }, 500);
    }
  };

  const handleOpenStudentPortal = () => {
    window.location.href = '/campus/login';
  };

  const handlePreselectTier2 = () => {
    setForcedTierId('tier-2');
  };

  // HYBRID ROUTE RENDERER (Garantiza funcionamiento en SPA Vercel y Next.js)
  if (currentPath === '/admin/login') {
    return <AdminLoginPage />;
  }
  if (currentPath === '/admin' || currentPath === '/dashboard/admin') {
    return <AdminDashboardPage />;
  }
  if (currentPath === '/campus/login') {
    return <CampusLoginPage />;
  }
  if (currentPath === '/login') {
    return <LoginView />;
  }
  if (currentPath === '/matricula') {
    return <MatriculaPage />;
  }
  if (currentPath === '/dashboard/admin') {
    return <AdminDashboardPage />;
  }
  if (currentPath === '/admin/liquidaciones' || currentPath === '/admin/finanzas' || currentPath === '/dashboard/admin/liquidaciones') {
    return <LiquidacionesCorplexPage />;
  }
  if (currentPath === '/admin/estudiantes' || currentPath === '/dashboard/admin/estudiantes') {
    return <AdminEstudiantesPage />;
  }
  if (currentPath === '/dashboard/admin/products') {
    return <AdminProductsPage />;
  }
  if (currentPath === '/dashboard/teacher') {
    return <TeacherDashboardPage />;
  }
  if (currentPath.startsWith('/campus/curso/')) {
    return <AulaVirtualPage />;
  }
  if (currentPath === '/campus' || currentPath === '/campus/miscursos') {
    return <CampusVirtualPage />;
  }
  if (currentPath === '/dashboard/student') {
    return <StudentDashboardPage />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-crimson-600 selection:text-white">
      
      {/* 1. Navbar */}
      <Navbar
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        onOpenDonationModal={() => setScholarshipModalOpen(true)}
        onOpenStudentPortal={handleOpenStudentPortal}
        onOpenProgramas={() => setPresencialOpen(true)}
        onOpenCursosDigitales={() => setDigitalStoreOpen(true)}
        onOpenClasesEnVivo={() => setLiveClassesOpen(true)}
        onOpenLocation={() => setLocationModalOpen(true)}
        onMatricularme={() => { window.location.href = '/matricula'; }}
      />

      {/* Main Content */}
      <main className="flex-1 bg-white">
        
        {/* 2. HeroSection */}
        <HeroSection
          onOpenDonation={() => setScholarshipModalOpen(true)}
          onExplorePrograms={() => scrollToSection('segmentos')}
          onOpenLocation={() => setLocationModalOpen(true)}
        />

        {/* 3. TrustLogos */}
        <TrustLogos />

        {/* 4. BusinessSegments */}
        <BusinessSegments
          currency={selectedCurrency}
          onPreselectTier2={handlePreselectTier2}
          onOpenDigitalStore={() => setDigitalStoreOpen(true)}
          onOpenLiveClasses={() => setLiveClassesOpen(true)}
          onOpenPresencial={() => setLocationModalOpen(true)}
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
        onOpenLocation={() => setLocationModalOpen(true)}
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

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />

    </div>
  );
}

export default App;
