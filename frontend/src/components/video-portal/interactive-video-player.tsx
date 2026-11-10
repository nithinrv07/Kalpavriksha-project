"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle,
  Play,
  SpeakerHigh,
  SpeakerSlash,
  Target,
  VideoCamera,
  X,
} from "@phosphor-icons/react/ssr";
import { loadYouTubeIframeAPI, YTPlayerInstance } from "./youtube-loader";
import { CheckpointModal } from "./checkpoint-modal";
import { TextbookReader } from "./dual-scroll-hud";
import { useTheme } from "@/lib/theme";
import type { LessonManifest, TimelineCheckpoint } from "@/lib/manifest-schema";
import type { CurriculumChapter, CurriculumSubject } from "@/lib/curriculum";

interface InteractiveVideoPlayerProps {
  manifest: LessonManifest;
  chapter?: CurriculumChapter;
  subject?: CurriculumSubject;
  standard?: number;
  onClose: () => void;
}

export function InteractiveVideoPlayer({
  manifest,
  chapter,
  subject,
  standard,
  onClose,
}: InteractiveVideoPlayerProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(manifest.durationSec || 720);
  const [activeCheckpoint, setActiveCheckpoint] = useState<TimelineCheckpoint | null>(null);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Set<string>>(new Set());
  const [isDualScrollOpen, setIsDualScrollOpen] = useState(false);

  // Ref tracking completed checkpoints inside interval to prevent closure staleness
  const completedRef = useRef<Set<string>>(new Set());
  completedRef.current = completedCheckpoints;

  // Initialize YouTube Player
  useEffect(() => {
    let isCancelled = false;
    const playerId = `yt-player-${manifest.lessonId}`;

    loadYouTubeIframeAPI().then(() => {
      if (isCancelled || !window.YT) return;

      const player = new window.YT.Player(playerId, {
        videoId: manifest.videoId,
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event) => {
            if (isCancelled) return;
            playerRef.current = event.target;
            setPlayerReady(true);
            const realDuration = event.target.getDuration();
            if (realDuration > 0) setDuration(realDuration);
          },
          onStateChange: (event) => {
            if (isCancelled) return;
            if (window.YT) {
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            }
          },
        },
      });
    });

    return () => {
      isCancelled = true;
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [manifest.lessonId, manifest.videoId]);

  // The Zero-Roundtrip Ticker Loop (Optimized for 60fps & zero UI thread thrashing)
  useEffect(() => {
    if (!playerReady) return;

    let lastLoggedSecond = -1;

    const interval = setInterval(() => {
      if (!playerRef.current) return;
      try {
        // Only inspect time when the player is actively PLAYING (state === 1)
        const playerState = playerRef.current.getPlayerState();
        if (playerState !== 1) return;

        const time = playerRef.current.getCurrentTime();

        // Throttle React state re-renders to once per second to avoid layout/GPU thrashing
        const currentSecInt = Math.floor(time);
        if (currentSecInt !== lastLoggedSecond) {
          lastLoggedSecond = currentSecInt;
          setCurrentTime(time);
        }

        // Check if current time triggers an unpassed checkpoint
        for (const cp of manifest.timeline) {
          if (!completedRef.current.has(cp.checkpointId)) {
            // Checkpoint Trigger Condition
            if (time >= cp.triggerSec && time < cp.triggerSec + 5.0) {
              playerRef.current.pauseVideo();
              playerRef.current.seekTo(cp.triggerSec, true);
              setCurrentTime(cp.triggerSec);
              setActiveCheckpoint(cp);
              break;
            } else if (cp.gate === "HARD" && time > cp.triggerSec + 5.0) {
              // Anti-Scrubbing Guard: Snap back if user scrubbed ahead over a hard gate
              playerRef.current.pauseVideo();
              playerRef.current.seekTo(cp.triggerSec, true);
              setCurrentTime(cp.triggerSec);
              setActiveCheckpoint(cp);
              break;
            }
          }
        }
      } catch {
        // Ignore iframe poll exceptions during unmount
      }
    }, 200);

    return () => clearInterval(interval);
  }, [playerReady, manifest.timeline]);

  const handleCheckpointPass = useCallback(() => {
    if (!activeCheckpoint) return;
    const cpId = activeCheckpoint.checkpointId;

    setCompletedCheckpoints((prev) => {
      const next = new Set(prev);
      next.add(cpId);
      return next;
    });

    setActiveCheckpoint(null);
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  }, [activeCheckpoint]);

  const handleCheckpointRewind = useCallback(
    (rewindSec: number) => {
      if (!activeCheckpoint) return;
      const targetTime = Math.max(0, activeCheckpoint.triggerSec - rewindSec);
      setActiveCheckpoint(null);

      if (playerRef.current) {
        playerRef.current.seekTo(targetTime, true);
        playerRef.current.playVideo();
      }
    },
    [activeCheckpoint]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const activeCheckpointIdx = activeCheckpoint
    ? manifest.timeline.findIndex((c) => c.checkpointId === activeCheckpoint.checkpointId) + 1
    : 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={manifest.title.en}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={containerRef}
        className={`relative w-full ${
          isDualScrollOpen ? "max-w-6xl" : "max-w-4xl"
        } rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isLight
            ? "border-purple-300 bg-white text-purple-950"
            : "border-purple-800/70 bg-[#0d041a] text-white"
        }`}
      >
        {/* Top Bar Header */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-b ${
            isLight ? "border-purple-200 bg-purple-50/50" : "border-purple-900/60 bg-[#160a2b]"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <VideoCamera size={20} className="text-pink-500 shrink-0" weight="fill" />
            <div className="min-w-0">
              <h3 className="font-display text-sm sm:text-base font-bold truncate">
                {manifest.title.en}
              </h3>
              <p className="font-mono text-[11px] text-purple-400 truncate">
                Zero-Latency Interactive Viewport • {manifest.timeline.length} Gating Checkpoints
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {chapter && subject && standard && (
              <button
                type="button"
                onClick={() => setIsDualScrollOpen(!isDualScrollOpen)}
                className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isDualScrollOpen
                    ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40"
                    : isLight
                    ? "bg-purple-100/80 border-purple-200 text-purple-900 hover:bg-purple-200"
                    : "bg-purple-950/60 border-purple-700/50 text-purple-200 hover:bg-purple-900/50"
                }`}
              >
                <BookOpen size={14} weight="fill" className="text-amber-400" />
                <span className="hidden sm:inline">{isDualScrollOpen ? "Hide Reader" : "Dual-Scroll HUD"}</span>
                <span className="sm:hidden">{isDualScrollOpen ? "Hide" : "HUD"}</span>
              </button>
            )}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Ticker
            </span>
            <button
              type="button"
              onClick={onClose}
              className={`grid size-8 place-items-center rounded-xl transition-colors ${
                isLight
                  ? "text-purple-900 hover:bg-purple-100"
                  : "text-purple-300 hover:text-white hover:bg-purple-800/40"
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Viewport Content Area (Split-View capable) */}
        <div className={`flex flex-col ${isDualScrollOpen ? "lg:flex-row" : ""} overflow-hidden`}>
          {/* Video Viewport Container */}
          <div className={`relative ${isDualScrollOpen ? "lg:w-1/2" : "w-full"} aspect-video bg-black shrink-0`}>
            <div id={`yt-player-${manifest.lessonId}`} className="w-full h-full" />

            {/* Loading Placeholder while YouTube API mounts */}
            {!playerReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-purple-950/90 text-purple-200">
                <div className="size-12 rounded-full border-2 border-purple-400 border-t-transparent animate-spin mb-3" />
                <span className="font-mono text-xs text-purple-300">
                  Mounting Zero-Latency Video Viewport...
                </span>
              </div>
            )}

            {/* Checkpoint Modal Overlay (< 5ms Zero-Latency Mount) */}
            {activeCheckpoint && (
              <CheckpointModal
                checkpoint={activeCheckpoint}
                checkpointNumber={activeCheckpointIdx}
                totalCheckpoints={manifest.timeline.length}
                onPass={handleCheckpointPass}
                onRewind={handleCheckpointRewind}
              />
            )}
          </div>

          {/* Right Column: Synchronized Interactive Textbook Reader */}
          {isDualScrollOpen && chapter && subject && standard && (
            <div className="lg:w-1/2 flex flex-col min-w-0">
              <TextbookReader
                chapter={chapter}
                subject={subject}
                standard={standard}
                manifest={manifest}
                currentTime={currentTime}
                onSeekVideo={(sec) => playerRef.current?.seekTo(sec, true)}
              />
            </div>
          )}
        </div>

        {/* Custom Timeline HUD & Milestone Pin Bar */}
        <div
          className={`p-4 border-t flex flex-col gap-2.5 ${
            isLight ? "border-purple-200 bg-purple-50/30" : "border-purple-900/50 bg-[#120724]"
          }`}
        >
          {/* Timeline Bar with Checkpoint Pins */}
          <div className="relative w-full h-3 bg-purple-950/60 rounded-full border border-purple-800/40 overflow-visible">
            {/* Playback Progress */}
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-200"
              style={{ width: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%` }}
            />

            {/* Checkpoint Pins */}
            {manifest.timeline.map((cp) => {
              const pinPos = Math.min(100, (cp.triggerSec / (duration || 1)) * 100);
              const isCleared = completedCheckpoints.has(cp.checkpointId);

              return (
                <div
                  key={cp.checkpointId}
                  className="absolute -top-1.5 -translate-x-1/2 group cursor-pointer"
                  style={{ left: `${pinPos}%` }}
                >
                  <div
                    className={`size-6 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-125 ${
                      isCleared
                        ? "bg-emerald-500 border-emerald-300 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        : "bg-amber-500 border-amber-300 text-purple-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    }`}
                  >
                    {isCleared ? (
                      <CheckCircle size={12} weight="bold" />
                    ) : (
                      <Target size={11} weight="bold" />
                    )}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                    <div className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-700 text-[10px] font-mono text-purple-200 whitespace-nowrap shadow-xl">
                      {cp.subtopicTitle.en} ({formatTime(cp.triggerSec)})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Info Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-purple-400">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-400" />
                <span>Gating Checkpoints: {completedCheckpoints.size}/{manifest.timeline.length} Cleared</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
