import { GrowthStage } from "@/components/learner-setup";
import type { Band } from "@/lib/progress";

/**
 * Band-aware guidance: juniors get a talking sprout mascot with a speech bubble,
 * older students a quiet one-line hint.
 */
export function BandHint({ band, text, className = "" }: { band: Band; text: string; className?: string }) {
  if (band === "junior") {
    return (
      <div className={`flex items-end gap-3 ${className}`}>
        <GrowthStage band="junior" className="size-20 shrink-0" />
        <p className="pop-in relative mb-6 rounded-3xl rounded-bl-md border border-amber/30 bg-amber/10 px-5 py-3.5 text-[16px] leading-snug text-text">
          {text}
        </p>
      </div>
    );
  }
  return (
    <p
      className={`flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-[14px] text-muted ${className}`}
    >
      <GrowthStage band={band} className="size-8 shrink-0" />
      {text}
    </p>
  );
}
