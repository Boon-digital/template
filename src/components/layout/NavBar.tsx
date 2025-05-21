'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SettingsQueryResult } from '@/sanity.types';
import { getLinkByLinkObject } from '@/lib/links';

export default function NavBar({
  menuItems,
}: {
  menuItems: NonNullable<NonNullable<SettingsQueryResult>['menu']>;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="navbar">
      {/* Desktop Navigation */}
      <div className="navbar__menu">
        <nav>
          <ul className="navbar__items">
            {menuItems.map((item) => (
              <li className="navbar__item" key={item._key}>
                {item.childMenu ? (
                  // Dropdown menu for items with children
                  <div>
                    <button className="navbar__dropdown-toggle">
                      {item.text}
                      <svg
                        className="navbar__dropdown-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div className="navbar__dropdown-menu">
                      {item.childMenu.map((child) => (
                        <Link
                          key={child._key}
                          href={child.link ? getLinkByLinkObject(child.link) || '#' : '#'}
                          className="navbar__dropdown-item"
                          {...(child.link?.openInNewTab
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {child.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Simple link for items without children
                  <Link
                    href={item.link ? getLinkByLinkObject(item.link) || '#' : '#'}
                    className="navbar__link"
                    {...(item.link?.openInNewTab
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {item.text}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <Link href={'/'} className="button button--primary">
            Get Started
          </Link>
          <Link href={'/'} className="button button--outline">
            Log In
          </Link>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button className="navbar__toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <svg
          className="navbar__toggle-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`navbar__mobile-menu ${
          isMobileMenuOpen ? 'navbar__mobile-menu--open' : 'navbar__mobile-menu--closed'
        }`}
      >
        <div className="navbar__mobile-menu-content">
          {menuItems.map((item) => (
            <div className="navbar__mobile-item" key={item._key}>
              {item.childMenu ? (
                // Parent item with children
                <>
                  <div className="navbar__mobile-dropdown">{item.text}</div>
                  <div className="navbar__mobile-dropdown-content">
                    {item.childMenu.map((child) => (
                      <Link
                        key={child._key}
                        href={child.link ? getLinkByLinkObject(child.link) || '#' : '#'}
                        className="navbar__mobile-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                        {...(child.link?.openInNewTab
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {child.text}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                // Single menu item
                <Link
                  href={item.link ? getLinkByLinkObject(item.link) || '#' : '#'}
                  className="navbar__mobile-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                  {...(item.link?.openInNewTab
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.text}
                </Link>
              )}
            </div>
          ))}
          <div className="navbar__mobile-actions">
            <Link href={'/'} className="button button--primary">
              Get Started
            </Link>
            <Link href={'/'} className="button button--outline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
