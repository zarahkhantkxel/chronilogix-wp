"use client";

// A four-turn mental-health coaching exchange. Millie opens with a
// check-in, the member replies short, Millie reflects with an MI
// question, then closes with a one-line moment of presence. Rendered
// as iMessage-style bubbles — Millie on the left, member on the right.
const MILLIE_OPENING = {
  who: "millie" as const,
  text: "Didn't see you check in tonight. What's keeping you up?",
};

const YOU_REPLY = {
  who: "you" as const,
  text: "Mind won't stop.",
};

const MILLIE_FOLLOWUP = {
  who: "millie" as const,
  text: "What's loudest right now?",
};

const MILLIE_LINER = {
  who: "millie" as const,
  text: "We can sit with it.",
};

const CHAT_TIME_LABEL = "Tonight · 23:18";

const MILLIE_OPENING_WINDOW: [number, number] = [0.04, 0.20];
const YOU_REPLY_WINDOW: [number, number] = [0.26, 0.40];
const MILLIE_FOLLOWUP_WINDOW: [number, number] = [0.46, 0.62];
const MILLIE_LINER_WINDOW: [number, number] = [0.68, 0.84];

const SCREEN = {
  top: (24 / 1375) * 100,
  left: (34 / 671) * 100,
  width: (612 / 671) * 100,
  height: (1326 / 1375) * 100,
  radius: "13.4% / 6.18%",
};

const NOTCH = {
  top: (41 / 1375) * 100,
  left: (243 / 671) * 100,
  width: (194 / 671) * 100,
  height: (57 / 1375) * 100,
};

export function HeroPhoneMockup({
  progress,
  maxRisePercent = 55,
  shiftXPercent = 0,
  scale = 1,
  chatProgress = 0,
  riseStart = 0.12,
  riseEnd = 0.65,
}: {
  progress: number;
  maxRisePercent?: number;
  shiftXPercent?: number;
  scale?: number;
  chatProgress?: number;
  /**
   * Scroll-progress thresholds (0–1) bounding the phone's rise. Below
   * `riseStart` the phone is fully tucked off-screen; at `riseEnd` it has
   * fully risen. Defaults preserve the original choreography; the
   * Statement section overrides these to hold the phone down until the
   * headline reveal is complete.
   */
  riseStart?: number;
  riseEnd?: number;
}) {
  // Phone is hidden at page load and rises into view as the scroll
  // progresses. At peak `maxRisePercent` of the phone is visible.
  const phoneRiseLinear = clamp01((progress - riseStart) / (riseEnd - riseStart));
  const phoneRise = easeInOutCubic(phoneRiseLinear);
  const phoneTranslateY = 100 - phoneRise * maxRisePercent;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
      style={{
        transform: `translateY(${phoneTranslateY}%)`,
        willChange: "transform",
        zIndex: 10,
      }}
    >
      <div
        className="relative aspect-[671/1375] w-[clamp(260px,26vw,360px)]"
        style={{
          transform: `translateX(${shiftXPercent}%) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <img
          src="/iphone/Iphone.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full select-none"
          draggable={false}
        />

        <ChatScreen
          active={phoneRise > 0.05}
          chatProgress={chatProgress}
        />

        <img
          src="/iphone/Notch.png"
          alt=""
          aria-hidden
          className="absolute select-none"
          style={{
            top: `${NOTCH.top}%`,
            left: `${NOTCH.left}%`,
            width: `${NOTCH.width}%`,
            height: `${NOTCH.height}%`,
          }}
          draggable={false}
        />

        {/* Live recording indicator — sits inside the Dynamic Island so the
            phone reads as an active voice-coaching session, mirroring the
            reference UI's red dot. Halo + core for stronger presence at
            small render sizes. */}
        <span
          aria-hidden
          className="absolute"
          style={{
            top: `${NOTCH.top + NOTCH.height / 2}%`,
            left: "50%",
            width: "3%",
            aspectRatio: "1 / 1",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #FF3B30 0%, #FF3B30 35%, rgba(255,59,48,0.35) 70%, rgba(255,59,48,0) 100%)",
            animation: "chronologixListeningPulse 1.6s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

function ChatScreen({
  active,
  chatProgress,
}: {
  active: boolean;
  chatProgress: number;
}) {
  const m1T = clamp01((chatProgress - MILLIE_OPENING_WINDOW[0]) / (MILLIE_OPENING_WINDOW[1] - MILLIE_OPENING_WINDOW[0]));
  const youT = clamp01((chatProgress - YOU_REPLY_WINDOW[0]) / (YOU_REPLY_WINDOW[1] - YOU_REPLY_WINDOW[0]));
  const m2T = clamp01((chatProgress - MILLIE_FOLLOWUP_WINDOW[0]) / (MILLIE_FOLLOWUP_WINDOW[1] - MILLIE_FOLLOWUP_WINDOW[0]));
  const m3T = clamp01((chatProgress - MILLIE_LINER_WINDOW[0]) / (MILLIE_LINER_WINDOW[1] - MILLIE_LINER_WINDOW[0]));

  // Each bubble fades in once during its entry window and stays at
  // full opacity — no dulling cascade. The whole thread reads clearly
  // once it's landed.
  const m1Opacity = m1T;
  const youOpacity = youT;
  const m2Opacity = m2T;
  const m3Opacity = m3T;

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        top: `${SCREEN.top}%`,
        left: `${SCREEN.left}%`,
        width: `${SCREEN.width}%`,
        height: `${SCREEN.height}%`,
        borderRadius: SCREEN.radius,
        backgroundColor: "#FFFFFF",
        color: SCREEN_INK,
      }}
    >
      {active && (
        <div className="relative flex h-full flex-col">
          <StatusBar />
          <ChatHeader />

          <div className="flex flex-1 flex-col overflow-hidden px-3.5 pt-4 pb-2">
            <TimeDivider label={CHAT_TIME_LABEL} t={m1T} />
            <div className="mt-3 flex flex-col gap-1.5">
              <Bubble
                side="left"
                text={MILLIE_OPENING.text}
                t={m1T}
                opacity={m1Opacity}
              />
              <Bubble
                side="right"
                text={YOU_REPLY.text}
                t={youT}
                opacity={youOpacity}
              />
              <Bubble
                side="left"
                text={MILLIE_FOLLOWUP.text}
                t={m2T}
                opacity={m2Opacity}
              />
              <Bubble
                side="left"
                text={MILLIE_LINER.text}
                t={m3T}
                opacity={m3Opacity}
              />
            </div>
          </div>

          <SeeFullConversationPill />
          <ChatInput />
          <HomeIndicator />
        </div>
      )}
    </div>
  );
}

// ─── Phone chrome ───────────────────────────────────────────────────────────
// Status bar, header, avatar block, transcript messages, and input bar — the
// static iOS-style chrome that frames the animated conversation. Sized in %
// of the screen height so proportions stay correct as the phone scales
// between 260px (mobile) and 360px (desktop).

const SCREEN_INK = "#0F1115";
const INK_MUTED = "rgba(15,17,21,0.45)";
const DIVIDER = "rgba(15,17,21,0.08)";

function StatusBar() {
  // Flanks the Dynamic Island: 9:41 + a filled live-activity badge on the
  // left, signal/wifi/battery on the right.
  return (
    <div
      className="flex shrink-0 items-center justify-between px-5"
      style={{ height: "6.5%", paddingTop: "1.6%", color: SCREEN_INK }}
    >
      <span className="flex items-center gap-[5px]">
        <span className="text-[12px] font-semibold tracking-tight">9:41</span>
        <span
          aria-hidden
          className="relative inline-block"
          style={{
            width: "7px",
            height: "10px",
            background: SCREEN_INK,
            borderRadius: "2px",
          }}
        >
          <span
            className="absolute"
            style={{
              top: "1.5px",
              left: "1.5px",
              right: "1.5px",
              bottom: "3px",
              background: "#FFFFFF",
              borderRadius: "0.5px",
              opacity: 0.85,
            }}
          />
        </span>
      </span>
      <div className="flex items-center gap-[3px]">
        <SignalGlyph />
        <WifiGlyph />
        <BatteryGlyph />
      </div>
    </div>
  );
}

function ChatHeader() {
  return (
    <div
      className="relative flex shrink-0 items-center px-4 pb-2 pt-1.5"
      style={{ borderBottom: `1px solid ${DIVIDER}` }}
    >
      <svg
        aria-hidden
        className="absolute left-4 top-1/2 -translate-y-1/2"
        width="11"
        height="18"
        viewBox="0 0 11 18"
        fill="none"
        stroke={SCREEN_INK}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 2 2 9 9 16" />
      </svg>
      <div className="mx-auto flex flex-col items-center gap-[3px] leading-tight">
        <p
          className="text-[15px] font-bold tracking-[-0.01em]"
          style={{ color: SCREEN_INK }}
        >
          Millie
        </p>
        <span
          className="flex items-center gap-[5px] text-[11px] font-medium"
          style={{ color: INK_MUTED }}
        >
          <span
            aria-hidden
            className="inline-block h-[6px] w-[6px] rounded-full"
            style={{ background: "#22C55E" }}
          />
          Mental health coach
        </span>
      </div>
    </div>
  );
}

function TimeDivider({ label, t }: { label: string; t: number }) {
  if (t <= 0) return null;
  return (
    <div
      className="flex shrink-0 justify-center"
      style={{
        opacity: Math.min(1, t * 2),
        transition: "opacity 200ms ease-out",
      }}
    >
      <span
        className="text-[10.5px] font-medium tracking-[0.01em]"
        style={{ color: INK_MUTED }}
      >
        {label}
      </span>
    </div>
  );
}

type BubbleProps = {
  side: "left" | "right";
  text: string;
  t: number;
  opacity: number;
};

function Bubble({ side, text, t, opacity }: BubbleProps) {
  if (t <= 0) return null;
  const isLeft = side === "left";
  return (
    <div
      className={`flex w-full ${isLeft ? "justify-start" : "justify-end"}`}
      style={{
        opacity,
        transform: `translateY(${(1 - t) * 8}px)`,
        transition: "opacity 220ms ease-out",
        willChange: "opacity, transform",
      }}
    >
      <div
        className="max-w-[78%] rounded-[18px] px-[11px] py-[7px] text-[13px] leading-[1.42] tracking-[-0.005em]"
        style={
          isLeft
            ? {
                background: "#F2F2F4",
                color: SCREEN_INK,
                borderBottomLeftRadius: 6,
              }
            : {
                background: "#F9904D",
                color: "#FFFFFF",
                borderBottomRightRadius: 6,
              }
        }
      >
        {text}
      </div>
    </div>
  );
}

function SeeFullConversationPill() {
  return (
    <div
      className="flex shrink-0 justify-center px-4 pb-2 pt-2.5"
      style={{ borderTop: `1px solid ${DIVIDER}` }}
    >
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-[4px] text-[12px] font-medium"
        style={{
          background: "rgba(15,17,21,0.03)",
          border: `1px solid ${DIVIDER}`,
          color: SCREEN_INK,
        }}
      >
        See full conversation
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="9 2 14 2 14 7" />
          <polyline points="7 14 2 14 2 9" />
          <line x1="14" y1="2" x2="9" y2="7" />
          <line x1="2" y1="14" x2="7" y2="9" />
        </svg>
      </span>
    </div>
  );
}

function ChatInput() {
  return (
    <div
      className="flex shrink-0 items-center gap-2.5 px-4 pt-1 pb-2"
      style={{ background: "#FFFFFF" }}
    >
      <span
        className="flex shrink-0 items-center justify-center"
        style={{ width: "22px", height: "22px", color: SCREEN_INK }}
        aria-hidden
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
      <div
        className="flex flex-1 items-center rounded-2xl px-3.5 py-2 text-[13.5px]"
        style={{
          background: "rgba(15,17,21,0.05)",
          color: INK_MUTED,
        }}
      >
        Ask anything
      </div>
      <span
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: "26px",
          height: "26px",
          background: "rgba(15,17,21,0.1)",
        }}
        aria-hidden
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="rgba(255,255,255,0.96)"
          aria-hidden
          style={{ transform: "translate(-0.5px, 0.5px) rotate(-45deg)" }}
        >
          <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
        </svg>
      </span>
      <span
        className="flex shrink-0 items-center justify-center"
        style={{ width: "22px", height: "22px", color: SCREEN_INK }}
        aria-hidden
      >
        <svg width="14" height="16" viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v10a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 12v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="21" x2="12" y2="26" />
        </svg>
      </span>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="flex shrink-0 justify-center pt-0.5 pb-1.5">
      <span
        aria-hidden
        className="block rounded-full"
        style={{ width: "36%", height: "4px", background: SCREEN_INK }}
      />
    </div>
  );
}

function SignalGlyph() {
  return (
    <svg width="11" height="7" viewBox="0 0 18 11" fill="currentColor" aria-hidden>
      <rect x="0" y="7" width="3" height="4" rx="0.6" />
      <rect x="5" y="5" width="3" height="6" rx="0.6" />
      <rect x="10" y="2.5" width="3" height="8.5" rx="0.6" />
      <rect x="15" y="0" width="3" height="11" rx="0.6" />
    </svg>
  );
}

function WifiGlyph() {
  return (
    <svg width="10" height="7" viewBox="0 0 16 11" fill="currentColor" aria-hidden>
      <path d="M8 2.2c2.6 0 5.1 1 7 2.8l-1.4 1.4c-1.5-1.5-3.5-2.3-5.6-2.3s-4.1.8-5.6 2.3L1 5C2.9 3.2 5.4 2.2 8 2.2z" opacity="0.5" />
      <path d="M8 5.4c1.7 0 3.3.7 4.5 1.9l-1.4 1.4c-.8-.8-1.9-1.3-3.1-1.3s-2.3.5-3.1 1.3L3.5 7.3C4.7 6.1 6.3 5.4 8 5.4z" opacity="0.8" />
      <circle cx="8" cy="9.4" r="1.4" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg width="16" height="8" viewBox="0 0 24 12" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.55" />
      <rect x="22" y="3.5" width="1.8" height="5" rx="0.6" fill="currentColor" fillOpacity="0.55" />
      <rect x="2" y="2" width="17" height="8" rx="1.4" fill="currentColor" />
    </svg>
  );
}

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
