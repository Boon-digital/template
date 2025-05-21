import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client/live';
import { settingsQuery } from '@/lib/sanity/queries/queries';
import Logo from '../icons/Logo';
import NavBar from './NavBar';

export default async function Header() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
  });

  if (!settings) {
    return null;
  }

  return (
    <header className="header">
      <div className="container header__container">
        <div className="header__logo-container">
          {typeof settings.title !== undefined && (
            <Link className="header__link" href="/">
              <div className="header__logo">
                <Logo />
              </div>
              <span className="header__title">{settings.title}</span>
            </Link>
          )}
        </div>
        <NavBar menuItems={settings.menu || []} />
      </div>
    </header>
  );
}
