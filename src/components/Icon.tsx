import type { ReactElement, SVGProps } from "react";

const P: Record<string, ReactElement> = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  home: <><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="M16 16l4 4" /></>,
  layers: <><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></>,
  sliders: <><path d="M4 8h9M19 8h1M4 16h1M11 16h9" /><circle cx="16" cy="8" r="2.4" /><circle cx="8" cy="16" r="2.4" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5" /></>,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  play: <path d="M8 5l11 7-11 7z" fill="currentColor" />,
  pause: <><rect x="7" y="5" width="3.4" height="14" rx="1" fill="currentColor" /><rect x="13.6" y="5" width="3.4" height="14" rx="1" fill="currentColor" /></>,
  replay: <><path d="M4 12a8 8 0 1 0 2.6-5.9" /><path d="M4 4v5h5" /></>,
  print: <><path d="M7 9V4h10v5" /><path d="M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" /><path d="M7 14h10v6H7z" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.01" /></>,
  book: <><path d="M5 5a2 2 0 0 1 2-2h12v16H7a2 2 0 0 0-2 2z" /><path d="M5 19V5" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></>,
  shield: <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />,
  bolt: <path d="M13 3L5 14h6l-1 7 8-11h-6z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chat: <path d="M4 5h16v11H9l-4 4V5z" />,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <><path d="M5 7h14M9 7V4h6v3" /><path d="M7 7l1 13h8l1-13" /></>,
  star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c1.2-4 4.2-6 8-6s6.8 2 8 6" /></>,
  users: <><circle cx="9" cy="8.5" r="3.3" /><path d="M2.5 19c.9-3.3 3.3-5 6.5-5s5.6 1.7 6.5 5" /><circle cx="17" cy="9.5" r="2.6" /><path d="M17 14c2.6 0 4.2 1.4 4.8 4" /></>,
  pencil: <path d="M4 20l1-4 11-11 3 3L8 19z" />,
  flip: <><path d="M4 12a8 8 0 0 1 14-5" /><path d="M20 4v5h-5" /><path d="M20 12a8 8 0 0 1-14 5" /><path d="M4 20v-5h5" /></>,
  sparkles: <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />,
  flag: <path d="M5 21V4M5 5h11l-2 4 2 4H5" />,
  wind: <path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h7" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  text: <path d="M4 19l5-14 5 14M6 14h6M16 19l2.5-7 2.5 7M17 17h3" />,
  share: <><circle cx="6" cy="12" r="2.4" /><circle cx="17" cy="6" r="2.4" /><circle cx="17" cy="18" r="2.4" /><path d="M8.2 11l6.6-3.8M8.2 13l6.6 3.8" /></>,
  save: <><path d="M5 4h11l3 3v13H5z" /><path d="M8 4v5h7V4M8 20v-6h8v6" /></>,
};

export type IconName = keyof typeof P;

export function Icon({ name, size = 22, className, ...rest }: { name: IconName; size?: number; className?: string } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
      className={"icon" + (className ? " " + className : "")} aria-hidden="true" focusable="false" {...rest}>
      {P[name]}
    </svg>
  );
}

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" className="brandmark">
      <rect x="9" y="14" width="8" height="36" rx="4" fill="var(--b1)" />
      <rect x="19.5" y="22" width="8" height="28" rx="4" fill="var(--b2)" />
      <rect x="30" y="10" width="8" height="40" rx="4" fill="var(--b3)" />
      <rect x="40.5" y="26" width="8" height="24" rx="4" fill="var(--b4)" />
      <rect x="51" y="18" width="5" height="32" rx="2.5" fill="var(--b5)" />
    </svg>
  );
}
