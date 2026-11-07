"use client";

import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react/ssr";
import { setSoundOn, useSoundOn } from "@/lib/feedback";

/** Mute switch for answer cues: one tap, remembered on this device. */
export function SoundToggle() {
  const on = useSoundOn();
  return (
    <button
      type="button"
      onClick={() => setSoundOn(!on)}
      aria-pressed={on}
      aria-label={on ? "Mute sounds" : "Unmute sounds"}
      title={on ? "Sound on" : "Sound off"}
      className="grid size-11 place-items-center rounded-xl border border-line bg-white/[0.04] text-muted transition-colors duration-200 hover:bg-white/[0.1] hover:text-text"
    >
      {on ? <SpeakerHigh size={19} weight="duotone" /> : <SpeakerSlash size={19} weight="duotone" />}
    </button>
  );
}
