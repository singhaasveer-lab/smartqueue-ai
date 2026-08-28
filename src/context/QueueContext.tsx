import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  QueueToken,
  Counter,
  Service,
  QueueAnalytics,
  AIInsight,
  PriorityLevel,
  ServiceId,
  ToastMessage,
} from '../types';
import { INITIAL_SERVICES, INITIAL_COUNTERS, INITIAL_DEMO_TOKENS } from '../data/initialData';
import { calculateAnalytics, generateAIInsights } from '../utils/aiEngine';
import { soundManager } from '../utils/sound';

interface JoinQueueParams {
  name: string;
  serviceId: ServiceId;
  priority: PriorityLevel;
  phone?: string;
  email?: string;
  notes?: string;
}

interface QueueContextType {
  tokens: QueueToken[];
  counters: Counter[];
  services: Service[];
  analytics: QueueAnalytics;
  insights: AIInsight[];
  activeTab: 'landing' | 'join' | 'live' | 'admin' | 'insights' | 'analytics' | 'kiosk';
  setActiveTab: (tab: 'landing' | 'join' | 'live' | 'admin' | 'insights' | 'analytics' | 'kiosk') => void;
  myActiveTokenId: string | null;
  myActiveToken: QueueToken | null;
  joinQueue: (params: JoinQueueParams) => QueueToken;
  leaveQueue: (tokenId: string) => void;
  callNext: (counterId?: number) => QueueToken | null;
  startServing: (tokenId: string, counterId?: number) => void;
  completeCurrent: (tokenId: string) => void;
  skipToken: (tokenId: string) => void;
  recallToken: (tokenId: string, counterId?: number) => void;
  prioritizeToken: (tokenId: string) => void;
  toggleCounterStatus: (counterId: number) => void;
  addCounter: (name: string, staffName: string) => void;
  resetToDemoData: () => void;
  clearAllData: () => void;
  fastAddDemoCustomer: (priority?: boolean) => QueueToken;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (enabled: boolean) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  setMyActiveTokenId: (id: string | null) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const TOKENS_STORAGE_KEY = 'smartqueue_tokens_v2';
const COUNTERS_STORAGE_KEY = 'smartqueue_counters_v2';
const MY_TOKEN_STORAGE_KEY = 'smartqueue_my_active_token_v2';
const SOUND_KEY = 'smartqueue_sound_enabled';
const SPEECH_KEY = 'smartqueue_speech_enabled';

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial tokens
  const [tokens, setTokens] = useState<QueueToken[]>(() => {
    try {
      const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_DEMO_TOKENS;
  });

  // Load counters
  const [counters, setCounters] = useState<Counter[]>(() => {
    try {
      const stored = localStorage.getItem(COUNTERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_COUNTERS;
  });

  const services = INITIAL_SERVICES;

  // Active user's joined token
  const [myActiveTokenId, setMyActiveTokenIdState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(MY_TOKEN_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'landing' | 'join' | 'live' | 'admin' | 'insights' | 'analytics' | 'kiosk'>('landing');

  // Sound and Speech Settings
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(SOUND_KEY);
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const [speechEnabled, setSpeechEnabledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(SPEECH_KEY);
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type, timestamp: Date.now() }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    soundManager.setSoundEnabled(enabled);
    try {
      localStorage.setItem(SOUND_KEY, String(enabled));
    } catch {
      // ignore
    }
  }, []);

  const setSpeechEnabled = useCallback((enabled: boolean) => {
    setSpeechEnabledState(enabled);
    soundManager.setSpeechEnabled(enabled);
    try {
      localStorage.setItem(SPEECH_KEY, String(enabled));
    } catch {
      // ignore
    }
  }, []);

  const setMyActiveTokenId = useCallback((id: string | null) => {
    setMyActiveTokenIdState(id);
    try {
      if (id) {
        localStorage.setItem(MY_TOKEN_STORAGE_KEY, id);
      } else {
        localStorage.removeItem(MY_TOKEN_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
    } catch {
      // ignore
    }
  }, [tokens]);

  useEffect(() => {
    try {
      localStorage.setItem(COUNTERS_STORAGE_KEY, JSON.stringify(counters));
    } catch {
      // ignore
    }
  }, [counters]);

  // Recalculate dynamic wait times for all waiting tokens
  const updateEstimatedWaitTimes = useCallback((currentTokens: QueueToken[], currentCounters: Counter[]): QueueToken[] => {
    const activeCountersCount = Math.max(1, currentCounters.filter((c) => c.status !== 'closed').length);
    
    // Sort waiting tokens: Priority first, then by joinedAt / numericSeq
    const waitingTokens = currentTokens
      .filter((t) => t.status === 'waiting')
      .sort((a, b) => {
        if (a.priority === 'priority' && b.priority !== 'priority') return -1;
        if (a.priority !== 'priority' && b.priority === 'priority') return 1;
        return a.joinedAt - b.joinedAt;
      });

    let cumulativeMinutes = 2; // base offset
    const waitTimeMap = new Map<string, number>();

    waitingTokens.forEach((token, index) => {
      const srv = services.find((s) => s.id === token.serviceId);
      const duration = srv?.avgDurationMinutes || 8;
      const estimated = Math.max(1, Math.round((cumulativeMinutes + (index * duration)) / activeCountersCount));
      waitTimeMap.set(token.id, estimated);
    });

    return currentTokens.map((token) => {
      if (token.status === 'waiting') {
        return {
          ...token,
          estimatedWaitMinutes: waitTimeMap.get(token.id) ?? token.estimatedWaitMinutes,
        };
      }
      return token;
    });
  }, [services]);

  // Dynamic calculations
  const analytics = useMemo(() => {
    return calculateAnalytics(tokens, counters, services);
  }, [tokens, counters, services]);

  const insights = useMemo(() => {
    return generateAIInsights(tokens, counters, services, analytics);
  }, [tokens, counters, services, analytics]);

  const myActiveToken = useMemo(() => {
    if (!myActiveTokenId) return null;
    return tokens.find((t) => t.id === myActiveTokenId) || null;
  }, [tokens, myActiveTokenId]);

  // Check if active token status changed to 'called' or 'serving' to notify user
  useEffect(() => {
    if (myActiveToken && (myActiveToken.status === 'called' || myActiveToken.status === 'serving')) {
      const counterInfo = myActiveToken.assignedCounter ? `at Counter ${myActiveToken.assignedCounter}` : '';
      if (myActiveToken.status === 'called') {
        addToast(
          'It\'s Your Turn!',
          `Token ${myActiveToken.tokenNumber} is now being called ${counterInfo}! Please proceed.`,
          'alert'
        );
        soundManager.playChime('call');
        soundManager.announceToken(myActiveToken.tokenNumber, myActiveToken.assignedCounter, myActiveToken.customerName);
      }
    }
  }, [myActiveToken?.status, myActiveToken?.assignedCounter]);

  // Listen for storage events (e.g. across multi-tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKENS_STORAGE_KEY && e.newValue) {
        try {
          setTokens(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === COUNTERS_STORAGE_KEY && e.newValue) {
        try {
          setCounters(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === MY_TOKEN_STORAGE_KEY) {
        setMyActiveTokenIdState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Action: Join Queue
  const joinQueue = useCallback(
    (params: JoinQueueParams): QueueToken => {
      const service = services.find((s) => s.id === params.serviceId) || services[0];
      
      // Calculate next sequential number
      const maxSeq = tokens.reduce((max, t) => Math.max(max, t.numericSeq), 100);
      const nextSeq = maxSeq + 1;

      // Token Code: e.g. PRI-109 or DOC-109
      const prefix = params.priority === 'priority' ? 'PRI' : service.code;
      const tokenNumber = `${prefix}-${nextSeq}`;

      const newToken: QueueToken = {
        id: `token-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        tokenNumber,
        numericSeq: nextSeq,
        customerName: params.name.trim(),
        customerPhone: params.phone?.trim() || undefined,
        customerEmail: params.email?.trim() || undefined,
        notes: params.notes?.trim() || undefined,
        serviceId: params.serviceId,
        serviceName: service.name,
        priority: params.priority,
        status: 'waiting',
        joinedAt: Date.now(),
        estimatedWaitMinutes: 10,
      };

      setTokens((prev) => {
        const updated = updateEstimatedWaitTimes([...prev, newToken], counters);
        return updated;
      });

      setMyActiveTokenId(newToken.id);
      soundManager.playChime('joined');
      addToast(
        'Queue Joined!',
        `Your token is ${newToken.tokenNumber}. You can monitor your position in real time.`,
        'success'
      );

      return newToken;
    },
    [services, tokens, counters, updateEstimatedWaitTimes, setMyActiveTokenId, addToast]
  );

  // Action: Leave Queue
  const leaveQueue = useCallback(
    (tokenId: string) => {
      setTokens((prev) => {
        const updated = prev.map((t) => (t.id === tokenId ? { ...t, status: 'cancelled' as const } : t));
        return updateEstimatedWaitTimes(updated, counters);
      });

      if (myActiveTokenId === tokenId) {
        setMyActiveTokenId(null);
      }

      addToast('Left Queue', 'Your token has been removed from the queue.', 'info');
    },
    [counters, myActiveTokenId, setMyActiveTokenId, updateEstimatedWaitTimes, addToast]
  );

  // Action: Call Next Token
  const callNext = useCallback(
    (targetCounterId?: number): QueueToken | null => {
      // Find eligible waiting token: highest priority first, then earliest joinedAt
      const waitingTokens = tokens
        .filter((t) => t.status === 'waiting')
        .sort((a, b) => {
          if (a.priority === 'priority' && b.priority !== 'priority') return -1;
          if (a.priority !== 'priority' && b.priority === 'priority') return 1;
          return a.joinedAt - b.joinedAt;
        });

      if (waitingTokens.length === 0) {
        addToast('No Waiting Tokens', 'There are currently no customers in the queue.', 'info');
        return null;
      }

      const nextToken = waitingTokens[0];
      const counterId = targetCounterId || counters.find((c) => c.status === 'available')?.id || counters[0]?.id || 1;

      // Update token status to called & serving
      setTokens((prev) => {
        const updated = prev.map((t) => {
          if (t.id === nextToken.id) {
            return {
              ...t,
              status: 'called' as const,
              calledAt: Date.now(),
              assignedCounter: counterId,
              estimatedWaitMinutes: 0,
            };
          }
          return t;
        });
        return updateEstimatedWaitTimes(updated, counters);
      });

      // Update counter
      setCounters((prev) =>
        prev.map((c) => (c.id === counterId ? { ...c, status: 'busy', currentServingTokenId: nextToken.id } : c))
      );

      soundManager.playChime('call');
      soundManager.announceToken(nextToken.tokenNumber, counterId, nextToken.customerName);

      addToast(
        `Calling ${nextToken.tokenNumber}`,
        `${nextToken.customerName} called to Counter ${counterId}.`,
        'success'
      );

      return nextToken;
    },
    [tokens, counters, updateEstimatedWaitTimes, addToast]
  );

  // Action: Start Serving
  const startServing = useCallback(
    (tokenId: string, counterId?: number) => {
      setTokens((prev) =>
        prev.map((t) => {
          if (t.id === tokenId) {
            return {
              ...t,
              status: 'serving' as const,
              serviceStartedAt: Date.now(),
              assignedCounter: counterId || t.assignedCounter || 1,
            };
          }
          return t;
        })
      );

      const targetCounter = counterId || 1;
      setCounters((prev) =>
        prev.map((c) => (c.id === targetCounter ? { ...c, status: 'busy', currentServingTokenId: tokenId } : c))
      );

      addToast('Service Started', `Token is now in active service.`, 'info');
    },
    [addToast]
  );

  // Action: Complete Current
  const completeCurrent = useCallback(
    (tokenId: string) => {
      const targetToken = tokens.find((t) => t.id === tokenId);
      setTokens((prev) => {
        const updated = prev.map((t) => {
          if (t.id === tokenId) {
            return {
              ...t,
              status: 'completed' as const,
              completedAt: Date.now(),
              serviceStartedAt: t.serviceStartedAt || t.calledAt || (Date.now() - 5 * 60 * 1000),
            };
          }
          return t;
        });
        return updateEstimatedWaitTimes(updated, counters);
      });

      // Free counter
      setCounters((prev) =>
        prev.map((c) => (c.currentServingTokenId === tokenId ? { ...c, status: 'available', currentServingTokenId: null } : c))
      );

      if (myActiveTokenId === tokenId) {
        // Keep active token view marked as completed
      }

      soundManager.playChime('complete');
      addToast(
        'Token Completed',
        `Token ${targetToken?.tokenNumber || ''} marked as successfully completed.`,
        'success'
      );
    },
    [tokens, counters, myActiveTokenId, updateEstimatedWaitTimes, addToast]
  );

  // Action: Skip Token
  const skipToken = useCallback(
    (tokenId: string) => {
      const targetToken = tokens.find((t) => t.id === tokenId);
      setTokens((prev) => {
        const updated = prev.map((t) => {
          if (t.id === tokenId) {
            return {
              ...t,
              status: 'skipped' as const,
            };
          }
          return t;
        });
        return updateEstimatedWaitTimes(updated, counters);
      });

      // Free counter if assigned
      setCounters((prev) =>
        prev.map((c) => (c.currentServingTokenId === tokenId ? { ...c, status: 'available', currentServingTokenId: null } : c))
      );

      soundManager.playChime('alert');
      addToast(
        'Token Skipped',
        `Token ${targetToken?.tokenNumber || ''} marked as skipped (no show).`,
        'warning'
      );
    },
    [tokens, counters, updateEstimatedWaitTimes, addToast]
  );

  // Action: Recall Token (e.g. from skipped or waiting)
  const recallToken = useCallback(
    (tokenId: string, targetCounterId?: number) => {
      const counterId = targetCounterId || counters[0]?.id || 1;
      const targetToken = tokens.find((t) => t.id === tokenId);

      setTokens((prev) => {
        const updated = prev.map((t) => {
          if (t.id === tokenId) {
            return {
              ...t,
              status: 'called' as const,
              calledAt: Date.now(),
              assignedCounter: counterId,
            };
          }
          return t;
        });
        return updateEstimatedWaitTimes(updated, counters);
      });

      setCounters((prev) =>
        prev.map((c) => (c.id === counterId ? { ...c, status: 'busy', currentServingTokenId: tokenId } : c))
      );

      soundManager.playChime('call');
      soundManager.announceToken(targetToken?.tokenNumber || 'Token', counterId, targetToken?.customerName);

      addToast(
        `Recalled ${targetToken?.tokenNumber}`,
        `Re-announcing token for Counter ${counterId}.`,
        'info'
      );
    },
    [tokens, counters, updateEstimatedWaitTimes, addToast]
  );

  // Action: Upgrade to Priority
  const prioritizeToken = useCallback(
    (tokenId: string) => {
      setTokens((prev) => {
        const updated = prev.map((t) => {
          if (t.id === tokenId) {
            return {
              ...t,
              priority: 'priority' as PriorityLevel,
              tokenNumber: t.tokenNumber.startsWith('PRI-') ? t.tokenNumber : `PRI-${t.numericSeq}`,
            };
          }
          return t;
        });
        return updateEstimatedWaitTimes(updated, counters);
      });

      addToast('Priority Upgraded', 'Customer has been moved to VIP/Priority tier.', 'success');
    },
    [counters, updateEstimatedWaitTimes, addToast]
  );

  // Counter management
  const toggleCounterStatus = useCallback((counterId: number) => {
    setCounters((prev) =>
      prev.map((c) => {
        if (c.id === counterId) {
          const nextStatus = c.status === 'closed' ? 'available' : 'closed';
          return {
            ...c,
            status: nextStatus,
            currentServingTokenId: nextStatus === 'closed' ? null : c.currentServingTokenId,
          };
        }
        return c;
      })
    );
  }, []);

  const addCounter = useCallback((name: string, staffName: string) => {
    setCounters((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((c) => c.id)) + 1 : 1;
      const newCounter: Counter = {
        id: nextId,
        name: name.trim() || `Counter ${nextId}`,
        staffName: staffName.trim() || `Staff ${nextId}`,
        status: 'available',
        currentServingTokenId: null,
      };
      return [...prev, newCounter];
    });
    addToast('Counter Added', `New service station created.`, 'success');
  }, [addToast]);

  // Fast Demo Customer generator
  const fastAddDemoCustomer = useCallback(
    (isPriority: boolean = false): QueueToken => {
      const sampleNames = [
        'Alexander Wright',
        'Nadia Patel',
        'Benjamin Cruz',
        'Maya Lin',
        'Julian Rossi',
        'Camila Alvarez',
        'Zayn Malik',
        'Oliver Hansen',
      ];
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];

      return joinQueue({
        name: randomName,
        serviceId: randomService.id,
        priority: isPriority ? 'priority' : 'normal',
        phone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
        notes: isPriority ? 'Senior / Express Walk-in' : 'Standard kiosk registration',
      });
    },
    [services, joinQueue]
  );

  // Reset to Demo Data
  const resetToDemoData = useCallback(() => {
    setTokens(INITIAL_DEMO_TOKENS);
    setCounters(INITIAL_COUNTERS);
    setMyActiveTokenId(null);
    try {
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_TOKENS));
      localStorage.setItem(COUNTERS_STORAGE_KEY, JSON.stringify(INITIAL_COUNTERS));
      localStorage.removeItem(MY_TOKEN_STORAGE_KEY);
    } catch {}
    addToast('Demo Reset', 'Reset queue to pristine demo benchmark state.', 'info');
  }, [setMyActiveTokenId, addToast]);

  // Clear all data
  const clearAllData = useCallback(() => {
    setTokens([]);
    setCounters((prev) => prev.map((c) => ({ ...c, status: 'available', currentServingTokenId: null })));
    setMyActiveTokenId(null);
    try {
      localStorage.removeItem(TOKENS_STORAGE_KEY);
      localStorage.removeItem(MY_TOKEN_STORAGE_KEY);
    } catch {}
    addToast('Queue Cleared', 'All tokens and waiting lines cleared.', 'warning');
  }, [setMyActiveTokenId, addToast]);

  return (
    <QueueContext.Provider
      value={{
        tokens,
        counters,
        services,
        analytics,
        insights,
        activeTab,
        setActiveTab,
        myActiveTokenId,
        myActiveToken,
        joinQueue,
        leaveQueue,
        callNext,
        startServing,
        completeCurrent,
        skipToken,
        recallToken,
        prioritizeToken,
        toggleCounterStatus,
        addCounter,
        resetToDemoData,
        clearAllData,
        fastAddDemoCustomer,
        soundEnabled,
        setSoundEnabled,
        speechEnabled,
        setSpeechEnabled,
        toasts,
        addToast,
        removeToast,
        setMyActiveTokenId,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
