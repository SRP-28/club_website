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
      const response = await fetch('http://localhost:5001/api/contact', {
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
    </div>
  );
};

export default Contact;
