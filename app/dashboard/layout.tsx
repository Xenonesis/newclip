import { Sidebar, TopBar } from '@/components/layout/Navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <TopBar />
      <main 
        className="dashboard-main"
        style={{ 
          marginLeft: '256px', 
          paddingTop: '64px', 
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
