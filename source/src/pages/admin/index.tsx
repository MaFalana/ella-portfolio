import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import data from '@/Ella.json';

interface DashboardStats {
  galleryItems: number;
  totalViews: number;
  lastUpdated: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    galleryItems: 0,
    totalViews: 0,
    lastUpdated: new Date().toLocaleDateString()
  });

  useEffect(() => {
    // Fetch dashboard statistics
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/server');
      const galleryData = await response.json();
      
      setStats({
        galleryItems: galleryData.length || data.Art.length,
        totalViews: Math.floor(Math.random() * 1000) + 500, // Placeholder
        lastUpdated: new Date().toLocaleDateString()
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="admin-dashboard">
        {/* Admin Header */}
        <header className="admin-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Admin Dashboard</h1>
              <p>Welcome back, {user?.email}</p>
            </div>
            <div className="header-right">
              <button onClick={() => router.push('/')} className="btn-secondary">
                View Site
              </button>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-main">
          
          {/* Top Section - Stats and Quick Info */}
          <div className="top-section">
            <section className="stats-section">
              <h2>📊 Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🖼️</div>
                  <div className="stat-content">
                    <h3>{stats.galleryItems}</h3>
                    <p>Gallery Items</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">👀</div>
                  <div className="stat-content">
                    <h3>{stats.totalViews}</h3>
                    <p>Total Views</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <h3>{stats.lastUpdated}</h3>
                    <p>Last Updated</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="quick-info">
              <h2>ℹ️ Quick Info</h2>
              <div className="info-item">
                <span className="info-label">Portfolio Status</span>
                <span className="info-value">🟢 Live</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gallery Items</span>
                <span className="info-value">{stats.galleryItems} artworks</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Login</span>
                <span className="info-value">Today</span>
              </div>
              <div className="info-item">
                <span className="info-label">Maintenance</span>
                <span className="info-value">🟢 Normal</span>
              </div>
            </section>
          </div>

          {/* Bottom Section - Actions and Activity */}
          <div className="bottom-section">
            <section className="actions-section">
              <h2>🚀 Quick Actions</h2>
              <div className="actions-grid">
                <div className="action-card" onClick={() => router.push('/admin/gallery')}>
                  <div className="action-icon">🎨</div>
                  <h3>Gallery</h3>
                  <p>Manage artwork</p>
                </div>
                
                <div className="action-card" onClick={() => router.push('/admin/profile')}>
                  <div className="action-icon">👤</div>
                  <h3>Profile</h3>
                  <p>Update info</p>
                </div>
                
                <div className="action-card" onClick={() => router.push('/admin/settings')}>
                  <div className="action-icon">⚙️</div>
                  <h3>Settings</h3>
                  <p>Configure site</p>
                </div>
                
                <div className="action-card" onClick={() => router.push('/admin/analytics')}>
                  <div className="action-icon">📊</div>
                  <h3>Analytics</h3>
                  <p>View metrics</p>
                </div>
              </div>
            </section>

            <section className="activity-section">
              <h2>⚡ Recent Activity</h2>
              <div className="activity-item">
                <div className="activity-icon">🖼️</div>
                <div className="activity-content">
                  <p>Gallery updated</p>
                  <span>Added new artwork</span>
                </div>
                <div className="activity-time">2h</div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">👤</div>
                <div className="activity-content">
                  <p>Profile updated</p>
                  <span>Work experience</span>
                </div>
                <div className="activity-time">1d</div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">⚙️</div>
                <div className="activity-content">
                  <p>Settings changed</p>
                  <span>Contact info</span>
                </div>
                <div className="activity-time">3d</div>
              </div>

              <div className="activity-item">
                <div className="activity-icon">📧</div>
                <div className="activity-content">
                  <p>Contact received</p>
                  <span>New inquiry</span>
                </div>
                <div className="activity-time">5d</div>
              </div>
            </section>
          </div>
        </main>

        <style jsx>{`
          .admin-dashboard {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .admin-header {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .header-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-left h1 {
            margin: 0;
            font-size: 1.5rem;
            color: white;
            font-weight: 600;
          }

          .header-left p {
            margin: 0.25rem 0 0 0;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
          }

          .header-right {
            display: flex;
            gap: 0.75rem;
          }

          .btn-secondary, .btn-logout {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.875rem;
          }

          .btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .btn-logout {
            background: rgba(239, 68, 68, 0.8);
            color: white;
          }

          .btn-logout:hover {
            background: rgba(239, 68, 68, 1);
          }

          .dashboard-main {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1.5rem;
            display: grid;
            gap: 1.5rem;
          }

          .top-section {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
          }

          .stats-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .stats-section h2 {
            margin: 0 0 1rem 0;
            color: #2d3748;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }

          .stat-card {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            padding: 1rem;
            border-radius: 12px;
            text-align: center;
            transition: all 0.3s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .stat-icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }

          .stat-content h3 {
            margin: 0;
            font-size: 1.25rem;
            color: #2d3748;
            font-weight: 700;
          }

          .stat-content p {
            margin: 0.25rem 0 0 0;
            color: #718096;
            font-size: 0.8rem;
          }

          .quick-info {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .quick-info h2 {
            margin: 0 0 1rem 0;
            color: #2d3748;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #f1f5f9;
          }

          .info-item:last-child {
            border-bottom: none;
          }

          .info-label {
            color: #64748b;
            font-size: 0.875rem;
          }

          .info-value {
            color: #1e293b;
            font-weight: 600;
            font-size: 0.875rem;
          }

          .bottom-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }

          .actions-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .actions-section h2 {
            margin: 0 0 1rem 0;
            color: #2d3748;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .actions-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .action-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 1rem;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            color: white;
          }

          .action-card:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          }

          .action-icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }

          .action-card h3 {
            margin: 0 0 0.25rem 0;
            font-size: 0.9rem;
            font-weight: 600;
          }

          .action-card p {
            margin: 0;
            font-size: 0.75rem;
            opacity: 0.9;
            line-height: 1.3;
          }

          .activity-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .activity-section h2 {
            margin: 0 0 1rem 0;
            color: #2d3748;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .activity-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 0;
            border-bottom: 1px solid #f1f5f9;
          }

          .activity-item:last-child {
            border-bottom: none;
          }

          .activity-icon {
            font-size: 1rem;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            border-radius: 8px;
            flex-shrink: 0;
          }

          .activity-content {
            flex: 1;
          }

          .activity-content p {
            margin: 0;
            color: #1e293b;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .activity-content span {
            color: #64748b;
            font-size: 0.75rem;
          }

          .activity-time {
            color: #94a3b8;
            font-size: 0.75rem;
            flex-shrink: 0;
          }

          @media (max-width: 1024px) {
            .top-section {
              grid-template-columns: 1fr;
            }
            
            .bottom-section {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 768px) {
            .header-content {
              padding: 0 1rem;
              flex-direction: column;
              gap: 0.75rem;
              text-align: center;
            }

            .dashboard-main {
              padding: 1rem;
            }

            .stats-grid {
              grid-template-columns: 1fr;
            }

            .actions-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}