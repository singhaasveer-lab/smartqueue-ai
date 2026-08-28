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

const AppContent: React.FC = () => {
  const { activeTab } = useQueue();
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  // If Kiosk / TV mode is active, render full-screen immersive display
  if (activeTab === 'kiosk') {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
        <LiveQueueDisplay isKioskMode={true} />
        <ToastContainer />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div>
        <Navbar onOpenInstructions={() => setInstructionsOpen(true)} />
        <main className="w-full">
          {activeTab === 'landing' && <LandingPage />}
          {activeTab === 'join' && <JoinQueueView />}
          {activeTab === 'live' && <LiveQueueDisplay isKioskMode={false} />}
          {activeTab === 'admin' && <AdminDashboard />}
          {activeTab === 'insights' && <AIInsightsView />}
          {activeTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      <Footer onOpenInstructions={() => setInstructionsOpen(true)} />
      <ToastContainer />
      <RunInstructionsModal isOpen={instructionsOpen} onClose={() => setInstructionsOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <QueueProvider>
      <AppContent />
    </QueueProvider>
  );
}
