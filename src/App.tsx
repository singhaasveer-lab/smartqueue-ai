import React, { useState } from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { JoinQueueView } from './components/JoinQueueView';
import { LiveQueueDisplay } from './components/LiveQueueDisplay';
import { AdminDashboard } from './components/AdminDashboard';
import { AIInsightsView } from './components/AIInsightsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ToastContainer } from './components/ToastContainer';
import { RunInstructionsModal } from './components/RunInstructionsModal';
import { Footer } from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const { activeTab } = useQueue();
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  // Kiosk / TV mode
  if (activeTab === 'kiosk') {
    return (
      <main
        className="
          w-full
          max-w-full
          min-h-screen
          overflow-x-hidden
          bg-[var(--background)]
          text-[var(--foreground)]
          selection:bg-blue-500
          selection:text-white
        "
      >
        <LiveQueueDisplay isKioskMode={true} />
        <ToastContainer />
      </main>
    );
  }

  return (
    <div
      className="
        w-full
        max-w-full
        min-h-screen
        flex
        flex-col
        bg-[var(--background)]
        text-[var(--foreground)]
        transition-colors
        duration-300
        overflow-x-hidden
        selection:bg-blue-500
        selection:text-white
      "
    >
      <div className="w-full max-w-full min-w-0 overflow-x-hidden">
        <Navbar
          onOpenInstructions={() => setInstructionsOpen(true)}
        />

        <main
          className="
            w-full
            max-w-full
            min-w-0
            overflow-x-hidden
          "
        >
          {activeTab === 'landing' && <LandingPage />}

          {activeTab === 'join' && <JoinQueueView />}

          {activeTab === 'live' && (
            <LiveQueueDisplay isKioskMode={false} />
          )}

          {activeTab === 'admin' && <AdminDashboard />}

          {activeTab === 'insights' && <AIInsightsView />}

          {activeTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      <Footer
        onOpenInstructions={() => setInstructionsOpen(true)}
      />

      <ToastContainer />

      <RunInstructionsModal
        isOpen={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <QueueProvider>
        <AppContent />
      </QueueProvider>
    </ThemeProvider>
  );
}