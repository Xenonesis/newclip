import { Sidebar, TopBar } from '@/components/layout/Navigation';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

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
        id="main-content"
        className="dashboard-main"
        style={{ 
          marginLeft: '0',
          paddingTop: '64px', 
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div className="lg:ml-64">
          <div style={{ padding: '24px' }}>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
}
