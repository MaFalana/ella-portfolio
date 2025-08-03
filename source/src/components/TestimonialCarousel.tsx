import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  role?: string;
  rating?: number;
}

// Default testimonials (can be managed via admin later)
const defaultTestimonials: Testimonial[] = [
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

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // In the future, this could fetch from an API
    // For now, use default testimonials
    setTestimonials(defaultTestimonials);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`star ${i < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="testimonial-carousel">
      <Slider {...settings}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-slide">
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              
              <p className="testimonial-text">
                {testimonial.text}
              </p>
              
              {testimonial.rating && (
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
              )}
              
              <div className="testimonial-author">
                <h4 className="author-name">{testimonial.name}</h4>
                {testimonial.role && (
                  <p className="author-role">{testimonial.role}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .testimonial-carousel {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .testimonial-slide {
          padding: 0 1rem;
          outline: none;
        }

        .testimonial-content {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          position: relative;
          margin: 1rem 0;
        }

        .quote-icon {
          font-size: 4rem;
          color: #667eea;
          line-height: 1;
          margin-bottom: 1rem;
          font-family: serif;
        }

        .testimonial-text {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #4a5568;
          margin-bottom: 1.5rem;
          font-style: italic;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .testimonial-rating {
          margin-bottom: 1.5rem;
        }

        .star {
          font-size: 1.25rem;
          color: #e2e8f0;
          margin: 0 0.125rem;
        }

        .star.filled {
          color: #ffd700;
        }

        .testimonial-author {
          border-top: 2px solid #f7fafc;
          padding-top: 1.5rem;
        }

        .author-name {
          margin: 0 0 0.25rem 0;
          color: #2d3748;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .author-role {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }

        /* Slick carousel customization */
        .testimonial-carousel .slick-dots {
          bottom: -50px;
        }

        .testimonial-carousel .slick-dots li button:before {
          font-size: 12px;
          color: #667eea;
          opacity: 0.5;
        }

        .testimonial-carousel .slick-dots li.slick-active button:before {
          opacity: 1;
          color: #667eea;
        }

        .testimonial-carousel .slick-prev,
        .testimonial-carousel .slick-next {
          z-index: 1;
          width: 40px;
          height: 40px;
        }

        .testimonial-carousel .slick-prev {
          left: -50px;
        }

        .testimonial-carousel .slick-next {
          right: -50px;
        }

        .testimonial-carousel .slick-prev:before,
        .testimonial-carousel .slick-next:before {
          font-size: 20px;
          color: #667eea;
          opacity: 0.7;
        }

        .testimonial-carousel .slick-prev:hover:before,
        .testimonial-carousel .slick-next:hover:before {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .testimonial-content {
            padding: 2rem 1.5rem;
          }

          .testimonial-text {
            font-size: 1rem;
          }

          .testimonial-carousel .slick-prev {
            left: -25px;
          }

          .testimonial-carousel .slick-next {
            right: -25px;
          }

          .testimonial-carousel .slick-prev:before,
          .testimonial-carousel .slick-next:before {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .testimonial-carousel {
            padding: 1rem 0.5rem;
          }

          .testimonial-carousel .slick-prev,
          .testimonial-carousel .slick-next {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}