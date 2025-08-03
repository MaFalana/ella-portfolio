import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  enableGallery: boolean;
  enableTestimonials: boolean;
  enableContact: boolean;
  enableBooking: boolean;
  enableResume: boolean;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  socialMedia: {
    linkedin: string;
    instagram: string;
    twitter: string;
    facebook: string;
  };
  integrations: {
    calendlyUrl: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export default function AdminSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Ella Beardsley Portfolio',
    siteDescription: 'Art Therapist & Creative Professional',
    enableGallery: true,
    enableTestimonials: true,
    enableContact: true,
    enableBooking: false,
    enableResume: true,
    maintenanceMode: false,
    analyticsEnabled: true,
    socialMedia: {
      linkedin: '',
      instagram: '',
      twitter: '',
      facebook: ''
    },
    integrations: {
      calendlyUrl: 'https://calendly.com/ella-beardsley'
    },
    theme: {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      fontFamily: 'Hk Grotesk'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const fetchedSettings = await response.json();
        setSettings(fetchedSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Settings updated successfully!');
      } else {
        console.error('Failed to save settings');
        alert('Error saving settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      setSettings({
        siteName: 'Ella Beardsley Portfolio',
        siteDescription: 'Art Therapist & Creative Professional',
        enableGallery: true,
        enableTestimonials: true,
        enableContact: true,
        enableBooking: false,
        enableResume: true,
        maintenanceMode: false,
        analyticsEnabled: true,
        socialMedia: {
          linkedin: '',
          instagram: '',
          twitter: '',
          facebook: ''
        },
        integrations: {
          calendlyUrl: 'https://calendly.com/ella-beardsley'
        },
        theme: {
          primaryColor: '#667eea',
          secondaryColor: '#764ba2',
          fontFamily: 'Hk Grotesk'
        }
      });
    }
  };

  const updateSocialMedia = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const updateIntegrations = (integration: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [integration]: value
      }
    }));
  };

  const updateTheme = (property: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [property]: value
      }
    }));
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="admin-settings">
        {/* Header */}
        <header className="settings-header">
          <div className="header-content">
            <div className="header-left">
              <button onClick={() => router.push('/admin')} className="back-btn">
                ← Back to Dashboard
              </button>
              <h1>Site Settings</h1>
              <p>Configure your portfolio preferences and features</p>
            </div>
            <div className="header-right">
              <button onClick={handleReset} className="btn-secondary">
                Reset to Defaults
              </button>
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </header>

        {/* Settings Form */}
        <main className="settings-main">
          <div className="settings-sections">
            
            {/* General Settings */}
            <section className="settings-section">
              <h2>General Settings</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    placeholder="Your Portfolio Name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Site Description</label>
                  <input
                    type="text"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    placeholder="Brief description of your work"
                  />
                </div>
              </div>
            </section>

            {/* Feature Toggles */}
            <section className="settings-section">
              <h2>Feature Settings</h2>
              <div className="toggle-grid">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <label>Gallery Section</label>
                    <p>Display your artwork portfolio</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.enableGallery}
                      onChange={(e) => setSettings(prev => ({ ...prev, enableGallery: e.target.checked }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <label>Testimonials Section</label>
                    <p>Show client testimonials and reviews</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.enableTestimonials}
                      onChange={(e) => setSettings(prev => ({ ...prev, enableTestimonials: e.target.checked }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <label>Contact Form</label>
                    <p>Allow visitors to send messages</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.enableContact}
                      onChange={(e) => setSettings(prev => ({ ...prev, enableContact: e.target.checked }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <label>Booking Calendar</label>
                    <p>Enable appointment scheduling</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.enableBooking}
                      onChange={(e) => setSettings(prev => ({ ...prev, enableBooking: e.target.checked }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <label>Resume Download</label>
                    <p>Provide downloadable resume/CV</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.enableResume}
                      onChange={(e) => setSettings(prev => ({ ...prev, enableResume: e.target.checked }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <label>Analytics Tracking</label>
                    <p>Enable visitor analytics and insights</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.analyticsEnabled}
                      onChange={(e) => setSettings(prev => ({ ...prev, analyticsEnabled: e.target.checked }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </section>

            {/* Social Media */}
            <section className="settings-section">
              <h2>Social Media Links</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    value={settings.socialMedia.linkedin}
                    onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div className="form-group">
                  <label>Instagram URL</label>
                  <input
                    type="url"
                    value={settings.socialMedia.instagram}
                    onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                
                <div className="form-group">
                  <label>Twitter URL</label>
                  <input
                    type="url"
                    value={settings.socialMedia.twitter}
                    onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourprofile"
                  />
                </div>
                
                <div className="form-group">
                  <label>Facebook URL</label>
                  <input
                    type="url"
                    value={settings.socialMedia.facebook}
                    onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                    placeholder="https://facebook.com/yourprofile"
                  />
                </div>
              </div>
            </section>

            {/* Third-Party Integrations */}
            <section className="settings-section">
              <h2>Third-Party Integrations</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Calendly Booking URL</label>
                  <input
                    type="url"
                    value={settings.integrations.calendlyUrl}
                    onChange={(e) => updateIntegrations('calendlyUrl', e.target.value)}
                    placeholder="https://calendly.com/your-username"
                  />
                  <p className="form-help">
                    Create a free Calendly account and paste your booking URL here. 
                    This will be used for the appointment booking section.
                  </p>
                </div>
              </div>
            </section>

            {/* Theme Customization */}
            <section className="settings-section">
              <h2>Theme Customization</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Primary Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={settings.theme.primaryColor}
                      onChange={(e) => updateTheme('primaryColor', e.target.value)}
                      className="color-input"
                    />
                    <input
                      type="text"
                      value={settings.theme.primaryColor}
                      onChange={(e) => updateTheme('primaryColor', e.target.value)}
                      placeholder="#667eea"
                      className="color-text"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Secondary Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                      className="color-input"
                    />
                    <input
                      type="text"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                      placeholder="#764ba2"
                      className="color-text"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Font Family</label>
                  <select
                    value={settings.theme.fontFamily}
                    onChange={(e) => updateTheme('fontFamily', e.target.value)}
                  >
                    <option value="Hk Grotesk">Hk Grotesk</option>
                    <option value="Jost">Jost</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Maintenance Mode */}
            <section className="settings-section maintenance-section">
              <div className="maintenance-warning">
                <h2>⚠️ Maintenance Mode</h2>
                <p>
                  When enabled, your site will show a maintenance page to visitors. 
                  Only administrators can access the site while maintenance mode is active.
                </p>
                <label className="toggle-switch maintenance-toggle">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                  />
                  <span className="slider"></span>
                  <span className="toggle-label">
                    {settings.maintenanceMode ? 'Maintenance Mode ON' : 'Maintenance Mode OFF'}
                  </span>
                </label>
              </div>
            </section>
          </div>
        </main>

        <style jsx>{`
          .admin-settings {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .settings-header {
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

          .header-right {
            display: flex;
            gap: 0.75rem;
          }

          .btn-primary, .btn-secondary {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.875rem;
          }

          .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .btn-primary:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.3);
          }

          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .btn-secondary {
            background: rgba(239, 68, 68, 0.8);
            color: white;
          }

          .btn-secondary:hover {
            background: rgba(239, 68, 68, 1);
          }

          .settings-main {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1.5rem;
          }

          .settings-sections {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .settings-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .settings-section h2 {
            margin: 0 0 1rem 0;
            color: #2d3748;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-group label {
            margin-bottom: 0.5rem;
            color: #4a5568;
            font-weight: 500;
          }

          .form-group input,
          .form-group select {
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }

          .form-group input:focus,
          .form-group select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          .form-help {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: #718096;
            line-height: 1.4;
          }

          .color-input-wrapper {
            display: flex;
            gap: 0.5rem;
          }

          .color-input {
            width: 60px;
            height: 42px;
            padding: 0;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            cursor: pointer;
          }

          .color-text {
            flex: 1;
          }

          .toggle-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .toggle-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
          }

          .toggle-info label {
            font-weight: 500;
            color: #2d3748;
            margin: 0;
          }

          .toggle-info p {
            margin: 0.25rem 0 0 0;
            color: #718096;
            font-size: 0.875rem;
          }

          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
          }

          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
          }

          .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }

          input:checked + .slider {
            background-color: #667eea;
          }

          input:checked + .slider:before {
            transform: translateX(26px);
          }

          .maintenance-section {
            border: 2px solid #fed7d7;
            background: #fef5e7;
          }

          .maintenance-warning h2 {
            color: #c53030;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .maintenance-warning p {
            color: #744210;
            margin-bottom: 1rem;
          }

          .maintenance-toggle {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .toggle-label {
            font-weight: 500;
            color: #2d3748;
          }

          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
              gap: 0.75rem;
              text-align: center;
              padding: 0 1rem;
            }

            .header-right {
              flex-direction: column;
              width: 100%;
            }

            .settings-main {
              padding: 1rem;
            }

            .form-grid {
              grid-template-columns: 1fr;
            }

            .toggle-item {
              flex-direction: column;
              gap: 1rem;
              text-align: center;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}