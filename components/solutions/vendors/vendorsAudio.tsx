"use client";

/**
 * vendorsAudio — one <audio> element, two UI surfaces.
 *
 * The page now speaks to four org types (employers, healthcare vendors,
 * health plans, care providers), not a single narrated pitch to one
 * persona — so the audio reads as "hear how this works," not "a
 * message to you specifically." Two visual surfaces:
 *
 *   • VendorsAudioPlayerBar — a bold, prominent horizontal player
 *     sitting directly under the hero copy (big play button, wide
 *     waveform, label + duration). Inspired by the reference sites'
 *     instinct to make audio a first-class hero element rather than a
 *     tucked-away control, kept in Chronilogix's own warm/serif
 *     language rather than their literal dark/stark aesthetics.
 *   • VendorsStickyAudio — a compact bar that slides in from the bottom
 *     of the viewport once the hero scrolls out of view.
 *
 * Both surfaces mirror the same play state, currentTime, and duration.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Editable defaults (ACF-backed). Passed into VendorsAudioProvider by the page
// and exposed to every UI surface through context, so the track src, title,
// and transcript can be edited in WordPress while falling back to these when a
// field is empty.
const DEFAULT_AUDIO_SRC = "/audio/chronilogix-vendor-track.mp3";
const DEFAULT_TRACK_TITLE = "The vendor brief";
const DEFAULT_TRACK_SUBTITLE = "Listen · 2:19";

// Transcript segments for the vendor track. Each `t` is the start time in
// seconds; the panel highlights the line matching the current playhead and
// clicking a line seeks to it.
//
// Source: "FINAL edit Chronilogix Vendor track" VO script. Copy is the
// finalized narration (brand spellings normalized: Chronilogix, Roni, US
// "behavior"/"utilization"). Timestamps are estimated from the ~2:19 track
// and can be nudged if a word-level timing pass is done later.
type TranscriptSegment = { t: number; text: string };

const DEFAULT_TRANSCRIPT: TranscriptSegment[] = [
  { t: 0, text: "If you sell chronic care products and you're still competing on features, price, or distribution, you're already losing." },
  { t: 9, text: "Because in today's market, the product isn't the problem. What happens after delivery is." },
  { t: 16, text: "Chronic care vendors are under pressure from every direction. Products are prescribed, shipped, and then quietly underused." },
  { t: 25, text: "Adherence drops after the first 30 to 90 days. Retention suffers." },
  { t: 30, text: "And payers, employers, and partners are no longer impressed by logistics alone. They want outcomes." },
  { t: 38, text: "Chronilogix is the outcomes upgrade your products have been missing." },
  { t: 43, text: "Chronilogix delivers 24/7, AI-powered chronic care and behavioral health coaching that sits on top of your existing solutions — driving sustained utilization, adherence, and measurable results in the real world." },
  { t: 58, text: "Powered by Roni, an AI coach trained in motivational interviewing and backed by more than 30 years of research and evidence-based behavior-change science, Chronilogix engages patients continuously, not episodically." },
  { t: 72, text: "It addresses the emotional, behavioral, and socioeconomic barriers that cause that drop-off — fear, fatigue, cost stress, and low health literacy." },
  { t: 82, text: "Chronilogix closes that behavior gap between prescription and real-world use, without relying on expensive, hard-to-scale clinical teams." },
  { t: 91, text: "The impact is immediate and measurable. Chronilogix replaces up to 80% of human coaching sessions at roughly $5 per session." },
  { t: 101, text: "Vendors who offer Chronilogix alongside their products see up to 40% higher retention rates — and there's no cost to the vendor." },
  { t: 112, text: "You don't replace your product. You upgrade it." },
  { t: 116, text: "In a crowded, noisy market, Chronilogix helps you move from commodity supplier to outcomes-enabled partner — with data, differentiation, and a stronger value story buyers can't ignore." },
  { t: 130, text: "If you're ready to upgrade outcomes, retention, and relevance, visit chronilogix.com. Chronilogix — chronic care coaching that clicks." },
];

type AudioCtx = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  // Editable track metadata, resolved from the provider's props / defaults.
  trackTitle: string;
  trackSubtitle: string;
  transcript: TranscriptSegment[];
  toggle: () => void;
  seekTo: (t: number) => void;
  // Registered by the hero card so the sticky bar knows when it is
  // out of view and should reveal itself.
  registerAnchor: (el: HTMLElement | null) => void;
  anchorVisible: boolean;
  // True once the visitor presses "Play Now" in the hero — keeps the
  // sticky player revealed from that point on (dismissible).
  activated: boolean;
  activateAndPlay: () => void;
  dismiss: () => void;
};

const VendorsAudioContext = createContext<AudioCtx | null>(null);

export type VendorsAudioContent = {
  audioSrc?: string;
  trackTitle?: string;
  trackSubtitle?: string;
  transcript?: TranscriptSegment[];
};

export function VendorsAudioProvider({
  children,
  content,
}: {
  children: ReactNode;
  content?: VendorsAudioContent;
}) {
  const audioSrc = content?.audioSrc || DEFAULT_AUDIO_SRC;
  const trackTitle = content?.trackTitle || DEFAULT_TRACK_TITLE;
  const trackSubtitle = content?.trackSubtitle || DEFAULT_TRACK_SUBTITLE;
  const transcript =
    content?.transcript && content.transcript.length
      ? content.transcript
      : DEFAULT_TRANSCRIPT;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorVisible, setAnchorVisible] = useState(true);
  // Sticky player is shown by default (paused), matching the Brokers page.
  // The visitor can still dismiss it via the close button.
  const [activated, setActivated] = useState(true);

  // Sync <audio> events → React state.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onDur = () => setDuration(el.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onDur);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onDur);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  // Watch the hero card so the sticky bar can reveal on scroll-past.
  useEffect(() => {
    if (!anchorEl) return;
    const io = new IntersectionObserver(
      ([entry]) => setAnchorVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "-40px 0px 0px 0px" },
    );
    io.observe(anchorEl);
    return () => io.disconnect();
  }, [anchorEl]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {
        // Autoplay policies can reject; the play button click itself is
        // a user gesture so this rarely triggers, but we swallow silently.
      });
    } else {
      el.pause();
    }
  }, []);

  const seekTo = useCallback((t: number) => {
    const el = audioRef.current;
    if (!el) return;
    if (!isFinite(t)) return;
    el.currentTime = Math.max(0, Math.min(t, el.duration || t));
  }, []);

  const registerAnchor = useCallback((el: HTMLElement | null) => {
    setAnchorEl(el);
  }, []);

  const activateAndPlay = useCallback(() => {
    setActivated(true);
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }, []);

  const dismiss = useCallback(() => {
    const el = audioRef.current;
    if (el) el.pause();
    setActivated(false);
  }, []);

  const value = useMemo<AudioCtx>(
    () => ({
      isPlaying,
      currentTime,
      duration,
      trackTitle,
      trackSubtitle,
      transcript,
      toggle,
      seekTo,
      registerAnchor,
      anchorVisible,
      activated,
      activateAndPlay,
      dismiss,
    }),
    [
      isPlaying,
      currentTime,
      duration,
      trackTitle,
      trackSubtitle,
      transcript,
      toggle,
      seekTo,
      registerAnchor,
      anchorVisible,
      activated,
      activateAndPlay,
      dismiss,
    ],
  );

  return (
    <VendorsAudioContext.Provider value={value}>
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      {children}
    </VendorsAudioContext.Provider>
  );
}

export function useVendorsAudio() {
  const ctx = useContext(VendorsAudioContext);
  if (!ctx) {
    throw new Error("useVendorsAudio must be used within VendorsAudioProvider");
  }
  return ctx;
}

// ── UI surface: hero audio player bar ────────────────────────────────

/**
 * VendorsAudioPlayerBar — a bold, prominent horizontal player. Two
 * sizes: the default full bar (big play button, wide waveform, title +
 * duration) and a `compact` variant sized to sit as a floating card
 * inside the hero collage (smaller play button, narrower waveform, no
 * title — just play/pause, waveform, and remaining time). Kept in
 * Chronilogix's own warm/serif/editorial language rather than the
 * reference sites' dark, stark aesthetics.
 */
export function VendorsAudioPlayerBar({
  compact = false,
}: {
  compact?: boolean;
}) {
  const {
    isPlaying,
    currentTime,
    duration,
    trackTitle,
    toggle,
    seekTo,
    registerAnchor,
  } = useVendorsAudio();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const remaining = duration ? duration - currentTime : 139 - currentTime;

  if (compact) {
    return (
      <div
        ref={registerAnchor}
        className="flex w-full items-center gap-3 rounded-full border border-ink/8 bg-white py-2 pl-2 pr-4 shadow-[0_1px_2px_rgba(15,20,25,0.04),0_16px_36px_-20px_rgba(228,90,28,0.38)]"
      >
        <PlayButton isPlaying={isPlaying} onClick={toggle} size="sm" />
        <WideWaveform
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          reducedMotion={reducedMotion}
          onSeek={seekTo}
          bars={22}
          heightClass="h-5"
        />
        <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-ink-muted">
          {formatTime(remaining)}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={registerAnchor}
      className="flex w-full max-w-[560px] items-center gap-4 rounded-full border border-ink/8 bg-white p-3 shadow-[0_1px_2px_rgba(15,20,25,0.04),0_18px_44px_-22px_rgba(228,90,28,0.32)] md:gap-5 md:p-4"
    >
      <PlayButton isPlaying={isPlaying} onClick={toggle} size="lg" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate font-serif text-[15px] italic text-ink md:text-base">
            {trackTitle}
          </p>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
            {formatTime(remaining)}
          </span>
        </div>
        <WideWaveform
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          reducedMotion={reducedMotion}
          onSeek={seekTo}
        />
      </div>
    </div>
  );
}

// Wide waveform for the bold hero player (42 bars by default, fewer for
// the compact card variant) — click/drag to seek, same
// deterministic-height technique as the rest of the site so SSR and
// client renders match exactly.
function WideWaveform({
  isPlaying,
  currentTime,
  duration,
  reducedMotion,
  onSeek,
  bars = 42,
  heightClass = "h-7",
  fill = false,
}: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  reducedMotion: boolean;
  onSeek: (t: number) => void;
  bars?: number;
  heightClass?: string;
  /** Let bars stretch to fill the full width instead of the thin 3.5px cap. */
  fill?: boolean;
}) {
  const BARS = bars;
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const durSafe = duration || 139;
  const progress = Math.min(1, currentTime / durSafe);

  const heights = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < BARS; i++) {
      const t = i / (BARS - 1);
      const base = 0.32 + 0.4 * Math.sin(t * Math.PI);
      const jitter = 0.16 * Math.sin(i * 1.9) * Math.cos(i * 1.1);
      const spike = i % 11 === 4 ? 0.18 : 0;
      const h = Math.max(0.2, Math.min(1, base + jitter + spike));
      out.push(Math.round(h * 1000) / 1000);
    }
    return out;
  }, [BARS]);

  const handleSeek = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(ratio * durSafe);
  };

  return (
    <span
      ref={containerRef}
      role="slider"
      aria-label="Seek audio"
      aria-valuemin={0}
      aria-valuemax={Math.round(durSafe)}
      aria-valuenow={Math.round(currentTime)}
      tabIndex={0}
      onClick={(e) => handleSeek(e.clientX)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onSeek(currentTime + 5);
        if (e.key === "ArrowLeft") onSeek(currentTime - 5);
      }}
      className={`flex ${heightClass} flex-1 cursor-pointer items-center gap-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
    >
      {heights.map((h, i) => {
        const t = i / (BARS - 1);
        const played = t <= progress;
        return (
          <span
            key={i}
            className="min-w-[2px] flex-1 rounded-full"
            style={{
              maxWidth: fill ? undefined : 3.5,
              height: `${h * 100}%`,
              backgroundColor: played ? "#E45A1C" : "#E9E4DB",
              animation:
                isPlaying && played && !reducedMotion
                  ? `barPulse 900ms ease-in-out ${i * 40}ms infinite alternate`
                  : undefined,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes barPulse {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(1.18); }
        }
      `}</style>
    </span>
  );
}

// ── UI surface: sticky bar ───────────────────────────────────────────

/**
 * VendorsStickyAudio — full-width bar fixed to the bottom of the
 * viewport, revealed once the visitor presses "Play Now" in the hero.
 * Keeps playing across scroll once revealed.
 */
export function VendorsStickyAudio() {
  const {
    isPlaying,
    currentTime,
    duration,
    trackTitle,
    transcript,
    toggle,
    seekTo,
    activated,
  } = useVendorsAudio();
  const visible = activated;
  // Transcript is revealed only while the audio is playing; it collapses
  // when paused or stopped.
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-2 pb-2 transition-all duration-500 ease-out-quart motion-reduce:transition-none md:px-3 md:pb-3 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {/* Single card — transcript (when open) sits directly above the
          player row, joined by an internal divider so they read as one. */}
      <div className="pointer-events-auto w-full max-w-[760px] overflow-hidden rounded-2xl border border-ink/8 bg-white/95 shadow-[0_2px_6px_rgba(15,20,25,0.06),0_24px_60px_-24px_rgba(15,20,25,0.28)] backdrop-blur-md">
        {isPlaying ? (
          <div className="border-b border-ink/8">
            <TranscriptPanel
              currentTime={currentTime}
              onSeek={seekTo}
              transcript={transcript}
            />
          </div>
        ) : null}

        <div className="flex items-center gap-3 px-3 py-2.5 md:gap-4 md:px-4 md:py-3">
          <PlayButton isPlaying={isPlaying} onClick={toggle} size="sm" />

          <div className="hidden min-w-0 flex-col sm:flex">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-brand-700">
              {isPlaying ? "Now playing" : "Paused"}
            </span>
            <span className="truncate text-[13px] font-medium text-ink">{trackTitle}</span>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="hidden shrink-0 font-mono text-[11px] tabular-nums text-ink-muted md:inline">
              {formatTime(currentTime)}
            </span>
            {/* Waveform seek control — same treatment as the Brokers sticky
                player (and the Vendors hero bar), replacing the thin line. */}
            <WideWaveform
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              reducedMotion={reducedMotion}
              onSeek={seekTo}
              bars={56}
              heightClass="h-9"
              fill
            />
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
              {formatTime(duration || 139)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Transcript panel ─────────────────────────────────────────────────
// Expandable transcript, shown above the sticky bar. Highlights the line
// matching the current playhead; clicking a line seeks the audio to it,
// and the compact window auto-scrolls to follow playback.
function TranscriptPanel({
  currentTime,
  onSeek,
  transcript,
}: {
  currentTime: number;
  onSeek: (t: number) => void;
  transcript: TranscriptSegment[];
}) {
  const scrollRef = useRef<HTMLOListElement | null>(null);
  const activeRef = useRef<HTMLLIElement | null>(null);

  const activeIndex = (() => {
    let idx = 0;
    for (let i = 0; i < transcript.length; i++) {
      if (currentTime >= transcript[i].t) idx = i;
    }
    return idx;
  })();

  useEffect(() => {
    const container = scrollRef.current;
    const el = activeRef.current;
    if (!container || !el) return;
    // Pin the active line near the top of the compact window.
    const target = el.offsetTop - 8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollTo({
      top: Math.max(0, target),
      behavior: reduce ? "auto" : "smooth",
    });
  }, [activeIndex]);

  // Compact caption window — ~two lines tall; auto-scrolls with the audio.
  // No timestamp column, so it reads as a running transcript; the active line
  // matching the playhead is highlighted, and clicking a line seeks to it.
  return (
    <ol ref={scrollRef} className="relative h-[64px] overflow-y-auto px-3 py-1.5 md:px-4">
      {transcript.map((seg, i) => {
        const isActive = i === activeIndex;
        return (
          <li key={seg.t} ref={isActive ? activeRef : undefined}>
            <button
              type="button"
              onClick={() => onSeek(seg.t)}
              className={`w-full rounded-lg px-2 py-1 text-left transition-colors duration-200 ${
                isActive ? "text-ink" : "text-ink-muted/70 hover:text-ink-soft"
              }`}
            >
              <span
                className={`text-[14px] leading-relaxed transition-colors duration-200 ${
                  isActive ? "font-medium" : ""
                }`}
              >
                {seg.text}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

// ── Building blocks ─────────────────────────────────────────────────

function PlayButton({
  isPlaying,
  onClick,
  size,
}: {
  isPlaying: boolean;
  onClick: () => void;
  size: "sm" | "lg";
}) {
  const dim = size === "lg" ? "h-16 w-16 md:h-20 md:w-20" : "h-11 w-11";
  const iconSize = size === "lg" ? 22 : 14;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPlaying ? "Pause audio" : "Play audio"}
      className={`group/play relative flex ${dim} shrink-0 items-center justify-center rounded-full bg-ink text-white shadow-[0_2px_6px_rgba(15,20,25,0.14),0_16px_32px_-14px_rgba(228,90,28,0.55)] transition-all duration-300 ease-out motion-reduce:transition-none hover:bg-brand-accent hover:shadow-[0_2px_10px_rgba(255,116,52,0.35),0_20px_40px_-14px_rgba(255,116,52,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2`}
    >
      {/* Pulsing halo when playing — subtle brand echo. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-full ring-2 ring-brand-accent/40 transition-opacity duration-300 ${
          isPlaying ? "animate-ping opacity-60" : "opacity-0"
        }`}
      />
      {isPlaying ? (
        <PauseGlyph size={iconSize} />
      ) : (
        <PlayGlyph size={iconSize} />
      )}
    </button>
  );
}

function PlayGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden
      style={{ marginLeft: size > 18 ? 2 : 1 }}
    >
      <path d="M6 4l10 6-10 6V4z" fill="currentColor" />
    </svg>
  );
}

function PauseGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <rect x="5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
