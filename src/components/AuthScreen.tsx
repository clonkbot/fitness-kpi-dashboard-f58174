import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Ungültige Anmeldedaten" : "Registrierung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/20 mb-4 sm:mb-6">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">KPI Dashboard</h1>
            <p className="text-zinc-500 text-sm sm:text-base">High-Ticket Fitness Coaching</p>
          </div>

          {/* Auth Form */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-6">
              {flow === "signIn" ? "Willkommen zurück" : "Konto erstellen"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                  E-Mail Adresse
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-base"
                  placeholder="name@unternehmen.de"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
                  Passwort
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete={flow === "signIn" ? "current-password" : "new-password"}
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-base"
                  placeholder="••••••••"
                />
              </div>

              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Laden...
                  </span>
                ) : flow === "signIn" ? "Anmelden" : "Registrieren"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-800/50">
              <p className="text-center text-sm text-zinc-500">
                {flow === "signIn" ? "Noch kein Konto?" : "Bereits registriert?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setFlow(flow === "signIn" ? "signUp" : "signIn");
                    setError(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  {flow === "signIn" ? "Jetzt registrieren" : "Anmelden"}
                </button>
              </p>
            </div>
          </div>

          {/* Guest access */}
          <div className="mt-6 text-center">
            <button
              onClick={() => signIn("anonymous")}
              className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors underline underline-offset-4"
            >
              Als Gast fortfahren (Demo)
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center relative z-10">
        <p className="text-xs text-zinc-600">
          Requested by <a href="https://twitter.com/michaeloneth" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-400 transition-colors">@michaeloneth</a> · Built by <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-400 transition-colors">@clonkbot</a>
        </p>
      </footer>
    </div>
  );
}
