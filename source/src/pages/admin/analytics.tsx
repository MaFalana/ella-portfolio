import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
  };
  topPages: Array<{
    page: string;
    views: number;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    percentage: number;
    color: string;
  }>;
  recentActivity: Array<{
    timestamp: string;
    event: string;
    page: string;
    location: string;
  }>;
}

export default function AdminAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    overview: {
      totalViews: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      bounceRate: 0,
      avgSessionDuration: '0:00'
    },
    topPages: [],
    trafficSources: [],
    deviceBreakdown: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Simplified analytics - real data would come from actual analytics service
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAnalytics({
        overview: {
          totalViews: 1247,
          uniqueVisitors: 892,
          pageViews: 2134,
          bounceRate: 35,
          avgSessionDuration: '3:24'
        },
        topPages: [
          { page: '/', views: 547, percentage: 45 },
          { page: '#gallery', views: 298, percentage: 25 },
          { page: '#about', views: 178, percentage: 15 },
          { page: '#contact', views: 124, percentage: 10 },
          { page: '#testimonials', views: 62, percentage: 5 }
        ],
        trafficSources: [
          { source: 'Direct', visitors: 356, percentage: 40 },
          { source: 'Google Search', visitors: 267, percentage: 30 },
          { source: 'Social Media', visitors: 178, percentage: 20 },
          { source: 'Referrals', visitors: 89, percentage: 10 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', percentage: 55, color: '#667eea' },
          { device: 'Mobile', percentage: 35, color: '#ed8936' },
          { device: 'Tablet', percentage: 10, color: '#48bb78' }
        ],
        recentActivity: [
          { timestamp: '5 min ago', event: 'Page View', page: 'Gallery', location: 'US' },
          { timestamp: '12 min ago', event: 'Contact Form', page: 'Contact', location: 'UK' },
          { timestamp: '18 min ago', event: 'Page View', page: 'About', location: 'CA' },
          { timestamp: '25 min ago', event: 'Page View', page: 'Home', location: 'AU' }
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRanges = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' }
  ];

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="admin-analytics">
        {/* Header */}
        <header className="analytics-header">
          <div className="header-content">
            <div className="header-left">
              <button onClick={() => router.push('/admin')} className="back-btn">
                ← Back to Dashboard
              </button>
              <h1>Site Analytics</h1>
              <p>Track your portfolio performance and visitor insights</p>
            </div>
            <div className="header-right">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="time-range-select"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Analytics Content */}
        <main className="analytics-main">
          
          {/* Overview Stats */}
          <section className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Views</h3>
                  <span className="stat-trend positive">+12%</span>
                </div>
                <div className="stat-value">{analytics.overview.totalViews.toLocaleString()}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Unique Visitors</h3>
                  <span className="stat-trend positive">+8%</span>
                </div>
                <div className="stat-value">{analytics.overview.uniqueVisitors.toLocaleString()}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Page Views</h3>
                  <span className="stat-trend positive">+15%</span>
                </div>
                <div className="stat-value">{analytics.overview.pageViews.toLocaleString()}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Bounce Rate</h3>
                  <span className="stat-trend negative">-5%</span>
                </div>
                <div className="stat-value">{analytics.overview.bounceRate}%</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Avg. Session</h3>
                  <span className="stat-trend positive">+3%</span>
                </div>
                <div className="stat-value">{analytics.overview.avgSessionDuration}</div>
              </div>
            </div>
          </section>

          <div className="analytics-grid">
            
            {/* Top Pages */}
            <section className="analytics-card">
              <h2>Top Pages</h2>
              <div className="pages-list">
                {analytics.topPages.map((page) => (
                  <div key={page.page} className="page-item">
                    <div className="page-info">
                      <span className="page-name">{page.page === '/' ? 'Home' : page.page}</span>
                      <span className="page-views">{page.views.toLocaleString()} views</span>
                    </div>
                    <div className="page-bar">
                      <div 
                        className="page-bar-fill" 
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                    <span className="page-percentage">{page.percentage}%</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Traffic Sources */}
            <section className="analytics-card">
              <h2>Traffic Sources</h2>
              <div className="sources-list">
                {analytics.trafficSources.map((source) => (
                  <div key={source.source} className="source-item">
                    <div className="source-info">
                      <span className="source-name">{source.source}</span>
                      <span className="source-visitors">{source.visitors.toLocaleString()} visitors</span>
                    </div>
                    <div className="source-bar">
                      <div 
                        className="source-bar-fill" 
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <span className="source-percentage">{source.percentage}%</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Device Breakdown */}
            <section className="analytics-card">
              <h2>Device Breakdown</h2>
              <div className="device-chart">
                <div className="chart-container">
                  <div className="pie-chart">
                    {analytics.deviceBreakdown.map((device, index) => (
                      <div
                        key={device.device}
                        className="pie-slice"
                        style={{
                          background: `conic-gradient(${device.color} 0deg ${device.percentage * 3.6}deg, transparent ${device.percentage * 3.6}deg 360deg)`,
                          transform: `rotate(${analytics.deviceBreakdown.slice(0, index).reduce((acc, d) => acc + d.percentage * 3.6, 0)}deg)`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="device-legend">
                  {analytics.deviceBreakdown.map((device) => (
                    <div key={device.device} className="legend-item">
                      <div 
                        className="legend-color" 
                        style={{ backgroundColor: device.color }}
                      ></div>
                      <span className="legend-label">{device.device}</span>
                      <span className="legend-percentage">{device.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="analytics-card">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <div className="activity-main">
                        <span className="activity-event">{activity.event}</span>
                        <span className="activity-page">on {activity.page}</span>
                      </div>
                      <div className="activity-meta">
                        <span className="activity-time">{activity.timestamp}</span>
                        <span className="activity-location">{activity.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        <style jsx>{`
          .admin-analytics {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .analytics-header {
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

          .back-btn {
            background: none;
            border: none;
            color: white;
            font-weight: 500;
            cursor: pointer;
            margin-bottom: 0.5rem;
            transition: color 0.3s ease;
            opacity: 0.9;
          }

          .back-btn:hover {
            opacity: 1;
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

          .time-range-select {
            padding: 0.5rem 1rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            font-weight: 500;
            cursor: pointer;
            font-size: 0.875rem;
          }

          .analytics-main {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1.5rem;
          }

          .overview-section {
            margin-bottom: 1.5rem;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
          }

          .stat-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 1.25rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .stat-header h3 {
            margin: 0;
            color: #718096;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .stat-trend {
            font-size: 0.8rem;
            font-weight: 500;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
          }

          .stat-trend.positive {
            background: #c6f6d5;
            color: #22543d;
          }

          .stat-trend.negative {
            background: #fed7d7;
            color: #742a2a;
          }

          .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #2d3748;
          }

          .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 1.5rem;
          }

          .analytics-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 1.5rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .analytics-card h2 {
            margin: 0 0 1rem 0;
            color: #2d3748;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .pages-list, .sources-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .page-item, .source-item {
            display: grid;
            grid-template-columns: 1fr auto 60px;
            align-items: center;
            gap: 1rem;
          }

          .page-info, .source-info {
            display: flex;
            flex-direction: column;
          }

          .page-name, .source-name {
            font-weight: 500;
            color: #2d3748;
          }

          .page-views, .source-visitors {
            font-size: 0.875rem;
            color: #718096;
          }

          .page-bar, .source-bar {
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
          }

          .page-bar-fill, .source-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
          }

          .page-percentage, .source-percentage {
            text-align: right;
            font-weight: 500;
            color: #4a5568;
            font-size: 0.875rem;
          }

          .device-chart {
            display: flex;
            align-items: center;
            gap: 2rem;
          }

          .chart-container {
            position: relative;
            width: 120px;
            height: 120px;
          }

          .pie-chart {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: relative;
            background: #e2e8f0;
          }

          .device-legend {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
          }

          .legend-label {
            flex: 1;
            color: #4a5568;
            font-weight: 500;
          }

          .legend-percentage {
            color: #718096;
            font-weight: 500;
          }

          .activity-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .activity-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
          }

          .activity-dot {
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 50%;
            margin-top: 6px;
            flex-shrink: 0;
          }

          .activity-content {
            flex: 1;
          }

          .activity-main {
            margin-bottom: 0.25rem;
          }

          .activity-event {
            font-weight: 500;
            color: #2d3748;
          }

          .activity-page {
            color: #667eea;
            margin-left: 0.5rem;
          }

          .activity-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.875rem;
            color: #718096;
          }

          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.2);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
              gap: 0.75rem;
              text-align: center;
              padding: 0 1rem;
            }

            .analytics-main {
              padding: 1rem;
            }

            .stats-grid {
              grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            }

            .analytics-grid {
              grid-template-columns: 1fr;
            }

            .device-chart {
              flex-direction: column;
              text-align: center;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}