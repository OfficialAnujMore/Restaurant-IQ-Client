export default function BrandMark({ className = '' }) {
  return (
    <div
      className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#0891b2_100%)] shadow-[0_18px_30px_rgba(8,145,178,0.22)] ${className}`.trim()}
      aria-hidden="true"
    >
      <span className="absolute left-[9px] top-[9px] h-2.5 w-2.5 rounded-full bg-white/95" />
      <span className="absolute right-[9px] top-[11px] h-2 w-2 rounded-full bg-cyan-100/95" />
      <span className="absolute bottom-[9px] left-1/2 h-2.5 w-5 -translate-x-1/2 rounded-full bg-white/90" />
      <span className="absolute bottom-[13px] left-1/2 h-1.5 w-6 -translate-x-1/2 rounded-full bg-cyan-200/80" />
    </div>
  );
}
