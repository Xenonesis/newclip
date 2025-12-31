import { Sidebar, TopBar } from '@/components/layout/Navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f' }}>
      <Sidebar />
      <TopBar />
      <main 
        style={{ 
          marginLeft: '256px', 
          paddingTop: '64px', 
          minHeight: '100vh',
          backgroundColor: '#0a0a0f'
        }}
      >
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
