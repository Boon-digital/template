// src/components/layout/Alert.tsx
import { sanityFetch } from '@/lib/sanity/client/live';
import { settingsQuery } from '@/lib/sanity/queries/queries';

export default async function Alert() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
  });

  // Don't render the alert if it's disabled or if there's no alert text
  if (!settings?.alertSettings?.enabled || !settings?.alertSettings?.text) {
    return null;
  }

  return (
    <div className="alert">
      <div className="container alert__container">
        {settings.alertSettings.text}{' '}
        {settings.alertSettings.linkText && settings.alertSettings.linkUrl && (
          <a href={settings.alertSettings.linkUrl} className="alert__link">
            {settings.alertSettings.linkText}
          </a>
        )}
      </div>
    </div>
  );
}
