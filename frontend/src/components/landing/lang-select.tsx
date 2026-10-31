"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Globe, CaretDown, Check } from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { LOCALES, LOCALE_LABEL, isLocale } from "@/lib/i18n";
import { createPortal } from "react-dom";

export function LangSelect({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, closeMenu]);

  const handleSelect = (newLocale: string) => {
    if (isLocale(newLocale)) {
      setLocale(newLocale);
      closeMenu();
    }
  };

  const currentLabel = LOCALE_LABEL[locale];

  const dropdownContent = (
    <div
      ref={menuRef}
      role="listbox"
      aria-label={t.language}
      className="z-50 min-w-[150px] origin-top-right rounded-xl border border-violet/30 bg-white/[0.05] bg-gradient-to-b from-violet-deep/20 to-violet-deep/10 px-1 py-1.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(76,29,149,0.4),0_0_0_1px_rgba(192,132,252,0.15)] animate-in fade-in-0 zoom-in-95 duration-150 ease-out"
      style={{
        boxShadow:
          "0 8px 32px rgba(76, 29, 149, 0.4), 0 0 0 1px rgba(192, 132, 252, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          role="option"
          aria-selected={l === locale}
          onClick={() => handleSelect(l)}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
            l === locale
              ? "bg-violet/20 text-violet-ink"
              : "text-muted hover:bg-white/[0.08] hover:text-text"
          }`}
        >
          <span className="flex-1 text-left">{LOCALE_LABEL[l].native}</span>
          {l === locale && (
            <Check size={16} weight="bold" className="text-violet shrink-0" aria-hidden />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t.language}
        className="group flex h-11 items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 font-mono text-[13px] text-text transition-all duration-200 hover:border-violet/40 hover:bg-violet-deep/30 hover:text-violet-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/50 active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(76,29,149,0.15) 100%)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          minWidth: "100px",
        }}
      >
        <Globe size={16} weight="regular" className="text-violet group-hover:text-violet-bright transition-colors shrink-0" aria-hidden />
        <span className="flex-1 text-left truncate">{currentLabel.short}</span>
        <CaretDown
          size={14}
          weight="bold"
          className={`text-violet/60 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {/* Custom Dropdown Menu - anchored to trigger */}
      {isOpen && triggerRef.current && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden="true"
            onClick={closeMenu}
          />
          {createPortal(
            <div
              className="fixed z-50 mt-1.5"
              style={{
                top: triggerRef.current.getBoundingClientRect().bottom + window.scrollY,
                left: triggerRef.current.getBoundingClientRect().left + window.scrollX,
              }}
            >
              {dropdownContent}
            </div>,
            document.body
          )}
        </>
      )}

      <style jsx>{`
        @keyframes fade-in-0 {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in-95 {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        .animate-in {
          animation: fade-in-0 150ms ease-out, zoom-in-95 150ms ease-out;
        }
      `}</style>
    </div>
  );
}