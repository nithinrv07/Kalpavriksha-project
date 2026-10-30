import Link from "next/link";
import { ArrowLeft, BookOpenText, House } from "@phosphor-icons/react/ssr";
import { BrandMark } from "@/components/brand-mark";
import { ChromeWaves } from "@/components/landing/chrome-waves";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#070312] text-white flex flex-col justify-between overflow-hidden">
      <ChromeWaves />

      {/* Header */}
      <header className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-purple-950/60 p-1.5 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <BrandMark className="size-full text-purple-400" />
          </div>
          <div>
            <span className="font-display text-base font-bold tracking-tight text-white block">
              Kalpavriksha
            </span>
            <span className="font-mono text-[10px] text-purple-300/60 block">
              கல்விருக்ஷா
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 font-mono text-xs text-purple-200 hover:bg-white/[0.08] transition-colors"
        >
          <House size={14} />
          <span>Home</span>
        </Link>
      </header>

      {/* Main 404 Hero */}
      <main className="relative z-10 mx-auto w-full max-w-md px-6 py-12 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="pointer-events-none absolute -inset-6 rounded-full bg-purple-600/20 blur-2xl" />
          <span className="relative font-display text-[96px] sm:text-[120px] font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-500/50 select-none">
            404
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Page Not Found
        </h1>
        <p className="font-mono text-xs sm:text-sm text-purple-300/70 max-w-sm mb-8 leading-relaxed">
          The requested page or learning resource doesn&apos;t exist or has moved to another branch.
        </p>

        {/* Quick Action Navigation */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            href="/m/learn"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-3 font-display text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <BookOpenText size={16} weight="bold" />
            <span>Digital Learning</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-5 py-3 font-display text-xs font-bold text-purple-200 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center font-mono text-[11px] text-purple-300/40">
        Kalpavriksha Learning Platform
      </footer>
    </div>
  );
}
