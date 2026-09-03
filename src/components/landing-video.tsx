import { Lock } from "lucide-react";
import videoAsset from "@/assets/emblem-motion.mp4.asset.json";

/** Wide browser-framed motion panel shown in its own landing section. */
export function LandingVideo() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/20 blur-3xl" aria-hidden />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_90px_-45px_oklch(0.3_0.055_252/0.4)]">
        <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-4 py-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-chart-4/70" />
            <span className="size-2.5 rounded-full bg-chart-5/80" />
            <span className="size-2.5 rounded-full bg-chart-2/60" />
          </span>
          <span className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
            <Lock className="size-3" aria-hidden />
            localhost:8000 / emblem
          </span>
          <span className="hidden rounded-full bg-chart-2/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-chart-2 sm:inline">
            Offline
          </span>
        </div>
        <video
          src={videoAsset.url}
          className="block aspect-video w-full bg-background object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="Minimalist motion graphics of the State Emblem of India"
        />
      </div>
    </div>
  );
}
