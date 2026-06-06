'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',       label: 'Dashboard', icon: '⊞' },
  { href: '/page1',  label: 'Node / 01',  icon: '▲' },
  { href: '/page2',  label: 'Node / 02',  icon: '■' },
  { href: '/page3',  label: 'Node / 03',  icon: '●' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <div className="nav-logo">
        CTRL<span>.</span>SYS
      </div>
      {links.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`nav-link${pathname === href ? ' active' : ''}`}
        >
          <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>{icon}</span>
          {label}
        </Link>
      ))}
      <div style={{ marginTop: 'auto', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', padding: '0 0.75rem' }}>
        SYS.VER 1.0.0
      </div>
    </nav>
  );
}
