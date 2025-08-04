import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import BookingCalendar from "@/components/BookingCalendar";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import data from "@/Ella.json";
import { GalleryInterface } from "@/managers/Models";

// Dynamically import the Masonry component
const Masonry = dynamic(() => import('@/blocks/Components/Masonry/Masonry'), {ssr: false,});

export default function Home() {
    const [galleryItems, setGalleryItems] = useState<GalleryInterface[]>([]);
    const timelineRef = useRef<HTMLDivElement>(null);
    const educationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Ensure page starts at top
        window.scrollTo(0, 0);
        
        // Fetch gallery items from public API
        fetch("/api/gallery/public")
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Failed to fetch gallery items');
            })
            .then((items) => setGalleryItems(items))
            .catch((err) => {
                console.error("Failed to fetch gallery items:", err);
                // Fallback to static data if API fails
                setGalleryItems(data.Art as any);
            });
    }, []);

    // Scroll animations for timeline and education
    useEffect(() => {
        const setupAnimations = () => {
            // Timeline items animation
            if (timelineRef.current) {
                const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
                
                timelineItems.forEach((item, index) => {
                    const isRightAligned = item.classList.contains('flex-end');
                    
                    gsap.fromTo(item, 
                        {
                            opacity: 0,
                            x: isRightAligned ? 100 : -100,
                            y: 30,
                        },
                        {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            duration: 0.8,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: item,
                                start: "top bottom-=100",
                                end: "bottom top",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                });
            }

            // Education items animation
            if (educationRef.current) {
                const educationItems = educationRef.current.querySelectorAll('.education-item');
                
                gsap.fromTo(educationItems,
                    {
                        opacity: 0,
                        y: 50,
                        scale: 0.9
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        ease: "power3.out",
                        stagger: 0.2,
                        scrollTrigger: {
                            trigger: educationRef.current,
                            start: "top bottom-=100",
                            end: "bottom top",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        };

        // Delay to ensure DOM is ready
        const timer = setTimeout(setupAnimations, 100);
        
        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <section id="hero" className="hero-section">
                <div className="hero-content">
                    <h1>Ella Beardsley</h1>
                    {/*<p>Art Therapist • Creative • Healer</p> */}
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="container">
                    <h2>About Me</h2>
                    <div className="about-content">
                        <div className="headshot-wrapper">
                            <Image 
                                src={data.Person[0].headshot} 
                                alt="Ella Beardsley" 
                                width={300}
                                height={300}
                                className="headshot"
                                priority
                            />
                        </div>
                        <div className="about-text">
                            <p>{data.Person[0].description}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Background Section */}
            <section id="background" className="background-section">
                <div className="container">
                    <h2>Experience</h2>
                    
                    <div className="education-section">
                        <h3>Education</h3>
                        <div className="education-grid" ref={educationRef}>
                            {data.Education.map((edu, index) => (
                                <div key={index} className="education-item">
                                    <h4>{edu.institution}</h4>
                                    <p>{edu.degree}</p>
                                    <p className="dates">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="timeline-section">
                        <h3>Work History</h3>
                        <div className="timeline" ref={timelineRef}>
                            {data.Employment.map((job, index) => (
                                <div key={index} className={`timeline-item ${job.alignment}`}>
                                    <div className="timeline-content">
                                        <h4>{job.title}</h4>
                                        <p className="company">{job.company}</p>
                                        <p className="location">{job.location}</p>
                                        <p className="dates">{job.startDate} - {job.endDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="gallery-section">
                <div className="container">
                    <h2>Gallery</h2>
                    <p>Explore my creative works across various mediums</p>
                    <Masonry
                        items={galleryItems}
                        ease="power3.out"
                        duration={0.6}
                        stagger={0.05}
                        animateFrom="bottom"
                        scaleOnHover={true}
                        hoverScale={0.95}
                        blurToFocus={true}
                        colorShiftOnHover={false}
                    />
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section">
                <div className="container">
                    <h2>Testimonials</h2>
                    <p>What clients and colleagues say about my work</p>
                    <TestimonialCarousel />
                </div>
            </section>

            {/* Booking Section */}
            <section id="booking" className="booking-section">
                <div className="container">
                    <h2>Book a Session</h2>
                    <p>Ready to start your healing journey? Schedule a consultation or therapy session.</p>
                    <BookingCalendar />
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="container">
                    <h2>Get in Touch</h2>
                    <div className="contact-content">
                        <div className="contact-info">
                            <h3>Contact Information</h3>
                            <div className="social-links">
                                <a href={`mailto:${data.Person[0].email}`} className="social-link" title="Email">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="email-icon">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </a>
                                {data.Socials.filter(social => social.url).map((social, index) => (
                                    <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="social-link">
                                        {social.platform === 'LinkedIn' ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="linkedin-icon">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        ) : (
                                            social.platform
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="contact-form">
                            <h3>Send a Message</h3>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}