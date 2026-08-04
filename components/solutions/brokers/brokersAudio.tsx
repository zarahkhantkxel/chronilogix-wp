"use client";

/**
 * brokersAudio — one <audio> element shared across the Brokers page.
 *
 * The hero's "Play Now" button starts the broker brief and reveals a
 * full-width sticky player fixed to the bottom of the viewport. Because
 * the <audio> element lives in the provider (not in any one section),
 * playback continues uninterrupted as the visitor scrolls, and the
 * sticky bar stays put at the same stage of the track.
 *
 *   • BrokersAudioProvider — owns the <audio> + play state.
 *   • useBrokersAudio()     — hook the hero button uses to start playback.
 *   • BrokersStickyAudio    — the fixed bottom player, revealed on first
 *                             play, dismissible via its close button.
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

// Editable defaults (ACF-backed). Passed into BrokersAudioProvider by the page
// and exposed to every UI surface through context, so the track src, title,
// and transcript can be edited in WordPress while falling back to these when a
// field is empty.
const DEFAULT_AUDIO_SRC = "/audio/chronilogix-broker-track.mp3";
const DEFAULT_TRACK_TITLE = "The broker brief";
const DEFAULT_TRACK_SUBTITLE = "Listen · 2:01";

// Transcript segments for the broker brief. Each `t` is the start time in
// seconds; the panel highlights the line matching the current playhead and
// clicking a line seeks to it.
//
// Source: "FINAL Broker track 20260210" VO script. Copy is the finalized
// narration (brand spellings normalized: Chronilogix, Roni, US "behavior").
// Timestamps are estimated from the ~2:01 track and can be nudged if a
// word-level timing pass is done later.
type TranscriptSegment = { t: number; text: string };

const DEFAULT_TRANSCRIPT: TranscriptSegment[] = [
  { t: 0, text: "If you're a broker working with self-funded employers, here's the uncomfortable truth: plan design isn't where the money's leaking anymore." },
  { t: 11, text: "Your clients are paying for chronic conditions like diabetes and obesity, rising behavioral health claims, and delayed care driven by high deductibles." },
  { t: 22, text: "Employees wait, conditions worsen, and claims spike — and you're expected to explain it at renewal." },
  { t: 31, text: "That's the real problem. Most healthcare spend isn't caused by catastrophic events." },
  { t: 38, text: "It's caused by unmanaged behavior between doctor visits — and traditional plans don't touch that. Chronilogix does." },
  { t: 46, text: "Chronilogix is a front-door claims-mitigation strategy for self-funded plans." },
  { t: 52, text: "It delivers 24/7, AI-driven chronic and behavioral health coaching that engages members before claims escalate." },
  { t: 60, text: "At the center is Roni, Chronilogix's AI coach — trained in motivational interviewing and grounded in more than 30 years of research." },
  { t: 69, text: "This isn't reminders or wellness noise. It's real behavior change delivered at scale, without relying on scarce clinicians." },
  { t: 78, text: "Chronilogix targets the top drivers of avoidable spend, improves adherence and self-management, and replaces up to 80% of human coaching sessions for roughly $5 per session." },
  { t: 91, text: "For employers, that means earlier engagement and fewer high-cost claims. For brokers, it means something more valuable." },
  { t: 100, text: "Chronilogix helps differentiate you in a market where everyone else is selling just another point solution." },
  { t: 107, text: "You move upstream in the cost curve, and it gives you a defensible ROI story." },
  { t: 113, text: "To learn how it helps you deliver measurable value and stand apart, visit chronilogix.com. Chronilogix — chronic care coaching that actually clicks." },
];

type AudioCtx = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  // Editable track metadata, resolved from the provider's props / defaults.
  trackTitle: string;
  trackSubtitle: string;
  transcript: TranscriptSegment[];
  /** True once the visitor has hit Play Now — keeps the sticky bar shown. */
  activated: boolean;
  toggle: () => void;
  activateAndPlay: () => void;
  dismiss: () => void;
  seekTo: (t: number) => void;
};

const BrokersAudioContext = createContext<AudioCtx | null>(null);

export type BrokersAudioContent = {
  audioSrc?: string;
  trackTitle?: string;
  trackSubtitle?: string;
  transcript?: TranscriptSegment[];
};

export function BrokersAudioProvider({
  children,
  content,
}: {
  children: ReactNode;
  content?: BrokersAudioContent;
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
  // Sticky player is shown by default (paused), not only after the hero's
  // Play Now. The visitor can still dismiss it via the close button.
  const [activated, setActivated] = useState(true);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    // Seed from the element in case metadata already loaded before the
    // listeners attached (fast cache hit → missed event).
    if (el.duration && isFinite(el.duration)) setDuration(el.duration);
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

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }, []);

  const activateAndPlay = useCallback(() => {
    setActivated(true);
    const el = audioRef.current;
    if (!el) return;
    // If already playing, treat a second press as pause (the button
    // mirrors play state), otherwise start it.
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }, []);

  const dismiss = useCallback(() => {
    const el = audioRef.current;
    if (el) el.pause();
    setActivated(false);
  }, []);

  const seekTo = useCallback((t: number) => {
    const el = audioRef.current;
    if (!el || !isFinite(t)) return;
    el.currentTime = Math.max(0, Math.min(t, el.duration || t));
  }, []);

  const value = useMemo<AudioCtx>(
    () => ({
      isPlaying,
      currentTime,
      duration,
      trackTitle,
      trackSubtitle,
      transcript,
      activated,
      toggle,
      activateAndPlay,
      dismiss,
      seekTo,
    }),
    [
      isPlaying,
      currentTime,
      duration,
      trackTitle,
      trackSubtitle,
      transcript,
      activated,
      toggle,
      activateAndPlay,
      dismiss,
      seekTo,
    ],
  );

  return (
    <BrokersAudioContext.Provider value={value}>
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      {children}
    </BrokersAudioContext.Provider>
  );
}

export function useBrokersAudio() {
  const ctx = useContext(BrokersAudioContext);
  if (!ctx) {
    throw new Error("useBrokersAudio must be used within BrokersAudioProvider");
  }
  return ctx;
}

// ── Sticky bottom player ─────────────────────────────────────────────

export function BrokersStickyAudio() {
  const {
    activated,
    isPlaying,
    currentTime,
    duration,
    trackTitle,
    transcript,
    toggle,
    seekTo,
  } = useBrokersAudio();
  const durSafe = duration || 121;

  return (
    <div
      aria-hidden={!activated}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-center px-2 pb-2 transition-all duration-500 ease-out-quart motion-reduce:transition-none md:px-3 md:pb-3 ${
        activated
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {/* Transcript and controls share ONE card so they read as a single
          surface rather than two stacked, separate panels. */}
      <div className="pointer-events-auto flex w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white/95 shadow-[0_2px_6px_rgba(15,20,25,0.06),0_24px_60px_-24px_rgba(15,20,25,0.28)] backdrop-blur-md">
        {isPlaying ? (
          <TranscriptPanel
            currentTime={currentTime}
            onSeek={seekTo}
            transcript={transcript}
          />
        ) : null}

        <div className="flex items-center gap-3 px-3 py-2.5 md:gap-4 md:px-4 md:py-3">
          <PlayButton isPlaying={isPlaying} onClick={toggle} />

          <div className="hidden min-w-0 flex-col sm:flex">
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-brand-700">
              {isPlaying ? "Now playing" : "Paused"}
            </span>
            <span className="truncate font-serif text-[15px] leading-tight text-ink">
              {trackTitle}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="hidden shrink-0 font-mono text-[11px] tabular-nums text-ink-muted md:inline">
              {formatTime(currentTime)}
            </span>
            <Waveform
              currentTime={currentTime}
              duration={durSafe}
              onSeek={seekTo}
            />
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
              {formatTime(durSafe)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Expandable transcript, shown above the sticky bar. Highlights the line
// matching the current playhead; clicking a line seeks the audio to it.
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

  // Auto-scroll: keep the active line centered in the compact window as
  // playback advances. Uses container-scoped math (not scrollIntoView) so
  // the page itself never jumps.
  useEffect(() => {
    const container = scrollRef.current;
    const el = activeRef.current;
    if (!container || !el) return;
    // Pin the active line near the top of the compact window so it's fully
    // visible and the next line peeks below — caption-style follow.
    const target = el.offsetTop - 8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollTo({
      top: Math.max(0, target),
      behavior: reduce ? "auto" : "smooth",
    });
  }, [activeIndex]);

  return (
    // Compact caption window — ~two lines tall; auto-scrolls with the audio.
    // Sits directly inside the shared player card (no separate panel, no
    // heading, no timestamp column) so it reads as a running transcript. The
    // active line matching the playhead is highlighted; clicking seeks to it.
    <ol
      ref={scrollRef}
      className="relative h-[64px] overflow-y-auto border-b border-ink/8 px-3 py-1.5 md:px-4"
    >
      {transcript.map((seg, i) => {
          const isActive = i === activeIndex;
          return (
            <li key={seg.t} ref={isActive ? activeRef : undefined}>
              <button
                type="button"
                onClick={() => onSeek(seg.t)}
                className={`w-full rounded-lg px-2 py-1 text-left transition-colors duration-200 ${
                  isActive
                    ? "text-ink"
                    : "text-ink-muted/70 hover:text-ink-soft"
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

function PlayButton({
  isPlaying,
  onClick,
}: {
  isPlaying: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPlaying ? "Pause audio" : "Play audio"}
      className="group/play relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white shadow-[0_2px_6px_rgba(15,20,25,0.14),0_16px_32px_-14px_rgba(228,90,28,0.55)] transition-all duration-300 ease-out motion-reduce:transition-none hover:bg-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2"
    >
      {isPlaying ? (
        <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden>
          <rect x="5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
          <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden style={{ marginLeft: 1 }}>
          <path d="M6 4l10 6-10 6V4z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}

// Static, organic-looking bar heights (0–1) for the seek waveform. Layered
// sines give a natural envelope (fuller in the middle) without randomness, so
// the shape is stable across renders and SSR/client stay in sync.
const WAVE_BARS = Array.from({ length: 48 }, (_, i) => {
  const envelope = Math.sin((i / 47) * Math.PI); // taller toward the center
  const detail = Math.sin(i * 0.9) * 0.22 + Math.sin(i * 2.3 + 1.5) * 0.14;
  return Math.max(0.22, Math.min(1, 0.4 + envelope * 0.55 + detail));
});

function Waveform({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  const handleSeek = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Seek audio"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(currentTime)}
      tabIndex={0}
      onClick={(e) => handleSeek(e.clientX)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onSeek(currentTime + 5);
        if (e.key === "ArrowLeft") onSeek(currentTime - 5);
      }}
      className="relative flex h-9 flex-1 cursor-pointer items-center gap-[2px] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 focus-visible:ring-offset-2"
    >
      {WAVE_BARS.map((h, i) => {
        const played = i / (WAVE_BARS.length - 1) <= progress;
        return (
          <span
            key={i}
            aria-hidden
            className={`min-w-[2px] flex-1 rounded-full transition-colors duration-150 ${
              played ? "bg-brand-700" : "bg-ink/15"
            }`}
            style={{ height: `${Math.round(h * 100)}%` }}
          />
        );
      })}
    </div>
  );
}

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
