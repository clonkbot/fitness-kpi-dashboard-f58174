import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function OnboardingScreen() {
  const createProfile = useMutation(api.profiles.create);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"ceo" | "manager" | "coach">("ceo");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await createProfile({ name: name.trim(), role });
    } catch (err) {
      console.error("Failed to create profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: "ceo" as const, label: "CEO / Inhaber", icon: "👑", description: "Vollzugriff auf alle Metriken" },
    { value: "manager" as const, label: "Manager", icon: "📊", description: "Team-Übersicht und KPIs" },
    { value: "coach" as const, label: "Coach", icon: "💪", description: "Persönliche Metriken" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/20 mb-4 sm:mb-6">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Profil einrichten</h1>
          <p className="text-zinc-500 text-sm sm:text-base">Erzählen Sie uns mehr über sich</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">
                Ihr Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-base"
                placeholder="Max Mustermann"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-3">
                Ihre Rolle
              </label>
              <div className="space-y-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                      role === r.value
                        ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30"
                        : "bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl">{r.icon}</span>
                      <div>
                        <p className={`font-medium text-sm sm:text-base ${role === r.value ? "text-emerald-400" : "text-white"}`}>
                          {r.label}
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-500">{r.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Speichern...
              </span>
            ) : "Profil erstellen"}
          </button>
        </form>
      </div>
    </div>
  );
}
