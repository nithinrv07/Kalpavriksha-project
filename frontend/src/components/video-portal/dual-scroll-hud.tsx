"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  FileText,
  Play,
  Target,
  X,
} from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { useTheme } from "@/lib/theme";
import type { CurriculumChapter, CurriculumSubject } from "@/lib/curriculum";
import type { LessonManifest } from "@/lib/manifest-schema";

export interface TextbookParagraph {
  id: string;
  sectionTitle: string;
  startSec: number;
  endSec: number;
  page: number;
  text: { en: string; ta: string };
  isKeyPrinciple?: boolean;
}

export interface TextbookReaderProps {
  chapter: CurriculumChapter;
  subject: CurriculumSubject;
  standard: number;
  manifest: LessonManifest;
  currentTime: number;
  onSeekVideo: (seconds: number) => void;
  autoSyncEnabled?: boolean;
}

export function TextbookReader({
  chapter,
  subject,
  standard,
  manifest,
  currentTime,
  onSeekVideo,
  autoSyncEnabled = true,
}: TextbookReaderProps) {
  const { locale } = useLocale();
  const textbookContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeParaId, setActiveParaId] = useState<string | null>(null);

  // Generate synchronized textbook paragraph segments from chapter metadata
  const paragraphs = useMemo<TextbookParagraph[]>(() => {
    const totalDuration = manifest.durationSec || 720;
    const cps = manifest.timeline;

    const items: TextbookParagraph[] = [];

    // Segment 1: Introduction & Chapter Scope
    items.push({
      id: `para-${chapter.id}-intro`,
      sectionTitle: "Section 1.1: Chapter Scope & Fundamentals",
      startSec: 0,
      endSec: cps[0]?.triggerSec || 180,
      page: 1,
      text: {
        en: chapter.summary.en,
        ta: chapter.summary.ta || chapter.summary.en,
      },
    });

    // Checkpoint-anchored textbook excerpts
    cps.forEach((cp, idx) => {
      const nextCp = cps[idx + 1];
      const endSec = nextCp ? nextCp.triggerSec : totalDuration;

      items.push({
        id: `para-${cp.checkpointId}`,
        sectionTitle: cp.subtopicTitle.en,
        startSec: cp.triggerSec,
        endSec,
        page: cp.bookCitation.page,
        text: {
          en: cp.bookCitation.excerpt,
          ta: cp.quiz.explanation.ta || cp.bookCitation.excerpt,
        },
        isKeyPrinciple: true,
      });
    });

    // Practice & Summary Segment
    if (chapter.lessonLines && chapter.lessonLines.length > 0) {
      items.push({
        id: `para-${chapter.id}-summary`,
        sectionTitle: "Key Points & Review",
        startSec: Math.max(0, totalDuration - 120),
        endSec: totalDuration,
        page: (cps[cps.length - 1]?.bookCitation.page || 10) + 1,
        text: {
          en: chapter.lessonLines.join(" "),
          ta: chapter.lessonLines.join(" "),
        },
      });
    }

    return items;
  }, [chapter, manifest]);

  // Determine active paragraph matching video currentTime
  useEffect(() => {
    const current = paragraphs.find(
      (p) => currentTime >= p.startSec && currentTime < p.endSec
    );

    if (current && current.id !== activeParaId) {
      setActiveParaId(current.id);

      // Auto-scroll the textbook pane if user is not actively scrolling
      if (autoSyncEnabled && !isUserScrollingRef.current) {
        const el = document.getElementById(current.id);
        if (el && textbookContainerRef.current) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [currentTime, paragraphs, activeParaId, autoSyncEnabled]);

  // Handle manual scroll detection to prevent fighting user scroll
  const handleTextbookScroll = useCallback(() => {
    isUserScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 4000); // Resume auto-scroll sync after 4s of inactivity
  }, []);

  return (
    <div
      ref={textbookContainerRef}
      onScroll={handleTextbookScroll}
      className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[550px] border-l border-purple-900/40 bg-black/40"
    >
      <div className="flex items-center justify-between border-b border-purple-800/30 pb-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-amber-400" weight="duotone" />
          <h4 className="font-display text-xs sm:text-sm font-bold text-purple-200">
            Official Textbook Reader (Class {standard} {subject.name.en})
          </h4>
        </div>
        <span className="text-[11px] font-mono text-purple-400">
          Click sentence to seek video
        </span>
      </div>

      {/* Paragraph List */}
      <div className="space-y-3.5">
        {paragraphs.map((para) => {
          const isActive = activeParaId === para.id;
          const textContent = locale === "ta" && para.text.ta ? para.text.ta : para.text.en;

          return (
            <div
              key={para.id}
              id={para.id}
              onClick={() => onSeekVideo(para.startSec)}
              className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? "border-amber-400 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)]"
                  : "border-purple-800/30 bg-purple-950/20 hover:border-purple-600/50 hover:bg-purple-900/30"
              }`}
            >
              {/* Active Indicator Strip */}
              {isActive && (
                <div className="absolute -left-1 top-3.5 bottom-3.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
              )}

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-amber-300">
                  {para.sectionTitle}
                </span>
                <div className="flex items-center gap-2 text-[11px] font-mono text-purple-400">
                  <span>p. {para.page}</span>
                  <span>•</span>
                  <span className="group-hover:text-amber-400 transition-colors flex items-center gap-1">
                    <Play size={10} weight="fill" />
                    {Math.floor(para.startSec / 60)}:{(para.startSec % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>

              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isActive ? "text-white font-medium" : "text-purple-200/90"
                }`}
              >
                {textContent}
              </p>

              {para.isKeyPrinciple && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-700/40 text-[10px] font-mono text-purple-300">
                  <Target size={11} weight="bold" className="text-pink-400" />
                  <span>Curriculum Gating Anchor</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
