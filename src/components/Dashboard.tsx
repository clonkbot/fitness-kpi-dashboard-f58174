import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";

type Profile = {
  _id: string;
  name: string;
  role: "ceo" | "manager" | "coach";
};

export function Dashboard({ profile }: { profile: Profile }) {
  const metrics = useQuery(api.kpis.getDashboardMetrics);
  const seedData = useMutation(api.kpis.seedDemoData);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedData();
    } catch (err) {
      console.error("Failed to seed data:", err);
    } finally {
      setIsSeeding(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => `${value}%`;

  if (metrics === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Metriken laden...</p>
        </div>
      </div>
    );
  }

  const isEmpty = metrics.collectedCash === 0 && metrics.closedRevenue === 0 && metrics.activeClients === 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Guten Tag, {profile.name.split(" ")[0]}
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base mt-1">
            Hier ist Ihr täglicher Überblick
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg transition-all disabled:opacity-50"
          >
            {isSeeding ? "Laden..." : "Demo-Daten"}
          </button>
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-400">Echtzeit</span>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Noch keine Daten</h3>
          <p className="text-zinc-500 text-sm max-w-md mx-auto mb-6">
            Klicken Sie auf "Demo-Daten", um Beispieldaten zu laden und das Dashboard zu erkunden.
          </p>
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            {isSeeding ? "Laden..." : "Demo-Daten laden"}
          </button>
        </div>
      ) : (
        <>
          {/* Revenue Metrics */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Umsatz
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <MetricCard
                label="Eingesammeltes Geld"
                value={formatCurrency(metrics.collectedCash)}
                trend="+12%"
                trendUp={true}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                color="emerald"
              />
              <MetricCard
                label="Abgeschlossener Umsatz"
                value={formatCurrency(metrics.closedRevenue)}
                trend="+8%"
                trendUp={true}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="blue"
              />
              <MetricCard
                label="Kommende Raten"
                value={formatCurrency(metrics.upcomingInstallments)}
                subtext="Nächste 30 Tage"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                color="violet"
              />
              <MetricCard
                label="Überfällig"
                value={formatCurrency(metrics.overduePayments)}
                trend="Achtung"
                trendUp={false}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
                color="rose"
              />
            </div>
          </div>

          {/* Sales Metrics */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Vertrieb
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <MetricCard
                label="Neue Leads"
                value={metrics.newLeads.toString()}
                subtext="Letzte 7 Tage"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                }
                color="cyan"
              />
              <MetricCard
                label="Gebuchte Termine"
                value={metrics.bookedAppointments.toString()}
                subtext="Letzte 7 Tage"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                color="amber"
              />
              <MetricCard
                label="Show Rate"
                value={formatPercent(metrics.showRate)}
                trend={metrics.showRate >= 70 ? "Gut" : "Niedrig"}
                trendUp={metrics.showRate >= 70}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
                color="teal"
              />
              <MetricCard
                label="Close Rate"
                value={formatPercent(metrics.closeRate)}
                trend={metrics.closeRate >= 20 ? "Gut" : "Niedrig"}
                trendUp={metrics.closeRate >= 20}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                }
                color="indigo"
              />
              <MetricCard
                label="Aktive Kunden"
                value={metrics.activeClients.toString()}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
                color="emerald"
                highlight
              />
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center justify-center pt-4">
            <p className="text-xs text-zinc-600 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Zuletzt aktualisiert: {new Date(metrics.lastUpdated).toLocaleTimeString("de-DE")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  subtext?: string;
  icon: React.ReactNode;
  color: "emerald" | "blue" | "violet" | "rose" | "cyan" | "amber" | "teal" | "indigo";
  highlight?: boolean;
};

function MetricCard({ label, value, trend, trendUp, subtext, icon, color, highlight }: MetricCardProps) {
  const colorClasses = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: "text-emerald-400",
      glow: "shadow-emerald-500/10",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: "text-blue-400",
      glow: "shadow-blue-500/10",
    },
    violet: {
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      icon: "text-violet-400",
      glow: "shadow-violet-500/10",
    },
    rose: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      icon: "text-rose-400",
      glow: "shadow-rose-500/10",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      icon: "text-cyan-400",
      glow: "shadow-cyan-500/10",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: "text-amber-400",
      glow: "shadow-amber-500/10",
    },
    teal: {
      bg: "bg-teal-500/10",
      border: "border-teal-500/20",
      icon: "text-teal-400",
      glow: "shadow-teal-500/10",
    },
    indigo: {
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      icon: "text-indigo-400",
      glow: "shadow-indigo-500/10",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`relative p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
        highlight
          ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
          : "bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700/50"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <span className={colors.icon}>{icon}</span>
        </div>
        {trend && (
          <span
            className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${
              trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <div>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight mb-1">
          {value}
        </p>
        <p className="text-xs sm:text-sm text-zinc-500 line-clamp-1">{label}</p>
        {subtext && (
          <p className="text-[10px] sm:text-xs text-zinc-600 mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
}
