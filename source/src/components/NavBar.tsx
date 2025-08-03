import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';

// Navigation items for single-page sections
const navItems = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#background" },
    { label: "Gallery", href: "#gallery" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Booking", href: "#booking" },
    { label: "Contact", href: "#contact" },
];

export default function NavBar() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('hero');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            
            // Check if page is scrolled
            setIsScrolled(scrollY > 50);

            // Enhanced section detection with intersection logic
            const allSections = ['hero', ...navItems.map(item => item.href.substring(1))];
            const viewportHeight = window.innerHeight;
            
            let currentSection = 'hero'; // default
            let maxVisibleArea = 0;
            
            // Find the section with the most visible area in the viewport
            for (let i = 0; i < allSections.length; i++) {
                const section = document.getElementById(allSections[i]);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    const viewportTop = scrollY;
                    const viewportBottom = scrollY + viewportHeight;
                    
                    // Calculate visible area of this section
                    const visibleTop = Math.max(sectionTop, viewportTop);
                    const visibleBottom = Math.min(sectionBottom, viewportBottom);
                    const visibleArea = Math.max(0, visibleBottom - visibleTop);
                    
                    // If this section has more visible area, it's the active one
                    if (visibleArea > maxVisibleArea) {
                        maxVisibleArea = visibleArea;
                        currentSection = allSections[i];
                    }
                }
            }
            
            // Fallback: if we're at the very top, ensure hero is active
            if (scrollY < 100) {
                currentSection = 'hero';
            }
            
            // Only update if section actually changed to prevent unnecessary re-renders
            if (currentSection !== activeSection) {
                setActiveSection(currentSection);
            }
        };

        // Throttle scroll events for better performance
        let ticking = false;
        const optimizedScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', optimizedScrollHandler);
    }, []);

    const handleNavClick = (href: string, e: React.MouseEvent) => {
        e.preventDefault();
        const id = href.substring(1);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        // Close mobile menu after navigation and restore body scroll
        setIsMobileMenuOpen(false);
        document.body.style.overflow = 'unset';
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Prevent body scroll when menu is open
        if (!isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    // Scroll to top on page load and set mounted
    useEffect(() => {
        window.scrollTo(0, 0);
        setMounted(true);
    }, []);

    // Cleanup body scroll on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Only show navigation on the home page
    if (router.pathname !== '/') {
        return null;
    }

    // Dynamic styling based on active section
    const getSectionTheme = (section: string) => {
        switch (section) {
            case 'hero':
                return { primary: '#667eea', secondary: '#764ba2' };
            case 'about':
                return { primary: '#ed8936', secondary: '#dd6b20' };
            case 'background':
                return { primary: '#38b2ac', secondary: '#319795' };
            case 'gallery':
                return { primary: '#9f7aea', secondary: '#805ad5' };
            case 'testimonials':
                return { primary: '#48bb78', secondary: '#38a169' };
            case 'booking':
                return { primary: '#f56565', secondary: '#e53e3e' };
            case 'contact':
                return { primary: '#4299e1', secondary: '#3182ce' };
            default:
                return { primary: '#667eea', secondary: '#764ba2' };
        }
    };

    const currentTheme = getSectionTheme(activeSection);

    return (
        <nav className={`modern-nav ${isScrolled ? 'scrolled' : ''} section-${activeSection}`}>
            <div className="nav-container">
                <div className="nav-brand">
                    <a href="#hero" onClick={(e) => handleNavClick('#hero', e)}>
                        Ella Beardsley
                    </a>
                </div>
                
                <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                className={activeSection === item.href.substring(1) ? 'active' : ''}
                                onClick={(e) => handleNavClick(item.href, e)}
                            >
                                {item.label}
                                {activeSection === item.href.substring(1) && (
                                    <span className="active-dot"></span>
                                )}
                            </a>
                        </li>
                    ))}
                </ul>


                {/* Mobile menu button */}
                <button 
                    className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile menu overlay rendered as portal */}
            {mounted && isMobileMenuOpen && createPortal(
                <div 
                    className="mobile-overlay-portal" 
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        document.body.style.overflow = 'unset';
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.3s ease'
                    }}
                >
                    <ul 
                        className="mobile-nav-links-portal" 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                            listStyle: 'none',
                            margin: 0,
                            minWidth: '280px',
                            maxWidth: '90vw',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            animation: 'slideIn 0.3s ease',
                            position: 'relative',
                            zIndex: 999999
                        }}
                    >
                        {navItems.map((item) => (
                            <li key={item.href} style={{ marginBottom: '1rem' }}>
                                <a
                                    href={item.href}
                                    className={activeSection === item.href.substring(1) ? 'active' : ''}
                                    onClick={(e) => handleNavClick(item.href, e)}
                                    style={{
                                        display: 'block',
                                        padding: '1rem',
                                        color: activeSection === item.href.substring(1) ? 'white' : '#4a5568',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'center',
                                        background: activeSection === item.href.substring(1) 
                                            ? `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                            : 'transparent'
                                    }}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>,
                document.body
            )}

            <style jsx>{`
                .modern-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    transition: all 0.3s ease;
                    padding: 1rem 0;
                }

                .modern-nav.scrolled {
                    background: rgba(255, 255, 255, 0.95);
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
                    padding: 0.75rem 0;
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                }

                .nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .nav-brand a {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #2d3748;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .nav-brand a:hover {
                    color: ${currentTheme.primary};
                }

                .section-indicator {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: ${currentTheme.primary};
                    background: ${currentTheme.primary}20;
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    text-transform: capitalize;
                    transition: all 0.3s ease;
                }

                .nav-links {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    gap: 1.5rem;
                }

                .nav-links a {
                    color: #4a5568;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.95rem;
                    padding: 0.5rem 1rem;
                    border-radius: 25px;
                    transition: all 0.3s ease;
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .nav-links a:hover {
                    color: ${currentTheme.primary};
                    background: ${currentTheme.primary}15;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px ${currentTheme.primary}25;
                    border-radius: 8px;
                }

                .nav-links a.active {
                    color: white;
                    background: linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary});
                    box-shadow: 0 4px 15px ${currentTheme.primary}40;
                    transform: translateY(-2px);
                }

                .active-dot {
                    width: 6px;
                    height: 6px;
                    background: currentColor;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(0.8); }
                }


                /* Section-specific navbar styling */
                .modern-nav.section-hero {
                    border-bottom: 3px solid ${currentTheme.primary}30;
                }

                .modern-nav.section-about {
                    border-bottom: 3px solid ${getSectionTheme('about').primary}30;
                }

                .modern-nav.section-background {
                    border-bottom: 3px solid ${getSectionTheme('background').primary}30;
                }

                .modern-nav.section-gallery {
                    border-bottom: 3px solid ${getSectionTheme('gallery').primary}30;
                }

                .modern-nav.section-testimonials {
                    border-bottom: 3px solid ${getSectionTheme('testimonials').primary}30;
                }

                .modern-nav.section-booking {
                    border-bottom: 3px solid ${getSectionTheme('booking').primary}30;
                }

                .modern-nav.section-contact {
                    border-bottom: 3px solid ${getSectionTheme('contact').primary}30;
                }

                .mobile-menu-btn {
                    display: none;
                    flex-direction: column;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    gap: 4px;
                    z-index: 999999;
                    position: relative;
                }

                .mobile-menu-btn span {
                    width: 24px;
                    height: 2px;
                    background: #4a5568;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                    transform-origin: center;
                }

                .mobile-menu-btn.open span:nth-child(1) {
                    transform: rotate(45deg) translate(6px, 6px);
                }

                .mobile-menu-btn.open span:nth-child(2) {
                    opacity: 0;
                }

                .mobile-menu-btn.open span:nth-child(3) {
                    transform: rotate(-45deg) translate(6px, -6px);
                }

                .mobile-overlay {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    background: rgba(0, 0, 0, 0.5) !important;
                    z-index: 999998 !important;
                    animation: fadeIn 0.3s ease;
                    overflow: hidden;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .mobile-nav-links {
                    background: white !important;
                    border-radius: 12px;
                    padding: 2rem;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
                    list-style: none;
                    margin: 0;
                    min-width: 280px;
                    max-width: 90vw;
                    max-height: 80vh;
                    overflow-y: auto;
                    animation: slideIn 0.3s ease;
                    position: relative !important;
                    z-index: 999999 !important;
                }

                @keyframes slideIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .mobile-nav-links li {
                    margin-bottom: 1rem;
                }

                .mobile-nav-links a {
                    display: block;
                    padding: 1rem;
                    color: #4a5568;
                    text-decoration: none;
                    font-weight: 500;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    text-align: center;
                }

                .mobile-nav-links a:hover,
                .mobile-nav-links a.active {
                    background: linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary});
                    color: white;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .nav-container {
                        padding: 0 1rem;
                    }

                    .nav-links {
                        display: none;
                    }

                    .mobile-menu-btn {
                        display: flex;
                    }

                    .nav-brand a {
                        font-size: 1.25rem;
                    }

                    .section-indicator {
                        font-size: 0.7rem;
                        padding: 0.2rem 0.4rem;
                    }
                }
            `}</style>
        </nav>
    );
}




