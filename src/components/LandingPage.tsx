import React from 'react';
import { useQueue } from '../context/QueueContext';
import {
  Sparkles,
  Ticket,
  LayoutDashboard,
  BrainCircuit,
  Clock,
  Zap,
  ShieldCheck,
  Building2,
  Stethoscope,
  GraduationCap,
  Landmark,
  Scissors,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  BellRing,
  Tv,
  Radio,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setActiveTab,
    analytics,
    tokens,
    counters,
    fastAddDemoCustomer,
    callNext,
  } = useQueue();

  const waitingTokens = tokens.filter(
    (t) => t.status === 'waiting'
  );

  const steps = [
    {
      step: '01',
      title: 'Digital Token Generation',
      description:
        'Visitors scan a QR code or pick their required service at the kiosk, receiving an instant digital ticket on their phone.',
      icon: Ticket,
      accent: 'blue',
    },
    {
      step: '02',
      title: 'AI Wait-Time & Queue Tracking',
      description:
        'SmartQueue AI calculates dynamic waiting estimates and alerts visitors as their turn approaches so they never wait in line.',
      icon: BrainCircuit,
      accent: 'sky',
    },
    {
      step: '03',
      title: 'Intelligent Multi-Desk Dispatch',
      description:
        'Staff call the next attendee with a single click. High-visibility TV boards and audio chimes guide visitors to the exact counter.',
      icon: LayoutDashboard,
      accent: 'indigo',
    },
  ];

  const industries = [
    {
      name: 'College & Universities',
      subtitle: 'Admissions, Fee Desks & Registrars',
      icon: GraduationCap,
      stat: '68% faster enrollment clearance',
      accent: 'blue',
    },
    {
      name: 'Hospitals & Clinics',
      subtitle: 'Triage, Diagnostics & Pharmacies',
      icon: Stethoscope,
      stat: 'Reduced physical waiting room crowding',
      accent: 'emerald',
    },
    {
      name: 'Banks & Financial Hubs',
      subtitle: 'Teller Desks, Loans & VIP Accounts',
      icon: Landmark,
      stat: 'Automated VIP priority routing',
      accent: 'amber',
    },
    {
      name: 'Government Citizen Desks',
      subtitle: 'Licensing, Passports & Civil Registry',
      icon: Building2,
      stat: 'Eliminated hallway bottleneck lines',
      accent: 'sky',
    },
    {
      name: 'Salons & Retail Centers',
      subtitle: 'Appointments & Express Checkouts',
      icon: Scissors,
      stat: 'Increased walk-in conversion by 42%',
      accent: 'rose',
    },
  ];

  const accentStyles: Record<
    string,
    {
      iconLight: string;
      iconDark: string;
      bgLight: string;
      bgDark: string;
      borderLight: string;
      borderDark: string;
    }
  > = {
    blue: {
      iconLight: 'text-blue-700',
      iconDark: 'text-blue-300',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-500/10',
      borderLight: 'border-blue-200',
      borderDark: 'border-blue-500/20',
    },
    sky: {
      iconLight: 'text-sky-700',
      iconDark: 'text-sky-300',
      bgLight: 'bg-sky-50',
      bgDark: 'bg-sky-500/10',
      borderLight: 'border-sky-200',
      borderDark: 'border-sky-500/20',
    },
    indigo: {
      iconLight: 'text-indigo-700',
      iconDark: 'text-indigo-300',
      bgLight: 'bg-indigo-50',
      bgDark: 'bg-indigo-500/10',
      borderLight: 'border-indigo-200',
      borderDark: 'border-indigo-500/20',
    },
    emerald: {
      iconLight: 'text-emerald-700',
      iconDark: 'text-emerald-300',
      bgLight: 'bg-emerald-50',
      bgDark: 'bg-emerald-500/10',
      borderLight: 'border-emerald-200',
      borderDark: 'border-emerald-500/20',
    },
    amber: {
      iconLight: 'text-amber-700',
      iconDark: 'text-amber-300',
      bgLight: 'bg-amber-50',
      bgDark: 'bg-amber-500/10',
      borderLight: 'border-amber-200',
      borderDark: 'border-amber-500/20',
    },
    rose: {
      iconLight: 'text-rose-700',
      iconDark: 'text-rose-300',
      bgLight: 'bg-rose-50',
      bgDark: 'bg-rose-500/10',
      borderLight: 'border-rose-200',
      borderDark: 'border-rose-500/20',
    },
  };

  return (
    <div className="space-y-16 pb-16">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="
          relative overflow-hidden
          pt-10 pb-14
          sm:pt-16 sm:pb-20
          border-b
          border-[var(--border)]
          bg-[var(--background)]
          transition-colors duration-300
        "
      >
        {/* Soft background decoration */}

        <div
          className="
            absolute
            top-[-160px]
            left-1/2
            -translate-x-1/2
            w-[700px]
            h-[420px]
            rounded-full
            bg-blue-200/30
            dark:bg-blue-500/10
            blur-[110px]
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            right-[-120px]
            top-24
            w-[300px]
            h-[300px]
            rounded-full
            bg-sky-200/30
            dark:bg-sky-500/10
            blur-[100px]
            pointer-events-none
          "
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          <div className="text-center max-w-3xl mx-auto space-y-7">

            {/* Tagline */}

            <div
              className="
                inline-flex items-center gap-2
                px-4 py-2
                rounded-full
                bg-blue-50
                dark:bg-blue-500/10
                border border-blue-200
                dark:border-blue-500/25
                text-blue-700
                dark:text-blue-300
                text-xs font-semibold
                shadow-sm
              "
            >
              <Sparkles className="w-3.5 h-3.5" />

              <span>
                Next-Gen Smart Token & Queue Management
              </span>

              <span
                className="
                  w-1.5 h-1.5
                  rounded-full
                  bg-emerald-500
                  animate-pulse
                "
              />

              <span
                className="
                  text-emerald-600
                  dark:text-emerald-400
                  font-mono
                  text-[11px]
                "
              >
                System Live
              </span>
            </div>

            {/* Heading */}

            <h1
              className="
                text-4xl
                sm:text-5xl
                lg:text-6xl
                font-extrabold
                tracking-tight
                leading-[1.08]
                text-[var(--foreground)]
              "
            >
              Smarter queues.
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-blue-700
                  via-sky-600
                  to-indigo-600
                  dark:from-blue-300
                  dark:via-sky-300
                  dark:to-indigo-300
                  bg-clip-text
                  text-transparent
                "
              >
                Less waiting.
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                text-base
                sm:text-lg
                text-[var(--muted)]
                max-w-2xl
                mx-auto
                leading-relaxed
              "
            >
              Empower visitors to join lines digitally, receive
              real-time wait predictions, and track tokens from
              their smartphones. Give staff seamless multi-counter
              dispatching and predictive AI analytics.
            </p>

            {/* CTA buttons */}

            <div
              className="
                flex flex-wrap
                items-center
                justify-center
                gap-3
                pt-1
              "
            >
              <button
                id="hero-join-queue-btn"
                onClick={() => setActiveTab('join')}
                className="
                  flex items-center gap-2.5
                  px-6 py-3.5
                  rounded-xl
                  bg-[#17324d]
                  hover:bg-[#234d70]
                  dark:bg-blue-500
                  dark:hover:bg-blue-400
                  text-white
                  font-bold
                  text-sm
                  shadow-lg
                  shadow-blue-900/10
                  dark:shadow-blue-500/20
                  transition-all
                  hover:-translate-y-0.5
                  active:translate-y-0
                "
              >
                <Ticket className="w-4 h-4" />
                <span>Join Queue as Customer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-admin-dash-btn"
                onClick={() => setActiveTab('admin')}
                className="
                  flex items-center gap-2
                  px-5 py-3.5
                  rounded-xl
                  bg-white
                  dark:bg-slate-900
                  hover:bg-blue-50
                  dark:hover:bg-slate-800
                  border
                  border-[var(--border)]
                  text-[var(--foreground)]
                  font-semibold
                  text-sm
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                "
              >
                <LayoutDashboard
                  className="
                    w-4 h-4
                    text-blue-700
                    dark:text-blue-300
                  "
                />
                <span>Admin Staff Desk</span>
              </button>

              <button
                id="hero-live-tv-btn"
                onClick={() => setActiveTab('kiosk')}
                className="
                  flex items-center gap-2
                  px-4 py-3.5
                  rounded-xl
                  bg-sky-50
                  dark:bg-sky-500/10
                  hover:bg-sky-100
                  dark:hover:bg-sky-500/15
                  border
                  border-sky-200
                  dark:border-sky-500/25
                  text-sky-700
                  dark:text-sky-300
                  font-semibold
                  text-sm
                  transition-all
                  hover:-translate-y-0.5
                "
              >
                <Tv className="w-4 h-4" />
                <span>TV Display Screen</span>
              </button>
            </div>

            {/* Metrics */}

            <div
              className="
                pt-6
                grid
                grid-cols-2
                sm:grid-cols-4
                gap-3
                max-w-2xl
                mx-auto
              "
            >
              {[
                {
                  value: analytics.totalWaiting,
                  label: 'In Line',
                  accent: 'text-[var(--foreground)]',
                },
                {
                  value: `${analytics.avgWaitTimeMinutes}m`,
                  label: 'Avg Wait Time',
                  accent:
                    'text-blue-700 dark:text-blue-300',
                },
                {
                  value: analytics.totalServedToday,
                  label: 'Served Today',
                  accent:
                    'text-emerald-700 dark:text-emerald-300',
                },
                {
                  value: counters.filter(
                    (c) => c.status !== 'closed'
                  ).length,
                  label: 'Open Desks',
                  accent:
                    'text-indigo-700 dark:text-indigo-300',
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="
                    p-4
                    rounded-2xl
                    bg-white
                    dark:bg-slate-900/70
                    border
                    border-[var(--border)]
                    text-center
                    shadow-sm
                    hover:-translate-y-0.5
                    transition-all
                  "
                >
                  <p
                    className={`
                      text-xl
                      font-bold
                      font-mono
                      ${metric.accent}
                    `}
                  >
                    {metric.value}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-[var(--muted)]
                      uppercase
                      tracking-wider
                      font-semibold
                    "
                  >
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LIVE QUEUE SNAPSHOT
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          className="
            p-6 sm:p-8
            rounded-3xl
            bg-white
            dark:bg-slate-900/80
            border
            border-[var(--border)]
            shadow-xl
            shadow-blue-900/5
            space-y-6
          "
        >

          <div
            className="
              flex flex-col
              sm:flex-row
              sm:items-center
              justify-between
              gap-4
              pb-5
              border-b
              border-[var(--border)]
            "
          >
            <div>

              <div className="flex items-center gap-2">

                <span className="relative flex h-3 w-3">
                  <span
                    className="
                      animate-ping
                      absolute
                      inline-flex
                      h-full w-full
                      rounded-full
                      bg-emerald-400
                      opacity-60
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      rounded-full
                      h-3 w-3
                      bg-emerald-500
                    "
                  />
                </span>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-[var(--foreground)]
                    tracking-tight
                  "
                >
                  Live Station & Queue Status
                </h2>
              </div>

              <p
                className="
                  text-xs
                  text-[var(--muted)]
                  mt-1
                "
              >
                Real-time state synchronized with desk
                operators & kiosks
              </p>
            </div>

            <div
              className="
                flex flex-wrap
                items-center
                gap-2
              "
            >
              <button
                onClick={() => fastAddDemoCustomer(false)}
                className="
                  px-3 py-1.5
                  rounded-lg
                  bg-blue-50
                  dark:bg-blue-500/10
                  hover:bg-blue-100
                  dark:hover:bg-blue-500/15
                  border
                  border-blue-200
                  dark:border-blue-500/25
                  text-blue-700
                  dark:text-blue-300
                  text-xs
                  font-semibold
                  transition-all
                "
              >
                + Add Sample Visitor
              </button>

              <button
                onClick={() => callNext()}
                className="
                  px-3 py-1.5
                  rounded-lg
                  bg-emerald-50
                  dark:bg-emerald-500/10
                  hover:bg-emerald-100
                  dark:hover:bg-emerald-500/15
                  border
                  border-emerald-200
                  dark:border-emerald-500/25
                  text-emerald-700
                  dark:text-emerald-300
                  text-xs
                  font-semibold
                  transition-all
                "
              >
                Call Next Token
              </button>

              <button
                onClick={() => setActiveTab('live')}
                className="
                  px-3 py-1.5
                  rounded-lg
                  bg-[var(--card-soft)]
                  dark:bg-slate-800
                  hover:bg-blue-50
                  dark:hover:bg-slate-700
                  border
                  border-[var(--border)]
                  text-[var(--foreground)]
                  text-xs
                  font-semibold
                  transition-all
                  flex items-center gap-1
                "
              >
                View Full Screen
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Counter cards */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
            "
          >
            {counters.map((counter) => {
              const servingToken = tokens.find(
                (t) =>
                  t.id === counter.currentServingTokenId
              );

              return (
                <div
                  key={counter.id}
                  className={`
                    p-5
                    rounded-2xl
                    border
                    transition-all
                    ${
                      counter.status === 'closed'
                        ? `
                          bg-[var(--card-soft)]
                          dark:bg-slate-950/50
                          border-[var(--border)]
                          opacity-60
                        `
                        : counter.currentServingTokenId
                          ? `
                            bg-blue-50/80
                            dark:bg-blue-500/10
                            border-blue-200
                            dark:border-blue-500/30
                            shadow-sm
                          `
                          : `
                            bg-[var(--card-soft)]
                            dark:bg-slate-800/60
                            border-[var(--border)]
                          `
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      text-xs
                    "
                  >
                    <span
                      className="
                        font-semibold
                        text-[var(--foreground)]
                      "
                    >
                      {counter.name}
                    </span>

                    <span
                      className={`
                        px-2 py-0.5
                        rounded-full
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        border
                        ${
                          counter.status === 'closed'
                            ? `
                              bg-slate-100
                              dark:bg-slate-800
                              text-slate-500
                              dark:text-slate-400
                              border-transparent
                            `
                            : counter.currentServingTokenId
                              ? `
                                bg-emerald-50
                                dark:bg-emerald-500/10
                                text-emerald-700
                                dark:text-emerald-300
                                border-emerald-200
                                dark:border-emerald-500/20
                              `
                              : `
                                bg-sky-50
                                dark:bg-sky-500/10
                                text-sky-700
                                dark:text-sky-300
                                border-sky-200
                                dark:border-sky-500/20
                              `
                        }
                      `}
                    >
                      {counter.status === 'closed'
                        ? 'Closed'
                        : counter.currentServingTokenId
                          ? 'Serving'
                          : 'Ready'}
                    </span>
                  </div>

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[10px]
                          uppercase
                          font-bold
                          text-[var(--muted)]
                        "
                      >
                        Current Token
                      </p>

                      <p
                        className="
                          text-2xl
                          font-black
                          font-mono
                          tracking-tight
                          text-[var(--foreground)]
                          mt-1
                        "
                      >
                        {servingToken
                          ? servingToken.tokenNumber
                          : '— None —'}
                      </p>
                    </div>

                    {servingToken && (
                      <div className="text-right">
                        <p
                          className="
                            text-xs
                            font-semibold
                            text-blue-700
                            dark:text-blue-300
                          "
                        >
                          {servingToken.customerName}
                        </p>

                        <p
                          className="
                            text-[11px]
                            text-[var(--muted)]
                          "
                        >
                          {servingToken.serviceName}
                        </p>
                      </div>
                    )}
                  </div>

                  <div
                    className="
                      mt-4
                      pt-3
                      border-t
                      border-[var(--border)]
                      flex
                      items-center
                      justify-between
                      text-[11px]
                      text-[var(--muted)]
                    "
                  >
                    <span>
                      Attendant: {counter.staffName}
                    </span>

                    {servingToken?.priority ===
                      'priority' && (
                      <span
                        className="
                          text-amber-600
                          dark:text-amber-300
                          font-bold
                          flex
                          items-center
                          gap-1
                        "
                      >
                        <Zap className="w-3 h-3" />
                        Priority
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Queue strip */}

          <div
            className="
              p-4
              rounded-2xl
              bg-[var(--card-soft)]
              dark:bg-slate-950/60
              border
              border-[var(--border)]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                text-xs
                mb-3
                gap-4
              "
            >
              <span
                className="
                  font-semibold
                  text-[var(--foreground)]
                  flex
                  items-center
                  gap-2
                "
              >
                <Clock
                  className="
                    w-4 h-4
                    text-blue-600
                    dark:text-blue-300
                  "
                />

                <span>
                  Next in Queue ({waitingTokens.length}{' '}
                  Waiting)
                </span>
              </span>

              <span
                className="
                  text-xs
                  text-[var(--muted)]
                "
              >
                Est. Clear Time: ~
                {analytics.estimatedTimeToClearMinutes}{' '}
                mins
              </span>
            </div>

            {waitingTokens.length === 0 ? (
              <p
                className="
                  text-xs
                  text-[var(--muted)]
                  italic
                  py-2
                  text-center
                "
              >
                Queue is currently clear! Join to get
                token #1.
              </p>
            ) : (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  overflow-x-auto
                  pb-1
                "
              >
                {waitingTokens
                  .slice(0, 6)
                  .map((token, index) => (
                    <div
                      key={token.id}
                      className={`
                        shrink-0
                        flex
                        items-center
                        gap-2
                        px-3 py-2
                        rounded-xl
                        border
                        text-xs
                        ${
                          token.priority === 'priority'
                            ? `
                              bg-amber-50
                              dark:bg-amber-500/10
                              border-amber-200
                              dark:border-amber-500/25
                              text-amber-700
                              dark:text-amber-200
                            `
                            : `
                              bg-white
                              dark:bg-slate-800
                              border-[var(--border)]
                              text-[var(--foreground)]
                            `
                        }
                      `}
                    >
                      <span
                        className="
                          w-5 h-5
                          rounded-full
                          bg-blue-50
                          dark:bg-slate-700
                          flex
                          items-center
                          justify-center
                          font-bold
                          text-[10px]
                          text-blue-700
                          dark:text-slate-300
                        "
                      >
                        #{index + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-1">
                          <span
                            className="
                              font-boldfont-mono
                            "
                          >
                            {token.tokenNumber}
                          </span>

                          {token.priority ===
                            'priority' && (
                            <span
                              className="
                                text-[9px]
                                px-1
                                bg-amber-100
                                dark:bg-amber-500/20
                                text-amber-700
                                dark:text-amber-300
                                rounded
                                font-bold
                              "
                            >
                              VIP
                            </span>
                          )}
                        </div>

                        <p
                          className="
                            text-[10px]
                            text-[var(--muted)]
                            truncate
                            max-w-[90px]
                          "
                        >
                          {token.customerName}
                        </p>
                      </div>

                      <span
                        className="
                          text-[10px]
                          text-blue-700
                          dark:text-blue-300
                          font-mono
                          pl-1
                        "
                      >
                        ~{token.estimatedWaitMinutes}m
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          className="
            text-center
            max-w-2xl
            mx-auto
            space-y-3
            mb-12
          "
        >
          <span
            className="
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-blue-700
              dark:text-blue-300
              bg-blue-50
              dark:bg-blue-500/10
              px-3 py-1
              rounded-full
              border
              border-blue-200
              dark:border-blue-500/20
            "
          >
            Frictionless Flow
          </span>

          <h2
            className="
              text-3xl
              font-extrabold
              text-[var(--foreground)]
              tracking-tight
            "
          >
            How SmartQueue AI Works
          </h2>

          <p
            className="
              text-sm
              text-[var(--muted)]
              leading-relaxed
            "
          >
            Eliminate chaotic physical queues with a
            three-step intelligent digital pipeline designed
            for rapid turnaround.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
          "
        >
          {steps.map((step) => {
            const Icon = step.icon;
            const style = accentStyles[step.accent];

            return (
              <div
                key={step.step}
                className="
                  relative
                  p-6 sm:p-7
                  rounded-2xl
                  bg-white
                  dark:bg-slate-900/80
                  border
                  border-[var(--border)]
                  hover:-translate-y-1
                  hover:shadow-xl
                  hover:shadow-blue-900/5
                  transition-all
                  group
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-5
                  "
                >
                  <div
                    className={`
                      w-12 h-12
                      rounded-xl
                      border
                      flex
                      items-center
                      justify-center
                      ${style.bgLight}
                      dark:${style.bgDark}
                      ${style.borderLight}
                      dark:${style.borderDark}
                    `}
                  >
                    <Icon
                      className={`
                        w-5 h-5
                        ${style.iconLight}
                        dark:${style.iconDark}
                        group-hover:scale-110
                        transition-transform
                      `}
                    />
                  </div>

                  <span
                    className="
                      text-2xl
                      font-black
                      font-mono
                      text-blue-300
                      dark:text-slate-700
                    "
                  >
                    {step.step}
                  </span>
                </div>

                <h3
                  className="
                    text-base
                    font-bold
                    text-[var(--foreground)]
                    mb-2
                  "
                >
                  {step.title}
                </h3>

                <p
                  className="
                    text-xs
                    text-[var(--muted)]
                    leading-relaxed
                  "
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          INDUSTRIES
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          className="
            p-8
            rounded-3xl
            bg-white
            dark:bg-slate-900/80
            border
            border-[var(--border)]
            space-y-8
            shadow-lg
            shadow-blue-900/5
          "
        >
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-end
              justify-between
              gap-4
            "
          >
            <div>
              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-sky-700
                  dark:text-sky-300
                  bg-sky-50
                  dark:bg-sky-500/10
                  px-3 py-1
                  rounded-full
                  border
                  border-sky-200
                  dark:border-sky-500/20
                "
              >
                Built For Every High-Traffic Venue
              </span>

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  text-[var(--foreground)]
                  tracking-tight
                  mt-3
                "
              >
                Tailored for Real-World Workflows
              </h2>
            </div>

            <p
              className="
                text-xs
                text-[var(--muted)]
                max-w-md
              "
            >
              From high-security financial counters to
              university fee halls and hospital triage
              centers, SmartQueue adapts to any service
              hierarchy.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-4
            "
          >
            {industries.map((industry) => {
              const Icon = industry.icon;
              const style = accentStyles[industry.accent];

              return (
                <div
                  key={industry.name}
                  className="
                    p-4
                    rounded-2xl
                    bg-[var(--card-soft)]
                    dark:bg-slate-800/60
                    border
                    border-[var(--border)]
                    hover:-translate-y-0.5
                    hover:shadow-md
                    transition-all
                    flex
                    items-start
                    gap-3.5
                  "
                >
                  <div
                    className={`
                      p-2.5
                      rounded-xl
                      border
                      shrink-0
                      ${style.bgLight}
                      dark:${style.bgDark}
                      ${style.borderLight}
                      dark:${style.borderDark}
                    `}
                  >
                    <Icon
                      className={`
                        w-5 h-5
                        ${style.iconLight}
                        dark:${style.iconDark}
                      `}
                    />
                  </div>

                  <div className="space-y-1">
                    <h3
                      className="
                        text-sm
                        font-bold
                        text-[var(--foreground)]
                      "
                    >
                      {industry.name}
                    </h3>

                    <p
                      className="
                        text-[11px]
                        text-[var(--muted)]
                      "
                    >
                      {industry.subtitle}
                    </p>

                    <p
                      className="
                        text-[10px]
                        text-emerald-700
                        dark:text-emerald-300
                        font-semibold
                        flex
                        items-center
                        gap-1
                        pt-1
                      "
                    >
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>{industry.stat}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURE HIGHLIGHTS
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          "
        >
          {[
            {
              icon: BrainCircuit,
              title: 'Dynamic AI Predictions',
              text: 'Considers historical desk velocity, priority loads, and active counter capacity to estimate exact wait times.',
              iconClass:
                'text-blue-700 dark:text-blue-300',
            },
            {
              icon: Zap,
              title: 'Priority / VIP Lane',
              text: 'Dedicated fast-track queues for senior citizens, medical emergencies, faculty, and VIP clients.',
              iconClass:
                'text-amber-700 dark:text-amber-300',
            },
            {
              icon: BellRing,
              title: 'Audio & Voice Synthesis',
              text: 'Built-in audio synthesizer and Web Speech API announcement calls out tokens directly to public speakers.',
              iconClass:
                'text-sky-700 dark:text-sky-300',
            },
            {
              icon: ShieldCheck,
              title: 'Zero Backend Required',
              text: 'Persisted instantly with local storage and tab synchronization, ensuring 100% uptime with zero setup.',
              iconClass:
                'text-emerald-700 dark:text-emerald-300',
            },
          ].map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  p-5
                  rounded-2xl
                  bg-white
                  dark:bg-slate-900/80
                  border
                  border-[var(--border)]
                  space-y-3
                  hover:-translate-y-1
                  hover:shadow-lg
                  hover:shadow-blue-900/5
                  transition-all
                "
              >
                <Icon
                  className={`
                    w-6 h-6
                    ${feature.iconClass}
                  `}
                />

                <h4
                  className="
                    text-sm
                    font-bold
                    text-[var(--foreground)]
                  "
                >
                  {feature.title}
                </h4>

                <p
                  className="
                    text-xs
                    text-[var(--muted)]
                    leading-relaxed
                  "
                >
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          className="
            relative
            overflow-hidden
            p-8
            sm:p-10
            rounded-3xl
            bg-gradient-to-br
            from-[#17324d]
            via-[#244d6d]
            to-[#397ca8]
            dark:from-[#0d2135]
            dark:via-[#123653]
            dark:to-[#173b55]
            border
            border-blue-300/20
            text-center
            space-y-5
            shadow-2xl
          "
        >
          <div
            className="
              absolute
              -right-16
              -bottom-20
              w-72
              h-72
              rounded-full
              bg-sky-300/15
              blur-3xl
              pointer-events-none
            "
          />

          <div
            className="
              relative
              inline-flex
              items-center
              justify-center
              w-12
              h-12
              rounded-2xl
              bg-white/10
              border
              border-white/15
            "
          >
            <Radio className="w-6 h-6 text-sky-200" />
          </div>

          <h2
            className="
              relative
              text-2xl
              sm:text-3xl
              font-extrabold
              text-white
              tracking-tight
            "
          >
            Ready to experience frictionless queue
            management?
          </h2>

          <p
            className="
              relative
              text-sm
              text-blue-100/80
              max-w-xl
              mx-auto
            "
          >
            Test the live customer token experience or
            jump right into the multi-desk staff controller.
          </p>

          <div
            className="
              relative
              flex
              flex-wrap
              items-center
              justify-center
              gap-3
              pt-2
            "
          >
            <button
              onClick={() => setActiveTab('join')}
              className="
                px-6 py-3
                rounded-xl
                bg-white
                text-[#17324d]
                hover:bg-blue-50
                font-bold
                text-sm
                shadow-xl
                transition-all
                hover:-translate-y-0.5
              "
            >
              Get Your Digital Token
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className="
                px-6 py-3
                rounded-xl
                bg-white/10
                hover:bg-white/15
                text-white
                font-semibold
                text-sm
                border
                border-white/20
                transition-all
                hover:-translate-y-0.5
              "
            >
              Open Staff Admin Desk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};