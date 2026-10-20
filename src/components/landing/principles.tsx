"use client";

import { ClipboardText, CurrencyInr, Devices, Translate } from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";

const ICONS = [Translate, Devices, CurrencyInr, ClipboardText] as const;

/** Four product principles as a divided strip (spacing and rules, not cards). */
export function Principles() {
  const { t } = useLocale();
  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 sm:px-6">
      <ul className="grid gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {t.principles.map((p, i) => {
          const Icon = ICONS[i] ?? Translate;
          return (
            <li key={i} className="bg-bg/85 py-8 sm:px-6">
              <div data-reveal="up" className="flex gap-4">
                <Icon size={22} weight="duotone" className="mt-0.5 shrink-0 text-violet" aria-hidden />
                <div>
                  <p className="text-[15px] text-text">{p.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{p.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
