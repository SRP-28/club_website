import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import SectionTitle from '../components/ui/SectionTitle';
import '../styles/Forms.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus('An error occurred. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>
      <div className="contact-layout">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required 
              ></textarea>
            </div>
            <button type="submit" className="btn" style={{ width: '100%' }}>Send Message</button>
          </form>
          {status && <p style={{ marginTop: '15px', textAlign: 'center', color: '#f7c275' }}>{status}</p>}
        </div>

        <div className="contact-map">
          <iframe
            title="Team Vajra Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.8412956494967!2d73.80690607523607!3d18.490846582596927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf0023f4b5e7%3A0x89c1d5aeefc92ae2!2sTeam%20Vajra%20MMCOE!5e0!3m2!1sen!2sin!4v1759480548553!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '12px', minHeight: '350px' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
