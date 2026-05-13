import { BottomNav } from '@/components/layout/BottomNav';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col">
      <main
        className="flex-1"
        style={{ paddingBottom: 'var(--bottom-nav-height)' }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
