# Fix prompt: restore header color + hero headline fonts + walkthrough animation

This is a copy-paste prompt for your other environment. Three defects there:
1. The navy header bar shows "FIR SUMMARIZER" in a near-invisible dark-on-dark color — it should be light/white (cream).
2. The hero headline "Turn handwritten FIRs into a clear case brief" lost its intended serif typeface and brass accent color.
3. The animated walkthrough demo that sits below the hero (the auto-cycling OCR → extract → summary → ready browser mockup, plus the underline-reveal on "clear case brief") is missing/blank.

Root cause: missing/incorrect CSS design tokens (`--sidebar-foreground`, `--chart-1`, etc.), the Google Fonts (DM Serif Display / DM Sans) not loaded, the `.landing-underline` animation CSS missing, and the `LandingDemo` component/section not rendered.

## Prompt to paste

```
Restore the FIR Summarizer landing page header and hero headline to their intended fonts and colors. Keep the light theme. The issue is that the design tokens and/or web fonts are not loaded, so text renders with the wrong color and typeface.

1. WEB FONTS — load DM Serif Display (headings) and DM Sans (body/UI) from Google Fonts. Add to the root route <head> links:
   - preconnect https://fonts.googleapis.com
   - preconnect https://fonts.gstatic.com (crossOrigin anonymous)
   - stylesheet: https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap

2. GLOBAL CSS — in :root, set these exact oklch tokens (light theme):
   --sidebar: oklch(0.3 0.055 252);              /* navy header/sidebar background */
   --sidebar-foreground: oklch(0.97 0.008 90);    /* light cream text on navy = THIS is what makes "FIR SUMMARIZER" visible */
   --sidebar-primary: oklch(0.84 0.075 82);      /* brass/khaki for the shield icon tile */
   --sidebar-primary-foreground: oklch(0.23 0.04 252);
   --sidebar-accent: oklch(0.38 0.06 252);
   --sidebar-accent-foreground: oklch(0.97 0.008 90);
   --sidebar-border: oklch(0.43 0.05 252);
   --accent: oklch(0.84 0.075 82);
   --accent-foreground: oklch(0.23 0.04 252);
   --chart-1: oklch(0.53 0.09 67);               /* brass/brown — used for "clear case brief" + accent icons */
   --foreground: oklch(0.22 0.035 254);
   --background: oklch(0.965 0.012 88);
   --muted-foreground: oklch(0.48 0.035 254);
   Register them in the @theme inline block as --color-sidebar, --color-sidebar-foreground, --color-accent, --color-chart-1, etc.

3. BODY/HEADING TYPOGRAPHY in base layer:
   body { font-family: "DM Sans", ui-sans-serif, system-ui, sans-serif; }
   h1,h2,h3,h4 { font-family: "DM Serif Display", Georgia, serif; font-weight: 400; }

4. HEADER MARKUP (navy bar) — verify the header uses bg-sidebar text-sidebar-foreground and the brand text uses font-serif:
   <header className="sticky top-0 z-30 border-b border-sidebar-border bg-sidebar/95 text-sidebar-foreground backdrop-blur">
     ... <span className="block font-serif text-sm font-bold tracking-wide">FIR SUMMARIZER</span>
         <span className="block text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/65">Investigation portal</span>
   "FIR SUMMARIZER" MUST render in --sidebar-foreground (light cream) via the inherited text-sidebar-foreground, NOT in a dark/navy color. If it still looks dark on dark, the --sidebar-foreground token is missing or overridden — fix the token, do not hardcode a text-white utility.

5. HERO HEADLINE — keep the serif headline at its original sizes and the brass accent on "clear case brief":
   <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
     Turn handwritten FIRs into a{" "}
     <span className="landing-underline text-chart-1">clear case brief</span>
   </h1>
   "clear case brief" should be brass/brown (text-chart-1 = oklch(0.53 0.09 67)) with the CSS underline-reveal animation (the .landing-underline ::after scaleX rule).

6. UNDERLINE-REVEAL ANIMATION (on "clear case brief") — add this CSS so the brass underline animates in:
   .landing-underline { position: relative; white-space: nowrap; }
   .landing-underline::after { content: ""; position: absolute; left: 0; bottom: -0.12em; height: 0.14em; width: 100%;
     background: linear-gradient(90deg, var(--color-accent), oklch(0.53 0.09 67)); transform-origin: left; }
   @media (prefers-reduced-motion: no-preference) {
     .landing-underline::after { animation: landing-underline 1000ms 500ms cubic-bezier(0.33, 1, 0.68, 1) both; }
   }
   @keyframes landing-underline { from { transform: scaleX(0); } to { transform: scaleX(1); } }

7. WALKTHROUGH DEMO ANIMATION (the section that is currently missing/blank below the hero) — create an auto-cycling browser-mockup component named LandingDemo and render it in a "Live walkthrough" section right after the hero. It must:
   - Loop through 4 phases every 2400ms via setInterval + IntersectionObserver (only run when in view; skip if prefers-reduced-motion): "Reading document" (ScanLine), "Extracting fields" (FileText), "Writing summary" (Sparkles), "Ready for review" (CheckCircle2).
   - Left side: a paper-like panel showing scanned Hindi FIR OCR lines (Devanagari text skeleton bars).
   - Right side: a metadata grid (FIR number, Police station, District, Date, Complainant, Sections) that fills in during the extract phase, and a summary block (3 plain-English lines) that fills in during the summarize phase.
   - A synchronized scanline sweeping the document panel (.landing-scanline keyframe).
   - A centered max-width 860px browser chrome frame with the navy/parchment/brass palette — same colors as the rest of the page, NO dark theme.
   - Transitions 700ms cubic-bezier(0.22, 1, 0.36, 1).
   Section markup:
   <section className="relative overflow-hidden border-b border-border bg-muted/20">
     <div className="landing-glow" aria-hidden />
     <div className="relative mx-auto w-[min(100%-2rem,1180px)] py-16 sm:py-20">
       <div className="mx-auto max-w-2xl text-center">
         <p className="portal-kicker">Live walkthrough</p>
         <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Watch one FIR move through the portal</h2>
         <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">The scanned page is read, the fields are lifted, and the brief is written — all on the station workstation.</p>
       </div>
       <div className="mx-auto mt-10 w-full max-w-[860px]"><LandingDemo wide /></div>
     </div>
   </section>

8. The landing hero background should be the light parchment gradient (.landing-hero) flowing continuously — no hard divider border between hero and the walkthrough section below.

Do NOT change the color palette (navy / parchment / brass / muted teal). Do NOT make it a dark theme. Only restore the missing tokens, fonts, and the LandingDemo walkthrough so: the header text is legible (cream on navy), the hero headline uses DM Serif Display with the brass "clear case brief" underline reveal, and the auto-cycling walkthrough demo renders in the section below the hero.
```

## Why this fixes it
- "FIR SUMMARIZER" is invisible because the header is `bg-sidebar` (navy) but its text relies on `--sidebar-foreground`. In your restored env that token is missing/wrong, so it falls back to a dark inherited color. Setting `--sidebar-foreground: oklch(0.97 0.008 90)` (light cream) makes it white/legible.
- The hero headline lost its serif look because the DM Serif Display web font isn't loaded in that env. Loading the Google Font + setting `h1..h4 { font-family: "DM Serif Display" }` restores it.
- "clear case brief" loses its brass color when `--chart-1` is unset; `oklch(0.53 0.09 67)` is the original value, and the `.landing-underline::after` keyframe provides the animated underline.
- The blank area below the hero is the missing LandingDemo walkthrough — re-creating the auto-cycling browser mockup and rendering it in the Live walkthrough section brings the animation back.
