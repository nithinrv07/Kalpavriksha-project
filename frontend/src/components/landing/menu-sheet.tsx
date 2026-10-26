"use client";

import { ArrowUpRight, MoonStars, ProjectorScreen, X } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";
import { setComfort, useComfort } from "@/lib/comfort";
import { LOCALES, LOCALE_LABEL } from "@/lib/i18n";
import { accentOf } from "@/modules/accents";
import { MODULES } from "@/modules/registry";

/** One on/off row for the two comfort switches. */
function ComfortRow({
  checked,
  label,
  hint,
  icon,
  onChange,
}: {
  checked: boolean;
  label: string;
  hint: string;
  icon: ReactNode;
  onChange: (on: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-2xl border border-transparent p-3 text-left transition-colors duration-200 hover:border-line hover:bg-white/[0.04]"
    >
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-200 ${
          checked ? "bg-violet-deep/60 text-violet-ink" : "bg-white/[0.05] text-muted"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] text-text">{label}</span>
        <span className="block text-[12px] text-muted">{hint}</span>
      </span>
      <span
        aria-hidden
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-violet" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

/** Glass side sheet built on native <dialog>: focus trap, Esc and inert page for free. */
export function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { locale, setLocale, t } = useLocale();
  const comfort = useComfort();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={t.menu}
      className="fixed inset-y-3 left-3 m-0 h-auto max-h-none w-[min(420px,calc(100%-1.5rem))] rounded-3xl border border-line-strong bg-surface/85 p-0 text-text shadow-[0_30px_80px_-10px_rgb(0_0_0/0.8)] backdrop-blur-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-[fade-up_0.45s_var(--ease-out)_both]"
    >
      <div className="flex h-full flex-col overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5 font-display text-lg tracking-tight">
            <BrandMark className="size-6 text-violet" />
            Kalpavriksha
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="grid size-11 place-items-center rounded-xl border border-line bg-white/[0.04] transition-colors duration-200 hover:bg-white/[0.1]"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1.5">
          {MODULES.map((m) => {
            const Icon = m.icon;
            const accent = accentOf(m.accent);
            return (
              <Link
                key={m.id}
                href={`/m/${m.slug}`}
                onClick={onClose}
                className="group flex items-center gap-4 rounded-2xl border border-transparent p-3 transition-colors duration-200 hover:border-line hover:bg-white/[0.04]"
              >
                <span className={`grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl ${accent.chip}`}>
                  {m.iconImage ? (
                    <Image
                      src={m.iconImage}
                      alt={m.title[locale]}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon size={20} weight="duotone" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block font-mono text-[11px] ${accent.text}`}>{m.index}</span>
                  <span className="block truncate text-[16px]">{m.title[locale]}</span>
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
                />
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-line pt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{t.comfort}</p>
          <div className="mt-2 flex flex-col gap-0.5">
            <ComfortRow
              checked={comfort.calm}
              label={t.calm}
              hint={t.calmHint}
              icon={<MoonStars size={20} weight="duotone" />}
              onChange={(on) => setComfort("calm", on)}
            />
            <ComfortRow
              checked={comfort.projector}
              label={t.projector}
              hint={t.projectorHint}
              icon={<ProjectorScreen size={20} weight="duotone" />}
              onChange={(on) => setComfort("projector", on)}
            />
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{t.language}</p>
          <div role="radiogroup" aria-label={t.language} className="mt-3 grid grid-cols-3 gap-2">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={locale === l}
                onClick={() => setLocale(l)}
                className="h-11 rounded-xl border border-line text-sm transition-colors duration-200 hover:bg-white/[0.06] aria-checked:border-violet/50 aria-checked:bg-violet-deep/50 aria-checked:text-violet-ink"
              >
                {LOCALE_LABEL[l].native}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-8">
          <Link
            href="/sign-in"
            onClick={onClose}
            className="grid h-12 place-items-center rounded-xl border border-violet/25 bg-violet-deep font-mono text-sm text-violet-ink transition-colors duration-200 hover:bg-[#4c1d95]"
          >
            {t.signIn}
          </Link>
          <p className="text-xs text-muted">{t.trust}</p>
        </div>
      </div>
    </dialog>
  );
}
