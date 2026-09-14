import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { StudentView } from './components/StudentView';
import { TeacherView } from './components/TeacherView';
import { WhatsAppModal } from './components/WhatsAppModal';
import { PlacementTestModal } from './components/PlacementTestModal';
import { CURRENT_CHALLENGE } from './data/mockData';
import { Submission, TeacherFeedback } from './types';
import { getStoredSubmissions, saveStoredSubmissions } from './utils/storage';

export function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'campus'>('landing');
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  
  // Modals state
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppDefaultMsg, setWhatsAppDefaultMsg] = useState<string | undefined>(undefined);
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);

  // Submissions state initialized from localStorage with fallback to mock data
  const [submissions, setSubmissions] = useState<Submission[]>(() => getStoredSubmissions());

  // Save to localStorage whenever submissions update
  useEffect(() => {
    saveStoredSubmissions(submissions);
  }, [submissions]);

  // Handle new student audio submission
  const handleNewSubmission = (newSub: Submission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  // Handle teacher review / feedback update
  const handleUpdateFeedback = (submissionId: string, feedback: TeacherFeedback) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          return {
            ...sub,
            status: 'reviewed',
            feedback,
          };
        }
        return sub;
      })
    );
  };

  const handleOpenWhatsApp = (customMessage?: string) => {
    setWhatsAppDefaultMsg(customMessage);
    setIsWhatsAppOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header Unificado */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userRole={userRole}
        onToggleRole={setUserRole}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
        onOpenPlacementTest={() => setIsPlacementTestOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'landing' ? (
          <LandingPage
            onGoToCampus={() => setCurrentTab('campus')}
            onOpenWhatsApp={handleOpenWhatsApp}
            onOpenPlacementTest={() => setIsPlacementTestOpen(true)}
          />
        ) : (
          <div className="bg-slate-100/60 min-h-screen py-4">
            {userRole === 'student' ? (
              <StudentView
                challenge={CURRENT_CHALLENGE}
                submissions={submissions}
                onNewSubmission={handleNewSubmission}
                onOpenWhatsApp={() => handleOpenWhatsApp()}
              />
            ) : (
              <TeacherView
                submissions={submissions}
                onUpdateFeedback={handleUpdateFeedback}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Action WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => handleOpenWhatsApp()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center space-x-2 transition-all transform hover:scale-105 active:scale-95 group ring-4 ring-emerald-500/20"
          title="Contacto WhatsApp Turbo"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold">
            WhatsApp Turbo
          </span>
        </button>
      </div>

      {/* Modals */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        defaultMessage={whatsAppDefaultMsg}
      />

      <PlacementTestModal
        isOpen={isPlacementTestOpen}
        onClose={() => setIsPlacementTestOpen(false)}
        onOpenWhatsApp={handleOpenWhatsApp}
      />

    </div>
  );
}

export default App;
