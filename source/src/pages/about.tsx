import Layout from "@/components/Layout";
import Image from "next/image";
import EllaData from "@/Ella.json";

export default function About() {
    const profile = EllaData.Person[0];
    
    return (
        <Layout>
            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="about-container">
                    <div className="about-content">
                        <div className="profile-section">
                            <div className="profile-image">
                                <img
                                    src={profile.headshot}
                                    alt={profile.name}
                                    className="headshot"
                                />
                            </div>
                            <div className="profile-info">
                                <h1>{profile.name}</h1>
                                <h2>{profile.title}</h2>
                                <p className="company">{profile.company}</p>
                                <p className="location">{profile.location}</p>
                                
                                <div className="description">
                                    <p>
                                        {EllaData.About || "Recent Art Therapy and Mental Health Counseling graduate at Herron School of Art and Design. I have experience working with adults and children from a variety of different backgrounds."}
                                    </p>
                                </div>
                                
                                <button type="button" className="btn-primary">
                                    Download CV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style jsx>{`
                    .about-container {
                        max-width: 100%;
                    }
                    
                    .profile-section {
                        display: grid;
                        grid-template-columns: 300px 1fr;
                        gap: 3rem;
                        align-items: start;
                        margin-bottom: 3rem;
                    }
                    
                    .profile-image {
                        position: sticky;
                        top: 2rem;
                    }
                    
                    .headshot {
                        width: 300px;
                        height: 400px;
                        border-radius: 12px;
                        object-fit: cover;
                        display: block;
                    }
                    
                    .profile-info h1 {
                        font-size: 2.5rem;
                        color: #2d3748;
                        margin-bottom: 0.5rem;
                    }
                    
                    .profile-info h2 {
                        font-size: 1.5rem;
                        color: #667eea;
                        margin-bottom: 0.25rem;
                        font-weight: 500;
                    }
                    
                    .company {
                        color: #4a5568;
                        font-size: 1.1rem;
                        margin-bottom: 0.25rem;
                    }
                    
                    .location {
                        color: #718096;
                        margin-bottom: 2rem;
                    }
                    
                    .description {
                        margin-bottom: 2rem;
                    }
                    
                    .description p {
                        line-height: 1.6;
                        color: #4a5568;
                        margin-bottom: 1rem;
                    }
                    
                    .btn-primary {
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 6px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    
                    .btn-primary:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                    }
                    
                    @media (max-width: 768px) {
                        .profile-section {
                            grid-template-columns: 1fr;
                            gap: 2rem;
                            text-align: center;
                        }
                        
                        .profile-image {
                            position: static;
                            display: flex;
                            justify-content: center;
                        }
                    }
                `}</style>
            </main>
        </Layout>
    );
}