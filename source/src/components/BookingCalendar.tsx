import { useEffect, useState } from 'react';

interface BookingCalendarProps {
  showInline?: boolean;
}

export default function BookingCalendar({ 
  showInline = true 
}: BookingCalendarProps) {
  const [calendlyUrl, setCalendlyUrl] = useState("https://calendly.com/ella-beardsley");
  
  useEffect(() => {
    // Fetch Calendly URL from public settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings/public');
        if (response.ok) {
          const settings = await response.json();
          if (settings.integrations?.calendlyUrl) {
            setCalendlyUrl(settings.integrations.calendlyUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Use default URL if fetch fails
      }
    };

    fetchSettings();

    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleBookingClick = () => {
    // For popup version
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({ url: calendlyUrl });
    } else {
      // Fallback to direct link
      window.open(calendlyUrl, '_blank');
    }
  };

  if (showInline) {
    return (
      <div className="booking-calendar">
        <div className="booking-header">
          
        </div>
        
        {/* Inline Calendly widget */}
        <div 
          className="calendly-inline-widget" 
          data-url={calendlyUrl}
          style={{ minWidth: '280px', height: '600px' }}
        ></div>

        <style jsx>{`
          .booking-calendar {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }

          .booking-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .booking-header h3 {
            margin: 0 0 0.5rem 0;
            color: #2d3748;
            font-size: 2rem;
            font-weight: 700;
          }

          .booking-header p {
            margin: 0;
            color: #4a5568;
            font-size: 1.1rem;
            line-height: 1.6;
          }

          .calendly-inline-widget {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          @media (max-width: 768px) {
            .calendly-inline-widget {
              height: 500px;
              min-width: 100%;
            }
            
            .booking-calendar {
              padding: 1rem 0.5rem;
            }
          }
        `}</style>
      </div>
    );
  }

  // Button version for popup
  return (
    <div className="booking-button-container">
      <button onClick={handleBookingClick} className="booking-button">
        📅 Schedule an Appointment
      </button>

      <style jsx>{`
        .booking-button-container {
          text-align: center;
          margin: 2rem 0;
        }

        .booking-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .booking-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .booking-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}