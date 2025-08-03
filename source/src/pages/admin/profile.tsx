import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import data from '@/Ella.json';

// Default testimonials (same as in TestimonialCarousel)
const defaultTestimonials = [
  {
    id: '1',
    name: 'Sarah M.',
    text: 'Ella\'s art therapy sessions helped me process emotions I couldn\'t put into words. Her gentle guidance and creative approach made all the difference in my healing journey.',
    role: 'Individual Client',
    rating: 5
  },
  {
    id: '2', 
    name: 'Michael R.',
    text: 'The group art therapy sessions were transformative. Ella creates such a safe, non-judgmental space where creativity flows naturally.',
    role: 'Group Participant',
    rating: 5
  },
  {
    id: '3',
    name: 'Lisa K.',
    text: 'As someone who struggled with traditional talk therapy, Ella\'s art-based approach was exactly what I needed. Highly recommend!',
    role: 'Individual Client', 
    rating: 5
  },
  {
    id: '4',
    name: 'Dr. Jennifer L.',
    text: 'I regularly refer clients to Ella. Her professionalism and therapeutic skills combined with artistic expertise make her an exceptional art therapist.',
    role: 'Referring Therapist',
    rating: 5
  }
];

interface ProfileData {
  name: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  testimonials?: Array<{
    id: string;
    name: string;
    text: string;
    role?: string;
    rating?: number;
  }>;
  skills: string[];
  services: string[];
}

export default function AdminProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    title: '',
    description: '',
    email: '',
    phone: '',
    location: '',
    experience: [],
    education: [],
    testimonials: [],
    skills: [],
    services: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profile = await response.json();
        setProfileData(profile);
      } else {
        // Use fallback data if API fails
        setProfileData({
          name: data.Person?.[0]?.name || '',
          title: data.Person?.[0]?.title || '',
          description: data.About || '',
          email: data.Person?.[0]?.email || '',
          phone: data.Person?.[0]?.phone || '',
          location: data.Person?.[0]?.location || '',
          experience: data.Employment || [],
          education: data.Education || [],
          testimonials: defaultTestimonials,
          skills: data.Skills || [],
          services: data.Services || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use fallback data
      setProfileData({
        name: data.Person?.[0]?.name || '',
        title: data.Person?.[0]?.title || '',
        description: data.About || '',
        email: data.Person?.[0]?.email || '',
        phone: data.Person?.[0]?.phone || '',
        location: data.Person?.[0]?.location || '',
        experience: data.Employment || [],
        education: data.Education || [],
        testimonials: defaultTestimonials,
        skills: data.Skills || [],
        services: data.Services || []
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        console.error('Failed to update profile');
        alert('Error saving profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addExperience = () => {
    setProfileData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateSkills = (skillsText: string) => {
    const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfileData(prev => ({ ...prev, skills: skillsArray }));
  };

  const updateServices = (servicesText: string) => {
    const servicesArray = servicesText.split(',').map(service => service.trim()).filter(service => service);
    setProfileData(prev => ({ ...prev, services: servicesArray }));
  };

  const addTestimonial = () => {
    setProfileData(prev => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), {
        id: Date.now().toString(),
        name: '',
        text: '',
        role: '',
        rating: 5
      }]
    }));
  };

  const updateTestimonial = (index: number, field: string, value: string | number) => {
    setProfileData(prev => ({
      ...prev,
      testimonials: (prev.testimonials || []).map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }));
  };

  const removeTestimonial = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="admin-profile">
        {/* Header */}
        <header className="profile-header">
          <div className="header-content">
            <div className="header-left">
              <button onClick={() => router.push('/admin')} className="back-btn">
                ← Back to Dashboard
              </button>
              <h1>Profile Management</h1>
              <p>Update your personal information and experience</p>
            </div>
            <div className="header-right">
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </header>

        {/* Profile Form */}
        <main className="profile-main">
          <div className="profile-sections">
            
            {/* Basic Information */}
            <section className="profile-section">
              <h2>Basic Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Professional Title</label>
                  <input
                    type="text"
                    value={profileData.title}
                    onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Art Therapist, Creative Professional"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>About Description</label>
                  <textarea
                    value={profileData.description}
                    onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell visitors about yourself and your work..."
                    rows={4}
                  />
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="profile-section">
              <h2>Contact Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                  />
                </div>
              </div>
            </section>

            {/* Experience */}
            <section className="profile-section">
              <div className="section-header">
                <h2>Work Experience</h2>
                <button onClick={addExperience} className="btn-add">+ Add Experience</button>
              </div>
              
              <div className="dynamic-list">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="dynamic-item">
                    <div className="item-header">
                      <h3>Experience {index + 1}</h3>
                      <button 
                        onClick={() => removeExperience(index)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Job Title</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          placeholder="Art Therapist"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Company/Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          placeholder="Healthcare Center"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(index, 'location', e.target.value)}
                          placeholder="City, State"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                          placeholder="August 2020"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          placeholder="Present"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Description (Optional)</label>
                        <textarea
                          value={exp.description || ''}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          placeholder="Describe your role and achievements..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="profile-section">
              <div className="section-header">
                <h2>Education</h2>
                <button onClick={addEducation} className="btn-add">+ Add Education</button>
              </div>
              
              <div className="dynamic-list">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="dynamic-item">
                    <div className="item-header">
                      <h3>Education {index + 1}</h3>
                      <button 
                        onClick={() => removeEducation(index)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          placeholder="Indiana University"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          placeholder="Master of Arts in Art Therapy"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                          placeholder="August 2023"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                          placeholder="May 2025"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Description (Optional)</label>
                        <textarea
                          value={edu.description || ''}
                          onChange={(e) => updateEducation(index, 'description', e.target.value)}
                          placeholder="Additional details about your education..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="profile-section">
              <div className="section-header">
                <h2>Testimonials</h2>
                <button onClick={addTestimonial} className="btn-add">+ Add Testimonial</button>
              </div>
              
              <div className="dynamic-list">
                {profileData.testimonials?.map((testimonial, index) => (
                  <div key={testimonial.id || index} className="dynamic-item">
                    <div className="item-header">
                      <h3>Testimonial {index + 1}</h3>
                      <button 
                        onClick={() => removeTestimonial(index)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Client Name</label>
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                          placeholder="Sarah M."
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Role/Title</label>
                        <input
                          type="text"
                          value={testimonial.role || ''}
                          onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                          placeholder="Individual Client"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Rating (1-5)</label>
                        <select
                          value={testimonial.rating || 5}
                          onChange={(e) => updateTestimonial(index, 'rating', Number(e.target.value))}
                        >
                          <option value={5}>5 - Excellent</option>
                          <option value={4}>4 - Very Good</option>
                          <option value={3}>3 - Good</option>
                          <option value={2}>2 - Fair</option>
                          <option value={1}>1 - Poor</option>
                        </select>
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Testimonial Text</label>
                        <textarea
                          value={testimonial.text}
                          onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                          placeholder="Share what the client said about your services..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills & Services */}
            <section className="profile-section">
              <h2>Skills & Services</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Skills (comma-separated)</label>
                  <textarea
                    value={profileData.skills.join(', ')}
                    onChange={(e) => updateSkills(e.target.value)}
                    placeholder="Art Therapy, Counseling, Creative Expression, Group Therapy"
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>Services (comma-separated)</label>
                  <textarea
                    value={profileData.services.join(', ')}
                    onChange={(e) => updateServices(e.target.value)}
                    placeholder="Individual Therapy, Group Sessions, Workshops, Consultations"
                    rows={3}
                  />
                </div>
              </div>
            </section>
          </div>
        </main>

        <style jsx>{`
          .admin-profile {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .profile-header {
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

          .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.875rem;
          }

          .btn-primary:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.3);
          }

          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .profile-main {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1.5rem;
          }

          .profile-sections {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .profile-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .profile-section h2 {
            margin: 0 0 1rem 0;
            color: #2d3748;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .section-header h2 {
            margin: 0;
          }

          .btn-add {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.875rem;
          }

          .btn-add:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
          }

          .form-group.full-width {
            grid-column: 1 / -1;
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
          .form-group textarea,
          .form-group select {
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }

          .form-group input:focus,
          .form-group textarea:focus,
          .form-group select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          .dynamic-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .dynamic-item {
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
          }

          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .item-header h3 {
            margin: 0;
            color: #4a5568;
            font-size: 0.9rem;
            font-weight: 600;
          }

          .btn-remove {
            background: rgba(239, 68, 68, 0.9);
            color: white;
            border: none;
            padding: 0.25rem 0.75rem;
            border-radius: 6px;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-remove:hover {
            background: rgba(239, 68, 68, 1);
            transform: scale(1.05);
          }

          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
              gap: 0.75rem;
              text-align: center;
              padding: 0 1rem;
            }

            .profile-main {
              padding: 1rem;
            }

            .form-grid {
              grid-template-columns: 1fr;
            }

            .section-header {
              flex-direction: column;
              gap: 1rem;
              align-items: stretch;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}