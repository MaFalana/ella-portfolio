import type { NextApiRequest, NextApiResponse } from 'next';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message }: ContactFormData = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email address' 
      });
    }

    // Import nodemailer dynamically
    const nodemailer = await import('nodemailer');
    
    console.log('Creating transporter...');
    
    const transporter = nodemailer.default.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'beardsleyella@gmail.com', // Ella's email
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">New Contact Form Submission</h2>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #2d3748; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #4a5568;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e6fffa; border-radius: 6px;">
            <p style="margin: 0; color: #234e52; font-size: 14px;">
              <strong>Reply to:</strong> ${email}<br>
              <strong>Sent from:</strong> Portfolio Contact Form<br>
              <strong>Time:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
        
        Reply to: ${email}
        Time: ${new Date().toLocaleString()}
      `,
    };

    // Send auto-reply to sender
    const autoReplyOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Thank you for reaching out!</h2>
          
          <p style="color: #4a5568; line-height: 1.6;">
            Hi ${name},
          </p>
          
          <p style="color: #4a5568; line-height: 1.6;">
            Thank you for your interest in my art therapy services. I've received your message 
            and will get back to you within 24-48 hours.
          </p>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #2d3748;"><strong>Your message:</strong></p>
            <p style="color: #718096; font-style: italic;">"${subject}"</p>
          </div>
          
          <p style="color: #4a5568; line-height: 1.6;">
            If you have any urgent questions, please don't hesitate to call me directly.
          </p>
          
          <p style="color: #4a5568;">
            Best regards,<br>
            <strong>Ella Beardsley</strong><br>
            Art Therapist
          </p>
        </div>
      `,
    };

    // Send both emails
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(autoReplyOptions);
        console.log('Emails sent successfully to:', process.env.CONTACT_EMAIL);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        return res.status(500).json({ 
          error: 'Failed to send email. Please check your email configuration.',
          details: emailError instanceof Error ? emailError.message : 'Unknown error' 
        });
      }
    } else {
      // Log to console if email is not configured (development)
      console.log('Email not configured. Missing SMTP_USER or SMTP_PASS');
      console.log('SMTP_USER exists:', !!process.env.SMTP_USER);
      console.log('SMTP_PASS exists:', !!process.env.SMTP_PASS);
      return res.status(500).json({ 
        error: 'Email configuration missing. Please check environment variables.' 
      });
    }

    return res.status(200).json({ 
      message: 'Contact form submitted successfully',
      success: true 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: 'Failed to send message. Please try again later.' 
    });
  }
}