import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  Tv,
  LayoutDashboard,
  BrainCircuit,
  BarChart3,
  Volume2,
  VolumeX,
  RotateCcw,
  Ticket,
  Menu,
  X,
  HelpCircle,
  Radio,
  Sun,
  Moon,
  Mic,
  MicOff,
} from 'lucide-react';

interface NavbarProps {
  onOpenInstructions: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInstructions }) => {
  const {
    activeTab,
    setActiveTab,
    myActiveToken,
    soundEnabled,
    setSoundEnabled,
    speechEnabled,
    setSpeechEnabled,
    resetToDemoData,
    analytics,
  } = useQueue();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const isLightMode = theme === 'light';

  const navItems = [
    {
      id: 'landing',
      label: 'Overview',
      icon: Sparkles,
    },
    {
      id: 'join',
      label: 'Join Queue',
      icon: Ticket,
    },
    {
      id: 'live',
      label: 'Live Queue',
      icon: Radio,
    },
    {
      id: 'admin',
      label: 'Admin Desk',
      icon: LayoutDashboard,
    },
    {
      id: 'insights',
      label: 'AI Insights',
      icon: BrainCircuit,
      badge: analytics.congestionLevel,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
  ];

  const handleNavigation = (tab: string) => {
    setActiveTab(tab as any);
    setMobileMenuOpen(false);
  };

  const getCongestionBadgeClass = () => {
    if (
      analytics.congestionLevel === 'High' ||
      analytics.congestionLevel === 'Severe'
    ) {
      return isLightMode
        ? 'bg-rose-100 text-rose-700 border-rose-200'
        : 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    }

    return isLightMode
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  };

  return (
    <header
      className={`
        sticky top-0 z-40 w-full max-w-full overflow-x-hidden
        border-b backdrop-blur-xl
        transition-all duration-300
        ${
          isLightMode
            ? 'border-blue-100 bg-white/95 shadow-sm'
            : 'border-slate-800 bg-slate-950/95'
        }
      `}
    >
      <div className="w-full max-w-[1500px] mx-auto px-3 sm:px-4 lg:px-5 xl:px-6">
        <div className="flex items-center h-[72px] gap-2 lg:gap-3 min-w-0">

          {/* =====================================================
              LOGO
          ====================================================== */}

          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleNavigation('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
              aria-label="Go to SmartQueue overview"
            >
              <div
                className={`
                  relative w-10 h-10 xl:w-11 xl:h-11
                  rounded-2xl p-[2px]
                  transition-all duration-300
                  group-hover:scale-105
                  ${
                    isLightMode
                      ? 'bg-gradient-to-br from-blue-500 via-sky-400 to-indigo-400 shadow-lg shadow-blue-200'
                      : 'bg-gradient-to-br from-blue-500 via-sky-400 to-indigo-500 shadow-lg shadow-blue-500/20'
                  }
                `}
              >
                <div
                  className={`
                    w-full h-full rounded-[14px]
                    flex items-center justify-center
                    ${isLightMode ? 'bg-white' : 'bg-slate-950'}
                  `}
                >
                  <Sparkles
                    className={`
                      w-5 h-5
                      ${
                        isLightMode
                          ? 'text-blue-600'
                          : 'text-sky-400'
                      }
                    `}
                  />
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`
                      font-bold text-base xl:text-lg tracking-tight
                      ${
                        isLightMode
                          ? 'text-slate-900'
                          : 'text-white'
                      }
                    `}
                  >
                    SmartQueue
                  </span>

                  <span
                    className={`
                      text-[9px] font-bold
                      px-1.5 py-0.5 rounded-md
                      border tracking-wide
                      ${
                        isLightMode
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/25'
                      }
                    `}
                  >
                    AI
                  </span>
                </div>

                <p
                  className={`
                    text-[9px] xl:text-[10px] font-medium tracking-wide
                    ${
                      isLightMode
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }
                  `}
                >
                  Smarter queues. Less waiting.
                </p>
              </div>
            </button>
          </div>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}

          <nav
            className={`
              hidden lg:flex flex-1 min-w-0
              items-center justify-center
              gap-0.5
              p-1 rounded-2xl border
              ${
                isLightMode
                  ? 'bg-slate-50 border-blue-100 shadow-sm'
                  : 'bg-slate-900/70 border-slate-800'
              }
            `}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    relative
                    flex-1 min-w-0
                    flex items-center justify-center
                    gap-1.5
                    px-2.5 xl:px-3
                    py-2
                    rounded-xl
                    text-[11px] xl:text-xs
                    font-semibold
                    tracking-wide
                    transition-all duration-200
                    whitespace-nowrap
                    ${
                      isActive
                        ? isLightMode
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                          : 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-600/25'
                        : isLightMode
                          ? 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />

                  <span className="truncate">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      className={`
                        hidden xl:inline-flex
                        text-[7px]
                        px-1.5 py-0.5
                        rounded-full
                        font-bold uppercase
                        border
                        shrink-0
                        ${getCongestionBadgeClass()}
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* =====================================================
              RIGHT SIDE CONTROLS
          ====================================================== */}

          <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">

            {/* =================================================
                MY ACTIVE TOKEN
            ================================================== */}

            {myActiveToken &&
              myActiveToken.status !== 'cancelled' && (
                <button
                  id="my-active-ticket-btn"
                  onClick={() => handleNavigation('join')}
                  className={`
                    hidden xl:flex
                    items-center
                    gap-1.5
                    px-2.5
                    h-[56px]
                    min-w-[112px]
                    max-w-[132px]
                    rounded-xl
                    border
                    transition-all
                    overflow-hidden
                    ${
                      isLightMode
                        ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                        : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/15'
                    }
                  `}
                  title={`My active token: ${myActiveToken.tokenNumber}`}
                >
                  <span
                    className={`
                      w-1.5 h-1.5 rounded-full
                      animate-pulse shrink-0
                      ${
                        isLightMode
                          ? 'bg-blue-500'
                          : 'bg-emerald-400'
                      }
                    `}
                  />

                  <div className="flex flex-col items-center justify-center min-w-0 flex-1 leading-tight">
                    <span
                      className={`
                        text-[9px] font-medium
                        ${
                          isLightMode
                            ? 'text-blue-600'
                            : 'text-emerald-300'
                        }
                      `}
                    >
                      My Token
                    </span>

                    <strong
                      className={`
                        text-[12px] font-mono font-bold
                        truncate max-w-full
                        ${
                          isLightMode
                            ? 'text-slate-900'
                            : 'text-white'
                        }
                      `}
                    >
                      {myActiveToken.tokenNumber}
                    </strong>
                  </div>

                  <span
                    className={`
                      hidden 2xl:inline-flex
                      text-[7px]
                      px-1.5 py-0.5
                      rounded-md
                      uppercase
                      font-mono font-bold
                      shrink-0
                      ${
                        isLightMode
                          ? 'bg-white text-blue-600 border border-blue-100'
                          : 'bg-emerald-950 text-emerald-400'
                      }
                    `}
                  >
                    {myActiveToken.status === 'serving'
                      ? 'At Desk'
                      : myActiveToken.status === 'called'
                        ? 'Called!'
                        : `~${myActiveToken.estimatedWaitMinutes}m`}
                  </span>
                </button>
              )}

            {/* =================================================
                TV BOARD
            ================================================== */}

            <button
              id="kiosk-mode-btn"
              onClick={() => handleNavigation('kiosk')}
              className={`
                hidden md:flex
                items-center justify-center
                gap-1.5
                px-2.5 xl:px-3
                h-11
                rounded-xl
                text-xs font-semibold
                border
                whitespace-nowrap
                transition-all
                ${
                  activeTab === 'kiosk'
                    ? isLightMode
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                    : isLightMode
                      ? 'bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                }
              `}
              title="Full Screen TV / Waiting Room Public Display"
              aria-label="Open TV Waiting Board"
            >
              <Tv
                className={`
                  w-3.5 h-3.5 shrink-0
                  ${
                    isLightMode
                      ? 'text-blue-600'
                      : 'text-sky-400'
                  }
                `}
              />

              <span className="hidden xl:inline">
                TV Board
              </span>
            </button>

            {/* =================================================
                THEME TOGGLE
            ================================================== */}

            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`
                relative
                p-2.5
                h-11 w-11
                flex items-center justify-center
                rounded-xl
                border
                transition-all duration-300
                shrink-0
                ${
                  isLightMode
                    ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                    : 'bg-slate-900 border-slate-700 text-sky-300 hover:bg-slate-800'
                }
              `}
              title={
                isLightMode
                  ? 'Switch to Dark Mode'
                  : 'Switch to Light Mode'
              }
              aria-label={
                isLightMode
                  ? 'Switch to dark mode'
                  : 'Switch to light mode'
              }
            >
              {isLightMode ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* =================================================
                SOUND
            ================================================== */}

            <button
              id="sound-toggle-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`
                hidden sm:flex
                p-2.5
                h-11 w-11
                items-center justify-center
                rounded-xl
                border
                transition-all
                shrink-0
                ${
                  soundEnabled
                    ? isLightMode
                      ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/15'
                    : isLightMode
                      ? 'bg-slate-100 border-slate-200 text-slate-400'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                }
              `}
              title={
                soundEnabled
                  ? 'Chime & Audio Enabled'
                  : 'Audio Muted'
              }
              aria-label="Toggle Audio"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* =================================================
                VOICE
            ================================================== */}

            <button
              id="speech-toggle-btn"
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`
                hidden lg:flex
                p-2.5
                h-11 w-11
                items-center justify-center
                rounded-xl
                border
                transition-all
                shrink-0
                ${
                  speechEnabled
                    ? isLightMode
                      ? 'bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100'
                      : 'bg-sky-500/10 border-sky-500/30 text-sky-300 hover:bg-sky-500/15'
                    : isLightMode
                      ? 'bg-slate-100 border-slate-200 text-slate-400'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                }
              `}
              title={
                speechEnabled
                  ? 'Voice Announcements Enabled'
                  : 'Voice Announcements Disabled'
              }
              aria-label="Toggle Voice Announcements"
            >
              {speechEnabled ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </button>

            {/* =================================================
                HELP
            ================================================== */}

            <button
              id="run-guide-btn"
              onClick={onOpenInstructions}
              className={`
                hidden xl:flex
                p-2.5
                h-11 w-11
                items-center justify-center
                rounded-xl
                border
                transition-all
                shrink-0
                ${
                  isLightMode
                    ? 'bg-white border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                }
              `}
              title="Local Run & Architecture Guide"
              aria-label="Help & Run Guide"
            >
              <HelpCircle
                className={`
                  w-4 h-4
                  ${
                    isLightMode
                      ? 'text-blue-600'
                      : 'text-sky-400'
                  }
                `}
              />
            </button>

            {/* =================================================
                RESET
            ================================================== */}

            <button
              id="reset-demo-btn"
              onClick={resetToDemoData}
              className={`
                hidden xl:flex
                p-2.5
                h-11 w-11
                items-center justify-center
                rounded-xl
                border
                transition-all
                shrink-0
                ${
                  isLightMode
                    ? 'bg-white border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10'
                }
              `}
              title="Reset to Realistic Demo Data"
              aria-label="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* =================================================
                MOBILE MENU
            ================================================== */}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`
                lg:hidden
                p-2.5
                h-11 w-11
                flex items-center justify-center
                rounded-xl
                border
                transition-all
                shrink-0
                ${
                  isLightMode
                    ? 'bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }
              `}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================
          MOBILE DRAWER
      =========================================================== */}

      {mobileMenuOpen && (
        <div
          className={`
            lg:hidden
            border-t
            px-4 pt-4 pb-5
            space-y-3
            ${
              isLightMode
                ? 'border-blue-100 bg-white'
                : 'border-slate-800 bg-slate-950'
            }
          `}
        >
          {/* Mobile Active Token */}

          {myActiveToken &&
            myActiveToken.status !== 'cancelled' && (
              <button
                onClick={() => handleNavigation('join')}
                className={`
                  w-full
                  p-3 rounded-2xl
                  border
                  flex items-center justify-between
                  transition-all
                  ${
                    isLightMode
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-emerald-500/10 border-emerald-500/25'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`
                      w-2.5 h-2.5
                      rounded-full
                      animate-pulse
                      ${
                        isLightMode
                          ? 'bg-blue-500'
                          : 'bg-emerald-400'
                      }
                    `}
                  />

                  <span
                    className={`
                      text-xs font-semibold
                      ${
                        isLightMode
                          ? 'text-blue-700'
                          : 'text-emerald-300'
                      }
                    `}
                  >
                    My Active Ticket
                  </span>
                </div>

                <span
                  className={`
                    font-mono
                    text-sm font-bold
                    px-2 py-1 rounded-lg
                    ${
                      isLightMode
                        ? 'bg-white text-blue-700 border border-blue-100'
                        : 'bg-emerald-950 text-emerald-300'
                    }
                  `}
                >
                  {myActiveToken.tokenNumber}
                </span>
              </button>
            )}

          {/* Mobile Navigation */}

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    flex items-center gap-2
                    px-3 py-3
                    rounded-xl
                    text-xs font-semibold
                    transition-all
                    ${
                      isActive
                        ? isLightMode
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-blue-600 text-white'
                        : isLightMode
                          ? 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />

                  <span>{item.label}</span>

                  {item.badge && (
                    <span
                      className={`
                        ml-auto
                        text-[8px]
                        px-1.5 py-0.5
                        rounded-full
                        border
                        ${getCongestionBadgeClass()}
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Mobile TV */}

            <button
              onClick={() => handleNavigation('kiosk')}
              className={`
                flex items-center gap-2
                px-3 py-3
                rounded-xl
                text-xs font-semibold
                transition-all
                ${
                  activeTab === 'kiosk'
                    ? 'bg-sky-600 text-white'
                    : isLightMode
                      ? 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                      : 'bg-slate-900 text-sky-300 hover:bg-slate-800'
                }
              `}
            >
              <Tv className="w-4 h-4 shrink-0" />
              <span>TV Waiting Board</span>
            </button>
          </div>

          {/* Mobile Controls */}

          <div
            className={`
              flex items-center justify-between
              pt-3
              border-t
              ${
                isLightMode
                  ? 'border-slate-100'
                  : 'border-slate-800'
              }
            `}
          >
            <div className="flex items-center gap-2 flex-wrap">

              {/* Theme */}

              <button
                onClick={toggleTheme}
                className={`
                  flex items-center gap-2
                  px-3 py-2
                  rounded-xl
                  text-xs font-semibold
                  border
                  ${
                    isLightMode
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-slate-900 border-slate-700 text-sky-300'
                  }
                `}
              >
                {isLightMode ? (
                  <Moon className="w-3.5 h-3.5" />
                ) : (
                  <Sun className="w-3.5 h-3.5" />
                )}

                <span>
                  {isLightMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>

              {/* Voice */}

              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`
                  flex items-center gap-2
                  px-3 py-2
                  rounded-xl
                  text-xs font-semibold
                  border
                  ${
                    speechEnabled
                      ? isLightMode
                        ? 'bg-sky-50 border-sky-200 text-sky-700'
                        : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                      : isLightMode
                        ? 'bg-slate-100 border-slate-200 text-slate-500'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                  }
                `}
              >
                {speechEnabled ? (
                  <Mic className="w-3.5 h-3.5" />
                ) : (
                  <MicOff className="w-3.5 h-3.5" />
                )}

                <span>
                  Voice {speechEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Reset */}

            <button
              onClick={() => {
                resetToDemoData();
                setMobileMenuOpen(false);
              }}
              className="
                flex items-center gap-1.5
                px-3 py-2
                rounded-xl
                text-xs font-semibold
                text-amber-500
                hover:bg-amber-500/10
                transition-all
              "
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};