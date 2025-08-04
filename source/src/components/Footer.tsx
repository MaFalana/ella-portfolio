import { useState } from 'react';
import data from '@/Ella.json';

export default function Footer() {
    const [currentYear] = useState(new Date().getFullYear());
    const person = data.Person[0];
    const socials = data.Socials.filter(social => social.url);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="modern-footer">
            <div className="footer-container">
                {/* Main Footer Content */}
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>{person.name}</h3>
                        <p className="footer-tagline">
                        </p>
                        <p className="footer-description">
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h4>Navigation</h4>
                            <ul>
                                <li><a href="#about">About Me</a></li>
                                <li><a href="#background">Experience</a></li>
                                <li><a href="#gallery">Gallery</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Services</h4>
                            <ul>
                                <li><a href="#contact">Art Therapy</a></li>
                                <li><a href="#contact">Workshops</a></li>
                                <li><a href="#contact">Commissions</a></li>
                                <li><a href="#contact">Consultations</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Connect</h4>
                            <div className="social-links">
                                <a href={`mailto:${person.email}`} className="social-link" title="Email">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </a>
                                {socials.map((social, index) => (
                                    <a 
                                        key={index}
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="social-link"
                                        title={social.platform}
                                    >
                                        {social.platform === 'LinkedIn' ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        ) : (
                                            social.platform
                                        )}
                                    </a>
                                ))}
                            </div>
                            <div className="contact-info">
                                <p>{person.location}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; {currentYear} {person.name}. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <button onClick={scrollToTop} className="back-to-top">
                                ↑ Back to Top
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .modern-footer {
                    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
                    color: white;
                    margin-top: auto;
                }

                .footer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .footer-content {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 3rem;
                    padding: 3rem 2rem 2rem;
                }

                .footer-brand h3 {
                    font-size: 1.75rem;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .footer-tagline {
                    color: #e2e8f0;
                    font-size: 1rem;
                    margin-bottom: 1rem;
                    font-weight: 500;
                }

                .footer-description {
                    color: #cbd5e0;
                    line-height: 1.6;
                    max-width: 300px;
                }

                .footer-links {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }

                .footer-section h4 {
                    color: #e2e8f0;
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }

                .footer-section ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-section li {
                    margin-bottom: 0.5rem;
                }

                .footer-section a {
                    color: #a0aec0;
                    text-decoration: none;
                    transition: color 0.3s ease;
                    font-size: 0.95rem;
                }

                .footer-section a:hover {
                    color: #667eea;
                }

                .social-links {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }

                .social-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.75rem;
                    background: rgba(102, 126, 234, 0.2);
                    border-radius: 50%;
                    color: #e2e8f0;
                    text-decoration: none;
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    width: 44px;
                    height: 44px;
                }

                .social-link:hover {
                    background: rgba(102, 126, 234, 0.4);
                    transform: translateY(-2px);
                }

                .contact-info p {
                    color: #a0aec0;
                    font-size: 0.9rem;
                    margin-bottom: 0.25rem;
                }

                .footer-bottom {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1.5rem 2rem;
                }

                .footer-bottom-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .footer-bottom p {
                    color: #a0aec0;
                    font-size: 0.9rem;
                    margin: 0;
                }

                .back-to-top {
                    background: none;
                    border: 1px solid rgba(102, 126, 234, 0.5);
                    color: #667eea;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                }

                .back-to-top:hover {
                    background: rgba(102, 126, 234, 0.2);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .footer-content {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                        padding: 2rem 1rem;
                    }

                    .footer-links {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .footer-bottom {
                        padding: 1rem;
                    }

                    .footer-bottom-content {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }

                    .social-links {
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .footer-links {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </footer>
    );
}