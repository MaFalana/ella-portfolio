import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import data from '@/Ella.json';

interface SiteSettings {
    testimonialsEnabled: boolean;
    description: string;
    calendlyUrl: string;
    googleAnalyticsId: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [siteSettings, setSiteSettings] = useState<SiteSettings>({
        testimonialsEnabled: true,
        description: data.About || 'Welcome to my portfolio',
        calendlyUrl: '',
        googleAnalyticsId: ''
    });
    const [settingsLoading, setSettingsLoading] = useState(false);

    useEffect(() => {
        checkAuth();
        loadSiteSettings();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                setAuthenticated(true);
            } else {
                // Only redirect if we're not already on the login page
                if (router.pathname !== '/admin/login') {
                    router.replace('/admin/login');
                }
            }
        } catch (error) {
            // Only redirect if we're not already on the login page
            if (router.pathname !== '/admin/login') {
                router.replace('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/admin-logout', {
                method: 'POST',
                credentials: 'include'
            });
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const loadSiteSettings = async () => {
        try {
            const response = await fetch('/api/site-settings');
            if (response.ok) {
                const settings = await response.json();
                setSiteSettings(settings);
            }
        } catch (error) {
            console.error('Error loading site settings:', error);
        }
    };

    const updateSiteSettings = async (newSettings: Partial<SiteSettings>) => {
        setSettingsLoading(true);
        try {
            const updatedSettings = { ...siteSettings, ...newSettings };
            const response = await fetch('/api/site-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSettings),
                credentials: 'include'
            });
            
            if (response.ok) {
                setSiteSettings(updatedSettings);
            } else {
                throw new Error('Failed to update settings');
            }
        } catch (error) {
            console.error('Error updating site settings:', error);
            alert('Error updating settings. Please try again.');
        } finally {
            setSettingsLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading...</p>
                </div>
            </Layout>
        );
    }

    if (!authenticated) {
        return null; // Redirecting to login
    }

    return (
        <Layout>
            <div className="admin-dashboard">
                <div className="header">
                    <div className="header-content">
                        <h1>Dashboard</h1>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="content">
                    <div className="settings-section">
                        <h2>Quick Settings</h2>
                        
                        <div className="setting">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={siteSettings.testimonialsEnabled}
                                    onChange={(e) => updateSiteSettings({ testimonialsEnabled: e.target.checked })}
                                    disabled={settingsLoading}
                                />
                                Show testimonials on site
                            </label>
                        </div>
                        
                        <div className="setting">
                            <label>About me description:</label>
                            <textarea
                                value={siteSettings.description}
                                onChange={(e) => setSiteSettings(prev => ({ ...prev, description: e.target.value }))}
                                onBlur={() => updateSiteSettings({ description: siteSettings.description })}
                                placeholder="Enter a brief description about yourself..."
                                rows={4}
                                disabled={settingsLoading}
                            />
                        </div>
                    </div>

                    <div className="settings-section">
                        <h2>Integrations</h2>
                        
                        <div className="setting">
                            <label>Calendly booking URL:</label>
                            <input
                                type="url"
                                value={siteSettings.calendlyUrl}
                                onChange={(e) => setSiteSettings(prev => ({ ...prev, calendlyUrl: e.target.value }))}
                                onBlur={() => updateSiteSettings({ calendlyUrl: siteSettings.calendlyUrl })}
                                placeholder="https://calendly.com/your-username"
                                disabled={settingsLoading}
                            />
                            <small>Visitors can book appointments through this link</small>
                        </div>
                        
                        <div className="setting">
                            <label>Google Analytics ID:</label>
                            <input
                                type="text"
                                value={siteSettings.googleAnalyticsId}
                                onChange={(e) => setSiteSettings(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                                onBlur={() => updateSiteSettings({ googleAnalyticsId: siteSettings.googleAnalyticsId })}
                                placeholder="G-XXXXXXXXXX"
                                disabled={settingsLoading}
                            />
                            <small>Track website visitors (leave empty to disable)</small>
                        </div>
                    </div>

                    <div className="nav-section">
                        <h2>Manage</h2>
                        <div className="nav-grid">
                            <a href="/admin/profile" className="nav-item">
                                <h3>Profile</h3>
                                <p>Update personal info and experience</p>
                                <span className="count">{data.Employment?.length || 0} jobs, {data.Education?.length || 0} degrees</span>
                            </a>

                            <a href="/admin/gallery" className="nav-item">
                                <h3>Gallery</h3>
                                <p>Manage portfolio artwork</p>
                                <span className="count">{data.Art?.length || 0} pieces</span>
                            </a>


                            <a href="/admin/messages" className="nav-item">
                                <h3>Messages</h3>
                                <p>Contact form submissions</p>
                                <span className="count">View all</span>
                            </a>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .admin-dashboard {
                        min-height: 100vh;
                        background: #f5f5f5;
                    }

                    .header {
                        background: white;
                        border-bottom: 1px solid #ddd;
                        padding: 1rem 0;
                    }

                    .header-content {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 2rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .header h1 {
                        margin: 0;
                        color: #333;
                        font-size: 1.5rem;
                    }

                    .logout-btn {
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    }

                    .logout-btn:hover {
                        background: #c82333;
                    }

                    .content {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 2rem;
                    }

                    .settings-section {
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 2rem;
                        margin-bottom: 2rem;
                    }

                    .settings-section h2 {
                        margin: 0 0 1.5rem 0;
                        color: #333;
                        font-size: 1.2rem;
                    }

                    .setting {
                        margin-bottom: 1.5rem;
                    }

                    .setting label {
                        display: block;
                        margin-bottom: 0.5rem;
                        color: #555;
                        font-weight: 500;
                    }

                    .setting input[type="checkbox"] {
                        margin-right: 0.5rem;
                    }

                    .setting textarea {
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 0.9rem;
                        resize: vertical;
                        font-family: inherit;
                    }

                    .setting textarea:focus {
                        outline: none;
                        border-color: #667eea;
                    }

                    .setting input[type="url"],
                    .setting input[type="text"] {
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 0.9rem;
                        font-family: inherit;
                    }

                    .setting input:focus {
                        outline: none;
                        border-color: #667eea;
                    }

                    .setting small {
                        display: block;
                        margin-top: 0.5rem;
                        color: #999;
                        font-size: 0.8rem;
                    }

                    .nav-section h2 {
                        margin: 0 0 1rem 0;
                        color: #333;
                        font-size: 1.2rem;
                    }

                    .nav-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 1rem;
                    }

                    .nav-item {
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 1.5rem;
                        text-decoration: none;
                        color: inherit;
                        transition: border-color 0.2s;
                    }

                    .nav-item:hover {
                        border-color: #667eea;
                        text-decoration: none;
                        color: inherit;
                    }

                    .nav-item h3 {
                        margin: 0 0 0.5rem 0;
                        color: #333;
                        font-size: 1.1rem;
                    }

                    .nav-item p {
                        margin: 0 0 0.5rem 0;
                        color: #666;
                        font-size: 0.9rem;
                    }

                    .count {
                        font-size: 0.8rem;
                        color: #999;
                    }

                    @media (max-width: 768px) {
                        .content {
                            padding: 1rem;
                        }

                        .header-content {
                            padding: 0 1rem;
                        }

                        .nav-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                `}</style>
            </div>
        </Layout>
    );
}