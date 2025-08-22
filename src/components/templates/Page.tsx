export default function Page({
  title,
  children,
}: {
  title?: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="page">
      {title ? <h1 className="page__title">{title}</h1> : null}
      {children}
    </div>
  );
}
