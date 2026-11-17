"use client";

/**
 * useMusicPlayer — Singleton HTML5 audio player hook for the Songs experience.
 *
 * Design decisions:
 * - One HTMLAudioElement is created per hook instance (the Songs component).
 *   The component is never duplicated in the routing model so this is safe.
 * - Audio is cleaned up on component unmount.
 * - No autoplay — requires explicit user gesture.
 * - Playback speed, seek, volume, repeat, shuffle are all supported.
 * - Song completion triggers XP award exactly once per song (via callback).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { SongEntry } from "./songs-data";

export type PlayerStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "completed"
  | "error"
  | "unavailable";

export type PlayerState = {
  songId: string | null;
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  speed: number;
  repeat: boolean;
  shuffle: boolean;
  error: string | null;
};

const INITIAL: PlayerState = {
  songId: null,
  status: "idle",
  currentTime: 0,
  duration: 0,
  volume: 0.9,
  muted: false,
  speed: 1,
  repeat: false,
  shuffle: false,
  error: null,
};

export type UseMusicPlayer = {
  state: PlayerState;
  load: (song: SongEntry) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setSpeed: (s: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  stop: () => void;
};

export function useMusicPlayer(
  onComplete: (songId: string) => void,
  onNext?: () => void,
): UseMusicPlayer {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(INITIAL);
  const completedRef = useRef<Set<string>>(new Set());

  // Initialise the audio element once on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };
    const handleDurationChange = () => {
      if (isFinite(audio.duration)) {
        setState((prev) => ({ ...prev, duration: audio.duration }));
      }
    };
    const handleEnded = () => {
      setState((prev) => {
        if (prev.repeat) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
          return { ...prev, currentTime: 0, status: "playing" };
        }
        return { ...prev, status: "completed" };
      });
      // Fire completion callback once per song
      setState((prev) => {
        if (prev.songId && !completedRef.current.has(prev.songId)) {
          completedRef.current.add(prev.songId);
          onComplete(prev.songId);
        }
        return prev;
      });
      // Advance to next song unless repeat is on
      setState((prev) => {
        if (!prev.repeat) {
          onNext?.();
        }
        return prev;
      });
    };
    const handleCanPlay = () => {
      setState((prev) =>
        prev.status === "loading" ? { ...prev, status: "paused" } : prev,
      );
    };
    const handleError = () => {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: "Audio failed to load. Please try again.",
      }));
    };
    const handleWaiting = () => {
      setState((prev) =>
        prev.status === "playing" ? { ...prev, status: "loading" } : prev,
      );
    };
    const handlePlaying = () => {
      setState((prev) => ({ ...prev, status: "playing" }));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback((song: SongEntry) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!song.audioSrc) {
      setState((prev) => ({
        ...prev,
        songId: song.id,
        status: "unavailable",
        currentTime: 0,
        duration: song.audioDuration ?? 0,
        error: null,
      }));
      return;
    }

    audio.pause();
    audio.src = song.audioSrc;
    audio.load();
    setState((prev) => ({
      ...prev,
      songId: song.id,
      status: "loading",
      currentTime: 0,
      duration: song.audioDuration ?? 0,
      error: null,
    }));
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    audio.play().catch(() => {
      setState((prev) => ({ ...prev, status: "error", error: "Playback blocked." }));
    });
    setState((prev) => ({ ...prev, status: "playing" }));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState((prev) => ({ ...prev, status: "paused" }));
  }, []);

  const togglePlay = useCallback(() => {
    setState((prev) => {
      if (prev.status === "playing") {
        audioRef.current?.pause();
        return { ...prev, status: "paused" };
      } else if (prev.status === "paused" || prev.status === "loading") {
        audioRef.current?.play().catch(() => {});
        return { ...prev, status: "playing" };
      } else if (prev.status === "completed") {
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
        return { ...prev, currentTime: 0, status: "playing" };
      }
      return prev;
    });
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || 0));
    setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    if (audioRef.current) audioRef.current.volume = clamped;
    setState((prev) => ({ ...prev, volume: clamped, muted: clamped === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    setState((prev) => {
      const muted = !prev.muted;
      if (audioRef.current) audioRef.current.muted = muted;
      return { ...prev, muted };
    });
  }, []);

  const setSpeed = useCallback((s: number) => {
    if (audioRef.current) audioRef.current.playbackRate = s;
    setState((prev) => ({ ...prev, speed: s }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState((prev) => {
      const repeat = !prev.repeat;
      if (audioRef.current) audioRef.current.loop = repeat;
      return { ...prev, repeat };
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setState((prev) => ({ ...prev, status: "idle", currentTime: 0 }));
  }, []);

  return {
    state,
    load,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setSpeed,
    toggleRepeat,
    toggleShuffle,
    stop,
  };
}

/** Format seconds to MM:SS */
export function fmtTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

