import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

interface Employment {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  alignment: string;
}

interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface ArtPiece {
  id: string;
  title: string;
  description: string;
  height: number;
  width?: number;
  medium: string;
  url: string;
  img: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
}

interface AdminData {
  // Profile
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  headshot: string;
  blurb: string;
  
  // Employment & Education
  employment: Employment[];
  education: Education[];
  art: ArtPiece[];
  testimonials: Testimonial[];
  
  // Toggles
  showContactForm: boolean;
  showGallery: boolean;
  showAbout: boolean;
  showTestimonials: boolean;
  
  // Theme
  theme: ThemeSettings;
  
  // Social
  linkedinUrl: string;
  instagramUrl: string;
  githubUrl: string;
  etsyUrl: string;
  
  // Analytics (simple)
  googleAnalyticsId: string;
}

export default function Admin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<AdminData>({
    name: 'Ella Beardsley',
    title: 'Art Therapist',
    email: 'beardsleyella@gmail.com',
    phone: '',
    location: 'Indianapolis, IN',
    company: 'IU Health Methodist Hospital',
    headshot: '/assets/Grad-6.jpeg',
    blurb: 'I am a passionate art therapist dedicated to helping individuals heal through creative expression. My approach combines traditional therapeutic techniques with innovative artistic methods to create a safe space for emotional growth and self-discovery.',
    employment: [
      {
        title: 'Art Therapist',
        company: 'IU Health Methodist Hospital',
        location: 'Indianapolis, IN',
        startDate: 'August 2025',
        endDate: 'Present',
        alignment: 'flex-start'
      },
      {
        title: 'Art Therapy Intern',
        company: 'IU Health Methodist Hospital',
        location: 'Indianapolis, IN',
        startDate: 'August 2024',
        endDate: 'May 2025',
        alignment: 'flex-end'
      },
      {
        title: 'Art Therapy Intern',
        company: 'Centerstone Community Mental Health',
        location: 'Martinsville, IN',
        startDate: 'August 2023',
        endDate: 'May 2024',
        alignment: 'flex-start'
      },
      {
        title: 'University Teaching Assistant',
        company: 'Indiana University Psychology Department',
        location: 'Bloomington, IN',
        startDate: 'August 2021',
        endDate: 'May 2023',
        alignment: 'flex-end'
      }
    ],
    education: [
      {
        institution: 'Indiana University Indianapolis',
        degree: 'Master of Arts - MA, Art Therapy/Therapist',
        startDate: 'August 2023',
        endDate: 'May 2025'
      },
      {
        institution: 'Indiana University Bloomington',
        degree: 'Psychology, Substance Abuse/Addiction Counseling',
        startDate: 'August 2019',
        endDate: 'May 2023'
      }
    ],
    art: [],
    testimonials: [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Client',
        company: 'Mental Health Advocate',
        content: 'Ella\'s art therapy sessions have been transformative for my healing journey. Her compassionate approach and creative techniques helped me express emotions I couldn\'t put into words.',
        avatar: ''
      }
    ],
    showContactForm: true,
    showGallery: true,
    showAbout: true,
    showTestimonials: true,
    theme: {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      accentColor: '#48bb78',
      backgroundColor: '#ffffff',
      textColor: '#2d3748',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px'
    },
    linkedinUrl: 'https://www.linkedin.com/in/ella-beardsley-661b751b6/',
    instagramUrl: '',
    githubUrl: '',
    etsyUrl: '',
    googleAnalyticsId: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        setAuthenticated(true);
        loadData();
      } else {
        router.replace('/admin/login');
      }
    } catch (error) {
      router.replace('/admin/login');
    } finally {
      setAuthLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const response = await fetch('/api/profile', { credentials: 'include' });
      if (response.ok) {
        const profile = await response.json();
        setData(prev => ({ 
          ...prev, 
          ...profile,
          employment: profile.employment || prev.employment,
          education: profile.education || prev.education,
          testimonials: profile.testimonials || prev.testimonials,
          art: profile.art || prev.art,
          theme: profile.theme || prev.theme
        }));
      }
    } catch (error) {
      console.log('Using default data');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Settings saved!');
      } else {
        alert('Error saving. Try again.');
      }
    } catch (error) {
      alert('Error saving. Try again.');
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

  const update = (key: keyof AdminData, value: string | boolean) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const addEmployment = () => {
    const newJob: Employment = {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      alignment: 'flex-start'
    };
    setData(prev => ({ ...prev, employment: [...prev.employment, newJob] }));
  };

  const updateEmployment = (index: number, field: keyof Employment, value: string) => {
    setData(prev => ({
      ...prev,
      employment: prev.employment.map((job, i) => 
        i === index ? { ...job, [field]: value } : job
      )
    }));
  };

  const removeEmployment = (index: number) => {
    setData(prev => ({
      ...prev,
      employment: prev.employment.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      institution: '',
      degree: '',
      startDate: '',
      endDate: ''
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEducation] }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: '',
      role: '',
      company: '',
      content: '',
      avatar: ''
    };
    setData(prev => ({ ...prev, testimonials: [...prev.testimonials, newTestimonial] }));
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    setData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }));
  };

  const removeTestimonial = (index: number) => {
    setData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  const updateTheme = (field: keyof ThemeSettings, value: string) => {
    setData(prev => ({
      ...prev,
      theme: { ...prev.theme, [field]: value }
    }));
  };

  if (authLoading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="admin-container">
        {/* Modern Header with Gradient */}
        <div className="admin-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">⚡</div>
              <div>
                <h1>Portfolio Dashboard</h1>
                <p>Manage your professional presence</p>
              </div>
            </div>
            <div className="header-actions">
              <button onClick={handleSave} disabled={loading} className="btn-save">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Save Changes
                  </>
                )}
              </button>
              <button onClick={handleLogout} className="btn-logout">
                <span>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          
          {/* Profile Card */}
          <div className="card profile-card">
            <div className="card-header">
              <div className="section-icon">👤</div>
              <h2>Profile Information</h2>
            </div>
            <div className="card-content">
              <div className="profile-preview">
                <div className="avatar-preview">
                  {data.headshot ? (
                    <img src={data.headshot} alt="Profile" onError={(e) => {e.currentTarget.style.display = 'none'}} />
                  ) : (
                    <div className="avatar-placeholder">📸</div>
                  )}
                </div>
                <div className="profile-info-preview">
                  <h3>{data.name || 'Your Name'}</h3>
                  <p>{data.title || 'Your Title'}</p>
                  <small>{data.location || 'Your Location'}</small>
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Professional Title</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => update('title', e.target.value)}
                    placeholder="e.g., Art Therapist"
                  />
                </div>
                <div className="form-group">
                  <label>Current Company</label>
                  <input
                    type="text"
                    value={data.company}
                    onChange={(e) => update('company', e.target.value)}
                    placeholder="Your current workplace"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => update('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                <div className="form-group">
                  <label>Profile Image Path</label>
                  <input
                    type="text"
                    value={data.headshot}
                    onChange={(e) => update('headshot', e.target.value)}
                    placeholder="/assets/profile-image.jpg"
                  />
                </div>
                <div className="form-group full-width">
                  <label>About Me Blurb</label>
                  <textarea
                    value={data.blurb}
                    onChange={(e) => update('blurb', e.target.value)}
                    rows={4}
                    placeholder="Write a brief description about yourself and your work..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employment History */}
          <div className="card">
            <div className="card-header">
              <div className="section-icon">💼</div>
              <h2>Employment History</h2>
              <button onClick={addEmployment} className="btn-add">
                <span>+</span>
                Add Position
              </button>
            </div>
            <div className="card-content">
            {data.employment.map((job, index) => (
              <div key={index} className="item-card">
                <div className="item-header">
                  <div className="item-info">
                    <h3>{job.title || `Position #${index + 1}`}</h3>
                    <small>{job.company}</small>
                  </div>
                  <button onClick={() => removeEmployment(index)} className="btn-remove">
                    🗑️
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={job.title}
                      onChange={(e) => updateEmployment(index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={job.company}
                      onChange={(e) => updateEmployment(index, 'company', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={job.location}
                      onChange={(e) => updateEmployment(index, 'location', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="text"
                      value={job.startDate}
                      onChange={(e) => updateEmployment(index, 'startDate', e.target.value)}
                      placeholder="August 2023"
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="text"
                      value={job.endDate}
                      onChange={(e) => updateEmployment(index, 'endDate', e.target.value)}
                      placeholder="Present or May 2024"
                    />
                  </div>
                  <div className="form-group">
                    <label>Layout Alignment</label>
                    <select
                      value={job.alignment}
                      onChange={(e) => updateEmployment(index, 'alignment', e.target.value)}
                    >
                      <option value="flex-start">Left</option>
                      <option value="flex-end">Right</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <div className="card-header">
              <div className="section-icon">🎓</div>
              <h2>Education</h2>
              <button onClick={addEducation} className="btn-add">
                <span>+</span>
                Add Education
              </button>
            </div>
            <div className="card-content">
            {data.education.map((edu, index) => (
              <div key={index} className="item-card">
                <div className="item-header">
                  <div className="item-info">
                    <h3>{edu.degree || `Education #${index + 1}`}</h3>
                    <small>{edu.institution}</small>
                  </div>
                  <button onClick={() => removeEducation(index)} className="btn-remove">
                    🗑️
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      placeholder="August 2019"
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      placeholder="May 2023"
                    />
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Site Features */}
          <div className="card">
            <div className="card-header">
              <div className="section-icon">⚙️</div>
              <h2>Site Features</h2>
            </div>
            <div className="card-content">
              <div className="toggles">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={data.showContactForm}
                    onChange={(e) => update('showContactForm', e.target.checked)}
                  />
                  <span className="toggle-switch"></span>
                  Show Contact Form
                </label>
                
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={data.showGallery}
                    onChange={(e) => update('showGallery', e.target.checked)}
                  />
                  <span className="toggle-switch"></span>
                  Show Gallery
                </label>
                
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={data.showAbout}
                    onChange={(e) => update('showAbout', e.target.checked)}
                  />
                  <span className="toggle-switch"></span>
                  Show About Page
                </label>
                
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={data.showTestimonials}
                    onChange={(e) => update('showTestimonials', e.target.checked)}
                  />
                  <span className="toggle-switch"></span>
                  Show Testimonials
                </label>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="card">
            <div className="card-header">
              <div className="section-icon">💬</div>
              <h2>Testimonials</h2>
              <button onClick={addTestimonial} className="btn-add">
                <span>+</span>
                Add Testimonial
              </button>
            </div>
            <div className="card-content">
            {data.testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="item-card">
                <div className="item-header">
                  <div className="item-info">
                    <h3>Testimonial #{index + 1}</h3>
                    <small>{testimonial.name}</small>
                  </div>
                  <button onClick={() => removeTestimonial(index)} className="btn-remove">
                    🗑️
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={testimonial.company}
                      onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Avatar Image Path (Optional)</label>
                    <input
                      type="text"
                      value={testimonial.avatar || ''}
                      onChange={(e) => updateTestimonial(index, 'avatar', e.target.value)}
                      placeholder="/assets/avatar.jpg"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Testimonial Content</label>
                    <textarea
                      value={testimonial.content}
                      onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                      rows={3}
                      placeholder="Write the testimonial content here..."
                    />
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Theme Settings */}
          <div className="card">
            <div className="card-header">
              <div className="section-icon">🎨</div>
              <h2>Theme & Branding</h2>
            </div>
            <div className="card-content">
              <div className="theme-grid">
                <div className="color-section">
                  <h3>Colors</h3>
                  <div className="color-inputs">
                    <div className="form-group">
                      <label>Primary Color</label>
                      <div className="color-input-wrapper">
                        <input
                          type="color"
                          value={data.theme.primaryColor}
                          onChange={(e) => updateTheme('primaryColor', e.target.value)}
                          className="color-picker"
                        />
                        <input
                          type="text"
                          value={data.theme.primaryColor}
                          onChange={(e) => updateTheme('primaryColor', e.target.value)}
                          className="color-text"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Secondary Color</label>
                      <div className="color-input-wrapper">
                        <input
                          type="color"
                          value={data.theme.secondaryColor}
                          onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                          className="color-picker"
                        />
                        <input
                          type="text"
                          value={data.theme.secondaryColor}
                          onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                          className="color-text"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Accent Color</label>
                      <div className="color-input-wrapper">
                        <input
                          type="color"
                          value={data.theme.accentColor}
                          onChange={(e) => updateTheme('accentColor', e.target.value)}
                          className="color-picker"
                        />
                        <input
                          type="text"
                          value={data.theme.accentColor}
                          onChange={(e) => updateTheme('accentColor', e.target.value)}
                          className="color-text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="typography-section">
                  <h3>Typography</h3>
                  <div className="form-group">
                    <label>Font Family</label>
                    <select
                      value={data.theme.fontFamily}
                      onChange={(e) => updateTheme('fontFamily', e.target.value)}
                    >
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="Open Sans, sans-serif">Open Sans</option>
                      <option value="Lato, sans-serif">Lato</option>
                      <option value="Poppins, sans-serif">Poppins</option>
                      <option value="Montserrat, sans-serif">Montserrat</option>
                      <option value="Playfair Display, serif">Playfair Display</option>
                      <option value="Merriweather, serif">Merriweather</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Base Font Size</label>
                    <select
                      value={data.theme.fontSize}
                      onChange={(e) => updateTheme('fontSize', e.target.value)}
                    >
                      <option value="14px">Small (14px)</option>
                      <option value="16px">Medium (16px)</option>
                      <option value="18px">Large (18px)</option>
                      <option value="20px">Extra Large (20px)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="card">
            <div className="card-header">
              <div className="section-icon">🌐</div>
              <h2>Social Media</h2>
            </div>
            <div className="card-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    value={data.linkedinUrl}
                    onChange={(e) => update('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="form-group">
                  <label>Instagram URL</label>
                  <input
                    type="url"
                    value={data.instagramUrl}
                    onChange={(e) => update('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    value={data.githubUrl}
                    onChange={(e) => update('githubUrl', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="form-group">
                  <label>Etsy URL</label>
                  <input
                    type="url"
                    value={data.etsyUrl}
                    onChange={(e) => update('etsyUrl', e.target.value)}
                    placeholder="https://etsy.com/shop/shopname"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Simple Analytics */}
          <div className="card">
            <div className="card-header">
              <div className="section-icon">📊</div>
              <h2>Analytics (Optional)</h2>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label>Google Analytics ID</label>
                <input
                  type="text"
                  value={data.googleAnalyticsId}
                  onChange={(e) => update('googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
                <small>Leave empty to disable tracking</small>
              </div>
            </div>
          </div>

        </div>

        <style jsx>{`
          .admin-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 0;
          }

          .dashboard-grid {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          }

          .card.profile-card {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
            border: 1px solid rgba(102, 126, 234, 0.2);
          }

          .card-header {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding: 1.5rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .card-header h2 {
            margin: 0;
            color: #2d3748;
            font-size: 1.25rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .section-icon {
            font-size: 1.5rem;
          }

          .card-content {
            padding: 2rem;
          }

          .profile-preview {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .avatar-preview {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            flex-shrink: 0;
          }

          .avatar-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .avatar-placeholder {
            font-size: 2rem;
          }

          .profile-info-preview h3 {
            margin: 0 0 0.25rem 0;
            color: #1a202c;
            font-size: 1.25rem;
            font-weight: 700;
          }

          .profile-info-preview p {
            margin: 0 0 0.25rem 0;
            color: #4a5568;
            font-size: 1rem;
            font-weight: 500;
          }

          .profile-info-preview small {
            color: #718096;
            font-size: 0.875rem;
          }

          .item-card {
            background: rgba(255, 255, 255, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            transition: all 0.2s;
          }

          .item-card:hover {
            background: rgba(255, 255, 255, 0.5);
            border-color: rgba(102, 126, 234, 0.3);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .item-info h3 {
            margin: 0;
            color: #1f2937;
            font-size: 1rem;
            font-weight: 700;
          }

          .item-info small {
            color: #6b7280;
            font-size: 0.875rem;
          }

          .admin-header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .header-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .header-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
          }

          .header-left h1 {
            margin: 0;
            color: #1a202c;
            font-size: 1.75rem;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .header-left p {
            margin: 0;
            color: #6b7280;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .header-actions {
            display: flex;
            gap: 0.75rem;
          }

          .btn-save {
            background: linear-gradient(135deg, #48bb78, #38a169);
            color: white;
            border: none;
            padding: 0.625rem 1.25rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.875rem;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(72, 187, 120, 0.2);
          }

          .btn-save:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(72, 187, 120, 0.3);
          }

          .btn-save:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .btn-logout {
            background: linear-gradient(135deg, #e53e3e, #c53030);
            color: white;
            border: none;
            padding: 0.625rem 1.25rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.875rem;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(229, 62, 62, 0.2);
          }

          .btn-logout:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(229, 62, 62, 0.3);
          }

          .admin-content {
            display: grid;
            gap: 1rem;
          }

          .admin-section {
            background: white;
            padding: 1.25rem;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.2s;
          }

          .admin-section:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .admin-section h2 {
            margin: 0 0 1rem 0;
            color: #1a202c;
            font-size: 1.125rem;
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

          .form-group.full-width {
            grid-column: 1 / -1;
          }

          .form-group label {
            margin-bottom: 0.375rem;
            color: #374151;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }

          .form-group input,
          .form-group textarea {
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 0.9rem;
            transition: all 0.2s;
            background: #fafafa;
          }

          .form-group input:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            background: white;
          }

          .form-group textarea {
            resize: vertical;
            min-height: 80px;
          }

          .form-group small {
            margin-top: 0.25rem;
            color: #6b7280;
            font-size: 0.75rem;
          }

          .toggles {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }

          .toggle {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-weight: 500;
            color: #2d3748;
          }

          .toggle input[type="checkbox"] {
            display: none;
          }

          .toggle-switch {
            position: relative;
            width: 50px;
            height: 24px;
            background: #cbd5e0;
            border-radius: 12px;
            margin-right: 0.75rem;
            transition: background 0.3s ease;
          }

          .toggle-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s ease;
          }

          .toggle input[type="checkbox"]:checked + .toggle-switch {
            background: #48bb78;
          }

          .toggle input[type="checkbox"]:checked + .toggle-switch::after {
            transform: translateX(26px);
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .section-header h2 {
            margin: 0;
            color: #2d3748;
            font-size: 1.1rem;
          }

          .btn-add {
            background: #4299e1;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .btn-add:hover {
            background: #3182ce;
          }

          .employment-item,
          .education-item,
          .testimonial-item {
            background: #f8fafc;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1rem;
            transition: all 0.2s;
          }

          .employment-item:hover,
          .education-item:hover,
          .testimonial-item:hover {
            border-color: #d1d5db;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #e5e7eb;
          }

          .item-header h3 {
            margin: 0;
            color: #1f2937;
            font-size: 1rem;
            font-weight: 700;
          }

          .btn-remove {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            border: none;
            padding: 0.375rem 0.75rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.75rem;
            font-weight: 600;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }

          .btn-remove:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
          }

          .theme-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }

          .color-section h3,
          .typography-section h3 {
            margin: 0 0 1rem 0;
            color: #1f2937;
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }

          .color-inputs {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .color-input-wrapper {
            display: flex;
            gap: 0.5rem;
            align-items: center;
          }

          .color-picker {
            width: 50px;
            height: 38px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .color-text {
            flex: 1;
            padding: 0.5rem 0.75rem !important;
            font-family: monospace;
            font-size: 0.875rem !important;
          }

          .form-group select {
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 0.9rem;
            background: #fafafa;
            cursor: pointer;
            transition: all 0.2s;
          }

          .form-group select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            background: white;
          }

          @media (max-width: 768px) {
            .admin {
              padding: 0.75rem;
            }

            .admin-header {
              flex-direction: column;
              gap: 1rem;
              text-align: center;
              padding: 1rem;
            }

            .form-grid {
              grid-template-columns: 1fr;
            }

            .theme-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }

            .toggles {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}