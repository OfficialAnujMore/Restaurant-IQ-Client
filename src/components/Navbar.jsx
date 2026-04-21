import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandMark from './BrandMark.jsx';

function NavbarAction({ item, className = '', onActivate }) {
  const {
    label,
    to,
    onClick,
    type = 'link',
    className: itemClassName = '',
  } = item;

  const mergedClassName = `${itemClassName} ${className}`.trim();

  if (type === 'text') {
    return <span className={mergedClassName}>{label}</span>;
  }

  if (type === 'button') {
    return (
      <button
        type="button"
        onClick={() => {
          onClick?.();
          onActivate?.();
        }}
        className={mergedClassName}
      >
        {label}
      </button>
    );
  }

  return (
    <Link
      to={to}
      onClick={() => onActivate?.()}
      className={mergedClassName}
    >
      {label}
    </Link>
  );
}

export default function Navbar({
  brandTo = '/',
  brandTextClassName = 'text-white',
  containerClassName = 'relative z-10',
  wrapperClassName = 'mx-auto flex max-w-6xl items-center justify-between px-6 py-4',
  navClassName = 'border-b border-white/50 bg-[linear-gradient(90deg,rgba(7,89,133,0.72)_0%,rgba(8,145,178,0.58)_52%,rgba(236,254,255,0.42)_100%)] backdrop-blur-xl',
  desktopCenter,
  mobilePanel,
  rightItems = [],
  mobileMenuItems = [],
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasMobileMenu = mobileMenuItems.length > 0;

  return (
    <nav className={`${containerClassName} ${navClassName}`.trim()}>
      <div className={wrapperClassName}>
        <Link to={brandTo} className="flex items-center gap-3">
          <BrandMark />
          <span className={`text-base font-semibold tracking-[-0.02em] ${brandTextClassName}`.trim()}>
            RestaurantIQ
          </span>
        </Link>

        {desktopCenter}

        <div className="hidden items-center gap-3 md:flex">
          {rightItems.map((item) => (
            <NavbarAction key={item.label} item={item} />
          ))}
        </div>

        {hasMobileMenu && (
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white transition hover:bg-white/16 md:hidden"
            aria-label="Toggle menu"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
            </span>
          </button>
        )}
      </div>

      {hasMobileMenu && menuOpen && (
        <div className="border-t border-white/20 bg-[rgba(14,116,144,0.38)] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {mobileMenuItems.map((item) => (
              <NavbarAction
                key={item.label}
                item={item}
                onActivate={() => setMenuOpen(false)}
                className={item.mobileClassName}
              />
            ))}
          </div>
        </div>
      )}

      {mobilePanel}
    </nav>
  );
}
