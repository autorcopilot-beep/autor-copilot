import type { SVGProps } from "react";

/**
 * Bespoke duotone icon set for the "Estante" reading app.
 * Signature style: a soft filled accent shape (var(--icon-accent)) sits behind
 * a 1.8 stroke in currentColor. Each icon carries a `.sig` element that plays a
 * one-shot signature animation when its tab becomes active (see index.css).
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number; active?: boolean };

function Base({
  size = 18,
  active,
  className = "",
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`ic ${active ? "is-active" : ""} ${className}`}
      {...props}
    >
      {children}
    </svg>
  );
}

const ACCENT = "var(--icon-accent)";

// Logo — open book (used white-on-green, non-themed).
export function BookMark(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 6.5C10.2 5.2 7.8 4.8 5.5 5.2A1 1 0 0 0 4.7 6.2v10.4a1 1 0 0 0 1.2 1c2-.4 4.2 0 6.1 1.2" />
      <path d="M12 6.5c1.8-1.3 4.2-1.7 6.5-1.3a1 1 0 0 1 .8 1v10.4a1 1 0 0 1-1.2 1c-2-.4-4.2 0-6.1 1.2" />
      <path d="M12 6.5v12.3" />
    </Base>
  );
}

// Início — pitched roof accent + chimney; the door draws in on activate.
export function HomeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path className="acc" d="M12 3.6 20.2 10.4H3.8Z" fill={ACCENT} stroke="none" />
      <path d="M3.6 10.8 12 4l8.4 6.8" />
      <path d="M15.7 6.7V4.6h1.5v3.2" />
      <path d="M6.3 10.4v8a.9.9 0 0 0 .9.9h9.6a.9.9 0 0 0 .9-.9v-8" />
      <path
        className="sig"
        pathLength={1}
        d="M10 19.3v-4.1a.7.7 0 0 1 .7-.7h2.6a.7.7 0 0 1 .7.7v4.1"
      />
    </Base>
  );
}

// Biblioteca — two shelved books with spine labels + a filled leaning volume
// that straightens on activate.
export function LibraryIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 18.4h14" />
      <path d="M6.4 18.4V7.8a1 1 0 0 1 1-1h.9a1 1 0 0 1 1 1v10.6" />
      <path d="M9.9 18.4V6.6a1 1 0 0 1 1-1h.9a1 1 0 0 1 1 1v11.8" />
      <path d="M6.6 10.4h2.5" />
      <path d="M10.1 9.2h2.5" />
      <rect
        className="acc sig"
        x="12.7"
        y="6.6"
        width="2.6"
        height="11.8"
        rx="0.8"
        fill={ACCENT}
        transform="rotate(11 14 18.4)"
      />
    </Base>
  );
}

// Visão geral — filled area accent; the trend line draws itself on activate.
export function OverviewIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        className="acc"
        d="M6.6 15.4 10 11.6l2.6 2 4.4-5.4V17H6.6z"
        fill={ACCENT}
        stroke="none"
      />
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path className="sig" pathLength={1} d="m6.6 15.4 3.4-3.8 2.6 2 4.4-5.4" />
    </Base>
  );
}

// Editor — filled nib accent; the written underline draws on activate.
export function EditorIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        className="acc"
        d="M15.5 4.7 19.3 8.5l-2.1 2.1-3.8-3.8z"
        fill={ACCENT}
        stroke="none"
      />
      <path d="M15.5 4.7 19.3 8.5 9.6 18.2l-4.6 1 1-4.6z" />
      <path className="sig" pathLength={1} d="M5 20.6c1.4-1 2.8-1 4.2 0" />
    </Base>
  );
}

// Enciclopédia — bound reference book with a thick filled spine accent and a
// ribbon bookmark that draws in on activate.
export function EncyclopediaIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        className="acc"
        d="M8 4.6H7A1.6 1.6 0 0 0 5.4 6.2v11.6A1.6 1.6 0 0 0 7 19.4h1Z"
        fill={ACCENT}
        stroke="none"
      />
      <path d="M8 4.6h8.4a1 1 0 0 1 1 1v12.8a1 1 0 0 1-1 1H7A1.6 1.6 0 0 1 5.4 17.8V6.2A1.6 1.6 0 0 1 7 4.6h1" />
      <path d="M8 4.8V19.2" />
      <path d="M10.9 15.6h4.6" />
      <path
        className="sig"
        pathLength={1}
        d="M11.9 4.6v4.7l1.3-1.1 1.3 1.1V4.6"
      />
    </Base>
  );
}

// Som — filled ear cushions accent; the sound waves pulse while active.
export function SoundIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 13v-1a7 7 0 0 1 14 0v1" />
      <path
        className="acc"
        d="M4.8 13.2a1.4 1.4 0 0 1 1.6 1.4v3a1.4 1.4 0 0 1-2.8 0v-3a1.4 1.4 0 0 1 1.2-1.4M19.2 13.2a1.4 1.4 0 0 0-1.6 1.4v3a1.4 1.4 0 0 0 2.8 0v-3a1.4 1.4 0 0 0-1.2-1.4"
        fill={ACCENT}
        stroke="currentColor"
      />
      <path className="sig wave1" d="M11.5 9.5v5" />
      <path className="sig wave2" d="M14 8v8" />
    </Base>
  );
}

// Settings — filled knobs accent; the knobs glide on activate.
export function SettingsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7.5h9" />
      <path d="M17 7.5h3" />
      <path d="M4 16.5h3" />
      <path d="M11 16.5h9" />
      <circle className="acc sig knob-a" cx="15" cy="7.5" r="2.2" fill={ACCENT} />
      <circle className="acc sig knob-b" cx="9" cy="16.5" r="2.2" fill={ACCENT} />
    </Base>
  );
}

/* ---------- Editor toolbar icons (same duotone language) ---------- */

// Editor mode — outline list: filled bullets + rules.
export function OutlineIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect className="acc" x="4.5" y="5.6" width="3.2" height="3.2" rx="1" fill={ACCENT} />
      <rect className="acc" x="4.5" y="12.2" width="3.2" height="3.2" rx="1" fill={ACCENT} />
      <path d="M9.8 7.2h9.7" />
      <path d="M9.8 13.8h9.7" />
      <path d="M9.8 16.4h6.4" />
      <path d="M9.8 9.8h6.4" />
    </Base>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Base>
  );
}

// New document — page with folded corner accent + plus.
export function NewPageIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path className="acc" d="M13.5 3.5 18 8h-4.5z" fill={ACCENT} stroke="none" />
      <path d="M13.4 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h9.5A1.5 1.5 0 0 0 18 19V8z" />
      <path d="M13.4 3.5V8H18" />
      <path className="sig" pathLength={1} d="M11.7 11.8v4.4M9.5 14h4.4" />
    </Base>
  );
}

// Save — floppy disk with filled label area.
export function SaveIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 4.5h8.8L19.5 9.2V18A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5" />
      <path className="acc" d="M7.6 13.4h8.8v6.1H7.6z" fill={ACCENT} stroke="none" />
      <path d="M7.8 13.6h8.4v5.9" />
      <path d="M8.2 4.5v3.9h6V4.5" />
    </Base>
  );
}

// Panel toggles — rectangle with one filled column.
export function PanelLeftIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        className="acc"
        d="M4 7A2.5 2.5 0 0 1 6.5 4.5H9.2v15H6.5A2.5 2.5 0 0 1 4 17z"
        fill={ACCENT}
        stroke="none"
      />
      <rect x="4" y="4.5" width="16" height="15" rx="2.5" />
      <path d="M9.2 4.5v15" />
    </Base>
  );
}

export function PanelRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        className="acc"
        d="M20 7A2.5 2.5 0 0 0 17.5 4.5H14.8v15h2.7A2.5 2.5 0 0 0 20 17z"
        fill={ACCENT}
        stroke="none"
      />
      <rect x="4" y="4.5" width="16" height="15" rx="2.5" />
      <path d="M14.8 4.5v15" />
    </Base>
  );
}

// Canvas / reader — open book with page lines.
export function ReaderIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        className="acc"
        d="M12 6.6c-1.9-1.2-4.2-1.6-6.3-1.3v11.4c2.1-.3 4.4.1 6.3 1.3 1.9-1.2 4.2-1.6 6.3-1.3V5.3c-2.1-.3-4.4.1-6.3 1.3z"
        fill={ACCENT}
        stroke="none"
      />
      <path d="M12 6.6c-1.9-1.2-4.2-1.6-6.3-1.3a.6.6 0 0 0-.5.6v10.4a.6.6 0 0 0 .7.6c2-.3 4.2.1 6.1 1.2" />
      <path d="M12 6.6c1.9-1.2 4.2-1.6 6.3-1.3a.6.6 0 0 1 .5.6v10.4a.6.6 0 0 1-.7.6c-2-.3-4.2.1-6.1 1.2" />
      <path d="M12 6.6V18" />
    </Base>
  );
}

// Focus — corner brackets + center dot.
export function FocusIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.5 8V6.5A2 2 0 0 1 6.5 4.5H8" />
      <path d="M16 4.5h1.5a2 2 0 0 1 2 2V8" />
      <path d="M19.5 16v1.5a2 2 0 0 1-2 2H16" />
      <path d="M8 19.5H6.5a2 2 0 0 1-2-2V16" />
      <circle className="acc" cx="12" cy="12" r="2.4" fill={ACCENT} stroke="currentColor" />
    </Base>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="5.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle className="acc" cx="12" cy="12" r="1.6" fill={ACCENT} stroke="currentColor" strokeWidth={1.4} />
      <circle cx="18.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path className="sig" pathLength={1} d="m5 12.5 4.5 4.5L19 6.5" />
    </Base>
  );
}

// Theme toggle — a sun that morphs into a crescent.
export function ThemeIcon({ dark, ...props }: IconProps & { dark?: boolean }) {
  return (
    <Base {...props}>
      {dark ? (
        <path
          className="acc"
          d="M20 14.5A7.5 7.5 0 0 1 9.5 4 7.5 7.5 0 1 0 20 14.5z"
          fill={ACCENT}
          stroke="currentColor"
        />
      ) : (
        <>
          <circle className="acc" cx="12" cy="12" r="4" fill={ACCENT} stroke="currentColor" />
          <path d="M12 3v2M12 19v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M3 12h2M19 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5" />
        </>
      )}
    </Base>
  );
}
