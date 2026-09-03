import emblemAsset from "@/assets/ashoka-emblem.png.asset.json";

/**
 * Static line-art State Emblem of India with glowing gold pulses that travel
 * along the existing stroke paths. The base illustration never changes: the
 * motion lives entirely in masked light overlays above it.
 */
export function EmblemHero() {
  return (
    <div className="emblem-stage relative mx-auto w-full max-w-[30rem]">
      <div className="emblem-frame relative aspect-square overflow-hidden rounded-xl border border-border bg-card">
        <span className="emblem-halo" aria-hidden />
        <img
          src={emblemAsset.url}
          alt="Line-art illustration of the Lion Capital of Ashoka, the State Emblem of India"
          width={1024}
          height={1024}
          className="emblem-base absolute inset-0 size-full object-contain p-8"
        />
        <span className="emblem-light emblem-light-sweep" aria-hidden />
        <span className="emblem-light emblem-light-beads" aria-hidden />
        <span className="emblem-vignette" aria-hidden />
      </div>
      <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        सत्यमेव जयते · Government record workflow
      </p>
    </div>
  );
}
